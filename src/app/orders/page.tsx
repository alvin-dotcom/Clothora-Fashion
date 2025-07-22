
'use client';

import OrderItemCard from '@/components/orders/OrderItemCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUserOrdersFromDb, type ClientOrderItem } from '@/actions/orderActions';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useUser } from '@clerk/nextjs'; // To ensure user is loaded before fetching

export default function OrdersPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [orders, setOrders] = useState<ClientOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (isUserLoaded && user) { // Only fetch if user is loaded and exists
        setIsLoading(true);
        try {
          const fetchedOrders = await getUserOrdersFromDb();
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
          // Optionally set an error state and display a message
        } finally {
          setIsLoading(false);
        }
      } else if (isUserLoaded && !user) {
        // User is not logged in, but Clerk is loaded
        setIsLoading(false);
        setOrders([]); // Clear orders if user logs out
      }
      // If !isUserLoaded, wait for Clerk to load
    }
    fetchOrders();
  }, [user, isUserLoaded]); // Rerun when user or its loaded state changes

  if (isLoading && isUserLoaded) { // Show loading only if user is loaded and we are fetching
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading your orders...</p>
      </div>
    );
  }

  if (!user && isUserLoaded) { // If Clerk is loaded but there's no user
    return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag className="w-24 h-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Please Sign In</h1>
        <p className="text-muted-foreground mb-8">
          Sign in to view your orders.
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    )
  }
  
  if (orders.length === 0 && isUserLoaded && user) { // Show no orders only if user is loaded, logged in, and has no orders
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <ShoppingBag className="w-24 h-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold mb-4">No Orders Yet</h1>
        <p className="text-muted-foreground mb-8">
          You haven't placed any orders. Start by designing your first custom item!
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/design">Design Now</Link>
        </Button>
      </div>
    );
  }


  // If still loading Clerk user, show a generic loader or nothing
  if (!isUserLoaded) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-muted-foreground">Loading user data...</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
      <div className="space-y-6 max-w-4xl mx-auto">
        {orders.map((order) => (
          <OrderItemCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
