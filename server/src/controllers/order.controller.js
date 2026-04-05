import Order from "../models/Order.js";
import Product from "../models/Product.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";

export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice, guestInfo, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const order = new Order({
    orderItems,
    shippingAddress,
    totalPrice,
    paymentMethod, 
    user: req.user ? req.user._id : null,
    guestInfo: req.user ? null : guestInfo, 
  });

  const createdOrder = await order.save();

  for (const item of orderItems) {
    await Product.updateOne(
      { 
        _id: item.product, 
        "variants.size": item.size 
      },
      { 
        $inc: { "variants.$.stock": -item.quantity } 
      }
    );
  }

  res.status(201).json(createdOrder);
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    if (req.body.status === 'Delivered') {
      order.isDelivered = true;
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});