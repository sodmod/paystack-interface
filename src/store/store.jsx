import { configureStore } from "@reduxjs/toolkit";
import paystackSlice from "./paystack";

const store = configureStore({
  reducer: { auth: paystackSlice.reducer },
});

export default store;
