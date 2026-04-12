import Comment from "../models/Comment.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 1. (User Action)
export const createComment = asyncHandler(async (req, res) => {
  const { productId, commentText, rating } = req.body;

  const comment = await Comment.create({
    product: productId,
    user: req.user._id, 
    userName: req.user.name,
    commentText,
    rating,
    status: "Pending" 
  });

  res.status(201).json({
    success: true,
    message: "Comment submitted! Waiting for admin approval.",
    data: comment
  });
});

// 2. (Public Action)
export const getProductComments = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const comments = await Comment.find({ 
    product: productId, 
    status: "Approved" 
  }).sort("-createdAt");

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

// 3. (Admin Action)
export const getAllCommentsForAdmin = asyncHandler(async (req, res) => {
  const comments = await Comment.find()
    .populate("product", "name")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    data: comments
  });
});

// 4. (Admin Action: Approve/Reject)
export const updateCommentStatus = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { status } = req.body;

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    { status },
    { new: true }
  );

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  res.status(200).json({
    success: true,
    message: `Comment ${status} successfully`,
    data: comment
  });
});