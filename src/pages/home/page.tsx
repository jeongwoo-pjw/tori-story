import { useState } from "react";
import TopNav from "@/components/feature/TopNav";
import Footer from "@/components/feature/Footer";
import FoldSidebar from "@/components/feature/FoldSidebar";
import HeroSection from "./components/HeroSection";
import RecentStories from "./components/RecentStories";
import WhyToriSection from "./components/WhyToriSection";
import FreeTrialSection from "./components/FreeTrialSection";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <TopNav
        isLoggedIn={isLoggedIn}
        onToggleLogin={() => setIsLoggedIn((v) => !v)}
      />

      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)]">
        <HeroSection isLoggedIn={isLoggedIn} />

        {isLoggedIn ? (
          <RecentStories isLoggedIn={isLoggedIn} />
        ) : (
          <>
            <WhyToriSection />
            <FreeTrialSection />
          </>
        )}

        <Footer />
      </div>
    </main>
  );
}
