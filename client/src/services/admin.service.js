import { api } from "./api";

// --- Stats & Dashboard ---
const getStats = async () => {
  try {
    return await api.get("/admin/stats");
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

// --- Product Management ---
const uploadProduct = async (formData) => {
  try {
    return await api.post("/products", formData);
  } catch (error) {
    console.error("Error uploading product:", error);
    throw error;
  }
};

const getProductByIdAdmin = async (id) => {
  try {
    return await api.get(`/products/${id}`);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

const updateProduct = async (id, formData) => {
  try {
    return await api.put(`/products/${id}`, formData);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    return await api.del(`/products/${id}`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

const getAllProductsAdmin = async () => {
  try {
    const response = await api.get("/products");
    console.log("API Response in Service:", response); 
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// --- Order Management ---
const getAllOrders = async () => {
  try {
    const response = await api.get('/orders/admin');
    return response?.data || response; 
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

const updateOrderStatus = async (id, status) => {
  try {
    return await api.put(`/orders/${id}/status`, { status });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// --- Export Section ---
const adminService = {
  getStats,
  uploadProduct,
  getProductByIdAdmin, 
  updateProduct,      
  deleteProduct,
  getAllProductsAdmin,
  getAllOrders,    
  updateOrderStatus 
};

export { getAllOrders, updateOrderStatus };

export default adminService;