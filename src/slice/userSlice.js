import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { commonApi } from "../common/common";

export const fetchUsers = createAsyncThunk("users/allusers", async () => {
  const res = await commonApi({ endpoint: "api/users/allUserSuper" });

  return res.data;
});

const fetchUserSlice = createSlice({
  name: "fetchUsers",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default fetchUserSlice.reducer;
