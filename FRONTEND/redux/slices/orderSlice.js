import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// async thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk(
    "orders/fetchUserOrders",
    async (userId, { rejectWithValue }) => {
        try {
            // Send GET request to fetch user orders
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Authorization header if required
                    },
                }
            );
            return response.data; // Assuming the backend response contains an array of orders
        } catch (error) {
            console.error("Error fetching orders:", error);
            return rejectWithValue(
                error.response.data
            );
        }
    }
);

// async thunk to fetch orders details by ID
export const fetchOrderDetails = createAsyncThunk(
    "orders/fetchOrderDetails",
    async (orderId, { rejectWithValue }) => {
        try {
            // Send GET request to fetch order details by ID
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Authorization header if required
                    },
                }
            );
            return response.data; // Return the order details
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const ordersSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        orderDetails: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle fetchUserOrders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload; // Set orders to the fetched data
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Handle fetchOrderDetails
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload; // Set order details
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export default ordersSlice.reducer;

