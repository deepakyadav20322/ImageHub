import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // LocalStorage for web
import authApi from "@/redux/apiSlice/authApi";
import authSliceReducer from "@/redux/features/authSlice";
import resourceReducer from '@/redux/features/resourceSlice'
import itemsReducer from  '@/redux/features/itemsSlice'
// Persist config for auth API reducer
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token", "isAuthenticated", "permissions"],
  // Only persist required data
};

const persistedAuthReducer = persistReducer(persistConfig, authSliceReducer);

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
   
    auth: persistedAuthReducer,
    // regular slice reducers
    resource: resourceReducer,
    items: itemsReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(authApi.middleware),

  devTools: import.meta.env.NODE_ENV !== "production", // Enable DevTools only in development
});

// Persistor for the store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

// Setup listeners for refetching queries when network status changes
setupListeners(store.dispatch);
