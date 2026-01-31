import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 bg-black/35 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl overflow-hidden bg-white/5 ring-1 ring-amber-300/20 shadow-[0_10px_30px_rgba(212,175,55,0.10)]">
            
            <img
              src="public/logo.jpg"
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
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm text-amber-50/70">
          <a className="hover:text-amber-200 transition" href="#about">
            About
          </a>
          <a className="hover:text-amber-200 transition" href="#categories">
            Categories
          </a>
          <a className="hover:text-amber-200 transition" href="#products">
            Products
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            className="px-4 py-2 rounded-full bg-white/5 ring-1 ring-amber-300/20 hover:ring-amber-300/35 hover:bg-white/10 transition text-amber-50/80 text-sm"
            href="#login"
          >
            Login
          </a>

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-b from-amber-300/25 to-amber-300/10 ring-1 ring-amber-300/30 hover:ring-amber-300/45 transition text-amber-50/90 text-sm">
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
