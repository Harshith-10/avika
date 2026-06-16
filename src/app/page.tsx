import CTASection from "@/components/blocks/cta-section";
import HeroSection from "@/components/blocks/hero-section";
import Navbar from "@/components/blocks/navbar";
import OffersSection from "@/components/blocks/offers-section";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <ScrollArea className="h-screen w-screen">
      <Navbar />
      <div className="px-16">
        <div className="flex flex-col items-center justify-center w-full border-r border-l">
          <div className="h-20" />
          <HeroSection />
          <OffersSection />
          <CTASection />
          <div className="h-20" />
        </div>
      </div>
    </ScrollArea>
  );
}
