import express from 'express';
import Checkout from "../models/Checkout.js";
import Order from "../models/Order.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route POST /api/checkout
// @desc create a new checkout session
// @access Private

router.post("/", protect, async (req, res) => {
    const {
        checkoutItems,
        shippingAddress,
        paymentMethod,
        totalPrice
    } = req.body;

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "No items to checkout" });
    }

    try {
        // Create a checkout session
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending", // Initially set to "Pending" before actual payment
            isPaid: false, // COD payments are unpaid initially
        });
        console.log(`Checkout created for user:${req.user._id}`);
        res.status(201).json(newCheckout);
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route PUT /api/checkout/cod/:id
// @desc Handle COD payment for a checkout session
// @access Private

router.put("/cod/:id", protect, async (req, res) => {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    // Ensure the payment method is COD
    if (paymentMethod !== "COD") {
        return res.status(400).json({ message: "Only COD payment method is allowed for this route" });
    }

    try {
        // Find the checkout session by ID
        const checkoutSession = await Checkout.findById(id);
        if (!checkoutSession) {
            return res.status(404).json({ message: "Checkout session not found" });
        }

        // Update the checkout session with COD details
        checkoutSession.paymentMethod = paymentMethod;
        checkoutSession.paymentStatus = "Pending";  // You can adjust this later based on your logic
        checkoutSession.isPaid = false;  // Since COD is unpaid initially

        // Save the updated checkout session
        const updatedCheckout = await checkoutSession.save();

        // Create an order based on the checkout details
        const order = new Order({
            user: req.user._id,
            checkoutSession: updatedCheckout._id,
            orderItems: updatedCheckout.checkoutItems,
            shippingAddress: updatedCheckout.shippingAddress,
            paymentMethod: updatedCheckout.paymentMethod,
            totalPrice: updatedCheckout.totalPrice,
            paymentStatus: updatedCheckout.paymentStatus, // "Pending"
            isPaid: updatedCheckout.isPaid, // false for COD
            status: "Processing", // You can add an order status like "Processing" or "Pending Delivery"
        });

        await order.save();
        console.log(`COD payment for checkout session ${id} created successfully`);

        res.status(200).json(updatedCheckout);
    } catch (error) {
        console.error("Error handling COD payment:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
