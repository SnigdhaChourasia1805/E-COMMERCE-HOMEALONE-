import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
}, { _id: false }); // Prevents creating a unique _id for each order item

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    orderItems: [orderItemSchema], // Array of order items (each an individual product)
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false, // Default to false (order not paid)
    },
    paidAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: "pending", // Order payment status (pending, completed, failed, etc.)
    },
    paymentDetails: {
        type: Map,
        of: mongoose.Schema.Types.Mixed, // Allows flexible data storage for payment details (e.g., PayPal, Stripe)
        default: {},
    },
    isDelivered: {
        type: Boolean,
        default: false, // Default order status
    },
    deliveredAt: {
        type: Date,
    },
    orderedAt: {
        type: Date,
        default: Date.now, // Automatically set to the current date
    },
    status: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered", "Canceled"],
        default: "Processing", // Default order status
    }
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
