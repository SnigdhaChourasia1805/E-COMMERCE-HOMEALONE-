import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice";
import adminReducer from "./slices/adminSlice";
import adminProductSlice from "./slices/adminProductSlice";
import adminOrderReducer from "./slices/adminOrderSlice";
import categoryReducer from "./slices/categorySlice"
const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        order: orderReducer,
        admin: adminReducer,
        adminProducts: adminProductSlice, 
        adminOrders: adminOrderReducer,   // ✅ FIXED (plural to match usage)
        categories: categoryReducer,
    }

});

export default store;