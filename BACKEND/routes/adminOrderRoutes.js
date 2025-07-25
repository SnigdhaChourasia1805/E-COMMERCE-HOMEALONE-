import express from "express";
import Order from "../models/Order.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/admin/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/admin/orders/:id
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;

    if (req.body.status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Failed to update order:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   DELETE /api/admin/orders/:id
// @desc    Delete an order (Admin only)
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order Not Found" });
    }

    await order.deleteOne();
    res.status(200).json({ message: "Order Removed" });
  } catch (error) {
    console.error("Failed to delete order:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
