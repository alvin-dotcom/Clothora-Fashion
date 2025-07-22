
'use client';

import AddressForm from '@/components/checkout/AddressForm';
import type { Address, Design } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import AddressDisplayCard from '@/components/profile/AddressDisplayCard';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { setShippingAddress, setCheckoutProgress } from '@/store/slices/checkoutSlice';
import { useUser } from '@clerk/nextjs';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { getSavedAddresses, type ManagedAddress } from '@/actions/addressActions'; // Import DB version

export default function CheckoutAddressPage() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();
  const { user, isLoaded: isUserLoaded } = useUser();

  const checkoutState = useSelector((state: RootState) => state.checkout);
  const { currentDesign, shippingAddress: reduxShippingAddress, progress: checkoutProgress } = checkoutState;

  const [dbSavedAddresses, setDbSavedAddresses] = useState<ManagedAddress[]>([]);
  const [isFetchingAddresses, setIsFetchingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>(reduxShippingAddress ? 'current_redux' : 'new');
  const [formAddress, setFormAddress] = useState<Address | undefined>(reduxShippingAddress || undefined); 

  useEffect(() => {
    // If checkout is already past the address step (e.g., payment or success), don't run these initial checks.
    if (checkoutProgress >= 66 && router.pathname !== '/checkout-address') { 
        // If user navigates back to address page after completing it,
        // this check might not be necessary, or you might want to allow edits.
        // For now, we prevent the "No design selected" error if progress is advanced.
        return;
    }

    if (!currentDesign) {
      toast({ title: "No design selected", description: "Please select a design to purchase.", variant: "destructive" });
      router.push('/'); 
      return;
    }
    // Only set progress to 33 if it's less than 33
    if (checkoutProgress < 33) {
        dispatch(setCheckoutProgress(33));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDesign, checkoutProgress, router, toast, dispatch]);

  useEffect(() => {
    async function fetchUserAddresses() {
      if (isUserLoaded && user && user.id) {
        setIsFetchingAddresses(true);
        try {
          const addressesFromDb = await getSavedAddresses(user.id);
          setDbSavedAddresses(addressesFromDb);

          // Logic to pre-select address or set form state
          if (reduxShippingAddress) {
            const matchedDbAddress = addressesFromDb.find(
              (dbAddr) => 
                dbAddr.fullName === reduxShippingAddress.fullName &&
                dbAddr.street === reduxShippingAddress.street &&
                dbAddr.city === reduxShippingAddress.city &&
                dbAddr.state === reduxShippingAddress.state &&
                dbAddr.zip_code === reduxShippingAddress.zipCode && // Note: zip_code from DB
                dbAddr.country === reduxShippingAddress.country
            );
            if (matchedDbAddress) {
              setSelectedAddressId(matchedDbAddress.id);
              setFormAddress(matchedDbAddress); // Use DB address (it has the ID)
            } else {
              setSelectedAddressId('current_redux');
              setFormAddress(reduxShippingAddress);
            }
          } else if (addressesFromDb.length > 0) {
            setSelectedAddressId(addressesFromDb[0].id);
            setFormAddress(addressesFromDb[0]);
          } else {
            setSelectedAddressId('new');
            setFormAddress(undefined);
          }
        } catch (error) {
            console.error("Failed to fetch addresses for checkout:", error);
            toast({ title: "Error", description: "Could not load saved addresses.", variant: "destructive" });
             // Fallback to new address if fetch fails
            setSelectedAddressId('new');
            setFormAddress(reduxShippingAddress || undefined); // Keep redux if available
        } finally {
            setIsFetchingAddresses(false);
        }
      } else if (isUserLoaded && !user) {
        // Not logged in, force new address. Middleware should prevent this page.
        setSelectedAddressId('new');
        setFormAddress(reduxShippingAddress || undefined);
        setIsFetchingAddresses(false);
      }
    }
    fetchUserAddresses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoaded, user, reduxShippingAddress]); // reduxShippingAddress dependency kept

  const handleAddressSelectionChange = (value: string) => {
    setSelectedAddressId(value);
    if (value === 'new') {
      setFormAddress(undefined); 
    } else if (value === 'current_redux' && reduxShippingAddress) {
      setFormAddress(reduxShippingAddress); 
    } else {
      const selectedDbAddr = dbSavedAddresses.find(addr => addr.id === value);
      if (selectedDbAddr) {
        // Map ManagedAddress from DB to Address for the form
        const formAddr: Address = {
            fullName: selectedDbAddr.full_name,
            street: selectedDbAddr.street,
            city: selectedDbAddr.city,
            state: selectedDbAddr.state,
            zipCode: selectedDbAddr.zip_code, // map from zip_code
            country: selectedDbAddr.country,
        };
        setFormAddress(formAddr);
      } else {
        setFormAddress(undefined); // Should not happen if value is a valid ID
      }
    }
  };

  const handleAddressSubmit = (addressFromForm: Address) => {
    dispatch(setShippingAddress(addressFromForm));
    toast({ title: "Address Saved", description: "Shipping address has been set for this order." });
    router.push('/checkout-payment');
  };

  if (!isUserLoaded || (!currentDesign && checkoutProgress < 66) || isFetchingAddresses) {
    return <div className="container mx-auto p-4 text-center py-10"><LoadingSpinner /> Loading checkout...</div>;
  }
  
  const displayableDbAddresses = dbSavedAddresses.map(dbAddr => ({
    ...dbAddr, // Includes id
    // Map for AddressDisplayCard if its props expect slightly different field names
    // For now, assuming AddressDisplayCard can handle `full_name` and `zip_code`
    // Or we transform it here for consistency with `Address` type:
    fullName: dbAddr.full_name,
    zipCode: dbAddr.zip_code,
  }));


  return (
    <div className="container mx-auto p-4 max-w-3xl">
       <div className="mb-8">
        <h2 className="text-lg font-medium text-center mb-2">Checkout Progress</h2>
        <Progress value={checkoutProgress} className="w-full" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span className={checkoutProgress >= 0 ? 'text-primary font-semibold' : ''}>Address</span>
            <span className={checkoutProgress >= 66 ? 'text-primary font-semibold' : ''}>Payment</span>
            <span className={checkoutProgress >= 100 ? 'text-primary font-semibold' : ''}>Confirmation</span>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-center">Shipping Information</h2>

      {user && displayableDbAddresses.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Select a Saved Address:</h3>
          <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelectionChange} className="space-y-3">
            {displayableDbAddresses.map((addr) => (
              <Label key={addr.id} htmlFor={addr.id} className="block cursor-pointer">
                <RadioGroupItem value={addr.id} id={addr.id} className="sr-only" />
                <AddressDisplayCard address={addr} isSelected={selectedAddressId === addr.id} />
              </Label>
            ))}
             {reduxShippingAddress && selectedAddressId === 'current_redux' && (
              <Label htmlFor="current_redux" className="block cursor-pointer">
                  <RadioGroupItem value="current_redux" id="current_redux" className="sr-only" />
                  <AddressDisplayCard 
                      address={reduxShippingAddress} 
                      isSelected={selectedAddressId === 'current_redux'}
                      className="border-dashed border-accent" 
                  />
                   <p className="text-xs text-accent mt-1 ml-1">Using address from previous session (not saved to your profile).</p>
              </Label>
            )}
            <div>
              <Label htmlFor="new-address-option" className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer transition-all ${selectedAddressId === 'new' ? 'ring-2 ring-primary border-primary shadow-lg' : 'border-border hover:shadow-md'}`}>
                <RadioGroupItem value="new" id="new-address-option" />
                <span>Use a new address or edit selected</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      {(selectedAddressId === 'new' || (user && displayableDbAddresses.length === 0) || !user || selectedAddressId === 'current_redux' ) && (
        <div className={`${displayableDbAddresses.length > 0 && user ? 'mt-6' : ''}`}>
           {displayableDbAddresses.length > 0 && user && <h3 className="text-lg font-medium mb-4 text-center">Enter New Address / Edit Details:</h3> }
           {!user && <p className="text-sm text-muted-foreground mb-4 text-center">Please enter your shipping address.</p>}
          <AddressForm 
            onAddressSubmit={handleAddressSubmit} 
            defaultValues={formAddress} 
          />
        </div>
      )}

       {user && displayableDbAddresses.length > 0 && selectedAddressId !== 'new' && selectedAddressId !== 'current_redux' && (
         <div className="mt-6">
            <p className="text-center text-muted-foreground mb-2">Selected address details below. Click "Continue to Payment" or choose "Use a new address" to edit.</p>
            <AddressForm 
                onAddressSubmit={handleAddressSubmit} 
                defaultValues={formAddress}
            />
        </div>
       )}
    </div>
  );
}
