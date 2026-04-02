import React, { useEffect, useState } from 'react';
import adminService from '../../services/admin.service';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        // Backend থেকে সরাসরি ডাটা অথবা data.data যেভাবে আসে সে অনুযায়ী সেট করুন
        setStats(data?.data || data); 
      } catch (err) {
        console.error("Failed to fetch stats", err);
        setError("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-300"></div>
    </div>
  );

  if (error) return <div className="text-red-400 p-8">{error}</div>;

  const statCards = [
    { title: "Total Revenue", value: `৳${stats?.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, color: "text-green-400" },
    { title: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "text-blue-400" },
    { title: "Products", value: stats?.totalProducts || 0, icon: Package, color: "text-amber-400" },
    { title: "Customers", value: stats?.totalUsers || 0, icon: Users, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-amber-300">Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white/5 border border-amber-300/10 p-6 rounded-3xl hover:border-amber-300/30 transition shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-50/60 text-sm font-medium">{card.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl bg-white/5 ${card.color}`}>
                <card.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white/5 border border-amber-300/10 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-amber-300/10 flex justify-between items-center">
          <h3 className="text-xl font-bold text-amber-300">Recent Orders</h3>
          <button className="text-sm text-amber-300/60 hover:text-amber-300 transition">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-amber-50/60 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-300/5">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition group">
                    <td className="p-4 text-xs font-mono text-amber-300/70 group-hover:text-amber-300">#{order._id.slice(-6)}</td>
                    <td className="p-4 font-medium text-white/90">{order.user?.name || "Guest User"}</td>
                    <td className="p-4 text-amber-200 font-semibold">৳{order.totalPrice}</td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 rounded-full bg-amber-300/10 text-amber-300 text-[10px] font-bold uppercase tracking-widest">
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-amber-50/40">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;