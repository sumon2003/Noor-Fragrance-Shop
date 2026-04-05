import React, { useState, useEffect } from 'react';
import adminService from '../../services/admin.service';
import { 
  ShoppingBag, Search, ExternalLink, 
  Loader2, X, Phone, MapPin, Mail, 
  User, Package, CreditCard, Clock
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

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

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await adminService.updateOrderStatus(id, newStatus);
      alert(`Order marked as ${newStatus}`);
      setIsModalOpen(false);
      fetchOrders(); 
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
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
    <div className="p-4 md:p-8 animate-in fade-in duration-700 relative">
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
              className="w-full bg-white/5 border border-amber-300/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-amber-300/30 text-sm transition-all text-white"
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
                        <div key={idx} className="h-10 w-10 rounded-xl border-2 border-[#0a0a0a] overflow-hidden bg-black/40 relative group/img" title={`${item.name} (${item.size})`}>
                          <img src={item.image} alt="" className="h-full w-full object-cover group-hover/img:scale-110 transition-transform" />
                        </div>
                      ))}
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
                    <button 
                      onClick={() => openOrderDetails(order)}
                      className="p-3 bg-white/5 rounded-xl text-amber-300/40 hover:text-amber-300 hover:bg-amber-300/10 transition-all active:scale-90"
                    >
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

      {/* --- ORDER DETAILS MODAL --- */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0d0d0d] border border-amber-300/20 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(251,191,36,0.15)] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${selectedOrder.status === 'Delivered' ? 'bg-emerald-500' : 'bg-amber-300'}`}></span>
                  <h3 className="text-xl font-black text-white tracking-tight uppercase">Order Details</h3>
                </div>
                <p className="text-[10px] text-amber-300/50 tracking-[0.2em] font-bold uppercase">Transaction: #{selectedOrder._id}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all text-white/40"><X size={20}/></button>
            </div>

            {/* Modal Body */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10 overflow-y-auto max-h-[60vh] custom-scrollbar">
              
              {/* Customer & Shipping */}
              <div className="space-y-8">
                <section>
                  <h4 className="text-[10px] font-black text-amber-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><User size={14}/> Customer Information</h4>
                  <div className="space-y-4 bg-white/[0.03] p-5 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 text-sm font-bold text-white/80"><User size={16} className="text-amber-300/60"/> {selectedOrder.user?.name || selectedOrder.guestInfo?.name}</div>
                    <div className="flex items-center gap-3 text-sm font-bold text-white/80"><Phone size={16} className="text-amber-300/60"/> {selectedOrder.shippingAddress.phone}</div>
                    <div className="flex items-center gap-3 text-sm font-bold text-white/80"><Mail size={16} className="text-amber-300/60"/> {selectedOrder.user?.email || selectedOrder.guestInfo?.email}</div>
                  </div>
                </section>

                <section>
                  <h4 className="text-[10px] font-black text-amber-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><MapPin size={14}/> Shipping Address</h4>
                  <div className="p-5 bg-white/[0.03] rounded-3xl border border-white/5 text-sm leading-relaxed">
                    <p className="text-amber-300 font-black mb-2 flex items-center gap-2"><MapPin size={14}/> {selectedOrder.shippingAddress.city}</p>
                    <p className="text-white/60 font-medium">{selectedOrder.shippingAddress.address}</p>
                  </div>
                </section>
              </div>

              {/* Order Items & Summary */}
              <div className="space-y-8">
                <section>
                  <h4 className="text-[10px] font-black text-amber-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Package size={14}/> Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 bg-white/[0.03] p-3 rounded-2xl border border-white/5 group/item">
                        <img src={item.image} className="w-14 h-14 rounded-xl object-cover ring-1 ring-white/10 group-hover/item:ring-amber-300/30 transition-all" alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-white truncate">{item.name}</p>
                          <p className="text-[10px] font-bold text-amber-300/60 mt-1 uppercase">Size: {item.size} | Qty: {item.quantity}</p>
                        </div>
                        <div className="text-xs font-black text-amber-300 italic">৳{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="p-6 bg-amber-300/[0.03] rounded-[2rem] border border-amber-300/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2"><CreditCard size={12}/> Payment</span>
                    <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-300/10 px-3 py-1 rounded-full">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-white uppercase tracking-tighter">Total Price</span>
                    <span className="text-3xl font-black text-amber-300 tracking-tighter">৳{selectedOrder.totalPrice.toLocaleString()}</span>
                  </div>
                </section>
              </div>
            </div>

            {/* Modal Footer: Action Buttons */}
            <div className="p-8 bg-white/[0.02] border-t border-white/5 grid grid-cols-3 gap-4">
              <button onClick={() => handleStatusUpdate(selectedOrder._id, 'Processing')} className="py-4 bg-amber-300/5 text-amber-300 border border-amber-300/10 rounded-2xl text-[10px] font-black tracking-[0.2em] hover:bg-amber-300 hover:text-black transition-all active:scale-95 uppercase">Processing</button>
              <button onClick={() => handleStatusUpdate(selectedOrder._id, 'Shipped')} className="py-4 bg-blue-500/5 text-blue-400 border border-blue-500/10 rounded-2xl text-[10px] font-black tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all active:scale-95 uppercase">Shipped</button>
              <button onClick={() => handleStatusUpdate(selectedOrder._id, 'Delivered')} className="py-4 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 rounded-2xl text-[10px] font-black tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all active:scale-95 uppercase">Delivered</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;