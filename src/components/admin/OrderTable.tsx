
'use client';

import { useState, useEffect } from 'react';
import type { OrderItem as ClientOrderItem } from '@/types';
import { updateOrderStatusAdmin } from '@/actions/adminActions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import OrderStatusSelect from './OrderStatusSelect';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge'; // Import Badge

interface OrderTableProps {
  initialOrders: ClientOrderItem[];
}

export default function OrderTable({ initialOrders }: OrderTableProps) {
  const [orders, setOrders] = useState<ClientOrderItem[]>(initialOrders);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({}); // For individual row loading
  const { toast } = useToast();

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setIsLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      const updatedOrder = await updateOrderStatusAdmin(orderId, newStatus);
      if (updatedOrder) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: updatedOrder.status } : order
          )
        );
        toast({ title: "Order Status Updated", description: `Order ${orderId.substring(0,8)} status set to ${newStatus}.` });
      } else {
        throw new Error('Failed to update order status.');
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({ title: "Error", description: "Could not update order status.", variant: "destructive" });
    } finally {
      setIsLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] rounded-md border">
      <Table>
        <TableCaption>A list of all customer orders.</TableCaption>
        <TableHeader className="sticky top-0 bg-muted z-10">
          <TableRow>
            <TableHead className="w-[80px] sm:w-[100px] px-2 py-3 sm:px-4">Order ID</TableHead>
            <TableHead className="hidden md:table-cell px-2 py-3 sm:px-4">User ID</TableHead>
            <TableHead className="px-2 py-3 sm:px-4">Item</TableHead>
            <TableHead className="px-2 py-3 sm:px-4">Order Date</TableHead>
            <TableHead className="text-right px-2 py-3 sm:px-4">Total</TableHead>
            <TableHead className="w-[140px] sm:w-[180px] text-center px-2 py-3 sm:px-4">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium truncate px-2 py-3 sm:px-4" title={order.id}>{order.id.substring(0, 8)}...</TableCell>
              <TableCell className="hidden md:table-cell truncate px-2 py-3 sm:px-4" title={order.user_id || undefined}>{order.user_id?.substring(0,15)}...</TableCell>
              <TableCell className="px-2 py-3 sm:px-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-12 sm:w-12 sm:h-16 relative rounded border overflow-hidden shrink-0">
                    <Image src={order.design.imageUrl} alt={order.design.prompt.substring(0,20)} layout="fill" objectFit="cover" />
                  </div>
                  <div className="text-xs max-w-[100px] sm:max-w-[150px] truncate" title={order.design.prompt}>
                    {order.design.basePrompt ? `"${order.design.basePrompt.substring(0,30)}..."` : order.design.prompt.substring(0, 30) + "..."}
                     <p className="text-muted-foreground mt-0.5">Sz: {order.design.size.toUpperCase()}, {order.design.material}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-xs sm:text-sm px-2 py-3 sm:px-4">{format(new Date(order.orderDate), "MMM d, yyyy, HH:mm")}</TableCell>
              <TableCell className="text-right px-2 py-3 sm:px-4">${order.totalAmount.toFixed(2)}</TableCell>
              <TableCell className="text-center px-2 py-3 sm:px-4">
                <OrderStatusSelect
                  orderId={order.id}
                  currentStatus={order.status || 'Processing'}
                  onStatusChange={handleStatusChange}
                  disabled={isLoading[order.id]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {orders.length === 0 && (
        <p className="p-4 text-center text-muted-foreground">No orders found.</p>
      )}
    </ScrollArea>
  );
}
