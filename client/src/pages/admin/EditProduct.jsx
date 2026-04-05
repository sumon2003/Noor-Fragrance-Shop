import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService from '../../services/admin.service';
import { Image, Plus, Trash2, Save, X, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Oud',
    description: '',
    image: null,
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    ingredients: '',
    isActive: true,
    variants: [{ size: '', price: '', stock: '' }] 
  });

  useEffect(() => {
    const getProductData = async () => {
      try {
        const product = await adminService.getProductByIdAdmin(id);
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          category: product.category || 'Oud',
          description: product.description || '',
          image: null,
          topNotes: product.notes?.top || '',
          heartNotes: product.notes?.heart || '',
          baseNotes: product.notes?.base || '',
          ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : (product.ingredients || ''),
          isActive: product.isActive ?? true,
          variants: product.variants || [{ size: '', price: '', stock: '' }]
        });
        setPreview(product.image);
      } catch (err) {
        alert("Failed to load product data.");
        nav('/admin/products');
      } finally {
        setFetching(false);
      }
    };
    getProductData();
  }, [id, nav]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("topNotes", formData.topNotes);
      data.append("heartNotes", formData.heartNotes);
      data.append("baseNotes", formData.baseNotes);
      data.append("ingredients", formData.ingredients);
      data.append("isActive", formData.isActive);
      data.append("variants", JSON.stringify(formData.variants));
      
      if (formData.image) {
        data.append("image", formData.image);
      }

      await adminService.updateProduct(id, data);
      alert("Product updated successfully!");
      nav('/admin/products');
    } catch (err) {
      console.error("Update Error:", err);
      alert(err.response?.data?.message || "Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="h-96 flex flex-col items-center justify-center text-amber-300 gap-4">
      <Loader2 className="animate-spin" size={48} />
      <p className="animate-pulse">Loading product details...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-amber-300">Edit Fragrance</h2>
          <p className="text-amber-50/40 text-sm mt-1">Update <span className="text-amber-300/80">{formData.name}</span></p>
        </div>
        <button onClick={() => nav(-1)} className="p-3 bg-white/5 rounded-2xl text-amber-50/50 hover:text-white transition"><X /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Status & Image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white/5 border border-amber-300/10 p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 backdrop-blur-md">
            <div className="relative h-44 w-44 rounded-[2rem] border-2 border-dashed border-amber-300/20 overflow-hidden bg-black/40">
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              <input type="file" onChange={handleImageChange} className="hidden" id="edit-img" accept="image/*" />
              <label htmlFor="edit-img" className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition flex items-center justify-center cursor-pointer text-white text-[10px] font-bold">CHANGE IMAGE</label>
            </div>
            
            <button 
              type="button"
              onClick={() => setFormData({...formData, isActive: !formData.isActive})}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition ${formData.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
            >
              {formData.isActive ? <><Eye size={18} /> Active</> : <><EyeOff size={18} /> Hidden</>}
            </button>
          </div>

          <div className="md:col-span-2 bg-white/5 border border-amber-300/10 p-8 rounded-[2.5rem] space-y-6">
            <div>
              <label className="text-[10px] font-bold text-amber-300/50 uppercase ml-1 mb-2 block tracking-widest">Product Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 outline-none focus:border-amber-300/40 text-white" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-amber-300/50 uppercase ml-1 mb-2 block tracking-widest">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 outline-none text-white">
                {["Oud", "Musk", "Floral", "Fresh", "Spicy"].map(cat => <option key={cat} value={cat} className="bg-[#0a0a0a]">{cat}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Notes & Ingredients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 border border-amber-300/10 p-8 rounded-[2.5rem]">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-widest mb-2">Scent Profile</h3>
            <input placeholder="Top Notes" value={formData.topNotes} onChange={e => setFormData({...formData, topNotes: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-5 py-3 outline-none focus:border-amber-300/30 text-sm" />
            <input placeholder="Heart Notes" value={formData.heartNotes} onChange={e => setFormData({...formData, heartNotes: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-5 py-3 outline-none focus:border-amber-300/30 text-sm" />
            <input placeholder="Base Notes" value={formData.baseNotes} onChange={e => setFormData({...formData, baseNotes: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-5 py-3 outline-none focus:border-amber-300/30 text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-widest mb-4">Ingredients</h3>
            <textarea rows="5" value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 outline-none focus:border-amber-300/30 text-sm resize-none" placeholder="Separate with commas..."></textarea>
          </div>
        </div>

        {/* Description & Variants */}
        <div className="bg-white/5 border border-amber-300/10 p-8 rounded-[2.5rem]">
           <label className="text-[10px] font-bold text-amber-300/50 uppercase ml-1 mb-2 block tracking-widest">Description</label>
           <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 outline-none resize-none text-sm"></textarea>
        </div>

        {/* Variants Section */}
        <div className="bg-white/5 border border-amber-300/10 p-8 rounded-[2.5rem]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-widest">Inventory</h3>
            <button type="button" onClick={() => setFormData({...formData, variants: [...formData.variants, {size:'', price:'', stock:''}]})} className="text-[10px] bg-amber-300/10 text-amber-300 px-4 py-2 rounded-xl border border-amber-300/20 flex items-center gap-2 font-bold hover:bg-amber-300/20"><Plus size={14} /> NEW SIZE</button>
          </div>
          <div className="space-y-4">
            {formData.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-black/20 rounded-2xl border border-amber-300/5 items-end">
                <input placeholder="Size" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} className="bg-black/40 border border-amber-300/10 rounded-xl px-4 py-3 outline-none text-sm" required />
                <input type="number" placeholder="Price" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} className="bg-black/40 border border-amber-300/10 rounded-xl px-4 py-3 outline-none text-sm" required />
                <div className="flex gap-2">
                  <input type="number" placeholder="Stock" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} className="flex-1 bg-black/40 border border-amber-300/10 rounded-xl px-4 py-3 outline-none text-sm" required />
                  {formData.variants.length > 1 && <button type="button" onClick={() => setFormData({...formData, variants: formData.variants.filter((_, idx) => idx !== i)})} className="p-3 text-red-400 hover:bg-red-500/10 rounded-xl"><Trash2 size={18} /></button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button disabled={loading} className="w-full py-5 bg-amber-300 text-black font-extrabold text-lg rounded-[2rem] hover:bg-amber-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={24} /> : <><CheckCircle size={24} /> SAVE CHANGES</>}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;