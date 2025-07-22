
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, Package } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { setCheckoutProgress } from '@/store/slices/checkoutSlice'; // Still might need to set it here


export default function CheckoutSuccessPage() {
  // const checkoutProgress = useSelector((state: RootState) => state.checkout.progress);
  // Note: By the time this page loads, checkout state might already be reset.
  // It might be safer to just display 100% progress statically or use local state.
  const [progress, setProgress] = useState(100); // Default to 100 on success

  // If we still want to potentially reflect Redux state briefly:
  // const dispatch: AppDispatch = useDispatch();
  // const checkoutProgress = useSelector((state: RootState) => state.checkout.progress);
  // useEffect(() => {
  //   // Ensure progress is 100%, even if Redux state was reset quickly
  //   if (checkoutProgress < 100) {
  //       // This dispatch might not be effective if the slice is already reset
  //       // dispatch(setCheckoutProgress(100));
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [checkoutProgress, dispatch]);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="mb-8 w-full max-w-md">
        <h2 className="text-lg font-medium text-center mb-2">Checkout Progress</h2>
        {/* Use local state `progress` which defaults to 100 */}
        <Progress value={progress} className="w-full bg-accent" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span className="text-primary font-semibold">Address</span>
            <span className="text-primary font-semibold">Payment</span>
            <span className="text-primary font-semibold">Confirmation</span>
        </div>
      </div>
      <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Order Successful!</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Thank you for your purchase. Your custom AI-designed clothing is being prepared and will be shipped soon.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" variant="outline">
          <Link href="/design">
            <Home className="mr-2 h-5 w-5" /> Continue Shopping
          </Link>
        </Button>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/orders">
            <Package className="mr-2 h-5 w-5" /> View My Orders
          </Link>
        </Button>
      </div>
    </div>
  );
}
