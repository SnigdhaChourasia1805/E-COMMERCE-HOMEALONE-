import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./middleware/Config/db.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import productAdminRoutes from "./routes/productAdminRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

// Middleware stack
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// Use morgan only in development for logging HTTP requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Serve static files from 'public' with correct MIME for JS
app.use(express.static("public", {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".js")) {
      res.setHeader("Content-Type", "application/javascript");
    }
  },
}));

// Serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check or basic welcome route
app.get("/", (req, res) => {
  res.send("WELCOME TO HOME ALONE");
});

// API routes
app.use("/api/users", userRoutes);

// <-- Updated this line -->
app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

// Admin routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// 404 handler (should be after all routes)
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Global error handler (with 4 args to signal error middleware)
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack || err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
