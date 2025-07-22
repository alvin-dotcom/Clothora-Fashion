
'use client';

import Image from 'next/image';
import type { WishlistItem, Design } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { startCheckout } from '@/store/slices/checkoutSlice';

interface WishlistItemCardProps {
  item: WishlistItem;
  onRemove: (itemId: string) => void; // Keep onRemove prop for dispatching remove action from parent page
}

export default function WishlistItemCard({ item, onRemove }: WishlistItemCardProps) {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const handleBuyNow = () => {
    // Prepare the design object for checkout, marking its source
    const designToCheckout: Design = {
      ...item, // WishlistItem already includes all necessary Design fields
      _sourceInformation: 'fromWishlist',
    };

    // Dispatch the startCheckout action, passing the design and the actual image URL
    dispatch(startCheckout({ design: designToCheckout, tempImageUrl: item.imageUrl }));
    router.push('/checkout-address');
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="aspect-[3/4] relative w-full">
          <Image
            src={item.imageUrl}
            alt={item.prompt}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint="fashion clothing"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg mb-1 truncate" title={item.prompt}>{item.basePrompt || item.prompt}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground space-y-0.5">
          {/* Removed Type and Color */}
          <p>Material: {item.material}</p>
          <p>Size: {item.size.toUpperCase()}</p>
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex flex-col sm:flex-row justify-between gap-2 mt-auto">
        <Button variant="outline" size="sm" onClick={() => onRemove(item.id)} className="text-destructive border-destructive hover:bg-destructive/10 w-full sm:w-auto">
          <XCircle className="mr-2 h-4 w-4" /> Remove
        </Button>
        <Button size="sm" onClick={handleBuyNow} className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
          <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}

