import { createSlice } from "@reduxjs/toolkit";

const paystackSlice = createSlice({
  name: "paystack",
  initialState: {
    email: "",
    reference: "",
    amount: "",
  },
  reducers: {
    onPay(state, action) {
      const details = action.payload;
      state.email = details.email;
      state.reference = details.reference;
      state.amount = details.amount;
    },
  },
});

export const authActions = paystackSlice.actions;
export default paystackSlice;
