
'use client';

import type { Design, WishlistItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { addItem, removeItem, selectIsInWishlist } from '@/store/slices/wishlistSlice';
import { useToast } from '@/hooks/use-toast'; // Keep toast for feedback


interface WishlistButtonProps {
  design: Design | null; // Accepts Design type
  className?: string;
}

export default function WishlistButton({ design, className }: WishlistButtonProps) {
  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();

  // Check if the item is in the wishlist using the selector
  const inWishlist = useSelector((state: RootState) =>
    design ? selectIsInWishlist(state, design.id.startsWith('data:image') ? design.imageUrl : design.id) : false
  );

  if (!design) return null;

  const handleToggleWishlist = () => {
    // Use the potentially transient ID (imageUrl) or stable ID for checking/removing
    const idOrUrl = design.id.startsWith('data:image') ? design.imageUrl : design.id;

    if (inWishlist) {
      dispatch(removeItem(idOrUrl));
      toast({ title: "Removed from Wishlist", description: "Item removed from your wishlist.", variant: "default" });
    } else {
      // Dispatch addItem with the full Design object. The slice reducer will handle creating the WishlistItem.
      dispatch(addItem(design));
      toast({
        title: "Added to Wishlist",
        description: `"${design.basePrompt || design.prompt.substring(0,30)}..." added to your wishlist.`,
        variant: "default"
      });
    }
  };

  return (
    <Button
      variant={inWishlist ? "secondary" : "outline"}
      onClick={handleToggleWishlist}
      className={cn("gap-2", className)}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("h-5 w-5", inWishlist ? "fill-destructive text-destructive" : "text-primary")} />
      {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
    </Button>
  );
}
