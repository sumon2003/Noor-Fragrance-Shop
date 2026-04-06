import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, 
    },
    guestInfo: {
      name: { type: String },
      email: { type: String },
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        size: { 
          type: String, 
          required: false, 
          default: "Regular" 
        }, 
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    totalPrice: { type: Number, required: true },
    status: { 
      type: String, 
      default: "Pending",
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] // অপশনাল: স্ট্যাটাস কন্ট্রোল করার জন্য
    }, 
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);