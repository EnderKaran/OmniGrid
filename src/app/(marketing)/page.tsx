import { CTA } from "@/components/marketing/CTA";
import { Features } from "@/components/marketing/Features";
import { Footer } from "@/components/marketing/Footer";
import { GridPattern } from "@/components/marketing/GridPattern";
import { Hero } from "@/components/marketing/Hero";
import { Navbar } from "@/components/marketing/Navbar";

export default function MarketingPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 selection:bg-cyan-500/30">
      <GridPattern />
      <Navbar />
      
      <main>
        <Hero />
        <Features />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
