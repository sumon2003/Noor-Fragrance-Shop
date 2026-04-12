import express from "express";
import { 
  createComment, 
  getProductComments, 
  getAllCommentsForAdmin, 
  updateCommentStatus 
} from "../controllers/comment.controller.js";
import { protect, admin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 1. (Public)
router.get("/product/:productId", getProductComments);

// 2. (User Action)
router.post("/", protect, createComment);

// 3. (Admin Action)
router.get("/admin/all", protect, admin, getAllCommentsForAdmin);

// 4. (Admin Action: Approve/Reject)
router.put("/admin/:commentId/status", protect, admin, updateCommentStatus);

export default router;