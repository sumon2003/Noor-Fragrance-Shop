import { api } from "./api";

// ১. ড্যাশবোর্ড স্ট্যাটাস দেখার জন্য
const getStats = async () => {
  try {
    // সরাসরি রেসপন্স রিটার্ন করছি কারণ api.js অলরেডি ডাটা পার্স করে
    return await api.get("/admin/stats");
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

// ২. নতুন প্রোডাক্ট আপলোড করার ফাংশন (Cloudinary & Multipart Support)
const uploadProduct = async (formData) => {
  try {
    // এখানে আলাদা করে Content-Type দেওয়ার প্রয়োজন নেই, 
    // কারণ api.js অটোমেটিক FormData ডিটেক্ট করতে পারে।
    return await api.post("/products", formData);
  } catch (error) {
    console.error("Error uploading product:", error);
    throw error;
  }
};

// ৩. প্রোডাক্ট ডিলিট করার ফাংশন
const deleteProduct = async (id) => {
  try {
    // api.js এ আপনার ফাংশনের নাম ছিল 'del', তাই সেটি ব্যবহার করা হলো
    return await api.del(`/products/${id}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// ৪. সব প্রোডাক্ট লিস্ট দেখার ফাংশন (অ্যাডমিন প্যানেলের জন্য)
const getAllProductsAdmin = async () => {
  try {
    const response = await api.get("/products");
    console.log("API Response in Service:", response); // ডাটা আসছে কি না চেক করার জন্য
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const adminService = {
  getStats,
  uploadProduct,
  deleteProduct,
  getAllProductsAdmin,
};

export default adminService;