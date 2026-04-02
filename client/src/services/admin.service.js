import { api } from "./api";

// ১. ড্যাশবোর্ড স্ট্যাটাস দেখার জন্য
const getStats = async () => {
  const { data } = await api.get("/admin/stats");
  return data;
};

// ২. নতুন প্রোডাক্ট আপলোড করার ফাংশন (Cloudinary & Multipart Support)
const uploadProduct = async (formData) => {
  // যেহেতু আমরা ছবি এবং JSON ডাটা একসাথে পাঠাচ্ছি, 
  // তাই 'multipart/form-data' হেডার ব্যবহার করা জরুরি।
  const { data } = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ৩. প্রোডাক্ট ডিলিট করার ফাংশন
const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

// ৪. সব প্রোডাক্ট লিস্ট দেখার ফাংশন (অ্যাডমিন প্যানেলের জন্য)
const getAllProductsAdmin = async () => {
  const { data } = await api.get("/products");
  return data;
};

const adminService = {
  getStats,
  uploadProduct,
  deleteProduct,
  getAllProductsAdmin,
};

export default adminService;