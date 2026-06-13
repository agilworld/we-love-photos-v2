"use client";

import Footer from "../components/shared/Footer";
import Hero from "../components/shared/Hero";
import SearchBar from "../features/search/SearchBar";
import Header from "../components/shared/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="container w-full md:w-4/6 mx-auto px-4 z-10">
        <Hero />
        <SearchBar />
        <Footer />
      </div>
    </div>
  );
}
