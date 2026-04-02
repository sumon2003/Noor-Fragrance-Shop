import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/admin.service';
import { Plus, Package, Edit2, Trash2, Loader2, ExternalLink } from 'lucide-react';

const AdminProducts = () => {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ১. ডাটাবেস থেকে প্রোডাক্ট লোড করার ফাংশন
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllProductsAdmin();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ২. প্রোডাক্ট ডিলিট করার ফাংশন
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await adminService.deleteProduct(id);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        alert("Delete failed!");
      }
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4 text-amber-300">
        <Loader2 className="animate-spin" size={48} />
        <p className="animate-pulse font-medium">Loading your collection...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-amber-300">Products Management</h2>
          <p className="text-amber-50/60 text-sm mt-1">Manage {products.length} premium fragrances in your shop</p>
        </div>
        <button 
          onClick={() => nav('/admin/products/add')}
          className="flex items-center gap-2 bg-amber-300 text-black px-8 py-4 rounded-2xl font-bold hover:bg-amber-200 transition shadow-[0_0_30px_rgba(251,191,36,0.15)] group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
          Add New Attar
        </button>
      </div>

      {/* Conditional Rendering: Empty State vs Product Table */}
      {products.length === 0 ? (
        <div className="bg-white/5 border border-amber-300/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
          <div className="p-24 text-center space-y-6">
            <div className="inline-flex p-8 rounded-full bg-amber-300/5 text-amber-300/20 mb-2 border border-amber-300/10">
              <Package size={64} />
            </div>
            <h3 className="text-2xl font-bold text-white">No products found</h3>
            <p className="text-amber-50/40 max-w-sm mx-auto leading-relaxed">
              Your digital shelves are currently empty. Click the button above to add your first premium fragrance.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <div key={product._id} className="group bg-white/5 border border-white/5 hover:border-amber-300/20 p-4 rounded-3xl backdrop-blur-sm transition-all duration-300 flex items-center gap-6">
              {/* Product Image Preview */}
              <div className="h-24 w-24 rounded-2xl overflow-hidden bg-black/40 border border-white/10 shrink-0">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=No+Image'}
                />
              </div>

              {/* Info Section */}
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-white truncate">{product.name}</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold bg-amber-300/10 text-amber-300 px-2 py-1 rounded-md border border-amber-300/10">
                    {product.category}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-bold bg-white/5 text-white/40 px-2 py-1 rounded-md border border-white/5">
                    {product.variants?.length || 0} Sizes
                  </span>
                </div>
              </div>

              {/* Price Display (First variant) */}
              <div className="hidden sm:block text-right px-4">
                <p className="text-[10px] text-white/30 uppercase font-bold">Starts From</p>
                <p className="text-xl font-black text-amber-300">৳{product.variants[0]?.price}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => nav(`/product/${product._id}`)}
                  className="p-3 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition"
                  title="View Live"
                >
                  <ExternalLink size={18} />
                </button>
                <button 
                  className="p-3 bg-white/5 text-blue-400/60 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition"
                  title="Edit Product"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(product._id)}
                  className="p-3 bg-white/5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition"
                  title="Delete Product"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;