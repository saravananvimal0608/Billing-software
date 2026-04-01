import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { commonApi } from "../common/common";

export const fetDetails = createAsyncThunk("shop/details", async () => {
  const res = await commonApi({ endpoint: "api/shop/" });
  return res;
});

export const fetchAllShops = createAsyncThunk("all/shops", async () => {
  const res = await commonApi({ endpoint: "api/shop/getallshopscount" });

  return res.data;
});


const fetchDetailSlice = createSlice({
  name: "fetchDetails",
  initialState: {
    shops: [],
    shopDetails: [],
    allUpgradeRequest:[],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.shopDetails = action.payload;
      })
      .addCase(fetDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // fetch all shops
      .addCase(fetchAllShops.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllShops.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload.data;
      })
      .addCase(fetchAllShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
  },
});

export default fetchDetailSlice.reducer;
