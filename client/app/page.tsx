import { Destinations } from "@/components/home/Destinations";
import { Features } from "@/components/home/Features";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { Navbar } from "@/components/home/Navbar";
import { Newsletter } from "@/components/home/Newsletter";
import { Offers } from "@/components/home/Offers";
import { Promo } from "@/components/home/Promo";
import { SearchBar } from "@/components/home/SearchBar";
import { Stats } from "@/components/home/Stats";
import { Testimonials } from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SearchBar />
        <Stats />
        <Offers />
        <Destinations />
        <Features />
        <Promo />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
