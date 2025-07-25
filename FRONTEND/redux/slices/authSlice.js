import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Retrieve user info and token from localStorage if available
const userFromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;

// Check for an existing guest ID in localStorage or generate a new one
const initialGuestId = localStorage.getItem("guestId") || `guest_${Date.now()}`;
localStorage.setItem("guestId", initialGuestId);

// Initial state
const initialState = {
    user: userFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
    try {
        console.log("Sending login payload:", userData); // ✅ Debug
        const { data } = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
            userData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        localStorage.setItem("userToken", data.token);
        return data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "An error occurred" });
    }
});

// Async thunk for user registration
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
    try {
        console.log("Sending register payload:", userData); // ✅ Debug
        const { data } = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
            userData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        localStorage.setItem("userToken", data.token);
        return data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "An error occurred" });
    }
});

// Slice definition
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.guestId = `guest_${Date.now()}`;
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId", state.guestId);
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${Date.now()}`;
            localStorage.setItem("guestId", state.guestId);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload;
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload?.message || "Login failed";
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload;
            })
            .addCase(registerUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload?.message || "Registration failed";
            });
    },
});

export const { logout, generateNewGuestId } = authSlice.actions;

export default authSlice.reducer;
