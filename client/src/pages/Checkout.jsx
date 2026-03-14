import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; 
import orderService from '../services/order.service';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({ phone: '', address: '', city: '' });

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        orderItems: items.map(i => ({
          name: i.snapshot.name,
          quantity: i.qty,
          image: i.snapshot.image,
          price: i.snapshot.price,
          product: i.productId
        })),
        shippingAddress: shippingInfo,
        paymentMethod: "Cash on Delivery",
        totalPrice: subtotal,
      };

      await orderService.createOrder(orderData);
      alert("Order Placed Successfully!");
      clearCart();
      navigate('/products'); 
    } catch (error) {
      alert(error.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Shipping Form */}
        <div className="bg-white/5 p-8 rounded-3xl ring-1 ring-amber-300/10 shadow-xl">
          <h2 className="text-2xl font-bold text-amber-300 mb-6">Shipping Details</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-amber-50/60 mb-2">Phone Number</label>
              <input 
                name="phone" required
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-amber-300/20 rounded-2xl p-3 focus:border-amber-300 outline-none transition" 
                placeholder="017XXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-amber-50/60 mb-2">City</label>
              <input 
                name="city" required
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-amber-300/20 rounded-2xl p-3 focus:border-amber-300 outline-none transition" 
                placeholder="e.g. Dhaka"
              />
            </div>
            <div>
              <label className="block text-amber-50/60 mb-2">Full Address</label>
              <textarea 
                name="address" required rows="3"
                onChange={handleInputChange}
                className="w-full bg-black/30 border border-amber-300/20 rounded-2xl p-3 focus:border-amber-300 outline-none transition" 
                placeholder="House, Road, Area..."
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || items.length === 0}
              className="w-full bg-amber-300 hover:bg-amber-200 text-black font-bold py-4 rounded-2xl transition shadow-[0_0_20px_rgba(251,191,36,0.2)] disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : "CONFIRM ORDER"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white/5 p-8 rounded-3xl ring-1 ring-amber-300/10 h-fit">
          <h2 className="text-2xl font-bold text-amber-300 mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
            {items.map((i) => (
              <div key={`${i.productId}_${i.variantId}`} className="flex justify-between border-b border-white/5 pb-3 items-center">
                <div className="flex gap-3 items-center">
                   <img src={i.snapshot.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                   <div>
                     <p className="font-medium">{i.snapshot.name}</p>
                     <p className="text-xs text-amber-50/50">Qty: {i.qty}</p>
                   </div>
                </div>
                <span className="text-amber-200">৳{(i.snapshot.price * i.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xl font-bold border-t border-white/10 pt-4">
            <span>Total:</span>
            <span className="text-amber-300 text-2xl">৳{Number(subtotal).toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;