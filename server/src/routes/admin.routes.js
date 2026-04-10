import express from "express";
const router = express.Router();
import { 
  getDashboardStats, 
  getAllUsers, 
  updateUserByAdmin, 
  deleteUser 
} from "../controllers/admin.controller.js";
import { protect, admin } from "../middlewares/auth.middleware.js";

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.route("/stats").get(protect, admin, getDashboardStats);

// ==========================================
//          USER MANAGEMENT ROUTES
// ==========================================

// @desc    Get all users list
// @route   GET /api/admin/users
router.route("/users").get(protect, admin, getAllUsers);

// @desc    Update or Delete specific user
// @route   PUT/DELETE /api/admin/users/:id
router.route("/users/:id")
  .put(protect, admin, updateUserByAdmin)
  .delete(protect, admin, deleteUser);

export default router;