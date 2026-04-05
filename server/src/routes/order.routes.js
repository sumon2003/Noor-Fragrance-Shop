import express from "express";
const router = express.Router();

import { 
  addOrderItems, 
  getOrders, 
  updateOrderStatus, 
  getOrderStats 
} from "../controllers/order.controller.js";
import { protect, optionalProtect, admin } from "../middlewares/auth.middleware.js";

// user side route
router.route("/").post(optionalProtect, addOrderItems);

// admin side routes
router.route("/admin").get(protect, admin, getOrders);
router.get("/stats", protect, admin, getOrderStats);
router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;