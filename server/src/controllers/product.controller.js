import Product from "../models/Product.js";

// all product showing
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });

    const normalized = products.map((p) => {
      const obj = p.toObject();
      return {
        ...obj,
        image: obj.image || obj.imageUrl || "", //
      };
    });

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// single product showing
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const obj = product.toObject();
    res.json({
      ...obj,
      image: obj.image || obj.imageUrl || "", //
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// create product
export const createProduct = async (req, res) => {
  try {
    const { 
      name, slug, category, description, 
      topNotes, heartNotes, baseNotes, 
      ingredients, variants 
    } = req.body;

    let parsedVariants = [];
    if (variants) {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants; //
    }

    let parsedIngredients = [];
    if (ingredients) {
      parsedIngredients = typeof ingredients === 'string' 
        ? ingredients.split(',').map(i => i.trim()).filter(i => i !== "") 
        : (Array.isArray(ingredients) ? ingredients : []); //
    }

    const newProduct = new Product({
      name,
      slug: slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      category,
      description: description || "",
      image: req.file ? req.file.path : "", //
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

// delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id); //
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// product update(Admin Side)
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

    // Variants safe parsing 
    if (variants) {
      product.variants = typeof variants === 'string' ? JSON.parse(variants) : variants; //
    }

    // Ingredients safe parsing
    if (ingredients) {
      product.ingredients = typeof ingredients === 'string' 
        ? ingredients.split(',').map(i => i.trim()).filter(i => i !== "") 
        : (Array.isArray(ingredients) ? ingredients : product.ingredients); //
    }

    // new image handling 
    if (req.file) {
      product.image = req.file.path; 
    }

   
    product.name = name !== undefined ? name : product.name;
    product.slug = slug !== undefined ? slug : product.slug;
    product.category = category !== undefined ? category : product.category;
    product.description = description !== undefined ? description : product.description;
    
    // isActive handling (string to boolean conversion)
    if (isActive !== undefined) {
      product.isActive = String(isActive) === 'true'; //
    }
    
    // Scent Notes update
    product.notes = {
      top: topNotes !== undefined ? topNotes : product.notes.top,
      heart: heartNotes !== undefined ? heartNotes : product.notes.heart,
      base: baseNotes !== undefined ? baseNotes : product.notes.base
    };

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};