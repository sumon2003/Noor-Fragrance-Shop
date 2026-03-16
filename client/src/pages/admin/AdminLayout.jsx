import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ClipboardList, Users } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-amber-50/90">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 border-r border-amber-300/10 p-6 space-y-8">
        <h1 className="text-2xl font-bold text-amber-300 tracking-wider">ADMIN</h1>
        
        <nav className="space-y-4">
          <Link to="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-300/10 hover:text-amber-300 transition">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-300/10 hover:text-amber-300 transition">
            <ShoppingBag size={20} /> Products
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-300/10 hover:text-amber-300 transition">
            <ClipboardList size={20} /> Orders
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-300/10 hover:text-amber-300 transition">
            <Users size={20} /> Users
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;