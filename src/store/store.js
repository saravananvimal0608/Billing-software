import { configureStore } from "@reduxjs/toolkit";

import fetchDetailsReducer from '../slice/shopSlice.js'

export const store = configureStore({
  reducer: {
    fetchDetails: fetchDetailsReducer
  }
});