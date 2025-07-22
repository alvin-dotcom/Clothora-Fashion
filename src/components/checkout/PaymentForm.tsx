'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { PaymentDetails } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, CheckCircle } from 'lucide-react';

const paymentSchema = z.object({
  method: z.enum(['creditCard', 'paypal'], {
    required_error: "You need to select a payment method.",
  }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
}).refine(data => {
  if (data.method === 'creditCard') {
    return !!data.cardNumber && data.cardNumber.length === 16 &&
           !!data.expiryDate && data.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/) &&
           !!data.cvv && data.cvv.length >= 3 && data.cvv.length <=4;
  }
  return true;
}, {
  message: "Please provide valid credit card details if selected.",
  path: ['cardNumber'], // You can refine path for specific error message locations
});


interface PaymentFormProps {
  onPaymentSubmit: (paymentDetails: PaymentDetails) => void;
}

export default function PaymentForm({ onPaymentSubmit }: PaymentFormProps) {
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: 'creditCard',
    },
  });

  const onSubmit = (data: z.infer<typeof paymentSchema>) => {
    const paymentDetails: PaymentDetails = {
      method: data.method === 'creditCard' ? 'Credit Card' : 'PayPal',
      cardNumber: data.cardNumber ? data.cardNumber.slice(-4) : undefined, // Store only last 4 digits for display
      expiryDate: data.expiryDate,
    };
    onPaymentSubmit(paymentDetails);
  };
  
  const paymentMethod = form.watch('method');

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Payment Details</CardTitle>
        <CardDescription>Choose your preferred payment method.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="creditCard" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          <CreditCard className="mr-2 h-5 w-5 text-primary" /> Credit Card
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="paypal" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          {/* Placeholder for PayPal icon */}
                          <svg className="mr-2 h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M8.326 4.002c-.312.097-.59.36-.758.701l-2.826 6.104c-.189.396-.148.864.083 1.216.23.352.629.542 1.03.542h2.255c2.388 0 3.783-1.344 4.267-3.459.248-1.086.168-2.036-.363-2.65-.41-.477-1.143-.752-2.019-.752H8.326zm7.98 1.871c-.476 0-.919.153-1.25.459-.458.424-.734 1.046-.637 1.772.396 2.989 2.357 4.626 4.926 4.626h.032c.402 0 .767-.207.978-.557.211-.35.22-.78.022-1.138l-1.086-2.98c-.19-.522-.69-.851-1.24-.851h-.712zM14.094 0c-.47 0-.89.308-1.036.752L9.866 11.37c2.076.315 3.288 1.515 3.71 3.351l.028.118.965-2.641c.207-.565.748-.922 1.345-.922h.704c.976 0 1.605.763 2.02 1.577l1.406-3.85c.176-.483.004-.976-.319-1.292-.323-.315-.763-.432-1.195-.31L14.094 0z"/></svg>
                           PayPal
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {paymentMethod === 'creditCard' && (
              <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="0000 0000 0000 0000" {...field} maxLength={16}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="123" {...field} maxLength={4}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            {paymentMethod === 'paypal' && (
                <FormDescription className="text-center p-4 border rounded-md bg-muted/30">
                    You will be redirected to PayPal to complete your purchase.
                </FormDescription>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Complete Order <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
