
'use client';

import Image from 'next/image';
import type { OrderItem } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageCheck, CalendarDays, MapPin, CreditCardIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge'; // Import Badge

interface OrderItemCardProps {
  order: OrderItem;
}

// Helper to determine badge variant based on status
const getStatusVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status?.toLowerCase()) {
    case 'processing':
      return 'secondary';
    case 'shipped':
      return 'default'; // Use primary color for shipped
    case 'delivered':
      return 'default'; // Could also use a success variant if you add one
    case 'cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function OrderItemCard({ order }: OrderItemCardProps) {
  const statusDisplay = order.status || 'Unknown';
  return (
    <Card className="overflow-hidden shadow-lg w-full">
      <CardHeader className="bg-muted/30 p-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle className="text-xl">Order #{order.id.substring(0, 8)}</CardTitle>
            <CardDescription className="flex items-center text-sm mt-1">
              <CalendarDays className="mr-1.5 h-4 w-4" /> Placed on: {format(new Date(order.orderDate), "MMMM d, yyyy")}
            </CardDescription>
          </div>
          <div className="text-left sm:text-right mt-2 sm:mt-0">
             <p className="text-lg font-semibold text-primary">${order.totalAmount.toFixed(2)}</p>
             <Badge variant={getStatusVariant(order.status)} className="mt-1 text-xs">
                {statusDisplay.charAt(0).toUpperCase() + statusDisplay.slice(1)}
             </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2 text-md">Item Details:</h4>
          <div className="flex items-start gap-3">
            <div className="w-20 h-28 relative rounded border overflow-hidden shrink-0 bg-muted">
              <Image
                src={order.design.imageUrl}
                alt={order.design.prompt}
                layout="fill"
                objectFit="cover"
                data-ai-hint="fashion apparel"
              />
            </div>
            <div>
              <p className="font-medium text-sm leading-tight" title={order.design.prompt}>
                {order.design.basePrompt ? `"${order.design.basePrompt}"` : order.design.prompt.substring(0, 80) + (order.design.prompt.length > 80 ? '...' : '')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Material: {order.design.material}, Size: {order.design.size.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
        <div>
           <h4 className="font-semibold mb-2 text-md">Shipping Address:</h4>
           <div className="text-sm text-muted-foreground space-y-0.5">
                <p className="flex items-start"><MapPin className="mr-1.5 h-4 w-4 text-primary/70 mt-0.5 shrink-0" /><span>{order.address.fullName}<br/>{order.address.street}<br/>{order.address.city}, {order.address.state} {order.address.zipCode}<br/>{order.address.country}</span></p>
           </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 text-sm text-muted-foreground flex justify-between items-center">
        <p className="flex items-center">
            <CreditCardIcon className="mr-1.5 h-4 w-4 text-primary/70" /> Payment Method: {order.payment.method}
            {order.payment.cardNumber && ` (**** ${order.payment.cardNumber})`}
        </p>
      </CardFooter>
    </Card>
  );
}
