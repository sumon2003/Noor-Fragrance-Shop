import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import Hero from "../sections/Hero";
import About from "../sections/About";
import Categories from "../sections/Categories";
import FeaturedProducts from "../sections/FeaturedProducts";
import WhyChooseUs from "../sections/WhyChooseUs";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen text-amber-50/90 selection:bg-amber-300/30 selection:text-amber-50">
      <Navbar />
      <main className="pb-16">
        <Hero />
        <About />

        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={(c) => setSelectedCategory(c)}
        />

        <FeaturedProducts selectedCategory={selectedCategory} />

        <WhyChooseUs />
      </main>
      <Footer />
    </div>
  );
}
