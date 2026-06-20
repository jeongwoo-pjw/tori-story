import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import { generateStory, STORY_REQUEST_KEY, STORY_RESULT_KEY } from "@/services/solar";
import { addToLibrary } from "@/services/library";

const SAFETY_CHECKS = [
  { id: "expression", label: "부적절한 표현 감지" },
  { id: "violence", label: "폭력성 요소 검사" },
  { id: "adult", label: "성인 콘텐츠 검사" },
  { id: "privacy", label: "개인정보 보호 검사" },
  { id: "copyright", label: "저작권 검사" },
];

const GENERATION_STEPS = [
  "이야기를 상상하고 있어요",
  "두근두근한 이야기를 쓰고 있어요",
  "책장을 넘기고 있어요",
  "어떤 캐릭터가 등장할까요?",
  "함께 나눌 이야기를 생각하고 있어요",
  "궁궐을 열고 동화세계로 환영할게요",
];

const PROGRESS_IMAGES = [
  "https://readdy.ai/api/search-image?query=Rough%20pencil%20sketch%20of%20cute%20Korean%20rabbit%20character%20in%20fairy%20tale%20forest%20with%20glowing%20lanterns%20simple%20outline%20drawing%20sketchy%20loose%20pencil%20lines%20on%20white%20paper%20children%20book%20concept%20art%20rough%20draft%20minimal%20lines&width=800&height=500&seq=progress-sketch-v3&orientation=landscape",
  "https://readdy.ai/api/search-image?query=Clean%20line%20art%20ink%20drawing%20of%20cute%20Korean%20rabbit%20in%20fairy%20tale%20forest%20with%20lanterns%20crisp%20black%20outlines%20white%20background%20no%20color%20children%20book%20illustration%20linework%20detailed%20clean%20strokes&width=800&height=500&seq=progress-lineart-v3&orientation=landscape",
  "https://readdy.ai/api/search-image?query=Flat%20color%20illustration%20of%20cute%20Korean%20rabbit%20in%20magical%20fairy%20tale%20forest%20with%20lanterns%20simple%20solid%20pastel%20colors%20no%20shading%20basic%20coloring%20children%20book%20style%20warm%20tones%20clean%20shapes&width=800&height=500&seq=progress-flat-v3&orientation=landscape",
  "https://readdy.ai/api/search-image?query=Cute%20Korean%20rabbit%20fairy%20tale%20illustration%20with%20basic%20cel%20shading%20simple%20soft%20shadows%20gentle%20lighting%20warm%20pastel%20colors%20magical%20forest%20scene%20with%20lanterns%20children%20book%20art%20in%20progress&width=800&height=500&seq=progress-shading-v3&orientation=landscape",
  "https://readdy.ai/api/search-image?query=Almost%20complete%20Korean%20fairy%20tale%20illustration%20cute%20rabbit%20in%20magical%20forest%20with%20glowing%20lanterns%20detailed%20shading%20rich%20warm%20colors%20nearly%20finished%20children%20book%20art%20soft%20dreamy%20atmosphere%20polished&width=800&height=500&seq=progress-detail-v3&orientation=landscape",
  "https://readdy.ai/api/search-image?query=Complete%20beautiful%20Korean%20fairy%20tale%20illustration%20cute%20rabbit%20in%20magical%20starlight%20forest%20with%20warm%20glowing%20lanterns%20soft%20pastel%20colors%20fully%20rendered%20polished%20children%20book%20art%20dreamy%20whimsical%20final%20version&width=800&height=500&seq=progress-final-v3&orientation=landscape",
];

export default function CreateProgressPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const raw = localStorage.getItem(STORY_REQUEST_KEY);
    if (!raw) {
      setError("동화 설정 정보를 찾을 수 없습니다. 처음부터 다시 시도해주세요.");
      return;
    }

    const request = JSON.parse(raw);

    // 가짜 진행률: 0% → 88% 까지 천천히 올림 (실제 API 응답 전까지)
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return 88;
        return prev + Math.random() * 2;
      });
    }, 400);

    generateStory(request)
      .then((story) => {
        clearInterval(timer);
        localStorage.setItem(STORY_RESULT_KEY, JSON.stringify(story));
        const entry = addToLibrary(story, request);
        setCurrentId(entry.id);
        setProgress(100);
        setDone(true);
      })
      .catch((err: Error) => {
        clearInterval(timer);
        setError(err.message);
      });

    return () => clearInterval(timer);
  }, []);

  const stepIdx = Math.min(
    Math.floor((progress / 100) * GENERATION_STEPS.length),
    GENERATION_STEPS.length - 1
  );
  const completedLanterns = Math.floor((progress / 100) * 6);
  const completedChecks = Math.floor((progress / 100) * SAFETY_CHECKS.length);
  const imageStage = Math.min(
    Math.floor((progress / 100) * PROGRESS_IMAGES.length),
    PROGRESS_IMAGES.length - 1
  );

  return (
    <main className="min-h-screen bg-background-100 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12">
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Sticky header */}
            <div className="sticky top-14 md:top-16 z-30 bg-background-100/95 backdrop-blur border-b border-background-200/70 py-4 mb-8 -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12">
              <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <h1 className="font-heading text-2xl md:text-3xl text-foreground-950 shrink-0">
                  동화 생성 중
                </h1>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-background-200 bg-background-50 hover:bg-primary-50 text-sm font-label text-foreground-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                  홈 화면 돌아가기
                </Link>
              </div>
            </div>

            {/* Error state */}
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-6 mb-6 text-center">
                <p className="text-red-700 font-label text-sm mb-4">{error}</p>
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-foreground-950 font-label text-sm transition-colors cursor-pointer"
                >
                  다시 시도하기
                </Link>
              </div>
            )}

            {!error && (
              <>
                {/* Progress text */}
                <div className="text-center mb-6">
                  <p className="text-sm text-foreground-500 mb-1">
                    {done ? "동화가 완성되었어요!" : `${GENERATION_STEPS[stepIdx]}...`}
                  </p>
                  <p className="text-3xl md:text-4xl font-heading text-primary-500">
                    {Math.floor(progress)}%
                  </p>
                </div>

                {/* Lanterns */}
                <div className="flex items-center justify-center gap-2 md:gap-4 mb-8">
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const filled = i < completedLanterns;
                    const current = i === completedLanterns && progress < 100;
                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div
                          className={`relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                            filled
                              ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                              : current
                              ? "bg-primary-200 text-primary-600 animate-pulse"
                              : "bg-secondary-200 text-secondary-500"
                          }`}
                        >
                          <i className="ri-fire-fill w-5 h-5 flex items-center justify-center text-sm md:text-base"></i>
                        </div>
                        <span
                          className={`text-xs font-label whitespace-nowrap ${
                            filled
                              ? "text-primary-600"
                              : current
                              ? "text-primary-500"
                              : "text-secondary-500"
                          }`}
                        >
                          {filled ? "완료" : current ? "진행중" : "대기"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Image */}
                <div className="relative rounded-3xl overflow-hidden mb-8">
                  <div className="w-full aspect-[4/3] md:aspect-[16/10] relative">
                    <img
                      src={PROGRESS_IMAGES[imageStage]}
                      alt="동화 생성 중"
                      className="w-full h-full object-cover object-top"
                    />
                    {!done && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-white/60 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Safety filter */}
                <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6 mb-6">
                  <h3 className="font-heading text-base md:text-lg text-foreground-950 mb-4">
                    안전 필터 결과
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {SAFETY_CHECKS.map((check, i) => {
                      const isDone = i < completedChecks;
                      return (
                        <div
                          key={check.id}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-500 ${
                            isDone
                              ? "bg-primary-100/60 border border-primary-200/50"
                              : "bg-background-100 border border-background-200/50"
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                              isDone
                                ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                                : "bg-background-200 text-foreground-400"
                            }`}
                          >
                            {isDone ? (
                              <i className="ri-check-line w-3 h-3 flex items-center justify-center text-xs"></i>
                            ) : (
                              <i className="ri-loader-2-line w-3 h-3 flex items-center justify-center text-xs animate-spin"></i>
                            )}
                          </span>
                          <span
                            className={`text-sm font-label transition-colors duration-500 ${
                              isDone ? "text-primary-700" : "text-foreground-500"
                            }`}
                          >
                            {check.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(currentId ? `/viewer?id=${currentId}` : "/viewer")}
                    disabled={!done}
                    className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-label text-sm transition-all whitespace-nowrap cursor-pointer ${
                      done
                        ? "bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950"
                        : "bg-secondary-200 text-secondary-500 cursor-not-allowed"
                    }`}
                  >
                    {done ? "동화 뷰어로 이동" : "생성 중..."}
                    <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
