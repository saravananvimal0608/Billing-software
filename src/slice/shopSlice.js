import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { commonApi } from "../common/common";

export const fetDetails = createAsyncThunk(
    'shop/details',
    async () => {
        const res = await commonApi({ endpoint: 'api/shop/' })
        return res
    }

)

const fetchDetailSlice = createSlice({
    name: "fetchDetails",
    initialState: {
        data: [],
        loading: false,
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetDetails.pending, (state) => {
                state.loading = true
            })
            .addCase(fetDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }

})

export default fetchDetailSlice.reducer;


