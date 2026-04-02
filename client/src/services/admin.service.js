import { api } from "./api";

const getStats = async () => {
  const { data } = await api.get("/admin/stats");
  return data;
};

const uploadProduct = async (formData) => {
  const { data } = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

const adminService = {
  getStats,
  uploadProduct,
  deleteProduct,
};

export default adminService;