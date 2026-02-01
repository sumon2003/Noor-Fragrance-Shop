import { ShoppingCart } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Home page section এ smooth scroll (About/Categories)
  const goToSection = (id) => {
    const isHome = location.pathname === "/";

    if (isHome) {
      const el = document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // If not on home, first navigate to home then scroll
    navigate(`/${id}`, { replace: false });
    // small delay to allow home render
    setTimeout(() => {
      const el = document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
  };

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
            
            <img
              src="/logo.jpg"
              alt="Noor Attar"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="leading-tight">
            <div className="font-semibold tracking-widest text-amber-50">
              NOOR <span className="text-amber-300">ATTAR</span>
            </div>
            <div className="text-[11px] text-amber-200/60 tracking-[0.25em] uppercase">
              Dark Premium
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          <button
            type="button"
            onClick={() => goToSection("#about")}
            className="text-amber-50/70 hover:text-amber-200 transition"
          >
            About
          </button>

          <button
            type="button"
            onClick={() => goToSection("#categories")}
            className="text-amber-50/70 hover:text-amber-200 transition"
          >
            Categories
          </button>

          <NavLink to="/products" className={navClass}>
            Products
          </NavLink>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* later: to="/login" */}
          <Link
            to="/"
            className="px-4 py-2 rounded-full bg-white/5 ring-1 ring-amber-300/20 hover:ring-amber-300/35 hover:bg-white/10 transition text-amber-50/80 text-sm"
            onClick={(e) => {
              // placeholder: home page login section future
              // If you later add /login, remove this handler.
              e.preventDefault();
              alert("Login page coming soon!");
            }}
          >
            Login
          </Link>

          {/* later: to="/cart" */}
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-b from-amber-300/25 to-amber-300/10 ring-1 ring-amber-300/30 hover:ring-amber-300/45 transition text-amber-50/90 text-sm"
            onClick={() => alert("Cart feature coming soon!")}
          >
            <ShoppingCart size={16} />
            Cart
          </button>
        </div>
      </div>

      {/* subtle divider glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />
    </header>
  );
}
