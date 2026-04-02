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
    name: { type: String, required: true, trim: true },
    slug: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    category: {
      type: String,
      enum: ["Oud", "Musk", "Floral", "Fresh", "Spicy"],
      required: true,
    },
    description: { type: String, default: "" },
    // image ফিল্ডটি Cloudinary URL স্টোর করবে
    image: { type: String, required: true },

    notes: {
      top: { type: String, default: "" },    
      heart: { type: String, default: "" },  
      base: { type: String, default: "" },   
    },
    
    // Controller এ আমরা split(',') করে অ্যারে বানাচ্ছি, তাই এখানে String অ্যারে রাখা হয়েছে
    ingredients: { 
      type: [String], 
      default: [] 
    }, 

    variants: {
      type: [variantSchema],
      // কমপক্ষে একটি ভ্যারিয়েন্ট থাকতে হবে
      validate: {
        validator: function(v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "Product must have at least one variant (Size & Price)!"
      }
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ডুপ্লিকেট স্লাগ এরর হ্যান্ডেল করার জন্য ইনডেক্সিং
productSchema.index({ slug: 1 });

export default mongoose.model("Product", productSchema);