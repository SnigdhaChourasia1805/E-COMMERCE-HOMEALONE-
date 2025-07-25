// productRoutes.js
import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';  // Correct import

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            collections,
            images,
            isFeatured,
            isPublished,
            sku,
            weight,
        } = req.body;

        // Validate required fields
        if (!name || !description || !price || !countInStock || !category || !sku) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Ensure price and countInStock are numbers
        if (isNaN(price) || isNaN(countInStock)) {
            return res.status(400).json({ message: 'Price and countInStock should be valid numbers' });
        }

        // Create a new product object
        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            collections,
            images,
            isFeatured,
            isPublished,
            sku,
            weight,
            user: req.user._id, // reference to the admin user who created it
        });

        // Save product to the database
        const createdProduct = await product.save();

        // Respond with the created product
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        // Server error handling
        res.status(500).json({ message: 'Server Error! Unable to create product.' });
    }
});

// @route   PUT /api/products/:id
// @desc    Update an existing product
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            collections,
            images,
            isFeatured,
            isPublished,
            sku,
            weight,
        } = req.body;

        // Validate the presence of required fields, even for updates
        if (!name && !description && !price && !countInStock && !category && !sku) {
            return res.status(400).json({ message: 'At least one field must be provided for update' });
        }

        // Find the product by ID
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ensure price and countInStock are valid numbers
        if (price && isNaN(price)) {
            return res.status(400).json({ message: 'Price should be a valid number' });
        }
        if (countInStock && isNaN(countInStock)) {
            return res.status(400).json({ message: 'countInStock should be a valid number' });
        }

        // Update product fields, only if new value is provided
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.discountPrice = discountPrice || product.discountPrice;
        product.countInStock = countInStock || product.countInStock;
        product.category = category || product.category;
        product.collections = collections || product.collections;
        product.images = images || product.images;
        product.isFeatured = isFeatured ?? product.isFeatured; // use nullish coalescing (??) for booleans
        product.isPublished = isPublished ?? product.isPublished;
        product.sku = sku || product.sku;
        product.weight = weight || product.weight;

        // Save the updated product
        const updatedProduct = await product.save();

        // Respond with the updated product
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        // Server error handling
        res.status(500).json({ message: 'Server Error! Unable to update product.' });
    }
});

// @route DELETE /api/products/:id
// @desc Delete a product by ID
// @access Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        // find the product
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: "Product removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @route GET /api/products
// @desc Get all products with optional query filters
// @access Public
router.get("/", async (req, res) => {
    try {
        const {
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            limit = 10,
            page = 1,
        } = req.query;

        // Initialize the query object
        let query = {};

        // Handle search filter: search by product name (case-insensitive)
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // 'i' for case-insensitive search
        }

        // Category filter: filter by category if provided
        if (category && category.toLowerCase() !== 'all') {
            query.category = category;
        }

        // Price filter: filter by minPrice and/or maxPrice
        if (minPrice) {
            query.price = { $gte: parseFloat(minPrice) };
        }
        if (maxPrice) {
            query.price = { ...query.price, $lte: parseFloat(maxPrice) };
        }

        // Pagination and sorting
        const limitNum = parseInt(limit);
        const skip = (page - 1) * limitNum;

        // Sorting logic
        let sortOption = {};
        if (sortBy) {
            const [field, order] = sortBy.split(':'); // Example: "price:asc" or "price:desc"
            sortOption[field] = order === 'desc' ? -1 : 1;
        }

        // Fetch products with filters, pagination, and sorting
        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        // Respond with the products
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public 
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ message: "Product Not Found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @route GET /api/products/similar/:id
// @desc retrieve similar products based on the current products category
// @access Public
router.get("/similar/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Find the current product by ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find products in the same category, excluding the current product
        const similarProducts = await Product.find({
            category: product.category,
            _id: { $ne: id }  // Exclude the current product from the results
        }).limit(4);  // Limit to 5 similar products (you can adjust this number)

        // Respond with the similar products
        res.json(similarProducts);  // Fix: Return `similarProducts` instead of `product`
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// @route GET /api/products/best-seller
// @desc Retrieve the product with highest string
// @access Public
router.get("/best-seller", async (req, res) => {
    try {
        // Find the product with the highest sales count (or any other relevant field)
        const bestSeller = await Product.findOne()
            .sort({ sales: -1 })  // Sort by sales in descending order
            .limit(1);  // Limit to 1 product

        if (bestSeller) {
            res.json(bestSeller);
        } else {
            res.status(404).json({ message: "No best-seller product found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});


// @route GET /api/products/new-arrivals
// @desc Retrieve the latest 8 products (based on creation date)
// @access Public
router.get("/new-arrivals", async (req, res) => {
    try {
        // Fetch the latest 8 products, sorted by createdAt in descending order
        const newArrivals = await Product.find()
            .sort({ createdAt: -1 })  // Sort by creation date, descending order
            .limit(8);  // Limit to 8 products

        if (newArrivals.length > 0) {
            res.json(newArrivals);
        } else {
            res.status(404).json({ message: "No new arrivals found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});


export default router;
