import express from "express";
import productRoutes from "./product.routes.js";
import adminRoutes from "./admin.routes.js";

const router = express.Router();

router.use("/products", productRoutes);
router.use("/admin", adminRoutes);

export default router;
