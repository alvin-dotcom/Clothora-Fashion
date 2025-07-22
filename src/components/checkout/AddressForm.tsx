
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Address } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } // This seems like an import error in the original, should be Label from ui/label
from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Save } from 'lucide-react'; // Added Save icon

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  street: z.string().min(5, "Street address must be at least 5 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  state: z.string().min(2, "State/Province must be at least 2 characters."),
  zipCode: z.string().min(3, "Zip/Postal code must be at least 3 characters."),
  country: z.string().min(2, "Country must be at least 2 characters."),
});

interface AddressFormProps {
  onAddressSubmit: (address: Address) => void;
  defaultValues?: Partial<Address>;
  submitButtonText?: string;
  submitButtonIcon?: React.ReactNode;
}

export default function AddressForm({ 
  onAddressSubmit, 
  defaultValues, 
  submitButtonText,
  submitButtonIcon
}: AddressFormProps) {
  const form = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues || {
      fullName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  const onSubmit = (data: Address) => {
    onAddressSubmit(data);
  };

  const buttonText = submitButtonText || "Continue to Payment";
  const buttonIcon = submitButtonIcon || <ArrowRight className="ml-2 h-5 w-5" />;

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border-none"> {/* Removed shadow from inner card if it's in a dialog */}
      {/* CardHeader can be omitted if the Dialog already has a title */}
      {/* <CardHeader>
        <CardTitle className="text-2xl">Shipping Address</CardTitle>
        <CardDescription>Where should we send your custom creation?</CardDescription>
      </CardHeader> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-6"> {/* Added pt-6 if CardHeader is removed */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip / Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="90210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {buttonIcon} {buttonText} 
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
