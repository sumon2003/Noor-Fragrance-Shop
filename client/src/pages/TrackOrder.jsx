import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import orderService from '../services/order.service';
import { 
  Package, Truck, CheckCircle2, Clock, 
  MapPin, ShoppingBag, ArrowLeft, Loader2, 
  Phone, Calendar, Hash
} from 'lucide-react';

const TrackOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  const steps = [
    { label: 'Pending', icon: <Clock size={20}/>, status: 'Pending' },
    { label: 'Processing', icon: <Package size={20}/>, status: 'Processing' },
    { label: 'Shipped', icon: <Truck size={20}/>, status: 'Shipped' },
    { label: 'Delivered', icon: <CheckCircle2 size={20}/>, status: 'Delivered' },
  ];

  // বর্তমান স্ট্যাটাস অনুযায়ী স্টেপ ইনডেক্স বের করা
  const currentStep = steps.findIndex(s => s.status === order?.status);

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-amber-300 gap-4">
      <Loader2 className="animate-spin" size={48} />
      <p className="animate-pulse tracking-[0.3em] text-xs font-black uppercase">Locating your package...</p>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-white p-6">
       <ShoppingBag size={64} className="text-amber-300/20 mb-6" />
       <h2 className="text-2xl font-black mb-4">Order Not Found</h2>
       <Link to="/products" className="text-amber-300 border border-amber-300/20 px-8 py-3 rounded-2xl hover:bg-amber-300 hover:text-black transition-all font-bold">Back to Shop</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6 pt-28 selection:bg-amber-300 selection:text-black">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Success Header */}
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-300/10 border border-amber-300/20 mb-2">
            <CheckCircle2 size={40} className="text-amber-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">THANK YOU FOR <br/> YOUR <span className="text-amber-300 italic">PURCHASE</span></h1>
          <p className="text-amber-50/40 text-xs font-bold uppercase tracking-[0.4em]">Order ID: #{order._id.slice(-8).toUpperCase()}</p>
        </div>

        {/* Order Progress Tracker */}
        <div className="bg-white/[0.02] border border-amber-300/10 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="relative flex justify-between items-center z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative z-20 group">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 
                  ${index <= currentStep 
                    ? 'bg-amber-300 border-amber-300 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]' 
                    : 'bg-black/40 border-white/10 text-white/20'}`}>
                  {step.icon}
                </div>
                <span className={`mt-4 text-[10px] md:text-xs font-black uppercase tracking-widest ${index <= currentStep ? 'text-amber-300' : 'text-white/20'}`}>
                  {step.label}
                </span>
                
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-6 md:top-8 left-[100%] w-[calc(100%)] h-[2px] -translate-x-[10%] hidden sm:block">
                    <div className={`h-full transition-all duration-1000 ${index < currentStep ? 'bg-amber-300' : 'bg-white/5'}`} style={{ width: '150%' }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Shipping Info */}
          <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
             <h3 className="text-xs font-black text-amber-300 uppercase tracking-[0.2em] flex items-center gap-2">
               <MapPin size={16}/> Shipping Details
             </h3>
             <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Customer Name</p>
                  <p className="font-bold text-lg">{order.user?.name || order.guestInfo?.name}</p>
                </div>
                <div className="flex gap-10">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Phone</p>
                    <p className="font-bold">{order.shippingAddress.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">City</p>
                    <p className="font-bold">{order.shippingAddress.city}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Full Address</p>
                  <p className="text-white/60 text-sm leading-relaxed">{order.shippingAddress.address}</p>
                </div>
             </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between">
             <div className="space-y-6">
               <h3 className="text-xs font-black text-amber-300 uppercase tracking-[0.2em] flex items-center gap-2">
                 <ShoppingBag size={16}/> Items Ordered
               </h3>
               <div className="space-y-4 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                 {order.orderItems.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between group">
                     <div className="flex items-center gap-3">
                        <img src={item.image} className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/10" alt=""/>
                        <div>
                          <p className="text-xs font-bold text-white/80 line-clamp-1">{item.name}</p>
                          <p className="text-[9px] text-amber-300/50 uppercase font-bold tracking-tighter">Qty: {item.quantity} | {item.size}</p>
                        </div>
                     </div>
                     <span className="text-xs font-black tracking-tighter">৳{item.price * item.quantity}</span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="pt-6 border-t border-white/5 mt-6">
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">Total Paid</span>
                   <span className="text-3xl font-black text-amber-300 tracking-tighter">৳{order.totalPrice.toLocaleString()}</span>
                </div>
             </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
           <Link to="/products" className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-2 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/> Continue Shopping
           </Link>
           <button onClick={() => window.print()} className="flex-1 border border-amber-300/20 text-amber-300 font-bold py-5 rounded-2xl hover:bg-amber-300/5 transition-all">
              Download Invoice
           </button>
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;