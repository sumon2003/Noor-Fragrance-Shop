import Order from "../models/Order.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice, guestInfo } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const order = new Order({
    orderItems,
    shippingAddress,
    totalPrice,
    
    user: req.user ? req.user._id : null,
    guestInfo: req.user ? null : guestInfo, 
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});