import { Router } from "express";
import { register, login, me, verifyEmail, resendVerification } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);

// verify link hit 
router.get("/verify/:token", verifyEmail);

// resend verify
router.post("/resend-verification", resendVerification);

export default router;
