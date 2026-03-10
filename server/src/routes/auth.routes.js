import { Router } from "express";
import { register, login, me, verifyEmail } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);

// email verification
router.get("/verify-email/:token", verifyEmail);

export default router;
