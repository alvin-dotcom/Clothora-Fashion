
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { WishlistItem, Design } from '@/types';

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Design>) => {
      const item = action.payload;
      const itemExists = state.items.find(i => i.id === item.id || i.imageUrl === item.imageUrl);

      if (!itemExists) {
         // Ensure the item added to wishlist has a stable, unique ID if it's a new addition from a transient selection
         const wishlistItem: WishlistItem = {
           ...item,
           id: item.id.startsWith('data:image') ? new Date().toISOString() + Math.random().toString(36).substring(2,9) : item.id,
         };
         state.items.push(wishlistItem);
      }
      // If item exists, do nothing (or update timestamp, etc.)
    },
    removeItem: (state, action: PayloadAction<string>) => {
        const itemIdOrUrl = action.payload;
        state.items = state.items.filter(item => item.id !== itemIdOrUrl && item.imageUrl !== itemIdOrUrl);
    },
    // Optional: Clear wishlist action
    clearWishlist: (state) => {
        state.items = [];
    }
  },
});

export const { addItem, removeItem, clearWishlist } = wishlistSlice.actions;

// Selector to check if an item is in the wishlist
export const selectIsInWishlist = (state: { wishlist: WishlistState }, itemIdOrUrl: string): boolean => {
    return state.wishlist.items.some(item => item.id === itemIdOrUrl || item.imageUrl === itemIdOrUrl);
};


export default wishlistSlice.reducer;
