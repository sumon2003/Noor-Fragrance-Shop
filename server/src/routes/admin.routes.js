import express from "express";
const router = express.Router();
import { getDashboardStats } from "../controllers/admin.controller.js";
import { protect, admin } from "../middlewares/auth.middleware.js";

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.route("/stats").get(protect, admin, getDashboardStats);

export default router;