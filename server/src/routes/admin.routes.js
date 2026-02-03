import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = Router();

router.get("/health", requireAuth, requireAdmin, (req, res) => {
  res.json({ ok: true, message: "Admin route working", admin: req.user.email });
});

export default router;
