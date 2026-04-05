import React, { useState, useEffect } from 'react';
import adminService from '../../services/admin.service';
import { 
  ShoppingBag, Search, Filter, ExternalLink, 
  CheckCircle2, Clock, Truck, MoreVertical, Loader2 
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await adminService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Shipped': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Processing': return 'bg-amber-300/10 text-amber-300 border-amber-300/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center text-amber-300 gap-4">
      <Loader2 className="animate-spin" size={48} />
      <p className="animate-pulse tracking-widest text-xs font-bold uppercase">Fetching Orders...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tight">ORDER <span className="text-amber-300">HUB</span></h2>
          <p className="text-amber-50/40 text-xs font-bold uppercase tracking-[0.3em] mt-1">Manage & Track Deliveries</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-300/40" size={18} />
            <input 
              placeholder="Search by ID or Name..." 
              className="w-full bg-white/5 border border-amber-300/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-amber-300/30 text-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white/[0.03] border border-amber-300/10 rounded-[2.5rem] backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-amber-300/10 bg-amber-300/[0.02]">
                <th className="px-8 py-6 text-[10px] font-black text-amber-300 uppercase tracking-[0.2em]">Order ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-amber-300 uppercase tracking-[0.2em]">Customer</th>
                <th className="px-8 py-6 text-[10px] font-black text-amber-300 uppercase tracking-[0.2em]">Items</th>
                <th className="px-8 py-6 text-[10px] font-black text-amber-300 uppercase tracking-[0.2em]">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black text-amber-300 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-amber-300 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-300/5">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-mono text-xs text-amber-50/40">#{order._id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-amber-300 transition-colors">
                        {order.user?.name || order.guestInfo?.name}
                      </span>
                      <span className="text-[10px] text-amber-50/30">{order.shippingAddress?.phone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex -space-x-3">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="h-10 w-10 rounded-xl border-2 border-[#0a0a0a] overflow-hidden bg-black/40 relative group/img" title={item.name}>
                          <img src={item.image} alt="" className="h-full w-full object-cover group-hover/img:scale-110 transition-transform" />
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <div className="h-10 w-10 rounded-xl border-2 border-[#0a0a0a] bg-amber-300/10 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                          +{order.orderItems.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-black text-amber-300">
                    ৳{order.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="p-3 bg-white/5 rounded-xl text-amber-300/40 hover:text-amber-300 hover:bg-amber-300/10 transition-all active:scale-90">
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-[2.5rem] mt-6 border border-dashed border-amber-300/10">
          <ShoppingBag className="mx-auto text-amber-300/20 mb-4" size={48} />
          <p className="text-amber-50/30 font-bold uppercase tracking-widest text-xs">No orders placed yet</p>
        </div>
      )}
    </div>
  );
};

export default Orders;