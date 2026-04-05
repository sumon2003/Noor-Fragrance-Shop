import express from "express";
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  deleteProduct,
  updateProduct
} from "../controllers/product.controller.js";
import upload from "../config/cloudinary.js"; 
// import { protect, admin } from "../middleware/auth.middleware.js"; 

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", upload.single("image"), createProduct);

router.put("/:id", upload.single("image"), updateProduct); 

router.delete("/:id", deleteProduct);


export default router;