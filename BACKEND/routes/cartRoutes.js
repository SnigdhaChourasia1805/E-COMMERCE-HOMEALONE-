import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper function to get a cart by user id or guest id
const getCart = async (userId, guestId) => {
    if (userId) {
        // Fetch cart for logged-in user
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        // Fetch cart for guest user
        return await Cart.findOne({ guestId });
    } else {
        // If neither userId nor guestId is provided, return null or a new empty cart
        return null;
    }
};

// @route POST /api/cart
// @desc Add a product to the cart for a guest or logged in user
// @access Public
router.post("/", async (req, res) => {
    const { productId, quantity, guestId, userId } = req.body;

    try {
        // Find the product in the database by its ID
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found!" });

        // Get the current cart for the logged-in user or guest
        let cart = await getCart(userId, guestId);

        // If no cart exists, create a new one
        if (!cart) {
            cart = new Cart({
                user: userId || null, // userId will be null for guests
                guestId: guestId || null, // guestId will be null for logged-in users
                products: [], // Initialize an empty product list
                totalPrice: 0, // Initialize total price to 0
            });
        }

        // Check if the product is already in the cart
        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId
        );

        if (productIndex >= 0) {
            // If the product already exists in the cart, update the quantity
            cart.products[productIndex].quantity += quantity;
        } else {
            // If the product is not in the cart, add it
            cart.products.push({
                productId,
                name: product.name,
                image: product.images[0].url,
                price: product.price,
                quantity,
            });
        }

        // Recalculate the total price of the cart
        cart.totalPrice = cart.products.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        // Save the updated cart to the database
        await cart.save();

        // Respond with the updated cart
        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route PUT /api/cart 
// @desc Update product quantity in the cart for a guest or logged-in user
// @access Public 
router.put("/", async (req, res) => {
    const { productId, quantity, guestId, userId } = req.body;

    try {
        // Get the current cart for the logged-in user or guest
        let cart = await getCart(userId, guestId);

        // If no cart exists, return an error
        if (!cart) {
            return res.status(404).json({ message: "Cart not found!" });
        }

        // Find the product in the cart
        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId
        );
        // If the product is not found, return an error
        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart!" });
        }

        // Update the product quantity
        cart.products[productIndex].quantity = quantity;

        // Recalculate the total price of the cart
        cart.totalPrice = cart.products.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
        // Save the updated cart to the database
        await cart.save();

        // Respond with the updated cart
        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route DELETE /api/cart
// @desc Remove a product from the cart
// @access Public
router.delete("/", async (req, res) => {
    const { productId, guestId, userId } = req.body;
    try {
        // Get the current cart for the logged-in user or guest
        let cart = await getCart(userId, guestId);

        // If no cart exists, return an error
        if (!cart) {
            return res.status(404).json({ message: "Cart not found!" });
        }

        // Find the index of the product in the cart
        const productIndex = cart.products.findIndex(
            (p) => p.productId.toString() === productId
        );
        // If the product is not found, return an error
        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart!" });
        }

        // Remove the product from the cart
        cart.products.splice(productIndex, 1);

        // Recalculate the total price of the cart
        cart.totalPrice = cart.products.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        // Save the updated cart to the database
        await cart.save();

        // Respond with the updated cart
        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route GET /api/cart
// @desc Get logged-in user's or guest user's cart
// @access Public
router.get("/", async (req, res) => {
    const { userId, guestId } = req.query;
    try {
        // Retrieve the cart based on userId or guestId
        let cart = await getCart(userId, guestId);

        // If no cart is found, return an empty cart or a 404 error
        if (!cart) {
            return res.status(404).json({ message: "Cart not found!" });
        }

        // Respond with the cart details
        res.status(200).json(cart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;

    try {
        // Find the guest cart and user cart
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if (!guestCart) {
            return res.status(404).json({ message: "Guest cart not found!" });
        }

        if (guestCart.products.length === 0) {
            return res.status(400).json({ message: "Guest cart is empty" });
        }

        if (!userCart) {
            return res.status(404).json({ message: "User cart not found!" });
        }

        // Merge guest cart into the user cart
        guestCart.products.forEach((guestItem) => {
            // Check if the product already exists in the user cart
            const productIndex = userCart.products.findIndex(
                (item) => item.productId.toString() === guestItem.productId.toString()
            );

            if (productIndex >= 0) {
                // If the product exists, update the quantity
                userCart.products[productIndex].quantity += guestItem.quantity;
            } else {
                // If the product doesn't exist, add it to the user cart
                userCart.products.push({
                    productId: guestItem.productId,
                    name: guestItem.name,
                    image: guestItem.image,
                    price: guestItem.price,
                    quantity: guestItem.quantity,
                });
            }
        });

        // Recalculate the total price of the cart
        userCart.totalPrice = userCart.products.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        // Save the updated user cart
        await userCart.save();

        // Optionally, delete the guest cart after merging (to clean up)
        await Cart.deleteOne({ guestId });

        // Respond with the updated user cart
        res.status(200).json(userCart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
