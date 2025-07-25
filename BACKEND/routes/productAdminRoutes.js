import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/admin/products
// @desc    Get all products with pagination/filtering
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    let pageSize = 20;
    let page = parseInt(req.query.page) || 1;

    if (req.query.pageSize) {
      pageSize = Math.min(parseInt(req.query.pageSize), 100) || 20;
    }

    const query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.published === "true") query.isPublished = true;
    if (req.query.published === "false") query.isPublished = false;

    const count = await Product.countDocuments(query);

    const products = await Product.find(query)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error("Admin fetch products failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/admin/products/new
// @desc    Get the latest 10 products
// @access  Private/Admin
router.get("/new", protect, admin, async (req, res) => {
  try {
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    res.json(recentProducts);
  } catch (error) {
    console.error("Admin fetch new products failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/admin/products
// @desc    Create new product
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      sku,
      category,
      brand,
      images,
      isFeatured,
      isPublished,
      rating,
      numReviews,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      weight,
    } = req.body;

    if (!name || !description || !price || !sku || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({ message: "SKU must be unique" });
    }

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock: countInStock || 0,
      sku,
      category,
      brand,
      images: images || [],
      isFeatured: isFeatured || false,
      isPublished: isPublished || false,
      rating: rating || 0,
      numReviews: numReviews || 0,
      tags: tags || [],
      metaTitle,
      metaDescription,
      metaKeywords,
      weight,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Admin create product failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Update product by ID
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.error("Admin update product failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ UPDATED: DELETE PRODUCT BY ID — Mongoose-safe version
// @route   DELETE /api/admin/products/:id
// @desc    Delete product by ID
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted", id });
  } catch (error) {
    console.error("Admin delete product failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
