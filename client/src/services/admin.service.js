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

// --- User Management ---
const getAllUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response?.data || response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const updateUserByAdmin = async (id, userData) => {
  try {
    return await api.put(`/admin/users/${id}`, userData);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    return await api.del(`/admin/users/${id}`); 
  } catch (error) {
    console.error("Error deleting user:", error);
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
  getAllUsers,      
  updateUserByAdmin, 
  deleteUser,        
  uploadProduct,
  getProductByIdAdmin, 
  updateProduct,      
  deleteProduct,
  getAllProductsAdmin,
  getAllOrders,    
  updateOrderStatus 
};

export { getAllOrders, updateOrderStatus, getAllUsers, updateUserByAdmin, deleteUser };

export default adminService;