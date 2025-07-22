
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Design, Address, PaymentDetails } from '@/types';

interface CheckoutState {
  currentDesign: (Design & { _sourceInformation?: 'fromDesignFlow' | 'fromWishlist' }) | null;
  tempImageUrl: string | null; // To temporarily hold the image URL if needed (like from wishlist)
  shippingAddress: Address | null;
  paymentDetails: PaymentDetails | null;
  progress: number; // e.g., 0, 33, 66, 100
}

const initialState: CheckoutState = {
  currentDesign: null,
  tempImageUrl: null,
  shippingAddress: null,
  paymentDetails: null,
  progress: 0,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    startCheckout: (state, action: PayloadAction<{ design: Design, tempImageUrl?: string }>) => {
       // Store a version of the design maybe without the large image URL if it's problematic
       // Or store the full design if state is not persisted
       // Add a source flag to indicate it's from the design flow.
       const designForLocalStorage: Design = {
         ...action.payload.design,
         imageUrl: '', // Remove large data URI to avoid large state / persistence issues
         _sourceInformation: action.payload.design._sourceInformation, // Keep the source info
       };
      state.currentDesign = designForLocalStorage;
      state.tempImageUrl = action.payload.tempImageUrl || null; // Store temp image URL if provided
      state.shippingAddress = null; // Reset address
      state.paymentDetails = null; // Reset payment
      state.progress = 33; // Start at address step
    },
    setShippingAddress: (state, action: PayloadAction<Address | null>) => {
      state.shippingAddress = action.payload;
      if (action.payload) {
        state.progress = 66; // Move to payment step
      }
    },
    setPaymentDetails: (state, action: PayloadAction<PaymentDetails | null>) => {
      state.paymentDetails = action.payload;
      // Progress is set to 100 upon successful order placement in the component/thunk
    },
    setCheckoutProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    resetCheckout: () => {
      // Reset to the initial state
      return initialState;
    },
  },
});

export const {
  startCheckout,
  setShippingAddress,
  setPaymentDetails,
  setCheckoutProgress,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
