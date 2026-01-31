// client/src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, ChevronLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchProductById } from "../services/product.service";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await fetchProductById(id);
        if (!alive) return;
        setProduct(data);
        setQty(1);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load product");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  const img = product?.image || "/images/fallback/default.jpg";
  const price = product?.price ?? 0;
  const stock = product?.stock ?? 0;
  const canAdd = stock > 0 && qty >= 1 && qty <= stock;

  return (
    <div className="min-h-screen text-amber-50/90">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 text-sm text-amber-50/60">
          <Link
            to="/"
            className="inline-flex items-center gap-2 hover:text-amber-200 transition"
          >
            <ChevronLeft size={16} />
            Back to Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-amber-100/70">Product</span>
        </div>

        {loading ? (
          <div className="mt-8 rounded-3xl bg-white/5 ring-1 ring-amber-300/10 p-6">
            Loading...
          </div>
        ) : err ? (
          <div className="mt-8 rounded-3xl bg-white/5 ring-1 ring-red-400/30 p-6">
            <div className="text-red-200 font-semibold">Error</div>
            <div className="mt-1 text-amber-50/70">{err}</div>
          </div>
        ) : !product ? (
          <div className="mt-8 rounded-3xl bg-white/5 ring-1 ring-amber-300/10 p-6">
            Product not found
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* IMAGE */}
            <div className="rounded-3xl overflow-hidden bg-white/5 ring-1 ring-amber-300/10">
              <div className="relative aspect-[4/3]">
                <img
                  src={img}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
                <div className="absolute top-4 left-4 text-xs px-3 py-1.5 rounded-full bg-black/40 backdrop-blur ring-1 ring-amber-300/15">
                  {product.category}
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="rounded-3xl bg-white/5 ring-1 ring-amber-300/10 p-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-amber-50/90">
                {product.name}
              </h1>

              <p className="mt-3 text-amber-50/65 leading-relaxed">
                {product.description || "No description yet."}
              </p>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <div className="text-sm text-amber-50/60">Price</div>
                  <div className="text-2xl font-semibold text-amber-300">
                    ৳ {Number(price).toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-amber-50/60">Stock</div>
                  <div
                    className={`font-semibold ${
                      stock > 0 ? "text-emerald-300" : "text-red-300"
                    }`}
                  >
                    {stock > 0 ? `${stock} available` : "Out of stock"}
                  </div>
                </div>
              </div>

              {/* QTY */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="text-sm text-amber-50/60 w-20">Qty</div>

                <div className="inline-flex items-center rounded-2xl bg-black/30 ring-1 ring-amber-300/12 overflow-hidden">
                  <button
                    className="px-4 py-2 text-amber-200 hover:bg-white/5 transition disabled:opacity-40"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <div className="px-5 py-2 text-amber-50/85 min-w-[56px] text-center">
                    {qty}
                  </div>
                  <button
                    className="px-4 py-2 text-amber-200 hover:bg-white/5 transition disabled:opacity-40"
                    onClick={() => setQty((q) => Math.min(stock || 99, q + 1))}
                    disabled={stock > 0 ? qty >= stock : true}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  disabled={!canAdd}
                  className="inline-flex justify-center items-center gap-2 px-5 py-3 rounded-2xl bg-amber-300 text-black font-semibold hover:bg-amber-200 transition disabled:opacity-40 disabled:hover:bg-amber-300"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>

                <Link
                  to="/"
                  className="inline-flex justify-center items-center px-5 py-3 rounded-2xl bg-white/5 ring-1 ring-amber-300/12 text-amber-50/80 hover:ring-amber-300/30 transition"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="mt-6 text-xs text-amber-50/45">
                Next step: Cart state + localStorage add করবো।
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
