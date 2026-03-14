import express from "express";
const router = express.Router();
import { addOrderItems } from "../controllers/order.controller.js";
import { protect, optionalProtect } from "../middlewares/auth.middleware.js";

router.route("/").post(optionalProtect, addOrderItems);

export default router;