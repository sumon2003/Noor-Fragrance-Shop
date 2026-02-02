const categories = [
  { name: "All", hint: "Show everything" },
  { name: "Oud", hint: "Deep & royal" },
  { name: "Musk", hint: "Soft & clean" },
  { name: "Floral", hint: "Elegant notes" },
  { name: "Fresh", hint: "Daily wear" },
  { name: "Spicy", hint: "Bold vibe" },
  { name: "Woody", hint: "Earthy & warm" }
];

export default function Categories({ selectedCategory, onSelectCategory }) {
  return (
    <section id="categories" className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-amber-50/90">Categories</h2>
          <p className="text-amber-50/55 text-sm mt-1">
            Choose a vibe—then explore matching attars.
          </p>
        </div>

        <div className="text-xs text-amber-200/60 hidden md:block">
          Selected: <span className="text-amber-200">{selectedCategory}</span>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-white/5 ring-1 ring-amber-300/12 p-4 md:p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap gap-3">
          {categories.map((c) => {
            const active = selectedCategory === c.name;

            return (
              <button
                key={c.name}
                onClick={() => onSelectCategory(c.name)}
                className={[
                  "group relative overflow-hidden rounded-full px-5 py-3 transition",
                  active
                    ? "bg-amber-300 text-black ring-1 ring-amber-200 shadow-[0_18px_45px_rgba(212,175,55,0.20)]"
                    : "bg-black/25 text-amber-50/80 ring-1 ring-amber-300/12 hover:ring-amber-300/35 hover:bg-black/35",
                ].join(" ")}
              >
                {!active ? (
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-amber-300/15 via-transparent to-amber-300/10" />
                ) : null}

                <div className="relative text-left">
                  <div className="font-semibold text-sm">{c.name}</div>
                  <div className={active ? "text-black/70 text-xs mt-0.5" : "text-amber-50/55 text-xs mt-0.5"}>
                    {c.hint}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-xs text-amber-50/50">
        </div>
      </div>
    </section>
  );
}
