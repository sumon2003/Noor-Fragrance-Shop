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
    setLoading(true);

    try {
      const orderData = {
        orderItems: items.map(i => ({
          name: i.snapshot.name,
          quantity: i.qty, //
          image: i.snapshot.image,
          price: i.snapshot.price,
          size: i.variantSize || i.snapshot.size, 
          product: i.productId
        })),
        shippingAddress: {
          phone: formData.phone, //
          city: formData.city,
          address: formData.address
        },
        paymentMethod: "Cash on Delivery",
        totalPrice: subtotal,
        // guestInfo 
        guestInfo: !user ? { name: formData.name, email: formData.email } : null
      };

      await orderService.createOrder(orderData);
      
      // Success Alert and Redirect
      alert("Order Placed Successfully!");
      clearCart();
      navigate('/products'); 
    } catch (error) {
      console.error("Checkout Error:", error);
      alert(error.response?.data?.message || error.message || "Order failed to place.");
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
            <h2 className="text-3xl font-black text-white tracking-tight">Checkout Information</h2>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-300/50 uppercase ml-1 tracking-widest flex items-center gap-2"><User size={12}/> Full Name</label>
                <input 
                  name="name" required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 focus:border-amber-300/40 outline-none transition-all placeholder:text-white/10" 
                  placeholder="Sumon Khan"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-300/50 uppercase ml-1 tracking-widest flex items-center gap-2"><Mail size={12}/> Email Address</label>
                <input 
                  type="email" name="email" required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 focus:border-amber-300/40 outline-none transition-all placeholder:text-white/10" 
                  placeholder="sumon@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-300/50 uppercase ml-1 tracking-widest flex items-center gap-2"><Phone size={12}/> Phone Number</label>
              <input 
                name="phone" required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 focus:border-amber-300/40 outline-none transition-all placeholder:text-white/10" 
                placeholder="017XXXXXXXX"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-300/50 uppercase ml-1 tracking-widest flex items-center gap-2">City</label>
              <input 
                name="city" required
                value={formData.city}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 focus:border-amber-300/40 outline-none transition-all placeholder:text-white/10" 
                placeholder="e.g. Dhaka"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-300/50 uppercase ml-1 tracking-widest flex items-center gap-2">Full Address</label>
              <textarea 
                name="address" required rows="3"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-amber-300/10 rounded-3xl px-5 py-4 focus:border-amber-300/40 outline-none transition-all placeholder:text-white/10 resize-none" 
                placeholder="House, Road, Area..."
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || items.length === 0}
              className="w-full group bg-amber-300 hover:bg-amber-200 text-black font-black py-5 rounded-[2rem] transition-all duration-300 shadow-xl shadow-amber-300/5 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <><CheckCircle size={22} className="group-hover:scale-110 transition-transform"/> CONFIRM ORDER</>}
            </button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="bg-white/[0.03] p-8 md:p-10 rounded-[3rem] border border-amber-300/10 backdrop-blur-xl sticky top-28">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-amber-300/10 text-amber-300"><ShoppingBag size={24} /></div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Order Summary</h2>
            </div>

            <div className="space-y-4 mb-8 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
              {items.map((i) => (
                <div key={`${i.productId}_${i.variantId}`} className="flex justify-between gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group">
                  <div className="flex gap-4 items-center">
                     <div className="relative h-16 w-16 rounded-2xl overflow-hidden ring-1 ring-white/10 shrink-0">
                        <img src={i.snapshot.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt={i.snapshot.name} />
                        <div className="absolute top-0 right-0 bg-amber-300 text-black text-[10px] font-black px-1.5 py-0.5 rounded-bl-lg leading-none">{i.qty}</div>
                     </div>
                     <div className="space-y-1">
                       <p className="font-bold text-white group-hover:text-amber-300 transition-colors leading-none">{i.snapshot.name}</p>
                       <p className="text-[10px] text-amber-50/40 uppercase tracking-widest font-bold">Size: {i.variantSize || i.snapshot.size}</p>
                     </div>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-300 font-black">৳{(i.snapshot.price * i.qty).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center opacity-60">
                <span className="text-sm font-medium">Delivery Charge</span>
                <span className="text-sm font-bold italic">FREE</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-amber-50/50 text-sm font-bold uppercase tracking-widest">Total Amount</span>
                <span className="text-amber-300 text-4xl font-black tracking-tighter leading-none">৳{Number(subtotal).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;