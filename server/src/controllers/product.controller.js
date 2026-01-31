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

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const obj = product.toObject();
    res.json({
      ...obj,
      image: obj.image || obj.imageUrl || "",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

