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

function normalize(s) {
  return (s || "").toString().toLowerCase().trim();
}

export default function FeaturedProducts({
  title = "Featured Products",
  subtitle = "Handpicked premium attars",

  // category filter
  selectedCategory = "All",

  // controls (search/sort)
  showControls = true,
  limit = null,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // controls state 
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default"); // default | price_asc | price_desc | name_asc

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

    return () => (alive = false);
  }, []);

  // category + search filter
  const filtered = useMemo(() => {
    const cat = normalize(selectedCategory);

    return items.filter((p) => {
      // category filter always applies
      const pCat = normalize(p?.category);
      const categoryOk = cat === "all" || pCat === cat;
      if (!categoryOk) return false;

      // search filter (only when controls on)
      if (!showControls) return true;

      const q = normalize(search);
      if (!q) return true;

      const name = normalize(p?.name);
      const desc = normalize(p?.description);
      return name.includes(q) || desc.includes(q) || pCat.includes(q) || desc.includes(q);
    });
  }, [items, selectedCategory, search, showControls]);

  // sorting (only when controls on)
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (!showControls) return arr;

    if (sort === "price_asc") {
      arr.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    } else if (sort === "price_desc") {
      arr.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
    } else if (sort === "name_asc") {
      arr.sort((a, b) => normalize(a?.name).localeCompare(normalize(b?.name)));
    }

    return arr;
  }, [filtered, sort, showControls]);

  // limit (Home: 3)
  const visible = useMemo(() => {
    if (!limit) return sorted;
    return sorted.slice(0, limit);
  }, [sorted, limit]);

  return (
    <section id="products" className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <h2 className="text-xl font-semibold text-amber-50/90">{title}</h2>
          <p className="text-sm text-amber-50/55 mt-1">
            {subtitle}{" "}
            <span className="text-amber-200/80">
              • Category: {selectedCategory}
            </span>
          </p>
        </div>

        {showControls ? (
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="w-full sm:w-[320px]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, category, or description..."
                className="w-full px-4 py-3 rounded-2xl bg-black/30 text-amber-50/85 placeholder:text-amber-100/25 ring-1 ring-amber-300/12 focus:ring-amber-300/35 outline-none transition"
              />
            </div>

            <div className="w-full sm:w-[220px]">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-black/30 text-amber-50/85 ring-1 ring-amber-300/12 focus:ring-amber-300/35 outline-none transition"
              >
                <option value="default">Sort: Default</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="name_asc">Name: A → Z</option>
              </select>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        {err ? (
          <div className="rounded-3xl bg-white/5 ring-1 ring-red-400/30 p-5 text-amber-50/80">
            <div className="font-semibold text-red-200">Error</div>
            <div className="text-sm mt-1">{err}</div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: limit || 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : visible.map((p) => (
                <ProductCard key={p._id || p.id || p.name} product={p} />
              ))}
        </div>

        {!loading && !err && visible.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white/5 ring-1 ring-amber-300/12 p-5 text-amber-50/70">
            No products found for{" "}
            <span className="text-amber-200">{selectedCategory}</span>.
          </div>
        ) : null}
      </div>
    </section>
  );
}
