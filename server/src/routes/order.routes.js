import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
} from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js"; 

router.route("/")
  .post(protect, addOrderItems)
  .get(protect, getMyOrders);

router.route("/:id")
  .get(protect, getOrderById);

export default router;