export default function About() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-4 py-10">
      <div className="rounded-3xl bg-white/5 ring-1 ring-amber-300/12 shadow-[0_30px_120px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-[260px] md:h-full min-h-[320px]">
            <img
              src="/about.png"
              alt="About Noor Attar"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <div className="text-amber-200/70 text-xs tracking-[0.35em] uppercase">Our story</div>
              <div className="text-amber-50/90 text-xl font-semibold mt-2">Crafted for calm & confidence</div>
            </div>
          </div>

          {/* Text */}
          <div className="p-7 md:p-10">
            <h2 className="text-xl md:text-3xl font-semibold text-amber-50/95">
              About <span className="text-amber-300">Noor Attar</span>
            </h2>

            <p className="text-amber-50/70 mt-3 leading-relaxed">
              Noor Attar is a premium collection of alcohol-free fragrances crafted for a clean,
              long-lasting experience. We focus on authentic notes, balanced blends, and a luxury feel
              suitable for everyday wear and special occasions.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { t: "Premium Oils", d: "High quality blends" },
                { t: "Long Lasting", d: "All-day confidence" },
                { t: "Alcohol-Free", d: "Comfortable wear" },
              ].map((x) => (
                <div
                  key={x.t}
                  className="rounded-2xl bg-black/25 ring-1 ring-amber-300/12 p-4 hover:ring-amber-300/30 hover:bg-black/30 transition"
                >
                  <div className="font-semibold text-sm text-amber-50/90">{x.t}</div>
                  <div className="text-xs text-amber-50/60 mt-1">{x.d}</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <a
                href="#products"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-amber-300 text-black font-semibold hover:bg-amber-200 transition"
              >
                Explore Products
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
