
'use client';

import PaymentForm from '@/components/checkout/PaymentForm';
import type { Address, Design, PaymentDetails, OrderItem as ReduxOrderItem } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { addOrder as addOrderToRedux } from '@/store/slices/orderSlice'; // Keep for potential optimistic UI
import { setPaymentDetails, resetCheckout, setCheckoutProgress } from '@/store/slices/checkoutSlice';
import { resetDesignProgress } from '@/store/slices/designSlice';
import { useUser } from '@clerk/nextjs'; // Import useUser
import { saveOrderToDb } from '@/actions/orderActions'; // Import the server action


export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();
  const { user, isLoaded: isUserLoaded } = useUser(); // Get user for saving order

  const checkoutState = useSelector((state: RootState) => state.checkout);
  const designProgressState = useSelector((state: RootState) => state.design); // Renamed to avoid conflict
  const { currentDesign, shippingAddress, tempImageUrl, progress: checkoutProgress } = checkoutState;

  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false); // New state flag


  useEffect(() => {
    if (isSubmittingOrder) {
      // If order submission is in progress, prevent useEffect from running its checks/redirects
      return;
    }

    // If checkout is already complete (progress 100) AND we are still on this page,
    // it's a safeguard. The primary navigation should come from handlePaymentSubmit.
    if (checkoutProgress === 100 && router.pathname === '/checkout-payment') {
        // This might indicate an issue if handlePaymentSubmit didn't navigate.
        // For now, we just return to prevent further logic on this page.
        return;
    }

    if (!currentDesign || !shippingAddress) {
      toast({ title: "Missing information", description: "Please complete previous steps.", variant: "destructive" });
      router.push('/checkout-address');
      return;
    }

    let imgUrl: string | null = null;
    if (currentDesign._sourceInformation === 'fromDesignFlow' && designProgressState.selectedImageUrl) {
        imgUrl = designProgressState.selectedImageUrl;
    } else if (currentDesign._sourceInformation === 'fromWishlist' && tempImageUrl) {
        imgUrl = tempImageUrl;
    }
    setDisplayImageUrl(imgUrl);

    if (checkoutProgress < 66) {
        dispatch(setCheckoutProgress(66));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmittingOrder, currentDesign, shippingAddress, tempImageUrl, designProgressState.selectedImageUrl, router, toast, dispatch, checkoutProgress]);

  const handlePaymentSubmit = async (paymentData: PaymentDetails) => {
    setIsSubmittingOrder(true); // Set flag when submission starts

    if (!currentDesign || !shippingAddress || !displayImageUrl || !isUserLoaded || !user || !user.id) {
       toast({ title: "Error", description: "Missing order details, image, or user information.", variant: "destructive" });
       setIsSubmittingOrder(false); // Reset flag
       return;
    }

    if (!currentDesign.size || !currentDesign.material) {
        console.error("Missing size or material in currentDesign:", currentDesign);
        toast({
            title: "Design Incomplete",
            description: "The selected design is missing size or material information. Please try selecting the design again.",
            variant: "destructive"
        });
        router.push(currentDesign._sourceInformation === 'fromWishlist' ? '/wishlist' : '/design/generate');
        setIsSubmittingOrder(false); // Reset flag
        return;
    }

    dispatch(setPaymentDetails(paymentData));

    const orderDesignForDb: Design = {
      id: currentDesign.id,
      prompt: currentDesign.prompt,
      basePrompt: currentDesign.basePrompt,
      imageUrl: displayImageUrl,
      size: currentDesign.size,
      material: currentDesign.material,
    };

    const orderToSave = {
        userId: user.id,
        designPrompt: orderDesignForDb.prompt,
        designBasePrompt: orderDesignForDb.basePrompt || null,
        designImageUrl: orderDesignForDb.imageUrl,
        designSize: orderDesignForDb.size,
        designMaterial: orderDesignForDb.material,
        shippingAddressFullName: shippingAddress.fullName,
        shippingAddressStreet: shippingAddress.street,
        shippingAddressCity: shippingAddress.city,
        shippingAddressState: shippingAddress.state,
        shippingAddressZipCode: shippingAddress.zipCode,
        shippingAddressCountry: shippingAddress.country,
        paymentMethod: paymentData.method,
        paymentCardLast4: paymentData.cardNumber || null,
        orderDate: new Date().toISOString(),
        totalAmount: 59.99 // Assuming fixed price
    };

    try {
        const savedDbOrder = await saveOrderToDb(orderToSave);
        if (!savedDbOrder) {
            console.error("Order save failed: saveOrderToDb returned null. Payload:", orderToSave);
            toast({
                title: "Order Submission Failed",
                description: "We couldn't save your order to the database. Please try again or contact support.",
                variant: "destructive"
            });
            setIsSubmittingOrder(false); // Reset flag
            return;
        }

        dispatch(setCheckoutProgress(100));
        router.push('/checkout-success');

        // Delay resetting checkout and design progress to allow navigation to complete
        // The component should unmount before these run, preventing the useEffect from re-triggering redirects.
        setTimeout(() => {
            dispatch(resetCheckout());
            dispatch(resetDesignProgress());
            // setIsSubmittingOrder(false); // Not strictly necessary if page unmounts
        }, 300); // Delay can be adjusted

        toast({ title: "Order Placed!", description: "Your order has been successfully placed.", variant: "default" });

    } catch (error) {
        console.error("Failed to process order in handlePaymentSubmit:", error);
        toast({ title: "Order Failed", description: "There was an issue placing your order. Please try again.", variant: "destructive" });
        setIsSubmittingOrder(false); // Reset flag on error
    }
  };

  // Initial checks for required data, guarded by isSubmittingOrder
  if (!isSubmittingOrder && (!currentDesign || !shippingAddress) && checkoutProgress < 100) {
    // This condition will be hit if user lands here directly or if data is missing
    // and an order is not currently being submitted.
    // The useEffect above will attempt to redirect if not submitting.
    return <div className="text-center py-10">Loading or redirecting...</div>;
  }

   if (!isSubmittingOrder && !displayImageUrl && checkoutProgress < 100) {
       // Also guard image loading check by isSubmittingOrder and checkoutProgress
       return <div className="text-center py-10">Loading image...</div>;
   }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h2 className="text-lg font-medium text-center mb-2">Checkout Progress</h2>
        <Progress value={checkoutProgress} className="w-full" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span className="text-primary font-semibold">Address</span>
            <span className="text-primary font-semibold">Payment</span>
            <span className={checkoutProgress >= 100 ? 'text-primary font-semibold' : ''}>Confirmation</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <PaymentForm onPaymentSubmit={handlePaymentSubmit} />
        </div>
        <div className="mt-8 md:mt-0">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          {currentDesign && shippingAddress && displayImageUrl && ( // Ensure these exist before rendering summary
            <div className="border rounded-lg p-6 bg-card shadow-md">
              <div className="flex items-center gap-4 mb-4">
                  <div className="w-24 h-32 relative rounded overflow-hidden border">
                      <Image src={displayImageUrl} alt={currentDesign.prompt} layout="fill" objectFit="cover" data-ai-hint="clothing fashion" />
                  </div>
                  <div>
                      <p className="font-semibold text-lg" title={currentDesign.prompt}>
                          {currentDesign.basePrompt ? `"${currentDesign.basePrompt}"` : currentDesign.prompt.substring(0,40) + (currentDesign.prompt.length > 40 ? '...' : '')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                          Material: {currentDesign.material}, Size: {currentDesign.size.toUpperCase()}
                      </p>
                  </div>
              </div>
              <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Item Price:</span> <span>Rs. 1499</span></div>
                  <div className="flex justify-between"><span>Shipping:</span> <span>FREE</span></div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total:</span> <span>Rs. 1499</span></div>
              </div>
              <div className="mt-6 border-t pt-4">
                  <h4 className="font-semibold mb-2">Shipping To:</h4>
                  <p className="text-sm text-muted-foreground">{shippingAddress.fullName}</p>
                  <p className="text-sm text-muted-foreground">{shippingAddress.street}</p>
                  <p className="text-sm text-muted-foreground">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                  <p className="text-sm text-muted-foreground">{shippingAddress.country}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
    