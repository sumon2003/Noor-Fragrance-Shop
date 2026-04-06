import express from "express";
const router = express.Router();

import { 
  addOrderItems, 
  getOrders, 
  updateOrderStatus, 
  getOrderStats,
  getOrderById 
} from "../controllers/order.controller.js";

import { protect, optionalProtect, admin } from "../middlewares/auth.middleware.js";

router.get("/stats", protect, admin, getOrderStats);
router.get("/admin", protect, admin, getOrders); 

router.post("/", optionalProtect, addOrderItems);

router.get('/:id', getOrderById); 

router.put("/:id/status", protect, admin, updateOrderStatus);

export default router;