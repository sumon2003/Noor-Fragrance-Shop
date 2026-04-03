import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/CartPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Checkout from "./pages/Checkout";

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, loading } = useAuth();

  // পেজ লোড হওয়ার সময় এম্বার কালারের স্পিনার দেখাবে
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-300"></div>
    </div>
  );

  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/checkout" element={<Checkout />} />

      {/* --- Admin Protected Routes --- */}
      {/* এখানে নিশ্চিত করা হয়েছে যে ইউজার লগইন করা আছে এবং তার isAdmin প্রপার্টি true।
          আপনার ডাটাবেসে Sumon ইউজারের isAdmin: true আছে, তাই এটি কাজ করবে।
      */}
      <Route 
        path="/admin" 
        element={user && user.isAdmin ? <AdminLayout /> : <Navigate to="/login" replace />}
      >
        {/* /admin */}
        <Route index element={<AdminDashboard />} />
        
        {/* /admin/products - এখানে এখন আর Route Match এরর দিবে না */}
        <Route path="products" element={<AdminProducts />} /> 
        
        {/* /admin/products/add - নতুন স্মার্ট প্রোডাক্ট আপলোড ফর্ম */}
        <Route path="products/add" element={<AddProduct />} />
      </Route>

      {/* 404 Handle - যদি ভুল কোনো রাউটে যায় তবে হোমে পাঠিয়ে দিবে */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}