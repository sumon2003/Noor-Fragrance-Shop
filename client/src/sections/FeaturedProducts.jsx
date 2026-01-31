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
  selectedCategory = "All",
  search = "",
  onSearchChange,
  sort = "default",
  onSortChange,
}) {
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

  // category + search filter
  const filtered = useMemo(() => {
    const q = normalize(search);

    return items.filter((p) => {
      // category match
      const c = normalize(p?.category);
      const categoryOk =
        selectedCategory === "All" || c === normalize(selectedCategory);

      if (!categoryOk) return false;

      if (!q) return true;

      // search match: name/category/description
      const name = normalize(p?.name);
      const desc = normalize(p?.description);
      const cat = normalize(p?.category);

      return name.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [items, selectedCategory, search]);

  // sorting
  const visible = useMemo(() => {
    const arr = [...filtered];

    if (sort === "price_asc") {
      arr.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    } else if (sort === "price_desc") {
      arr.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
    } else if (sort === "name_asc") {
      arr.sort((a, b) => normalize(a?.name).localeCompare(normalize(b?.name)));
    }

    return arr;
  }, [filtered, sort]);

  return (
    <section id="products" className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <h2 className="text-xl font-semibold text-amber-50/90">
            Featured Products
          </h2>
          <p className="text-sm text-amber-50/55 mt-1">
            Category:{" "}
            <span className="text-amber-200 font-semibold">
              {selectedCategory}
            </span>
            {search ? (
              <>
                {" "}
                • Search:{" "}
                <span className="text-amber-200 font-semibold">“{search}”</span>
              </>
            ) : null}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="w-full sm:w-[320px]">
            <input
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search by name, category, or description..."
              className="w-full px-4 py-3 rounded-2xl bg-black/30 text-amber-50/85 placeholder:text-amber-100/25 ring-1 ring-amber-300/12 focus:ring-amber-300/35 outline-none transition"
            />
          </div>

          {/* Sort */}
          <div className="w-full sm:w-[220px]">
            <select
              value={sort}
              onChange={(e) => onSortChange?.(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-black/30 text-amber-50/85 ring-1 ring-amber-300/12 focus:ring-amber-300/35 outline-none transition"
            >
              <option value="default">Sort: Default</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="name_asc">Name: A → Z</option>
            </select>
          </div>
        </div>
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
            : visible.map((p) => (
                <ProductCard
                  key={p._id || p.id || p.name}
                  product={p}
                />
              ))}
        </div>

        {!loading && !err && visible.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white/5 ring-1 ring-amber-300/12 p-5 text-amber-50/70">
            No products match your filters.
            <div className="text-xs mt-2 text-amber-50/55">
              Try: Category “All” or clear the search box.
            </div>
          </div>
        ) : null}

        {!loading && !err ? (
          <div className="mt-5 text-xs text-amber-50/50">
            Showing <span className="text-amber-200">{visible.length}</span> of{" "}
            <span className="text-amber-200">{items.length}</span> products
          </div>
        ) : null}
      </div>
    </section>
  );
}
