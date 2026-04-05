import express from "express";
const router = express.Router();
import { addOrderItems, getOrders } from "../controllers/order.controller.js";
import { protect, optionalProtect, admin } from "../middlewares/auth.middleware.js";

router.route("/").post(optionalProtect, addOrderItems);

router.route("/admin").get(protect, admin, getOrders);

export default router;