import { api } from "./api";

const getStats = async () => {
  return await api.get("/admin/stats");
};

const adminService = {
  getStats,
};

export default adminService;