import { configureStore } from "@reduxjs/toolkit";

import fetchDetailsReducer from '../slice/shopSlice.js'
import fetchUserReducer from '../slice/userSlice.js'

export const store = configureStore({
  reducer: {
    fetchDetails: fetchDetailsReducer,
    fetchUsers: fetchUserReducer,
  }
});