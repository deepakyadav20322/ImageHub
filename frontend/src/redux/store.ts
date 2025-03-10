import { configureStore } from '@reduxjs/toolkit'
import {authApi} from '@/redux/apiSlice/authApi'
const store = configureStore({
  reducer: {
    // [apiSlice.reducerPath]: apiSlice.reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export default store