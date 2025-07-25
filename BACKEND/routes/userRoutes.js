import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route POST /api/users/register
// @desc  Register a new user
// @access Public
router.post("/register", async (req, res) => {
    console.log("Register request body:", req.body); 

    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please enter all fields" });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Create new user — password will be hashed by model middleware
        user = new User({
            name,
            email,
            password,
        });

        await user.save();

        // Create JWT payload
        const payload = {
            user: {
                id: user._id,
                role: user.role,
            },
        };

        // Sign token and return user + token
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (error, token) => {
            if (error) throw error;

            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @route POST /api/users/login
// @desc  Authenticate user
// @access Public
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user._id,
                role: user.role,
            },
        };

        // Sign token and return user + token
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (error, token) => {
            if (error) throw error;

            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @route GET /api/users/profile
// @desc Get logged-in user's profile
// @access Private
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});

export default router;
