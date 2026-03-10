import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; 

const Checkout = () => {
  const { cart, totalPrice } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    phone: '',
    address: '',
    city: ''
  });

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    console.log("Order Placing with:", { cart, shippingInfo, totalPrice });
    alert("Order Received! (Backend Integration Pending)");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 pt-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Shipping Form */}
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-yellow-600/20 shadow-xl">
          <h2 className="text-2xl font-bold text-yellow-500 mb-6">Shipping Details</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Phone Number</label>
              <input 
                name="phone" required
                onChange={handleInputChange}
                className="w-full bg-[#252525] border border-gray-700 rounded-lg p-3 focus:border-yellow-500 outline-none" 
                placeholder="017XXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Delivery Address</label>
              <textarea 
                name="address" required rows="3"
                onChange={handleInputChange}
                className="w-full bg-[#252525] border border-gray-700 rounded-lg p-3 focus:border-yellow-500 outline-none" 
                placeholder="House no, Road no, Area..."
              />
            </div>
            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 rounded-xl transition shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              CONFIRM ORDER
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-yellow-600/20 h-fit">
          <h2 className="text-2xl font-bold text-yellow-500 mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between border-b border-gray-800 pb-3">
                <span>{item.name} (x{item.quantity})</span>
                <span className="text-yellow-500">৳{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xl font-bold border-t border-gray-700 pt-4">
            <span>Total Amount:</span>
            <span className="text-yellow-500 text-2xl">৳{totalPrice}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;