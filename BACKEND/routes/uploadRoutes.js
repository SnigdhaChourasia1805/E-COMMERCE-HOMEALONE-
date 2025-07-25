import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Set up Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();


// Set up Multer for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory (ideal for Cloudinary uploads)
const upload = multer({ storage });

// POST route to handle file upload and save to Cloudinary
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        };

        // Function to handle the stream upload to Cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                if (result) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            });
            // use streamifier to convert file buffer to a stream
            streamifier.createReadStream(fileBuffer).pipe(stream);
        };

        // call the streamUpload function
        const result = await streamUpload(req.file.buffer);

        // respond with the upload image url
        res.json({ imageUrl: result.secure_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }

});

export default router;