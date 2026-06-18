import { useState, useEffect } from "react";
import TopNav from "@/components/feature/TopNav";
import Footer from "@/components/feature/Footer";
import FoldSidebar from "@/components/feature/FoldSidebar";
import HeroSection from "./components/HeroSection";
import RecentStories from "./components/RecentStories";
import WhyToriSection from "./components/WhyToriSection";
import FreeTrialSection from "./components/FreeTrialSection";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // 비로그인 시 사이드바 너비 0으로 초기화
  useEffect(() => {
    if (!isLoggedIn) {
      document.documentElement.style.setProperty("--sidebar-width", "0px");
    }
  }, [isLoggedIn]);

  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <TopNav
        isLoggedIn={isLoggedIn}
        onToggleLogin={() => setIsLoggedIn((v) => !v)}
      />

      {isLoggedIn && <FoldSidebar />}

      <div className={isLoggedIn ? "pl-[var(--sidebar-width)]" : ""}>
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
