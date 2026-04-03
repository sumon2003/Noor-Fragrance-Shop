import Product from "../models/Product.js";

// ১. সব প্রোডাক্ট দেখা (User Side)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });

    const normalized = products.map((p) => {
      const obj = p.toObject();
      return {
        ...obj,
        image: obj.image || obj.imageUrl || "",
      };
    });

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// ২. সিঙ্গেল প্রোডাক্ট দেখা (Details Page)
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

// ৩. নতুন প্রোডাক্ট তৈরি (Admin Side - Cloudinary Support)
export const createProduct = async (req, res) => {
  try {
    const { 
      name, slug, category, description, 
      topNotes, heartNotes, baseNotes, 
      ingredients, variants 
    } = req.body;

    // ১. Variants safe parsing
    let parsedVariants = [];
    if (variants) {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    }

    // ২. Ingredients safe parsing
    let parsedIngredients = [];
    if (ingredients) {
      parsedIngredients = typeof ingredients === 'string' 
        ? ingredients.split(',').map(i => i.trim()).filter(i => i !== "") 
        : (Array.isArray(ingredients) ? ingredients : []);
    }

    const newProduct = new Product({
      name,
      slug,
      category,
      description: description || "",
      image: req.file ? req.file.path : "", 
      notes: {
        top: topNotes || "",
        heart: heartNotes || "",
        base: baseNotes || ""
      },
      ingredients: parsedIngredients,
      variants: parsedVariants
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Create Product Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// ৪. প্রোডাক্ট ডিলিট করা
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// ৫. প্রোডাক্ট আপডেট করা (Admin Side)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, slug, category, description, 
      topNotes, heartNotes, baseNotes, 
      ingredients, variants, isActive 
    } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ১. Variants safe parsing
    if (variants) {
      product.variants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    }

    // ২. Ingredients safe parsing
    if (ingredients) {
      product.ingredients = typeof ingredients === 'string' 
        ? ingredients.split(',').map(i => i.trim()).filter(i => i !== "") 
        : (Array.isArray(ingredients) ? ingredients : product.ingredients);
    }

    // ৩. নতুন ইমেজ থাকলে আপডেট করা
    if (req.file) {
      product.image = req.file.path; 
    }

    // ৪. অন্যান্য ফিল্ড আপডেট
    product.name = name || product.name;
    product.slug = slug || product.slug;
    product.category = category || product.category;
    product.description = description || product.description;
    product.isActive = isActive !== undefined ? isActive : product.isActive;
    
    product.notes = {
      top: topNotes || product.notes.top,
      heart: heartNotes || product.notes.heart,
      base: baseNotes || product.notes.base
    };

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};