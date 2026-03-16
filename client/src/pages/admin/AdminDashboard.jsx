import React, { useEffect, useState } from 'react';
import adminService from '../../services/admin.service';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-amber-300">Loading Dashboard...</div>;

  const statCards = [
    { title: "Total Revenue", value: `৳${stats?.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-400" },
    { title: "Total Orders", value: stats?.totalOrders, icon: ShoppingBag, color: "text-blue-400" },
    { title: "Products", value: stats?.totalProducts, icon: Package, color: "text-amber-400" },
    { title: "Customers", value: stats?.totalUsers, icon: Users, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-amber-300">Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white/5 border border-amber-300/10 p-6 rounded-3xl hover:border-amber-300/30 transition shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-50/60 text-sm">{card.title}</p>
                <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl bg-white/5 ${card.color}`}>
                <card.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white/5 border border-amber-300/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-amber-300/10">
          <h3 className="text-xl font-bold text-amber-300">Recent Orders</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-white/5 text-amber-50/60 text-sm">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {stats?.recentOrders.map((order) => (
              <tr key={order._id} className="border-b border-amber-300/5 hover:bg-white/5 transition">
                <td className="p-4 text-xs font-mono">#{order._id.slice(-6)}</td>
                <td className="p-4">{order.user?.name || "Guest"}</td>
                <td className="p-4 text-amber-200">৳{order.totalPrice}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-amber-300/10 text-amber-300 text-xs">
                    Processing
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;