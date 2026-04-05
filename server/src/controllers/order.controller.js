import Order from "../models/Order.js";
import Product from "../models/Product.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Create new order & Update Inventory
// @route   POST /api/orders
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

  // inventory update logic
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

// @desc    Get all orders for Admin
// @route   GET /api/orders/admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    if (req.body.status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get order statistics for Dashboard
// @route   GET /api/orders/stats
export const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $facet: {
        totalOrders: [{ $count: "count" }],
        deliveredOrders: [
          { $match: { status: "Delivered" } },
          { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
        ],
        pendingOrders: [
          { $match: { status: "Pending" } },
          { $count: "count" }
        ]
      }
    }
  ]);

  const result = {
    totalOrders: stats[0].totalOrders[0]?.count || 0,
    totalRevenue: stats[0].deliveredOrders[0]?.totalRevenue || 0,
    pendingOrders: stats[0].pendingOrders[0]?.count || 0,
  };

  res.json(result);
});