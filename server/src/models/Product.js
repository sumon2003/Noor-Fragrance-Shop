import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true }, // 3ml, 6ml
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["Oud", "Musk", "Floral", "Fresh", "Spicy"],
      required: true,
    },
    description: String,
    image: { type: String, required: true },

    // --- নতুন যোগ করা সেকশন: Notes & Ingredients ---
    notes: {
      top: { type: String, default: "" },    // Opening notes
      heart: { type: String, default: "" },  // Middle notes
      base: { type: String, default: "" },   // Long-lasting notes
    },
    ingredients: { 
      type: [String], 
      default: [] 
    }, // উপাদানের তালিকা (Array of strings)
    // ----------------------------------------------

    variants: {
      type: [variantSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);