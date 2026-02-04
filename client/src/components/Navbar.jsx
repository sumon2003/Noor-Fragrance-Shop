import { ShoppingCart, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const nav = useNavigate();

  const count = items?.reduce((sum, it) => sum + (it.qty || 0), 0) || 0;

  return (
    <header className="sticky top-0 z-20 bg-black/35 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl overflow-hidden bg-white/5 ring-1 ring-amber-300/20">
            <img
              src="/logo.jpg"
              alt="Noor Attar"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="leading-tight">
            <div className="font-semibold tracking-widest text-amber-50">
              NOOR <span className="text-amber-300">FRAGRANCE</span>
            </div>
            <div className="text-[11px] text-amber-200/60 tracking-[0.25em] uppercase">
              Premium Attar
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-amber-50/70">
          <NavLink to="/" className={({isActive}) => isActive ? "text-amber-200" : "hover:text-amber-200 transition"}>
            Home
          </NavLink>
          <NavLink to="/products" className={({isActive}) => isActive ? "text-amber-200" : "hover:text-amber-200 transition"}>
            Products
          </NavLink>
          <a className="hover:text-amber-200 transition" href="/#about">
            About
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <Link
              className="px-4 py-2 rounded-full bg-white/5 ring-1 ring-amber-300/20 hover:ring-amber-300/35 hover:bg-white/10 transition text-amber-50/80 text-sm"
              to="/login"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                logout();
                nav("/", { replace: true });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 ring-1 ring-amber-300/20 hover:ring-amber-300/35 hover:bg-white/10 transition text-amber-50/85 text-sm"
              type="button"
              title="Logout"
            >
              <span className="hidden sm:inline">{user.name}</span>
              <LogOut size={16} />
            </button>
          )}

          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-b from-amber-300/25 to-amber-300/10 ring-1 ring-amber-300/30 hover:ring-amber-300/45 transition text-amber-50/90 text-sm"
          >
            <ShoppingCart size={16} />
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-2 h-6 min-w-[24px] px-2 rounded-full bg-amber-300 text-black text-xs font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />
    </header>
  );
}
