import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    // normalize image field 
    const normalizedProducts = products.map((p) => {
      const obj = p.toObject(); 
      return {
        ...obj,
        image: obj.image || obj.imageUrl || "",
      };
    });

    res.json(normalizedProducts);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
