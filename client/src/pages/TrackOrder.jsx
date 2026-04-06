import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/order.service';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ShoppingBag, 
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
    try {
        setLoading(true);
        const data = await orderService.getOrderById(id);
        
        // ডাটাবেস থেকে আসা অবজেক্টটি সরাসরি চেক করুন
        if (data && data._id) { 
        setOrder(data);
        } else {
        setError("Order details missing in response");
        }
    } catch (err) {
        console.error("Tracking Error:", err);
        setError(err.response?.status === 404 ? "Order Not Found" : "Server Error");
    } finally {
        setLoading(false);
    }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-amber-300 animate-spin mb-4" />
        <p className="text-amber-300/50 font-bold tracking-widest animate-pulse">FETCHING ORDER DETAILS...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-white p-6">
        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-2 uppercase italic">Order Not Found</h2>
          <p className="text-white/40 mb-8 leading-relaxed">The order ID you are looking for does not exist or has been removed.</p>
          <button 
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 mx-auto bg-amber-300 text-black px-8 py-4 rounded-2xl font-black hover:bg-white transition-all uppercase text-xs tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    'Pending': { icon: <Clock />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    'Processing': { icon: <Package />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    'Shipped': { icon: <Truck />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    'Delivered': { icon: <CheckCircle />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  };

  const currentStatus = statusConfig[order.status] || statusConfig['Pending'];

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Order Header */}
        <div className="bg-white/5 border border-white/5 p-8 rounded-[3rem] backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-amber-300/50 text-[10px] font-black uppercase tracking-[0.4em]">Tracking Order</p>
            <h1 className="text-2xl font-black tracking-tighter">#{order._id}</h1>
          </div>
          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest ${currentStatus.bg} ${currentStatus.color}`}>
            {currentStatus.icon}
            {order.status || 'Pending'}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Items Summary */}
          <div className="bg-white/5 border border-white/5 p-8 rounded-[3rem] space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 italic">
              <ShoppingBag size={18} className="text-amber-300" /> Items Summary
            </h3>
            <div className="space-y-4">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-black/40 rounded-3xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover opacity-80" />
                    <div>
                      <p className="font-bold text-sm text-white/90">{item.name}</p>
                      <p className="text-[10px] text-white/30 uppercase font-black">Size: {item.size} × {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-amber-300 font-black text-sm italic">৳{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/5 flex justify-between items-end">
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Total Paid</p>
              <p className="text-2xl font-black text-amber-300 tracking-tighter italic">৳{order.totalPrice?.toLocaleString()}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white/5 border border-white/5 p-8 rounded-[3rem] space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 italic">
              <MapPin size={18} className="text-amber-300" /> Delivery To
            </h3>
            <div className="space-y-2 text-white/60 font-medium">
              <p className="text-white font-black text-lg">{order.guestInfo?.name || order.user?.name || "Customer"}</p>
              <p className="text-sm">{order.shippingAddress?.address}</p>
              <p className="text-sm">{order.shippingAddress?.city}</p>
              <p className="text-amber-300/50 pt-4 font-black tracking-widest text-[10px]">{order.shippingAddress?.phone}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;