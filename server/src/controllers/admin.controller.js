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

// ==========================================
//          USER MANAGEMENT LOGIC
// ==========================================

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Update user role or block status
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // self block or role change protection
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error("You cannot update your own admin status or block yourself!");
    }

    user.role = req.body.role || user.role;
    user.isAdmin = req.body.role === "Admin" ? true : false;
    user.isBlocked = req.body.isBlocked !== undefined ? req.body.isBlocked : user.isBlocked;

    const updatedUser = await user.save();
    res.json({
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isAdmin: updatedUser.isAdmin,
        isBlocked: updatedUser.isBlocked,
      },
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    // অ্যাডমিন ইউজার ডিলিট করা প্রোটেকশন
    if (user.isAdmin || user.role === "Admin") {
      res.status(400);
      throw new Error("You cannot delete an admin user!");
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});