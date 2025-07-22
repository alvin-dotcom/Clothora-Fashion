
'use client';

import WishlistItemCard from '@/components/wishlist/WishlistItemCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeartCrack } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { removeItem } from '@/store/slices/wishlistSlice';
import { useToast } from '@/hooks/use-toast';

export default function WishlistPage() {
  const dispatch: AppDispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const { toast } = useToast();

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItem(itemId));
    toast({ title: "Removed from Wishlist", description: "Item removed from your wishlist.", variant: "default" });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <HeartCrack className="w-24 h-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-semibold mb-4">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your wishlist yet.
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/design">Start Designing</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <WishlistItemCard key={item.id} item={item} onRemove={handleRemoveItem} />
        ))}
      </div>
    </div>
  );
}
