import { Router } from "express";
import { getProducts } from "../controllers/product.controller.js";

const router = Router();

// GET /api/products
router.get("/", getProducts);

export default router;
