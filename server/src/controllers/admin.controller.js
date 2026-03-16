import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  // Total revenue calculation
  const orders = await Order.find();
  const totalRevenue = orders.reduce((acc, item) => acc + item.totalPrice, 0);

  // Recent orders (last 5)
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name");

  res.json({
    totalOrders,
    totalUsers,
    totalProducts,
    totalRevenue,
    recentOrders,
  });
});