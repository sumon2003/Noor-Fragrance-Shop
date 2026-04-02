import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/admin.service';
import { Image, Plus, Trash2, Save, X } from 'lucide-react';

const AddProduct = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Oud', // Default category
    description: '',
    image: null,
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    ingredients: '',
    variants: [{ size: '', price: '', stock: '' }] 
  });

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  
  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: '', price: '', stock: '' }]
    });
  };

  const removeVariant = (index) => {
    const newVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: newVariants });
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
    
      Object.keys(formData).forEach(key => {
        if (key === 'variants') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      await adminService.uploadProduct(data);
      alert("Product uploaded successfully!");
      nav('/admin/products');
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-amber-300">Add New Attar</h2>
        <button onClick={() => nav(-1)} className="p-2 text-amber-50/50 hover:text-white"><X /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="bg-white/5 border border-amber-300/10 p-6 rounded-3xl backdrop-blur-sm">
          <label className="block text-sm font-medium text-amber-50/70 mb-4">Product Image</label>
          <div className="flex items-center gap-6">
            <div className="h-40 w-40 rounded-2xl border-2 border-dashed border-amber-300/20 flex items-center justify-center overflow-hidden bg-black/20">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <Image className="text-amber-300/20" size={48} />
              )}
            </div>
            <input type="file" onChange={handleImageChange} className="hidden" id="img-upload" accept="image/*" required />
            <label htmlFor="img-upload" className="px-6 py-3 bg-amber-300/10 text-amber-300 rounded-xl cursor-pointer hover:bg-amber-300/20 transition font-semibold">
              Select Image
            </label>
          </div>
        </div>

        {/* Basic Info & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 border border-amber-300/10 p-6 rounded-3xl">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-amber-50/50 ml-1">Product Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-4 py-3 outline-none focus:border-amber-300/40" placeholder="e.g. Royal Oud" />
            </div>
            <div>
              <label className="text-xs text-amber-50/50 ml-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-4 py-3 outline-none focus:border-amber-300/40 text-white">
                {["Oud", "Musk", "Floral", "Fresh", "Spicy"].map(cat => (
                  <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-amber-50/50 ml-1">Description</label>
            <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-4 py-3 outline-none focus:border-amber-300/40" placeholder="Describe the fragrance..."></textarea>
          </div>
        </div>

        {/* Dynamic Variants Section (ML, Price, Stock) */}
        <div className="bg-white/5 border border-amber-300/10 p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-amber-300">Price & Sizes</h3>
            <button type="button" onClick={addVariant} className="text-xs bg-amber-300/10 text-amber-300 px-3 py-2 rounded-lg hover:bg-amber-300/20 transition flex items-center gap-1">
              <Plus size={14} /> Add Size
            </button>
          </div>
          <div className="space-y-3">
            {formData.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 items-end">
                <input placeholder="Size (e.g. 6ml)" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} className="bg-black/40 border border-amber-300/10 rounded-xl px-4 py-2 outline-none" required />
                <input type="number" placeholder="Price (৳)" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} className="bg-black/40 border border-amber-300/10 rounded-xl px-4 py-2 outline-none" required />
                <div className="flex gap-2">
                  <input type="number" placeholder="Stock" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-4 py-2 outline-none" required />
                  {formData.variants.length > 1 && (
                    <button type="button" onClick={() => removeVariant(i)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={18} /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scent Profile (Notes & Ingredients) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 border border-amber-300/10 p-6 rounded-3xl">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-300">Scent Notes</h3>
            <input placeholder="Top Notes (e.g. Lemon, Mint)" value={formData.topNotes} onChange={e => setFormData({...formData, topNotes: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-4 py-3 outline-none" />
            <input placeholder="Heart Notes (e.g. Rose, Jasmine)" value={formData.heartNotes} onChange={e => setFormData({...formData, heartNotes: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-4 py-3 outline-none" />
            <input placeholder="Base Notes (e.g. Musk, Sandalwood)" value={formData.baseNotes} onChange={e => setFormData({...formData, baseNotes: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-4 py-3 outline-none" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-300 mb-4">Ingredients</h3>
            <textarea rows="5" value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-4 py-3 outline-none focus:border-amber-300/40" placeholder="Enter ingredients separated by comma..."></textarea>
          </div>
        </div>

        <button disabled={loading} className="w-full py-4 bg-amber-300 text-black font-bold rounded-2xl hover:bg-amber-200 transition shadow-xl flex items-center justify-center gap-2">
          {loading ? "UPLOADING..." : <><Save size={20}/> PUBLISH PRODUCT</>}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;