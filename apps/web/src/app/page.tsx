import TopBar from "@/components/landing/TopBar";
import Header from "@/components/landing/Header";
import NewsTicker from "@/components/landing/NewsTicker";
import HeroSection from "@/components/landing/HeroSection";
import PopularSchemes from "@/components/landing/PopularSchemes";
import ServicesSection from "@/components/landing/ServicesSection";
import StatsSection from "@/components/landing/StatsSection";
import MinistryMarquee from "@/components/landing/MinistryMarquee";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <TopBar />
      <Header />
      <NewsTicker />
      
      <main className="flex-1">
        <HeroSection />
        <PopularSchemes />
        <ServicesSection />
        <StatsSection />
      </main>

      <MinistryMarquee />

      <Footer />
    </div>
  );
}
