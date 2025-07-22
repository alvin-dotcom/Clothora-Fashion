// src/components/profile/ManageUserAddresses.tsx
'use client';

import { useState, useEffect } from 'react';
// No longer use useUser here, userId will be passed as prop
import type { Address } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import AddressForm from '@/components/checkout/AddressForm';
import AddressDisplayCard from './AddressDisplayCard';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Home, Save } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { 
  getSavedAddresses, 
  addShippingAddress, 
  updateShippingAddress, 
  deleteShippingAddress,
  type ManagedAddress 
} from '@/actions/addressActions';

interface ManageUserAddressesProps {
  userId: string; // Expect userId as a prop
}

export default function ManageUserAddresses({ userId }: ManageUserAddressesProps) {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<ManagedAddress[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ManagedAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For DB operations
  const [isFetching, setIsFetching] = useState(true); // For initial fetch

  useEffect(() => {
    async function fetchAddresses() {
      if (!userId) {
        setIsFetching(false);
        return;
      }
      setIsFetching(true);
      try {
        const fetchedAddresses = await getSavedAddresses(userId);
        setAddresses(fetchedAddresses);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
        toast({ title: "Error", description: "Could not load your saved addresses.", variant: "destructive" });
      } finally {
        setIsFetching(false);
      }
    }
    fetchAddresses();
  }, [userId, toast]);

  const handleFormSubmit = async (formData: Address) => {
    if (!userId) {
      toast({ title: "Error", description: "User not identified.", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    try {
      let resultAddress: ManagedAddress | null = null;
      if (editingAddress) {
        resultAddress = await updateShippingAddress(editingAddress.id, formData);
        if (resultAddress) {
          setAddresses(prev => prev.map(addr => addr.id === editingAddress.id ? resultAddress! : addr));
          toast({ title: "Address Updated", description: "Your address has been saved." });
        } else {
           throw new Error("Failed to update address.");
        }
      } else {
        resultAddress = await addShippingAddress(userId, formData);
        if (resultAddress) {
          setAddresses(prev => [...prev, resultAddress!]);
          toast({ title: "Address Added", description: "Your new address has been saved." });
        } else {
          throw new Error("Failed to add address.");
        }
      }
      setIsDialogOpen(false);
      setEditingAddress(null);
    } catch (error: any) {
      console.error("Failed to save address:", error);
      toast({ title: "Error", description: error.message || "Failed to save address. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAddress = (address: ManagedAddress) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!userId) return;
    setIsLoading(true); // Use a general loading state or a specific delete loading state
    try {
      const result = await deleteShippingAddress(addressId);
      if (result.success) {
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        toast({ title: "Address Deleted", description: "The address has been removed." });
      } else {
        throw new Error(result.message || "Failed to delete address.");
      }
    } catch (error: any) {
      console.error("Failed to delete address:", error);
      toast({ title: "Error", description: error.message || "Failed to delete address. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isFetching) {
    return <div className="flex justify-center items-center p-4"><LoadingSpinner /> Loading addresses...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2"><Home className="h-5 w-5 text-primary" /> My Saved Addresses</h3>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          if (!isOpen) setEditingAddress(null);
        }}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => { setEditingAddress(null); setIsDialogOpen(true);}}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-lg">
            {isLoading && ( // Spinner overlay for the dialog content during form submission
                <div className="absolute inset-0 bg-card/80 flex items-center justify-center rounded-lg z-10">
                    <LoadingSpinner />
                </div>
            )}
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
              <DialogDescription>
                {editingAddress ? "Update the details of your address." : "Enter the details for your new shipping address."}
              </DialogDescription>
            </DialogHeader>
            <AddressForm 
              onAddressSubmit={handleFormSubmit} 
              defaultValues={editingAddress || undefined} // Pass full editingAddress if available
              submitButtonText="Save Changes"
              submitButtonIcon={<Save className="mr-2 h-4 w-4"/>}
            />
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <p className="text-sm text-muted-foreground p-4 border border-dashed rounded-md text-center">
          You haven't saved any addresses yet. Add one to get started!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressDisplayCard 
              key={addr.id} 
              address={addr} 
              onEdit={() => handleEditAddress(addr)}
              onDelete={() => handleDeleteAddress(addr.id)}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
