import mongoose from "mongoose";

const checkoutItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
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
}, { _id: false }); // Ensures that the checkout items don't have their own _id

const checkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Ref to the User model
        required: true,
    },
    checkoutItems: [checkoutItemSchema], // Array of checkout items
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true }, // Corrected the duplicate 'address' field
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
        default: false,
    },
    paidAt: {
        type: Date,
    },
    paymentStatus: {
        type: String,
        default: "pending",
    },
    paymentDetails: {
        // Here you can add fields as needed, e.g., for Stripe/PayPal details
        type: Map,
        of: mongoose.Schema.Types.Mixed, // Allows flexibility in storing payment details
        default: {},
    },
    finalizedAt: {
        type: Date,

    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Checkout = mongoose.model("Checkout", checkoutSchema);

export default Checkout;
