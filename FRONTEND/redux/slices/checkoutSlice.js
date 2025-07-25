import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// async thunk to create a checkout session
export const createCheckout = createAsyncThunk("checkout/createCheckout", async (checkoutData, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
            checkoutData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Add token if needed
                },
            }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to create checkout session"
        );
    }
});

const checkoutSlice = createSlice({
    name: "checkout",
    initialState: {
        checkoutData: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle createCheckout
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkoutData = action.payload; // Store the checkout data (e.g., session ID, etc.)
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export default checkoutSlice.reducer;