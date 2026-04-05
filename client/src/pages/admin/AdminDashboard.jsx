import React, { useEffect, useState } from 'react';
import adminService from '../../services/admin.service';
import { 
  DollarSign, ShoppingBag, Users, Package, 
  TrendingUp, ArrowUpRight, Clock, ChevronRight, 
  LayoutDashboard, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data?.data || data || {}); 
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
      <Loader2 className="animate-spin text-amber-300" size={48} />
      <p className="text-amber-300/50 font-black tracking-[0.3em] text-[10px] uppercase">Loading Intelligence...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem] text-red-400 text-sm font-bold tracking-wide">
        ⚠️ {error}
      </div>
    </div>
  );
  const statCards = [
    { 
      title: "Total Revenue", 
      value: `৳${(Number(stats?.totalRevenue) || 0).toLocaleString()}`, 
      icon: DollarSign, 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10",
      trend: "+12.5%" 
    },
    { 
      title: "Total Orders", 
      value: (stats?.totalOrders || 0).toLocaleString(), 
      icon: ShoppingBag, 
      color: "text-amber-300", 
      bg: "bg-amber-300/10",
      trend: "+8.2%" 
    },
    { 
      title: "Active Products", 
      value: (stats?.totalProducts || 0).toLocaleString(), 
      icon: Package, 
      color: "text-blue-400", 
      bg: "bg-blue-500/10",
      trend: "Stable" 
    },
    { 
      title: "Total Customers", 
      value: (stats?.totalUsers || 0).toLocaleString(), 
      icon: Users, 
      color: "text-purple-400", 
      bg: "bg-purple-500/10",
      trend: "+15%" 
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 p-2">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutDashboard size={18} className="text-amber-300" />
            <h2 className="text-3xl font-black text-white italic tracking-tight uppercase">Dashboard <span className="text-amber-300">Overview</span></h2>
          </div>
          <p className="text-amber-50/30 text-[10px] font-bold uppercase tracking-[0.4em] ml-1">Real-time business analytics</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
          <Clock size={14} className="text-amber-300" />
          <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="group bg-white/[0.03] border border-white/5 hover:border-amber-300/30 p-7 rounded-[2.5rem] transition-all duration-500 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-[50px] opacity-10 transition-opacity group-hover:opacity-20 ${card.bg}`}></div>
            
            <div className="flex flex-col gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.bg} ${card.color} border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                <card.icon size={22} />
              </div>
              <div>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{card.title}</p>
                <h3 className="text-3xl font-black mt-1 text-white tracking-tighter italic">{card.value}</h3>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <span className={`flex items-center gap-1 text-[10px] font-bold ${index === 2 ? 'text-blue-400' : 'text-emerald-400'}`}>
                  {index !== 2 && <ArrowUpRight size={12} />} {card.trend}
                </span>
                <span className="text-[9px] text-white/10 font-bold uppercase tracking-widest">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table Section */}
      <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-xl shadow-2xl transition-all hover:border-amber-300/10">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-300/10 text-amber-300">
              <ShoppingBag size={18} />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tighter">Recent <span className="text-amber-300">Orders</span></h3>
          </div>
          <button 
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2 text-[10px] font-black text-amber-300/50 hover:text-amber-300 transition-all uppercase tracking-widest group"
          >
            View All Orders <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] text-amber-300/50 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Total Amount</th>
                <th className="px-8 py-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-8 py-6">
                      <span className="text-xs font-mono text-white/30 group-hover:text-amber-300/60 transition-colors uppercase tracking-widest italic">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-amber-300 transition-colors text-sm">
                          {order.user?.name || order.guestInfo?.name || "Anonymous Guest"}
                        </span>
                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                          {order.shippingAddress?.city || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-amber-300 font-black text-base italic tracking-tight">
                        ৳{(Number(order.totalPrice) || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-500
                          ${order.status === 'Delivered' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-300/10 text-amber-300 border-amber-300/20 shadow-[0_0_15px_rgba(251,191,36,0.05)]'
                          }`}>
                          {order.status || "Pending"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <ShoppingBag size={40} />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No recent activity detected</p>
                    </div>
                  </td>
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