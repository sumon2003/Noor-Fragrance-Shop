import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext'; 
import orderService from '../services/order.service';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, MapPin, Phone, Mail, User, ShoppingBag } from 'lucide-react';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
  });

  // Auto-fill for logged-in users
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
  e.preventDefault();
  
  if (items.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  setLoading(true);

  try {
    const orderData = {
      orderItems: items.map(i => {
        let finalSize = "Regular"; 
        if (i.variantSize) {
          finalSize = i.variantSize;
        } else if (i.snapshot?.size) {
          finalSize = Array.isArray(i.snapshot.size) ? i.snapshot.size[0] : i.snapshot.size;
        }

        return {
          name: i.snapshot?.name || "Product",
          quantity: Number(i.qty), 
          image: i.snapshot?.image || "",
          price: Number(i.snapshot?.price || 0),
          size: String(finalSize), 
          product: i.productId
        };
      }),
      shippingAddress: {
        phone: formData.phone,
        city: formData.city,
        address: formData.address
      },
      paymentMethod: "Cash on Delivery",
      totalPrice: Number(subtotal),
      guestInfo: !user ? { name: formData.name, email: formData.email } : null
    };

    console.log("Submitting Order Data:", orderData);

    // ১. সার্ভিস কল করা (অপেক্ষা করা)
    const result = await orderService.createOrder(orderData);
    
    // কনসোলে চেক করা সার্ভার থেকে কী এলো
    console.log("Order Result in Component:", result);

    // ২. অর্ডার আইডি বের করার জন্য ফেইল-সেফ লজিক
    // ব্যাকএন্ড যেভাবে ডাটা পাঠাক না কেন, এখান থেকে আইডি খুঁজে বের করবে
    const newOrderId = 
      result?._id || 
      result?.order?._id || 
      result?.data?._id || 
      result?.data?.order?._id ||
      (typeof result === 'string' ? result : null);

    if (newOrderId) {
      console.log("Success! Redirecting to ID:", newOrderId);
      clearCart();
      
      // ৩. নেভিগেশনে সামান্য ডিলে দেওয়া যাতে স্টেট ক্লিন হওয়ার সময় পায়
      setTimeout(() => {
        navigate(`/track-order/${newOrderId}`);
      }, 100);
      
    } else {
      // যদি ডাটা আসে কিন্তু আইডি না পাওয়া যায়
      console.error("Order ID not found in response object. Check your backend response structure.", result);
      
      // যদি result আনডিফাইনড হয়, তার মানে সার্ভিস থেকে return করা হয়নি
      if (!result) {
        alert("Error: No response from server. Check order.service.js return statement.");
      } else {
        alert("Order Placed, but couldn't get ID for tracking.");
        clearCart();
        navigate('/products');
      }
    }
    
  } catch (error) {
    console.error("Checkout Error:", error);
    const errorMsg = error.response?.data?.message || error.message || "Order failed to place.";
    alert(`Error: ${errorMsg}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6 pt-28 selection:bg-amber-300 selection:text-black">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Shipping Form Section */}
        <div className="lg:col-span-7 bg-white/[0.03] p-8 md:p-10 rounded-[3rem] border border-amber-300/10 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-amber-300/10 text-amber-300"><MapPin size={24} /></div>
            <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">Checkout Info</h2>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-amber-300/50 uppercase ml-1 tracking-[0.3em] flex items-center gap-2"><User size={12}/> Full Name</label>
                <input 
                  name="name" required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:border-amber-300 outline-none transition-all placeholder:text-white/10 font-bold" 
                  placeholder="Sumon Khan"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-amber-300/50 uppercase ml-1 tracking-[0.3em] flex items-center gap-2"><Mail size={12}/> Email Address</label>
                <input 
                  type="email" name="email" required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:border-amber-300 outline-none transition-all placeholder:text-white/10 font-bold" 
                  placeholder="sumon@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-amber-300/50 uppercase ml-1 tracking-[0.3em] flex items-center gap-2"><Phone size={12}/> Phone Number</label>
              <input 
                name="phone" required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:border-amber-300 outline-none transition-all placeholder:text-white/10 font-bold" 
                placeholder="017XXXXXXXX"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-amber-300/50 uppercase ml-1 tracking-[0.3em] flex items-center gap-2">City</label>
              <input 
                name="city" required
                value={formData.city}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 focus:border-amber-300 outline-none transition-all placeholder:text-white/10 font-bold" 
                placeholder="e.g. Dhaka"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-amber-300/50 uppercase ml-1 tracking-[0.3em] flex items-center gap-2">Full Address</label>
              <textarea 
                name="address" required rows="3"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-white/5 rounded-[2rem] px-6 py-4 focus:border-amber-300 outline-none transition-all placeholder:text-white/10 resize-none font-bold" 
                placeholder="House, Road, Area..."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || items.length === 0}
              className="w-full group bg-amber-300 hover:bg-white text-black font-black py-6 rounded-[2rem] transition-all duration-500 shadow-xl shadow-amber-300/5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <><CheckCircle size={22} className="group-hover:scale-110 transition-transform"/> CONFIRM ORDER</>}
            </button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="bg-white/[0.03] p-10 rounded-[3rem] border border-white/5 backdrop-blur-xl sticky top-28">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 rounded-2xl bg-amber-300/10 text-amber-300"><ShoppingBag size={24} /></div>
              <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Order Summary</h2>
            </div>

            <div className="space-y-5 mb-10 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
              {items.map((i) => (
                <div key={`${i.productId}_${i.variantId}`} className="flex justify-between gap-4 p-4 rounded-3xl hover:bg-white/5 transition-colors group">
                  <div className="flex gap-5 items-center">
                     <div className="relative h-16 w-16 rounded-2xl overflow-hidden ring-1 ring-white/10 shrink-0 bg-black">
                        <img src={i.snapshot?.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" alt={i.snapshot?.name} />
                        <div className="absolute top-0 right-0 bg-amber-300 text-black text-[10px] font-black px-2 py-1 rounded-bl-xl leading-none">{i.qty}</div>
                     </div>
                     <div className="space-y-1">
                       <p className="font-black text-white/90 group-hover:text-amber-300 transition-colors leading-none text-sm">{i.snapshot?.name}</p>
                       <p className="text-[9px] text-amber-50/30 uppercase tracking-[0.2em] font-black mt-2">
                         Size: {i.variantSize || (Array.isArray(i.snapshot?.size) ? i.snapshot.size[0] : i.snapshot?.size) || "Regular"}
                       </p>
                     </div>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-black text-sm tracking-tighter italic">৳{(Number(i.snapshot?.price || 0) * i.qty).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Delivery Charge</span>
                <span className="text-xs font-black text-emerald-400 italic uppercase">FREE</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-amber-50/20 text-[10px] font-black uppercase tracking-[0.4em]">Total Amount</span>
                <span className="text-amber-300 text-4xl font-black tracking-tighter leading-none animate-pulse">৳{Number(subtotal).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

if (isSuccess) {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-[3rem] backdrop-blur-2xl text-center space-y-8">
        
        {/* Animated Icon Container */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Congratulations!
          </h1>
          <p className="text-amber-300 font-bold tracking-widest text-[10px] uppercase">
            Thank you for your order
          </p>
          <div className="h-px w-12 bg-white/10 mx-auto my-4" />
          <p className="text-white/50 text-sm leading-relaxed">
            আপনার অর্ডারটি আমরা পেয়েছি। কিছুক্ষণের মধ্যে আমাদের প্রতিনিধি আপনার নাম্বারে কল করে অর্ডারটি নিশ্চিত করবেন।
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4 text-left">
          <div className="bg-amber-300/10 p-3 rounded-xl">
            <PhoneCall className="text-amber-300" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Next Step</p>
            <p className="text-xs font-bold text-white/80">কলের জন্য অপেক্ষা করুন</p>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => navigate('/')}
          className="w-full group relative flex items-center justify-center gap-3 bg-amber-300 hover:bg-white text-black py-5 rounded-2xl font-black transition-all duration-500 uppercase text-xs tracking-widest overflow-hidden"
        >
          <Home size={18} className="group-hover:-translate-y-1 transition-transform" />
          Go Back Home
        </button>
        
      </div>
    </div>
  );
}

export default Checkout;