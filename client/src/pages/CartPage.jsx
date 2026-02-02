import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, setQty, removeItem, subtotal, clearCart } = useCart();

  return (
    <div className="min-h-screen px-4 py-10 text-amber-50/90">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Cart</h1>
            <p className="text-amber-50/60 text-sm mt-1">
              {items.length} item(s)
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="px-4 py-2 rounded-2xl bg-white/5 ring-1 ring-amber-300/15 hover:ring-amber-300/35 transition text-sm"
            >
              Clear
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white/5 ring-1 ring-amber-300/10 p-6">
            <p className="text-amber-50/70">Cart is empty.</p>
            <Link
              to="/products"
              className="inline-flex mt-4 px-5 py-3 rounded-2xl bg-amber-300 text-black font-semibold hover:bg-amber-200 transition"
            >
              Go Products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((i) => {
                const snap = i.snapshot || {};
                return (
                  <div
                    key={`${i.productId}_${i.variantId}`}
                    className="rounded-3xl bg-white/5 ring-1 ring-amber-300/10 p-4 flex gap-4"
                  >
                    <div className="h-20 w-24 rounded-2xl overflow-hidden bg-black/30 ring-1 ring-amber-300/10">
                      <img
                        src={snap.image || "/images/fallback/default.jpg"}
                        alt={snap.name || "Item"}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold">{snap.name}</div>
                          <div className="text-sm text-amber-50/60 mt-1">
                            {snap.category} • {snap.size}
                          </div>
                          <div className="text-amber-300 font-semibold mt-2">
                            ৳ {Number(snap.price || 0).toLocaleString()}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            removeItem({ productId: i.productId, variantId: i.variantId })
                          }
                          className="p-2 rounded-2xl bg-white/5 ring-1 ring-amber-300/10 hover:ring-amber-300/30 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <button
                          className="p-2 rounded-2xl bg-black/30 ring-1 ring-amber-300/10 hover:ring-amber-300/30 transition"
                          onClick={() =>
                            setQty({
                              productId: i.productId,
                              variantId: i.variantId,
                              qty: Math.max(1, i.qty - 1),
                            })
                          }
                        >
                          <Minus size={16} />
                        </button>

                        <div className="min-w-[44px] text-center">{i.qty}</div>

                        <button
                          className="p-2 rounded-2xl bg-black/30 ring-1 ring-amber-300/10 hover:ring-amber-300/30 transition"
                          onClick={() =>
                            setQty({
                              productId: i.productId,
                              variantId: i.variantId,
                              qty: i.qty + 1,
                            })
                          }
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-3xl bg-white/5 ring-1 ring-amber-300/10 p-6 h-fit">
              <h2 className="text-lg font-semibold">Summary</h2>
              <div className="mt-4 flex justify-between text-amber-50/70">
                <span>Subtotal</span>
                <span className="text-amber-200/90 font-semibold">
                  ৳ {Number(subtotal).toLocaleString()}
                </span>
              </div>

              <button
                className="mt-6 w-full px-5 py-3 rounded-2xl bg-amber-300 text-black font-semibold hover:bg-amber-200 transition"
                onClick={() => alert("Checkout later")}
              >
                Checkout
              </button>

              <Link
                to="/products"
                className="mt-3 w-full inline-flex justify-center px-5 py-3 rounded-2xl bg-white/5 ring-1 ring-amber-300/12 hover:ring-amber-300/30 transition"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
