
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { OrderItem } from '@/types';

interface OrderState {
  items: OrderItem[];
}

const initialState: OrderState = {
  items: [],
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<OrderItem>) => {
      // Add new orders to the beginning of the list
      state.items.unshift(action.payload);
    },
    // Optional: Clear orders action
    clearOrders: (state) => {
        state.items = [];
    }
  },
});

export const { addOrder, clearOrders } = orderSlice.actions;

export default orderSlice.reducer;
