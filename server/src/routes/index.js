import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.get("/health", (req, res) => res.json({ ok: true, message: "Server is running" }));

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/admin", adminRoutes);

export default router;
