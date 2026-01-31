import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../services/product.service";

function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-white/5 ring-1 ring-amber-300/10 overflow-hidden animate-pulse">
      <div className="h-56 bg-black/30" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-2/3 bg-black/30 rounded" />
        <div className="h-4 w-1/2 bg-black/30 rounded" />
        <div className="h-10 w-full bg-black/30 rounded-2xl" />
      </div>
    </div>
  );
}

export default function FeaturedProducts({ selectedCategory = "All" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await fetchProducts();
        if (!alive) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load products");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // ✅ category filtering
  const filtered = useMemo(() => {
    if (selectedCategory === "All") return items;

    const target = selectedCategory.toLowerCase();
    return items.filter((p) => {
      const c = (p?.category || "").toString().toLowerCase().trim();
      return c === target;
    });
  }, [items, selectedCategory]);

  return (
    <section id="products" className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-amber-50/90">Featured Products</h2>
          <p className="text-sm text-amber-50/55 mt-1">
            Showing:{" "}
            <span className="text-amber-200 font-semibold">{selectedCategory}</span>
          </p>
        </div>

        <a
          href="#categories"
          className="text-sm text-amber-200/70 hover:text-amber-200 transition"
        >
          Change category →
        </a>
      </div>

      <div className="mt-6">
        {err ? (
          <div className="rounded-3xl bg-white/5 ring-1 ring-red-400/30 p-5 text-amber-50/80">
            <div className="font-semibold text-red-200">Error</div>
            <div className="text-sm mt-1">{err}</div>
            <div className="text-xs mt-3 text-amber-50/50">
              Tip: backend (`server`) running আছে কিনা দেখুন (port 5000)।
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map((p) => <ProductCard key={p._id || p.id || p.name} product={p} />)}
        </div>

        {!loading && !err && filtered.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white/5 ring-1 ring-amber-300/12 p-5 text-amber-50/70">
            No products found for{" "}
            <span className="text-amber-200 font-semibold">{selectedCategory}</span>.
            <div className="text-xs mt-2 text-amber-50/55">
              Tip: MongoDB products এর category value ঠিকভাবে “Oud/Musk/Floral/Fresh/Spicy” কিনা চেক করুন।
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
