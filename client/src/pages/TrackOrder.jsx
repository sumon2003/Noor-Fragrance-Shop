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
        const response = await orderService.getOrderById(id);
        const orderData = response?.data || response;
        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrderDetails();
  }, [id]);

  const steps = [
    { label: 'Pending', icon: <Clock size={20}/>, status: 'Pending' },
    { label: 'Processing', icon: <Package size={20}/>, status: 'Processing' },
    { label: 'Shipped', icon: <Truck size={20}/>, status: 'Shipped' },
    { label: 'Delivered', icon: <CheckCircle2 size={20}/>, status: 'Delivered' },
  ];

  const currentStep = steps.findIndex(s => s.status === order?.status);

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-amber-300 gap-4">
      <div className="relative">
        <Loader2 className="animate-spin text-amber-300" size={60} />
        <div className="absolute inset-0 blur-xl bg-amber-300/20 animate-pulse"></div>
      </div>
      <p className="animate-pulse tracking-[0.4em] text-[10px] font-black uppercase">Locating your package...</p>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center text-white p-6">
       <ShoppingBag size={64} className="text-amber-300/20 mb-6" />
       <h2 className="text-2xl font-black mb-4 tracking-tighter uppercase italic">Order Not Found</h2>
       <p className="text-white/40 mb-8 text-sm max-w-xs text-center">The order ID you are looking for does not exist or has been removed.</p>
       <Link to="/products" className="text-amber-300 border border-amber-300/20 px-10 py-4 rounded-2xl hover:bg-amber-300 hover:text-black transition-all font-black uppercase text-xs tracking-widest">Back to Shop</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6 pt-28 selection:bg-amber-300 selection:text-black">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Success Header */}
        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-1000">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-300/5 border border-amber-300/10 mb-2 relative">
            <div className="absolute inset-0 bg-amber-300/5 rounded-full animate-ping"></div>
            <CheckCircle2 size={48} className="text-amber-300 relative z-10" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none uppercase">
            THANK YOU FOR <br/> YOUR <span className="text-amber-300 italic">PURCHASE</span>
          </h1>
          <p className="text-amber-50/40 text-[10px] font-black uppercase tracking-[0.5em]">Order ID: #{order?._id?.slice(-8).toUpperCase()}</p>
        </div>

        {/* Order Progress Tracker */}
        <div className="bg-white/[0.02] border border-amber-300/10 rounded-[3rem] p-8 md:p-14 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-300/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-amber-300/10 transition-colors duration-1000"></div>
          
          <div className="relative flex justify-between items-center z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center relative z-20">
                <div className={`w-14 h-14 md:w-20 md:h-20 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 border-2 
                  ${index <= currentStep 
                    ? 'bg-amber-300 border-amber-300 text-black shadow-[0_0_40px_rgba(251,191,36,0.3)]' 
                    : 'bg-white/5 border-white/5 text-white/20'}`}>
                  {React.cloneElement(step.icon, { size: 28 })}
                </div>
                <span className={`mt-5 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] ${index <= currentStep ? 'text-amber-300' : 'text-white/20'}`}>
                  {step.label}
                </span>
                
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-7 md:top-10 left-[100%] w-[calc(100%)] h-[2px] -translate-x-[10%] hidden sm:block">
                    <div className="h-full bg-white/5 w-[150%] absolute"></div>
                    <div className={`h-full transition-all duration-1000 bg-amber-300 relative z-10 ${index < currentStep ? 'w-[150%]' : 'w-0'}`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Shipping Info */}
          <div className="bg-white/[0.03] border border-white/5 p-10 rounded-[3rem] space-y-8 hover:border-amber-300/20 transition-all duration-500">
             <h3 className="text-[10px] font-black text-amber-300 uppercase tracking-[0.3em] flex items-center gap-3">
               <MapPin size={16} className="opacity-50"/> Shipping Details
             </h3>
             <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-2">Recipient</p>
                  <p className="font-black text-xl tracking-tight">{order?.user?.name || order?.guestInfo?.name || "Customer"}</p>
                </div>
                <div className="flex gap-12">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-2 text-nowrap">Contact Number</p>
                    <p className="font-black text-white/90">{order?.shippingAddress?.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-2">City</p>
                    <p className="font-black text-white/90">{order?.shippingAddress?.city}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-2">Full Destination</p>
                  <p className="text-white/60 text-sm font-medium leading-relaxed italic">{order?.shippingAddress?.address}</p>
                </div>
             </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white/[0.03] border border-white/5 p-10 rounded-[3rem] flex flex-col justify-between hover:border-amber-300/20 transition-all duration-500">
             <div className="space-y-8">
               <h3 className="text-[10px] font-black text-amber-300 uppercase tracking-[0.3em] flex items-center gap-3">
                 <ShoppingBag size={16} className="opacity-50"/> Package Summary
               </h3>
               <div className="space-y-5 max-h-[220px] overflow-y-auto custom-scrollbar pr-3">
                 {order?.orderItems?.map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden ring-1 ring-white/10 group-hover:ring-amber-300/30 transition-all duration-500 bg-black">
                          <img src={item?.image} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt=""/>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-white/90 truncate max-w-[150px]">{item?.name}</p>
                          <p className="text-[9px] text-amber-300/50 uppercase font-black tracking-widest mt-1">Qty {item?.quantity} <span className="mx-1 opacity-20">|</span> {item?.size}</p>
                        </div>
                     </div>
                     <span className="text-sm font-black tracking-tighter italic">৳{((item?.price || 0) * (item?.quantity || 1)).toLocaleString()}</span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="pt-8 border-t border-white/5 mt-8">
                <div className="flex justify-between items-end">
                   <div className="space-y-1">
                     <span className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em]">Total Amount Paid</span>
                     <p className="text-[9px] text-emerald-400/50 font-bold uppercase tracking-widest flex items-center gap-1">
                       <CheckCircle2 size={10}/> {order?.paymentMethod || 'COD Verified'}
                     </p>
                   </div>
                   <span className="text-4xl font-black text-amber-300 tracking-tighter animate-pulse">৳{(order?.totalPrice || 0).toLocaleString()}</span>
                </div>
             </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-5 pt-6 pb-12">
           <Link to="/products" className="flex-[2] bg-white/5 hover:bg-amber-300 text-white hover:text-black font-black py-6 rounded-3xl transition-all duration-500 flex items-center justify-center gap-3 group uppercase text-xs tracking-widest">
              <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform duration-500"/> Continue Shopping
           </Link>
           <button onClick={() => window.print()} className="flex-1 border border-white/10 text-white/60 hover:text-amber-300 hover:border-amber-300 font-black py-6 rounded-3xl transition-all duration-500 uppercase text-xs tracking-widest flex items-center justify-center gap-2">
              <Calendar size={18} className="opacity-40"/> Invoice
           </button>
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;