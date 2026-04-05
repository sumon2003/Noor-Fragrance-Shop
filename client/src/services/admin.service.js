import { api } from "./api";

const getStats = async () => {
  try {
    return await api.get("/admin/stats");
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

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

const adminService = {
  getStats,
  uploadProduct,
  getProductByIdAdmin, 
  updateProduct,      
  deleteProduct,
  getAllProductsAdmin,
};

export const getAllOrders = async () => {
  return await api.get('/orders/admin'); 
};

export const updateOrderStatus = async (id, status) => {
  return await api.put(`/orders/${id}/status`, { status });
};

export default adminService;