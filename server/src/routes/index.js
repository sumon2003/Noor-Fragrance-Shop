import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import adminRoutes from "./admin.routes.js";
import commentRoutes from "./comment.routes.js";

const router = Router();

router.get("/health", (req, res) => res.json({ ok: true, message: "Server is running" }));
router.use("/comments", commentRoutes);

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/admin", adminRoutes);

export default router;
