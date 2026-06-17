import { useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";

const STORY = {
  title: "토끼와 별빛 숲",
  pages: [
    {
      text: "옛날옛날 한 마을의 숲 속에 할아버지가 살고 있었습니다. 할아버지는 매일 밤 숲의 친구들을 찾아 다니며 따뜻한 이야기를 나누곤 했습니다. 어느 날, 작은 토끼가 반짝이는 별빛을 따라 숲 속으로 조심스럽게 걸어왔습니다.",
      image: "https://readdy.ai/api/search-image?query=Cute%20korean%20rabbit%20character%20sitting%20under%20glowing%20starlight%20forest%20dreamy%20night%20scene%20soft%20pastel%20colors%20children%20book%20illustration%20warm%20magical%20atmosphere%20whimsical%20fairy%20tale%20art%20style%20gentle%20lighting&width=1200&height=600&seq=viewer-page-01&orientation=landscape",
    },
    {
      text: "밤하늘의 별들이 가장 밝게 빛날 때, 할아버지는 아이들을 위해 특별한 이야기를 준비합니다. 반짝이는 별빛 아래에서 작은 동물 친구들이 모두 모여 따뜻한 시간을 보냈답니다. 부엉이와 다람쥐도 자리에 앉아 이야기를 기다렸어요. 모두의 눈이 반짝이는 기대로 가득 찼답니다.",
      image: "https://readdy.ai/api/search-image?query=Beautiful%20night%20sky%20filled%20with%20twinkling%20stars%20glowing%20softly%20above%20a%20peaceful%20forest%20silhouette%20korean%20fairy%20tale%20illustration%20style%20warm%20dreamy%20pastel%20colors%20magical%20atmosphere%20children%20book%20art&width=1200&height=600&seq=viewer-page-02&orientation=landscape",
    },
    {
      text: "작은 토끼가 별빛을 따라 숲을 걸어갑니다. 반짝이는 별빛 아래에서 토끼는 새로운 친구를 만납니다. 그 친구는 하얀 털을 가진 강아지였고, 둘은 금세 따뜻한 친구가 되었습니다.",
      image: "https://readdy.ai/api/search-image?query=Warm%20korean%20fairy%20tale%20scene%20old%20wise%20grandfather%20character%20surrounded%20by%20forest%20animal%20friends%20under%20starlight%20soft%20pastel%20illustration%20children%20book%20style%20gentle%20magical%20lighting%20dreamy%20atmosphere&width=1200&height=600&seq=viewer-page-03&orientation=landscape",
    },
    {
      text: "친구들과 함께 별빛을 모아 아름다운 길을 만들었어요. 함께 하니까 더 밝게 빛났답니다. 하나둘씩 모인 별빛이 반짝이는 길을 만들어주었고, 그 길을 따라 새로운 모험이 기다리고 있었습니다. 모두가 함께라서 더 큰 별을 찾을 수 있었어요.",
      image: "https://readdy.ai/api/search-image?query=Happy%20children%20characters%20in%20korean%20hanbok%20gathering%20around%20warm%20lantern%20light%20in%20fairy%20tale%20forest%20soft%20pastel%20illustration%20style%20dreamy%20children%20book%20art%20magical%20gentle%20atmosphere&width=1200&height=600&seq=viewer-page-04&orientation=landscape",
    },
    {
      text: "할아버지는 별빛이 가장 밝은 곳에서 아이들에게 따뜻한 마음을 전해주었습니다. 그리고 말했습니다. \"서로를 도우면 더 큰 별을 발견할 수 있단다.\" 아이들은 할아버지의 말에 고개를 끄덕였어요.",
      image: "https://readdy.ai/api/search-image?query=Beautiful%20starlight%20shining%20through%20forest%20trees%20casting%20gentle%20glow%20on%20meadow%20korean%20fairy%20tale%20illustration%20style%20soft%20pastel%20colors%20dreamy%20magical%20atmosphere%20children%20book%20art&width=1200&height=600&seq=viewer-page-05&orientation=landscape",
    },
    {
      text: "토끼와 친구들은 별빛 숲에서 평생 잊지 못할 추억을 만들었어요. 서로를 도우며 더 큰 별을 발견했답니다. 이야기를 나누는 따뜻한 마음이 세상에서 가장 큰 별빛이었어요.",
      image: "https://readdy.ai/api/search-image?query=Warm%20cozy%20story%20time%20scene%20with%20korean%20fairy%20tale%20characters%20sharing%20tales%20under%20glowing%20moon%20soft%20pastel%20illustration%20style%20dreamy%20children%20book%20art%20gentle%20magical%20atmosphere&width=1200&height=600&seq=viewer-page-06&orientation=landscape",
    },
    {
      text: "과연 오늘밤의 이야기는 어떤 모험일까요? 다음 이야기를 기대해주세요! 할아버지의 이야기는 언제나 별빛처럼 반짝이고, 우리 모두의 마음속에 오래도록 따뜻하게 남아 있을 거예요.",
      image: "https://readdy.ai/api/search-image?query=Peaceful%20korean%20fairy%20tale%20ending%20scene%20with%20moon%20and%20stars%20blessing%20over%20sleeping%20forest%20soft%20pastel%20illustration%20style%20dreamy%20children%20book%20art%20warm%20magical%20gentle%20atmosphere&width=1200&height=600&seq=viewer-page-07&orientation=landscape",
    },
  ],
};

export default function StoryViewerPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [sleepMode, setSleepMode] = useState(false);
  const [listening, setListening] = useState(false);
  const [showCompletePopup, setShowCompletePopup] = useState(false);
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
      setShowCompletePopup(true);
    } else {
      goToPage(currentPage + 1);
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
            {/* Left: title + heart */}
            <div className="flex items-center gap-2">
              <h1 className={`font-heading text-lg md:text-xl transition-colors ${sleepMode ? "text-foreground-200" : "text-foreground-950"}`}>
                {STORY.title}
              </h1>
              <button
                type="button"
                onClick={() => setLiked(!liked)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${sleepMode ? "hover:bg-foreground-800" : "hover:bg-primary-50"}`}
              >
                <i className={`${liked ? "ri-heart-fill text-primary-500" : "ri-heart-line text-foreground-400"} w-5 h-5 flex items-center justify-center text-lg`}></i>
              </button>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSleepMode(!sleepMode)}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${sleepMode ? "bg-foreground-800 text-foreground-300 hover:bg-foreground-700" : "bg-background-100 text-foreground-700 border border-background-200 hover:bg-primary-50"}`}
              >
                <i className="ri-moon-line w-3.5 h-3.5 flex items-center justify-center"></i>
                취침 모드
              </button>
              <button
                type="button"
                onClick={() => setListening(!listening)}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${listening ? "bg-primary-500 text-foreground-950 dark:text-foreground-950" : sleepMode ? "bg-foreground-800 text-foreground-300 hover:bg-foreground-700" : "bg-background-100 text-foreground-700 border border-background-200 hover:bg-primary-50"}`}
              >
                <i className={`${listening ? "ri-volume-up-fill" : "ri-volume-up-line"} w-3.5 h-3.5 flex items-center justify-center`}></i>
                듣기
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${sleepMode ? "hover:bg-foreground-800 text-foreground-300" : "hover:bg-primary-50 text-foreground-700"}`}
                >
                  <i className="ri-more-fill w-5 h-5 flex items-center justify-center text-lg"></i>
                </button>
                {moreOpen && (
                  <div className={`absolute top-full right-0 mt-2 w-36 rounded-2xl border p-2 z-50 shadow-lg ${sleepMode ? "bg-foreground-900 border-foreground-800" : "bg-background-50 border-background-200"}`}>
                    <button
                      type="button"
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-label transition-colors cursor-pointer whitespace-nowrap ${sleepMode ? "text-foreground-300 hover:bg-foreground-800" : "text-foreground-800 hover:bg-primary-50"}`}
                    >
                      <i className="ri-fullscreen-line w-4 h-4 flex items-center justify-center"></i>
                      다보기
                    </button>
                    <button
                      type="button"
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-label transition-colors cursor-pointer whitespace-nowrap ${sleepMode ? "text-foreground-300 hover:bg-foreground-800" : "text-foreground-800 hover:bg-primary-50"}`}
                    >
                      <i className="ri-flashlight-line w-4 h-4 flex items-center justify-center"></i>
                      액션
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Click outside to close more menu */}
        {moreOpen && (
          <div className="fixed inset-0 z-20" onClick={() => setMoreOpen(false)}></div>
        )}

        {/* Story swiper area */}
        <div className="px-4 md:px-8 lg:px-12 pt-4">
          <div className="max-w-6xl mx-auto">
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
                    className="w-full flex-shrink-0 flex flex-col"
                  >
                    {/* Image with arrows inside */}
                    <div className="w-full aspect-[16/9] relative overflow-hidden">
                      <img
                        src={page.image}
                        alt={`${STORY.title} ${idx + 1}페이지`}
                        className="w-full h-full object-cover object-top"
                      />

                      {/* Swipe arrows (desktop) - inside image, no background */}
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentPage === 0}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center z-10 transition-all cursor-pointer ${currentPage === 0 ? "opacity-0 pointer-events-none" : sleepMode ? "text-foreground-400 hover:text-foreground-200" : "text-foreground-400 hover:text-foreground-700"}`}
                      >
                        <i className="ri-arrow-left-s-line w-8 h-8 flex items-center justify-center text-3xl"></i>
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center z-10 transition-all cursor-pointer ${isLastPage ? "opacity-0 pointer-events-none" : sleepMode ? "text-foreground-400 hover:text-foreground-200" : "text-foreground-400 hover:text-foreground-700"}`}
                      >
                        <i className="ri-arrow-right-s-line w-8 h-8 flex items-center justify-center text-3xl"></i>
                      </button>
                    </div>
                    {/* Text */}
                    <div className={`p-5 md:p-8 transition-colors ${sleepMode ? "bg-foreground-950" : "bg-background-50"}`}>
                      <p className={`text-sm leading-relaxed font-body transition-colors ${sleepMode ? "text-foreground-300" : "text-foreground-700"}`}>
                        {page.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentPage === 0}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${currentPage === 0 ? "opacity-50 pointer-events-none bg-secondary-200 text-secondary-700" : sleepMode ? "bg-foreground-800 text-foreground-300 hover:bg-foreground-700" : "bg-secondary-100 text-foreground-700 hover:bg-secondary-200 border border-secondary-200"}`}
              >
                <i className="ri-arrow-left-s-line w-4 h-4 flex items-center justify-center"></i>
                이전 페이지
              </button>

              <div className="flex items-center gap-1">
                {STORY.pages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToPage(idx)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-label transition-colors cursor-pointer ${idx === currentPage ? (sleepMode ? "bg-foreground-700 text-foreground-200" : "bg-foreground-800 text-background-50") : sleepMode ? "bg-foreground-900 text-foreground-500 hover:bg-foreground-800" : "bg-secondary-100 text-foreground-600 hover:bg-secondary-200 border border-secondary-200"}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${isLastPage ? (sleepMode ? "bg-primary-600 text-foreground-950 hover:bg-primary-500" : "bg-primary-500 text-foreground-950 dark:text-foreground-950 hover:bg-primary-600") : sleepMode ? "bg-foreground-800 text-foreground-300 hover:bg-foreground-700" : "bg-foreground-800 text-background-50 hover:bg-foreground-700"}`}
              >
                {isLastPage ? "동화 완료" : "다음 페이지"}
                <i className="ri-arrow-right-s-line w-4 h-4 flex items-center justify-center"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Popup */}
      {showCompletePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-3xl bg-background-50 p-6 md:p-8 text-center shadow-2xl">
            {/* Close button */}
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

            {/* Character image */}
            <div className="w-40 h-40 mx-auto rounded-3xl overflow-hidden mb-6">
              <img
                src="https://readdy.ai/api/search-image?query=Adorable%20cute%20Korean%20fairy%20tale%20rabbit%20character%20holding%20glowing%20lantern%20warm%20smile%20soft%20pastel%20illustration%20chibi%20style%20children%20book%20art%20simple%20clean%20background%20gentle%20warm%20lighting%20kawaii&width=400&height=400&seq=popup-character-v3&orientation=squarish"
                alt="동화 캐릭터"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Buttons */}
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
