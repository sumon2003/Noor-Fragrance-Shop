import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Categories from "../sections/Categories";
import FeaturedProducts from "../sections/FeaturedProducts";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen text-amber-50/90">
      <Navbar />

      <main className="pb-16">
        <section className="max-w-6xl mx-auto px-4 pt-10">
          <div className="rounded-3xl bg-white/5 ring-1 ring-amber-300/10 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.25)]">
            <h1 className="text-2xl md:text-3xl font-semibold text-amber-50/90">
              All Products
            </h1>
            <p className="mt-2 text-amber-50/60 text-sm">
              Filter by category, then search & sort your favorite attars.
            </p>
          </div>
        </section>

        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <FeaturedProducts
          title="Browse Products"
          subtitle="Search + Sort works with category filter"
          selectedCategory={selectedCategory}
          showControls={true}
          limit={null}
        />
      </main>

      <Footer />
    </div>
  );
}
