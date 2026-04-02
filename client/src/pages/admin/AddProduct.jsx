import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/admin.service';
import { Image, Plus, Trash2, Save, X, AlertCircle } from 'lucide-react';

const AddProduct = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // Form State
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
    
    // ১. ক্লায়েন্ট সাইড ভ্যালিডেশন
    if (!formData.image) {
      alert("Please select a product image!");
      return;
    }

    if (formData.variants.some(v => !v.size || !v.price || !v.stock)) {
      alert("Please fill all size, price, and stock details for each variant!");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();

      // ২. অটোমেটিক স্লাগ জেনারেশন (এরর এড়াতে)
      const finalSlug = formData.slug || formData.name.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

      data.append("name", formData.name);
      data.append("slug", finalSlug);
      data.append("category", formData.category);
      data.append("description", formData.description);
      
      // ৩. আপনার কন্ট্রোলার অনুযায়ী নোটস পাঠানো
      data.append("topNotes", formData.topNotes);
      data.append("heartNotes", formData.heartNotes);
      data.append("baseNotes", formData.baseNotes);
      data.append("ingredients", formData.ingredients);

      // ৪. ফাইল এবং ভ্যারিয়েন্টস (JSON Stringify খুবই গুরুত্বপূর্ণ)
      data.append("image", formData.image);
      data.append("variants", JSON.stringify(formData.variants));

      // ৫. সার্ভিসে রিকোয়েস্ট পাঠানো
      await adminService.uploadProduct(data);
      
      alert("Product published successfully!");
      nav('/admin/products');
    } catch (err) {
      console.error("Upload error details:", err.response?.data);
      // সার্ভারের এরর মেসেজটি অ্যালার্টে দেখানো
      alert(err.response?.data?.message || "Failed to publish product. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-amber-300">Add New Attar</h2>
          <p className="text-amber-50/40 text-sm mt-1">Create a premium fragrance listing</p>
        </div>
        <button onClick={() => nav(-1)} className="p-3 bg-white/5 rounded-2xl text-amber-50/50 hover:text-white transition"><X /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="bg-white/5 border border-amber-300/10 p-8 rounded-[2.5rem] backdrop-blur-sm shadow-2xl">
          <label className="block text-sm font-bold text-amber-300/60 uppercase tracking-widest mb-6">Product Image</label>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative h-52 w-52 rounded-[2rem] border-2 border-dashed border-amber-300/20 flex items-center justify-center overflow-hidden bg-black/40 group">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-cover transition transform group-hover:scale-110" />
              ) : (
                <Image className="text-amber-300/10" size={60} />
              )}
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-amber-50/40 text-xs leading-relaxed">Recommended size: 1000x1000px. <br/> Transparent PNG or High-quality JPG works best.</p>
              <input type="file" onChange={handleImageChange} className="hidden" id="img-upload" accept="image/*" />
              <label htmlFor="img-upload" className="inline-block px-8 py-3 bg-amber-300 text-black rounded-2xl cursor-pointer hover:bg-amber-200 transition font-bold shadow-lg shadow-amber-300/10">
                Select Image
              </label>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 border border-amber-300/10 p-8 rounded-[2.5rem]">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-amber-300/50 uppercase ml-1 mb-2 block">Product Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 outline-none focus:border-amber-300/40 transition text-white" placeholder="e.g. Royal Oud" />
            </div>
            <div>
              <label className="text-xs font-bold text-amber-300/50 uppercase ml-1 mb-2 block">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 outline-none focus:border-amber-300/40 text-white appearance-none">
                {["Oud", "Musk", "Floral", "Fresh", "Spicy"].map(cat => (
                  <option key={cat} value={cat} className="bg-[#0a0a0a]">{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-amber-300/50 uppercase ml-1 mb-2 block">Description</label>
            <textarea rows="5" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 outline-none focus:border-amber-300/40 transition resize-none" placeholder="Describe the soul of this fragrance..."></textarea>
          </div>
        </div>

        {/* Price & Variants */}
        <div className="bg-white/5 border border-amber-300/10 p-8 rounded-[2.5rem]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-amber-300">Price & Inventory</h3>
            <button type="button" onClick={addVariant} className="text-xs bg-amber-300/10 text-amber-300 px-4 py-2 rounded-xl hover:bg-amber-300/20 transition flex items-center gap-2 font-bold border border-amber-300/20">
              <Plus size={16} /> Add New Size
            </button>
          </div>
          <div className="space-y-4">
            {formData.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-black/20 rounded-2xl border border-amber-300/5 items-end">
                <div>
                  <label className="text-[10px] text-amber-50/30 uppercase font-bold mb-1 block">Size</label>
                  <input placeholder="e.g. 6ml" value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-4 py-3 outline-none focus:border-amber-300/30" required />
                </div>
                <div>
                  <label className="text-[10px] text-amber-50/30 uppercase font-bold mb-1 block">Price (৳)</label>
                  <input type="number" placeholder="৳" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-4 py-3 outline-none focus:border-amber-300/30" required />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] text-amber-50/30 uppercase font-bold mb-1 block">Stock</label>
                    <input type="number" placeholder="Qty" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} className="w-full bg-black/40 border border-amber-300/10 rounded-xl px-4 py-3 outline-none focus:border-amber-300/30" required />
                  </div>
                  {formData.variants.length > 1 && (
                    <button type="button" onClick={() => removeVariant(i)} className="p-3 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition self-end"><Trash2 size={20} /></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes & Ingredients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 border border-amber-300/10 p-8 rounded-[2.5rem]">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-amber-300">Scent Profile</h3>
            <div className="space-y-4">
              <input placeholder="Top Notes (e.g. Lemon, Mint)" value={formData.topNotes} onChange={e => setFormData({...formData, topNotes: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 outline-none focus:border-amber-300/40" />
              <input placeholder="Heart Notes (e.g. Rose, Jasmine)" value={formData.heartNotes} onChange={e => setFormData({...formData, heartNotes: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 outline-none focus:border-amber-300/40" />
              <input placeholder="Base Notes (e.g. Musk, Sandalwood)" value={formData.baseNotes} onChange={e => setFormData({...formData, baseNotes: e.target.value})} className="w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 outline-none focus:border-amber-300/40" />
            </div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-amber-300 mb-6">Ingredients</h3>
            <textarea rows="6" value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} className="flex-1 w-full bg-black/40 border border-amber-300/10 rounded-2xl px-5 py-4 outline-none focus:border-amber-300/40 resize-none" placeholder="Rose oil, Sandalwood extract, etc. (Separate with commas)"></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          disabled={loading} 
          className="w-full py-5 bg-amber-300 text-black font-extrabold text-lg rounded-[2rem] hover:bg-amber-200 transition-all shadow-2xl shadow-amber-300/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-t-2 border-black rounded-full animate-spin"></div>
              CRAFTING PRODUCT...
            </div>
          ) : (
            <>
              <Save size={24} className="group-hover:scale-110 transition" /> 
              PUBLISH PREMIUM ATTAR
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;