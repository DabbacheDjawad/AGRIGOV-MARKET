import MarketTicker from "@/components/Home/Marketticker"
import HeroSection from "@/components/Home/Hero";
import PersonaCards from "@/components/Home/PersonaCards";
import PriceTable from "@/components/Home/PriceTable";
import NewsSection from "@/components/Home/News";
import NationalCoverageSection from "@/components/Home/NationalCoverage";
import {
  tickerItems,
  priceRows,
  personaCards,
  newsArticles,
  nationalStats,
  footerQuickLinks,
  footerSupportLinks,
} from "@/types/Home";

export default function LandingPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display selection:bg-primary selection:text-black antialiased">
      <MarketTicker items={tickerItems} />
      <HeroSection />
      <PersonaCards cards={personaCards} />
      <PriceTable rows={priceRows} />
      <NewsSection articles={newsArticles} />
      <NationalCoverageSection stats={nationalStats} />
    </div>
  );
}