import { ShoppingCart } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { count } = useCart();

  const navClass = ({ isActive }) =>
    `hover:text-amber-200 transition ${
      isActive ? "text-amber-200" : "text-amber-50/70"
    }`;

  return (
    <header className="sticky top-0 z-20 bg-black/35 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl overflow-hidden bg-white/5 ring-1 ring-amber-300/20 shadow-[0_10px_30px_rgba(212,175,55,0.10)]">
            {/* logo path must be from public: /logo.jpg */}
            <img src="/logo.jpg" alt="Noor Attar" className="h-full w-full object-cover" />
          </div>

          <div className="leading-tight">
            <div className="font-semibold tracking-widest text-amber-50">
              NOOR <span className="text-amber-300">Fragrance</span>
            </div>
            <div className="text-[11px] text-amber-200/60 tracking-[0.25em] uppercase">
              Premium Attar
            </div>
          </div>
        </Link>

        {/* Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink className={navClass} to="/">
            Home
          </NavLink>

          <a className="text-amber-50/70 hover:text-amber-200 transition" href="#about">
            About
          </a>
          
          <NavLink className={navClass} to="/products">
            Products
          </NavLink>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <NavLink
            to="/login"
            className="px-4 py-2 rounded-full bg-white/5 ring-1 ring-amber-300/20 hover:ring-amber-300/35 hover:bg-white/10 transition text-amber-50/80 text-sm"
          >
            Login
          </NavLink>

          {/* Cart button goes to /cart */}
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-b from-amber-300/25 to-amber-300/10 ring-1 ring-amber-300/30 hover:ring-amber-300/45 transition text-amber-50/90 text-sm"
          >
            <ShoppingCart size={16} />
            Cart

            {/* badge */}
            {count > 0 && (
              <span className="absolute -top-2 -right-2 h-6 min-w-[24px] px-2 rounded-full bg-amber-300 text-black text-xs font-bold grid place-items-center shadow">
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
