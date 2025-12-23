import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./features/dataSlice";
import cartReducer from "./features/cartSlice";

export const store = configureStore({
  reducer: {
    data: dataReducer,
    cart: cartReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;