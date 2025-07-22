
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import designReducer from './slices/designSlice';
import checkoutReducer from './slices/checkoutSlice';
import wishlistReducer from './slices/wishlistSlice';
import orderReducer from './slices/orderSlice';

// Configuration for persisting wishlist state
const wishlistPersistConfig = {
  key: 'wishlist',
  storage,
};

// Configuration for persisting order state
const orderPersistConfig = {
  key: 'orders',
  storage,
};

// Combine reducers - persist only wishlist and orders
const rootReducer = combineReducers({
  design: designReducer, // Not persisted
  checkout: checkoutReducer, // Not persisted
  wishlist: persistReducer(wishlistPersistConfig, wishlistReducer), // Persisted
  orders: persistReducer(orderPersistConfig, orderReducer), // Persisted
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Necessary for redux-persist
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {design: DesignState, checkout: CheckoutState, wishlist: WishlistState, orders: OrdersState}
export type AppDispatch = typeof store.dispatch;
