import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

export const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    }
  }
});

export default cartSlice.reducer;

export const { setCart } = cartSlice.actions;
