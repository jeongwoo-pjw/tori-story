import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import { STORY_RESULT_KEY, type GeneratedStory } from "@/services/solar";
import { getStoryById, updateStoryStatus } from "@/services/library";

type LangCode = "ko" | "en" | "ja" | "zh";

const LANGS: { code: LangCode; label: string; flag: string }[] = [
  { code: "ko", label: "한국어", flag: "https://flagcdn.com/w40/kr.png" },
  { code: "en", label: "English", flag: "https://flagcdn.com/w40/us.png" },
  { code: "ja", label: "日本語", flag: "https://flagcdn.com/w40/jp.png" },
  { code: "zh", label: "中文", flag: "https://flagcdn.com/w40/cn.png" },
];

const FALLBACK_STORY = {
  title: "토끼와 별빛 숲",
  pages: [
    {
      image: "https://readdy.ai/api/search-image?query=Cute%20korean%20rabbit%20character%20sitting%20under%20glowing%20starlight%20forest%20dreamy%20night%20scene%20soft%20pastel%20colors%20children%20book%20illustration%20warm%20magical%20atmosphere%20whimsical%20fairy%20tale%20art%20style%20gentle%20lighting&width=1200&height=600&seq=viewer-page-01&orientation=landscape",
      texts: {
        ko: "옛날옛날 한 마을의 숲 속에 할아버지가 살고 있었습니다. 할아버지는 매일 밤 숲의 친구들을 찾아 다니며 따뜻한 이야기를 나누곤 했습니다. 어느 날, 작은 토끼가 반짝이는 별빛을 따라 숲 속으로 조심스럽게 걸어왔습니다.",
        en: "Once upon a time, a grandfather lived deep in the forest of a small village.",
        ja: "むかしむかし、ある村の森の中におじいさんが住んでいました。",
        zh: "从前，在一个村庄的森林里住着一位老爷爷。",
      },
    },
  ],
};

function loadStory(id: string | null): GeneratedStory | null {
  if (id) {
    const byId = getStoryById(id);
    if (byId) return byId;
  }
  const raw = localStorage.getItem(STORY_RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GeneratedStory;
  } catch {
    return null;
  }
}

function toViewerStory(story: GeneratedStory | null) {
  if (!story) return FALLBACK_STORY;
  return {
    title: story.title,
    pages: story.pages.map((p) => ({
      image: p.image,
      texts: { ko: p.text, en: "", ja: "", zh: "" },
    })),
  };
}

const formatText = (text: string) => {
  const sentences = text.split('. ');
  return sentences.map((sentence, i) => (
    <span key={i}>
      {sentence}{i < sentences.length - 1 ? '.' : ''}
      {i < sentences.length - 1 && <br />}
    </span>
  ));
};

export default function StoryViewerPage() {
  const [searchParams] = useSearchParams();
  const storyId = searchParams.get("id");
  const STORY = toViewerStory(loadStory(storyId));
  const [currentPage, setCurrentPage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [sleepMode, setSleepMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [showCompletePopup, setShowCompletePopup] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LangCode>("ko");
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    if (fullscreen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreen]);

  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = STORY.pages.length;
  const isLastPage = currentPage === totalPages - 1;

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => {
    if (currentPage === totalPages - 1) {
      if (storyId) updateStoryStatus(storyId, 100, "completed");
      setShowCompletePopup(true);
    } else {
      const nextPage = currentPage + 1;
      if (storyId) {
        const pct = Math.round(((nextPage + 1) / totalPages) * 100);
        updateStoryStatus(storyId, pct, "reading");
      }
      goToPage(nextPage);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) {
      handlePrev();
    } else if (diff < -50) {
      handleNext();
    }
    touchStartX.current = null;
  };

  return (
    <main className={`min-h-screen text-foreground-950 transition-colors duration-500 ${sleepMode ? "bg-foreground-950" : "bg-background-50"}`}>
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12">
        {/* Toolbar */}
        <div className={`sticky top-14 md:top-16 z-30 transition-colors duration-500 border-b py-3 px-4 md:px-8 lg:px-12 -mx-4 md:-mx-8 lg:-mx-12 ${sleepMode ? "bg-foreground-950/90 border-foreground-800" : "bg-background-50/95 backdrop-blur border-background-200/70"}`}>
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            {/* Left: back to bookshelf */}
            <Link
              to="/bookshelf"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border shadow-sm hover:scale-105 active:scale-95 ${sleepMode ? "bg-foreground-800 text-foreground-300 border-foreground-700 hover:bg-foreground-700" : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"}`}
            >
              <i className="ri-arrow-left-line w-3.5 h-3.5 flex items-center justify-center"></i>
              책 닫고 책장으로
            </Link>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              {/* 좋아요 */}
              <button
                type="button"
                onClick={() => setLiked(!liked)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border shadow-sm hover:scale-105 active:scale-95 ${
                  liked
                    ? "bg-rose-500 text-white border-rose-400"
                    : sleepMode
                      ? "bg-foreground-800 text-foreground-300 border-foreground-700 hover:bg-foreground-700"
                      : "bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100"
                }`}
              >
                <i className={`${liked ? "ri-heart-fill" : "ri-heart-line"} w-3.5 h-3.5 flex items-center justify-center`}></i>
                좋아요
              </button>

              {/* 취침 모드 */}
              <button
                type="button"
                onClick={() => setSleepMode(!sleepMode)}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border shadow-sm hover:scale-105 active:scale-95 ${
                  sleepMode
                    ? "bg-indigo-600 text-white border-indigo-500"
                    : "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100"
                }`}
              >
                <i className={`${sleepMode ? "ri-moon-fill" : "ri-moon-line"} w-3.5 h-3.5 flex items-center justify-center`}></i>
                취침 모드
              </button>

              {/* 듣기 */}
              <button
                type="button"
                onClick={() => setListening(!listening)}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border shadow-sm hover:scale-105 active:scale-95 ${
                  listening
                    ? "bg-emerald-500 text-white border-emerald-400"
                    : sleepMode
                      ? "bg-foreground-800 text-foreground-300 border-foreground-700 hover:bg-foreground-700"
                      : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                <i className={`${listening ? "ri-volume-up-fill" : "ri-volume-up-line"} w-3.5 h-3.5 flex items-center justify-center`}></i>
                듣기
              </button>

              {/* 풀화면으로 보기 */}
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border shadow-sm hover:scale-105 active:scale-95 ${
                  sleepMode
                    ? "bg-foreground-800 text-foreground-300 border-foreground-700 hover:bg-foreground-700"
                    : "bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-100"
                }`}
              >
                <i className="ri-fullscreen-line w-3.5 h-3.5 flex items-center justify-center"></i>
                풀화면으로 보기
              </button>
            </div>
          </div>
        </div>

        {/* Story swiper area */}
        <div className="px-4 md:px-8 lg:px-12 pt-6">
          <div className="max-w-6xl mx-auto">

            {/* Centered title */}
            <h1 className={`text-center font-heading text-3xl md:text-5xl font-bold mb-10 transition-colors ${sleepMode ? "text-foreground-200" : "text-foreground-950"}`}>
              {STORY.title}
            </h1>

            <div
              ref={containerRef}
              className="relative overflow-hidden rounded-3xl border-2 border-dashed border-background-200"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Pages container */}
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentPage * 100}%)` }}
              >
                {STORY.pages.map((page, idx) => (
                  <div
                    key={idx}
                    className="w-full flex-shrink-0 flex flex-row min-h-[460px] md:min-h-[600px]"
                  >
                    {/* Image - left 3/5 */}
                    <div className="w-3/5 relative overflow-hidden">
                      <img
                        src={page.image}
                        alt={`${STORY.title} ${idx + 1}페이지`}
                        className="w-full h-full object-cover object-top"
                      />
                      {/* Swipe arrows - inside image */}
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentPage === 0}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center z-10 transition-all cursor-pointer ${currentPage === 0 ? "opacity-0 pointer-events-none" : "text-white/80 hover:text-white drop-shadow-lg"}`}
                      >
                        <i className="ri-arrow-left-s-line w-8 h-8 flex items-center justify-center text-3xl"></i>
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center z-10 transition-all cursor-pointer ${isLastPage ? "opacity-0 pointer-events-none" : "text-white/80 hover:text-white drop-shadow-lg"}`}
                      >
                        <i className="ri-arrow-right-s-line w-8 h-8 flex items-center justify-center text-3xl"></i>
                      </button>
                    </div>

                    {/* Text - right 2/5 */}
                    <div className={`w-2/5 p-8 md:p-12 flex flex-col transition-colors ${sleepMode ? "bg-foreground-950" : "bg-background-50"}`}>
                      {/* Language selector - 상단 고정 */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-label whitespace-nowrap border ${sleepMode ? "bg-foreground-800 text-primary-300 border-primary-700" : "bg-primary-50 text-primary-600 border-primary-200"}`}>
                          🌍 다국어 번역 지원
                        </span>
                        <div className="flex items-center gap-1.5">
                          {LANGS.map((lang) => (
                            <button
                              key={lang.code}
                              type="button"
                              onClick={() => setSelectedLang(lang.code)}
                              title={lang.label}
                              className={`w-8 h-6 rounded overflow-hidden transition-all cursor-pointer flex-shrink-0 ${
                                selectedLang === lang.code
                                  ? "ring-2 ring-primary-500 ring-offset-1 scale-110"
                                  : "opacity-60 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={lang.flag}
                                alt={lang.label}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Story text - 상하 중앙 */}
                      <div className="flex-1 flex items-center">
                        <p className={`text-xl md:text-2xl leading-loose font-body transition-colors ${sleepMode ? "text-foreground-300" : "text-foreground-700"}`}>
                          {formatText(page.texts[selectedLang])}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentPage === 0}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border shadow-sm ${currentPage === 0 ? "opacity-30 pointer-events-none bg-slate-100 text-slate-400 border-slate-200" : sleepMode ? "bg-foreground-800 text-foreground-300 border-foreground-700 hover:bg-foreground-700 hover:scale-105 active:scale-95" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:scale-105 active:scale-95"}`}
              >
                <i className="ri-arrow-left-s-line w-4 h-4 flex items-center justify-center"></i>
                이전 페이지
              </button>

              <div className="flex items-center gap-2">
                {STORY.pages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToPage(idx)}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentPage
                        ? sleepMode ? "w-4 h-4 bg-primary-500" : "w-4 h-4 bg-primary-600"
                        : idx < currentPage
                          ? sleepMode ? "w-3 h-3 bg-primary-400" : "w-3 h-3 bg-primary-300"
                          : sleepMode ? "w-3 h-3 bg-foreground-700 border border-foreground-600" : "w-3 h-3 bg-primary-100 border border-primary-300"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shadow-md hover:scale-105 active:scale-95 ${
                  isLastPage
                    ? sleepMode
                      ? "bg-primary-500 text-foreground-950 hover:bg-primary-400 shadow-primary-900/30"
                      : "bg-gradient-to-r from-primary-500 to-amber-400 text-foreground-950 hover:from-primary-600 hover:to-amber-500 shadow-primary-300/50"
                    : sleepMode
                      ? "bg-foreground-700 text-foreground-100 border border-foreground-600 hover:bg-foreground-600"
                      : "bg-gradient-to-r from-primary-500 to-primary-600 text-foreground-950 hover:from-primary-600 hover:to-primary-700 shadow-primary-300/40"
                }`}
              >
                {isLastPage ? "동화 완료 🎉" : "다음 페이지"}
                <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div className="fixed inset-0 z-[100] bg-foreground-950 flex">
          {/* Close button */}
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer z-10"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>

          {/* Left: image */}
          <div className="w-3/5 relative overflow-hidden">
            <img
              src={STORY.pages[currentPage].image}
              alt={`${STORY.title} ${currentPage + 1}페이지`}
              className="w-full h-full object-cover object-top"
            />
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPage === 0}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors cursor-pointer z-10 ${currentPage === 0 ? "opacity-0 pointer-events-none" : ""}`}
            >
              <i className="ri-arrow-left-s-line text-3xl"></i>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors cursor-pointer z-10 ${isLastPage ? "opacity-0 pointer-events-none" : ""}`}
            >
              <i className="ri-arrow-right-s-line text-3xl"></i>
            </button>
          </div>

          {/* Right: text */}
          <div className="w-2/5 flex flex-col p-10 md:p-14 bg-foreground-900 overflow-auto">
            {/* Language selector */}
            <div className="flex items-center gap-2 mb-8 flex-shrink-0">
              {LANGS.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLang(lang.code)}
                  title={lang.label}
                  className={`w-8 h-6 rounded overflow-hidden transition-all cursor-pointer flex-shrink-0 ${selectedLang === lang.code ? "ring-2 ring-primary-400 ring-offset-1 ring-offset-foreground-900 scale-110" : "opacity-60 hover:opacity-100"}`}
                >
                  <img src={lang.flag} alt={lang.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Story text */}
            <div className="flex-1 flex items-center">
              <p className="text-xl md:text-2xl leading-loose font-body text-foreground-100">
                {formatText(STORY.pages[currentPage].texts[selectedLang])}
              </p>
            </div>

            {/* Page dots */}
            <div className="flex items-center gap-2 flex-shrink-0 mt-8">
              {STORY.pages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToPage(idx)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${idx === currentPage ? "w-4 h-4 bg-primary-400" : "w-2.5 h-2.5 bg-foreground-700 hover:bg-foreground-500"}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Complete Popup */}
      {showCompletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-3xl bg-background-50 p-6 md:p-8 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setShowCompletePopup(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-background-200 text-foreground-500 transition-colors cursor-pointer"
            >
              <i className="ri-close-line w-5 h-5 flex items-center justify-center text-lg"></i>
            </button>

            <h2 className="font-heading text-xl md:text-2xl text-foreground-950 mb-3">
              동화 보기 완료
            </h2>
            <p className="text-sm text-foreground-600 mb-6 leading-relaxed">
              오늘 동화를 모두 읽었어요. 지금 바로 어떤 재미난 이야기들이 있었는지 확인해볼까요?
            </p>

            <div className="w-40 h-40 mx-auto rounded-3xl overflow-hidden mb-6">
              <img
                src="https://readdy.ai/api/search-image?query=Adorable%20cute%20Korean%20fairy%20tale%20rabbit%20character%20holding%20glowing%20lantern%20warm%20smile%20soft%20pastel%20illustration%20chibi%20style%20children%20book%20art%20simple%20clean%20background%20gentle%20warm%20lighting%20kawaii&width=400&height=400&seq=popup-character-v3&orientation=squarish"
                alt="동화 캐릭터"
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/create/select"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-background-200 bg-background-50 hover:bg-background-100 text-foreground-700 font-label text-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                새로운 동화 만들기
              </Link>
              <Link
                to="/report"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                놀이마당 가기
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
