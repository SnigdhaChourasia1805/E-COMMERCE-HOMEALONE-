import express, { response } from "express";
import User from "../models/User.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route GET /api/admin/users
// @desc Get all users(Admin only)
// @access Private

router.get("/", protect, async (req, res) => {
    try {
        // Retrieve all users from the database
        const users = await User.find({});

        // Return the list of users
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});


// @route POST/api/admin/users
// @desc add a new user(admin only)
// @access Private/Admin
router.post("/", protect, async (req, res) => {
    const {
        name,
        email,
        password,
        role
    } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        user = new User({
            name,
            email,
            password,
            role: role || "customer",
        });

        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route PUT /api/admin/users/:id
// @desc Update user info (admin-only)-name,email and role
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the fields (name, email, role)
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        // Save the updated user
        const updatedUser = await user.save();
        res.json({ message: "User updated successfully", user:updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route DELETE /api/admin/users/:id
// @desc Delete a user
// @access Private/Admin
router.delete("/:id",protect,async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(user){
            await user.deleteOne();
            res.json({message:"User deleted successfully"})
        }
        else{
            res.status(404).json({message:"User not found"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"})
    }
})

export default router;