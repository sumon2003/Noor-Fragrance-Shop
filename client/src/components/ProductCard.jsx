import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const title = product?.name || "Attar Name";
  const category = product?.category || "Category";
  const price = product?.price ?? 0;

  const img =
    product?.image || product?.imageUrl || "/images/fallback/default.jpg";

  const id = product?._id || product?.id;

  return (
    <div className="group rounded-3xl bg-white/5 ring-1 ring-amber-300/10 hover:ring-amber-300/30 transition overflow-hidden shadow-[0_18px_70px_rgba(0,0,0,0.35)]">
      {/* click area */}
      <Link to={id ? `/product/${id}` : "#"} className="block">
        <div className="relative h-56 overflow-hidden">
          <img
            src={img}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-[1.05] transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
          <div className="absolute top-3 left-3 text-xs px-3 py-1.5 rounded-full bg-black/40 backdrop-blur ring-1 ring-amber-300/15 text-amber-50/85">
            {category}
          </div>
        </div>

        <div className="p-5">
          <div className="text-amber-50/90 font-semibold line-clamp-1">
            {title}
          </div>

          <div className="mt-1 text-amber-50/60 text-sm">
            Premium oil • Alcohol-free
          </div>
        </div>
      </Link>

      {/* bottom area stays clickable for Add button */}
      <div className="px-5 pb-5 flex items-center justify-between">
        <div className="text-amber-300 font-semibold">
          ৳ {Number(price).toLocaleString()}
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-300 text-black font-semibold hover:bg-amber-200 transition">
          <ShoppingCart size={16} />
          Add
        </button>
      </div>
    </div>
  );
}
