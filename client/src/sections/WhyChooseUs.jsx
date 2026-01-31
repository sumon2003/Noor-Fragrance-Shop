const items = [
  { title: "Long-lasting", desc: "Balanced blends designed to stay longer." },
  { title: "Alcohol-free", desc: "Clean & comfortable everyday wear." },
  { title: "Premium oils", desc: "Carefully curated notes and quality." },
];

export default function WhyChooseUs() {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-amber-50/90">Why Choose Us</h2>
          <p className="text-sm text-amber-50/55 mt-1">
            Simple reasons people trust premium attars.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <div
            key={it.title}
            className="rounded-3xl bg-white/5 ring-1 ring-amber-300/10 hover:ring-amber-300/30 transition p-6 shadow-[0_18px_70px_rgba(0,0,0,0.30)]"
          >
            <h3 className="font-semibold text-amber-50/90">{it.title}</h3>
            <p className="text-amber-50/60 mt-2">{it.desc}</p>
            <div className="mt-4 h-px bg-gradient-to-r from-amber-300/25 via-transparent to-transparent" />
            <div className="mt-3 text-xs text-amber-200/60">
              Premium • Clean • Modern
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
