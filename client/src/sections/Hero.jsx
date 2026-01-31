export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 pt-10 pb-10">
      <div className="relative overflow-hidden rounded-3xl bg-white/5 ring-1 ring-amber-300/15 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
        {/* glow blobs */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-amber-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-52 -right-52 h-[36rem] w-[36rem] rounded-full bg-orange-200/10 blur-3xl" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-7 md:p-12 items-center">
          {/* Text */}
          <div>
            <p className="text-amber-200/60 tracking-[0.35em] text-[12px] uppercase">
              Dark Premium Collection
            </p>

            <h1 className="text-3xl md:text-6xl font-semibold mt-4 leading-[1.05] text-amber-50/95">
              Premium Attar{" "}
              <span className="text-amber-300 drop-shadow-[0_0_18px_rgba(212,175,55,0.30)]">
                that feels luxury
              </span>
              .
            </h1>

            <p className="text-amber-50/70 mt-4 max-w-xl text-base md:text-lg leading-relaxed">
              Alcohol-free, long-lasting fragrances crafted for daily wear, office, and special occasions.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#products"
                className="px-6 py-3 rounded-full font-semibold text-black bg-amber-300 hover:bg-amber-200 transition shadow-[0_18px_45px_rgba(212,175,55,0.20)]"
              >
                Shop Now
              </a>

              <a
                href="#categories"
                className="px-6 py-3 rounded-full text-amber-50/85 bg-white/5 ring-1 ring-amber-300/20 hover:ring-amber-300/40 hover:bg-white/10 transition"
              >
                View Categories
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 text-xs">
              {["Alcohol-free", "Long-lasting", "Premium oils"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full bg-black/25 ring-1 ring-amber-300/15 text-amber-50/75"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden bg-black/20 ring-1 ring-amber-300/15 h-[280px] md:h-[420px]">
              
              <img
                src="public/hero1.jpg"
                alt="Premium Attar"
                className="h-full w-full object-cover"
              />
              {/* soft overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
            </div>

            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl bg-black/35 backdrop-blur-xl ring-1 ring-amber-300/15 p-4 hidden md:block">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-amber-50/90">Signature Scents</div>
                  <div className="text-xs text-amber-50/60 mt-1">Curated premium blends</div>
                </div>
                <div className="text-amber-300 font-semibold">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
