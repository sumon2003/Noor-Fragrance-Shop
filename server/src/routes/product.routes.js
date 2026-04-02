import express from "express";
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  deleteProduct 
} from "../controllers/product.controller.js";
import upload from "../config/cloudinary.js"; 
// import { protect, admin } from "../middleware/auth.middleware.js"; // সিকিউরিটির জন্য পরে অ্যাড করতে পারেন

const router = express.Router();

// ১. সব প্রোডাক্ট দেখা (Public)
router.get("/", getProducts);

// ২. সিঙ্গেল প্রোডাক্ট দেখা (Public)
router.get("/:id", getProductById);

// ৩. নতুন প্রোডাক্ট তৈরি করা (Admin Only - Cloudinary Support)
// 'image' হলো ফ্রন্টএন্ড ফর্মের input name
router.post("/", upload.single("image"), createProduct);

// ৪. প্রোডাক্ট ডিলিট করা (Admin Only)
router.delete("/:id", deleteProduct);

export default router;