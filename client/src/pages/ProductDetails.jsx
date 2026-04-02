import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingCart, Wind, Heart, Anchor, List } from "lucide-react"; // নতুন আইকন
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchProductById } from "../services/product.service";
import { useCart } from "../context/CartContext";

function getMinPrice(variants = []) {
  const prices = variants.map((v) => Number(v?.price || 0)).filter((n) => n > 0);
  return prices.length ? Math.min(...prices) : 0;
}

function resolveImageUrl(image) {
  if (!image) return "/images/fallback/default.jpg";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/")) return image;
  return `/${image}`;
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await fetchProductById(id);
        if (!alive) return;
        setProduct(data);
        const first = data?.variants?.[0];
        setSelectedVariantId(first?._id || "");
        setQty(1);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load product");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [id]);

  const variants = product?.variants || [];
  const selectedVariant = useMemo(() => {
    if (!variants.length) return null;
    return variants.find((v) => v?._id === selectedVariantId) || variants[0] || null;
  }, [variants, selectedVariantId]);

  const price = selectedVariant?.price ?? getMinPrice(variants);
  const stock = selectedVariant?.stock ?? 0;
  const img = resolveImageUrl(product?.image || product?.imageUrl);
  const canAdd = !!selectedVariant && stock > 0 && qty >= 1 && qty <= stock;

  const onMinus = () => setQty((q) => Math.max(1, q - 1));
  const onPlus = () => setQty((q) => Math.min(stock || 99, q + 1));

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    const safeQty = Math.max(1, Math.min(qty, stock || 1));
    addToCart({
      productId: product._id,
      variantId: `${product._id}_${selectedVariant.size}`,
      qty: safeQty,
      snapshot: {
        _id: product._id,
        name: product.name,
        category: product.category,
        image: img,
        size: selectedVariant.size,
        price: Number(selectedVariant.price || 0),
        stock: Number(selectedVariant.stock || 0),
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-amber-50/90">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 text-sm text-amber-50/60 mb-8">
          <Link to="/products" className="inline-flex items-center gap-2 hover:text-amber-200 transition">
            <ChevronLeft size={16} /> Back to Products
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-amber-100/70">{product?.name || 'Details'}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-t-2 border-amber-300 rounded-full" /></div>
        ) : err ? (
          <div className="p-10 bg-red-500/10 rounded-3xl border border-red-500/20 text-center">{err}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* --- LEFT: Image & Scent Profile --- */}
            <div className="space-y-8">
              <div className="rounded-[2.5rem] overflow-hidden bg-white/5 ring-1 ring-amber-300/10 shadow-2xl shadow-amber-900/10">
                <img src={img} alt={product.name} className="w-full aspect-square object-cover" />
              </div>

              {/* Scent Profile Bars (স্যারের রিকোয়ারমেন্ট অনুযায়ী) */}
              <div className="bg-white/5 border border-amber-300/10 rounded-3xl p-6 space-y-6">
                <h3 className="text-xl font-bold text-amber-300 flex items-center gap-2">
                  <Wind size={20} /> Scent Profile
                </h3>
                
                <div className="space-y-4">
                  {/* Top Notes Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-amber-50/60 mb-1">
                      <span>Top Notes (Opening)</span>
                      <span className="text-amber-200">{product.notes?.top || 'Fresh'}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-amber-300/5">
                      <div className="h-full bg-amber-400 w-[90%] rounded-full shadow-[0_0_10px_rgba(251,191,36,0.3)]" />
                    </div>
                  </div>

                  {/* Heart Notes Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-amber-50/60 mb-1">
                      <span>Heart Notes (Evolution)</span>
                      <span className="text-amber-200">{product.notes?.heart || 'Floral'}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-amber-300/5">
                      <div className="h-full bg-amber-500 w-[70%] rounded-full" />
                    </div>
                  </div>

                  {/* Base Notes Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-amber-50/60 mb-1">
                      <span>Base Notes (Long Lasting)</span>
                      <span className="text-amber-200">{product.notes?.base || 'Woody'}</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-amber-300/5">
                      <div className="h-full bg-amber-700 w-[50%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT: Details & Selection --- */}
            <div className="space-y-8">
              <div className="bg-white/5 border border-amber-300/10 rounded-[2.5rem] p-8 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-300/60 font-bold">{product.category}</span>
                  <h1 className="text-4xl font-bold mt-2 text-white">{product.name}</h1>
                </div>

                <p className="text-amber-50/60 leading-relaxed text-lg">{product.description}</p>

                {/* Ingredients Chip List */}
                {product.ingredients?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {product.ingredients.map((ing, i) => (
                      <span key={i} className="text-[10px] px-3 py-1 bg-amber-300/5 border border-amber-300/10 rounded-full text-amber-200 uppercase tracking-tighter italic">
                        • {ing.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="h-px bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />

                {/* Price & ML Selection */}
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold text-amber-300">৳{Number(price).toLocaleString()}</div>
                  <div className={`text-sm font-bold px-4 py-1 rounded-full ${stock > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400'}`}>
                    {stock > 0 ? `${stock} in stock` : 'Sold Out'}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-amber-50/40 uppercase tracking-widest">Select Size</label>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((v) => (
                      <button
                        key={v._id}
                        onClick={() => { setSelectedVariantId(v._id); setQty(1); }}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all border ${v._id === selectedVariantId ? 'bg-amber-300 text-black border-amber-300' : 'bg-white/5 border-amber-300/10 hover:border-amber-300/40'}`}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Qty & Add to Cart */}
                <div className="flex gap-4 items-center pt-4">
                  <div className="flex items-center bg-black/40 border border-amber-300/20 rounded-2xl overflow-hidden">
                    <button onClick={onMinus} className="px-5 py-3 hover:bg-amber-300/10 transition">-</button>
                    <span className="w-12 text-center font-bold">{qty}</span>
                    <button onClick={onPlus} className="px-5 py-3 hover:bg-amber-300/10 transition">+</button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    disabled={!canAdd}
                    className="flex-1 bg-amber-300 text-black font-bold py-4 rounded-2xl hover:bg-amber-200 transition shadow-lg shadow-amber-300/10 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} /> Add to Cart
                  </button>
                </div>
              </div>

              {/* Trust Badge / Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-3xl border border-amber-300/5 text-center space-y-1">
                  <Anchor size={20} className="mx-auto text-amber-300/40" />
                  <p className="text-[10px] text-amber-50/40 uppercase font-bold">100% Pure Concentrate</p>
                </div>
                <div className="p-4 bg-white/5 rounded-3xl border border-amber-300/5 text-center space-y-1">
                  <List size={20} className="mx-auto text-amber-300/40" />
                  <p className="text-[10px] text-amber-50/40 uppercase font-bold">Alcohol Free Fragrance</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}