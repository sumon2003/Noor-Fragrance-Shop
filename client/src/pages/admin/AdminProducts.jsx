import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Edit2, Trash2 } from 'lucide-react';

const AdminProducts = () => {
  const nav = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-amber-300">Products Management</h2>
          <p className="text-amber-50/60 text-sm mt-1">View and manage your attar collection</p>
        </div>
        <button 
          onClick={() => nav('/admin/products/add')}
          className="flex items-center gap-2 bg-amber-300 text-black px-6 py-3 rounded-2xl font-bold hover:bg-amber-200 transition shadow-[0_0_20px_rgba(251,191,36,0.2)]"
        >
          <Plus size={20} /> Add New Attar
        </button>
      </div>

      <div className="bg-white/5 border border-amber-300/10 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="p-20 text-center space-y-4">
          <div className="inline-flex p-6 rounded-full bg-amber-300/10 text-amber-300 mb-2">
            <Package size={48} />
          </div>
          <h3 className="text-xl font-medium text-white">No products found</h3>
          <p className="text-amber-50/40 max-w-xs mx-auto">Your collection is empty. Start by adding your first premium fragrance.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;