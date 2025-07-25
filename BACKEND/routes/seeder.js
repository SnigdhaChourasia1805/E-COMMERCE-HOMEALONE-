import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product";
import User from "../models/User";
import products from "../data/products";


dotenv.config();

// connect to mongoDB
mongoose.connect(process.env.MONGO_URI);

// Function to seed data
const seedData = async ()=>{
    try {
        // clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        // create a default admin user
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "adminpassword", 
            role: "admin",  
        }); 

        // Assign the default user ID to each product
        const userID = createdUser._id;
        const sampleProducts = products.map((product)=>{
            return{...product,user:userID} });

            // Insert the products into the database
            await Product.insertMany(sampleProducts);

            console.log("Product data seeded successfully");
            process.exit();
    } catch (error) {
        console.log("Error seeding the data:",error);
        process.exit(1);
    }
};

seedData();