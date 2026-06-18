import { useState, useEffect } from "react";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import { RECENT_STORIES } from "@/mocks/bookshelf";

/* ── 상수 ─────────────────────────────────────────────── */

const ACTIVITIES = [
  {
    id: "comprehension",
    title: "이해력 활동",
    subtitle: "이야기를 다시 떠올려요",
    tagColor: "bg-primary-100 text-primary-900",
    image: `${__BASE_PATH__}activity-comprehension.png`,
  },
  {
    id: "emotion",
    title: "감정탐색",
    subtitle: "감정을 느끼고 표현해요",
    tagColor: "bg-accent-100 text-accent-900",
    image: `${__BASE_PATH__}activity-emotion.png`,
  },
  {
    id: "creative",
    title: "창의력 활동",
    subtitle: "손으로 만들어봐요",
    tagColor: "bg-secondary-100 text-secondary-900",
    image: `${__BASE_PATH__}activity-creative.png`,
  },
  {
    id: "vocabulary",
    title: "어휘활동",
    subtitle: "오늘의 말을 배워봐요",
    tagColor: "bg-foreground-100 text-foreground-900",
    image: `${__BASE_PATH__}activity-vocabulary.png`,
  },
];

const STORY_DESCRIPTIONS: Record<string, string> = {
  "s-001": "도깨비와 함께 용기의 의미를 배우고 어휘를 탐험해요",
  "s-002": "호랑이 친구와 우정의 소중함을 느끼며 낱말을 익혀요",
  "s-003": "설날 밤의 따뜻한 가족 이야기로 감정을 표현해요",
  "s-004": "제주 바다에서 자연의 신비를 담은 낱말을 배워요",
  "s-005": "탈춤 속 지혜로운 토끼의 이야기로 창의력을 키워요",
  "s-006": "별빛과 한복 속 우리 문화의 아름다운 말을 찾아요",
};

type ActivityContent =
  | { type: "text"; intro: string; question: string; placeholder: string }
  | { type: "emotion"; intro: string; question: string; options: string[] }
  | { type: "choice"; intro: string; question: string; options: string[] };

const ACTIVITY_CONTENT: Record<string, ActivityContent> = {
  comprehension: {
    type: "text",
    intro: "동화 속 이야기를 얼마나 잘 이해했는지 확인해봐요!",
    question: "주인공이 이야기 속에서 가장 어려웠던 순간은 언제였나요? 자유롭게 적어보세요.",
    placeholder: "주인공의 마음을 상상하며 적어보세요...",
  },
  emotion: {
    type: "emotion",
    intro: "이야기를 읽으며 느낀 감정을 탐색해봐요!",
    question: "이 이야기를 읽고 어떤 감정이 가장 크게 느껴졌나요?",
    options: ["😊 기쁨", "😢 슬픔", "😮 놀람", "😰 걱정", "😌 평온", "🥰 따뜻함"],
  },
  creative: {
    type: "text",
    intro: "상상력을 마음껏 발휘해봐요!",
    question: "이야기의 결말을 나만의 방식으로 바꿔본다면 어떻게 될까요?",
    placeholder: "어떤 결말이면 좋을지 상상해서 적어보세요...",
  },
  vocabulary: {
    type: "choice",
    intro: "오늘 동화에서 배운 낱말을 기억해봐요!",
    question: "다음 중 주인공이 가장 많이 보여준 모습과 어울리는 낱말을 골라보세요.",
    options: ["🦁 용기", "🤝 우정", "⭐ 지혜", "🌱 노력"],
  },
};

const GAME_QUESTIONS = [
  {
    definition: "어려운 일도 두려워하지 않고 씩씩하게 해내는 마음",
    options: ["용기", "나태", "걱정", "슬픔"],
    correct: "용기",
  },
  {
    definition: "친구 사이의 따뜻하고 진실된 마음",
    options: ["경쟁", "우정", "외로움", "미움"],
    correct: "우정",
  },
  {
    definition: "사물의 이치를 빨리 깨닫고 올바르게 처리하는 능력",
    options: ["욕심", "게으름", "지혜", "거짓"],
    correct: "지혜",
  },
  {
    definition: "위험을 무릅쓰고 어떤 일을 하거나 어떤 곳을 탐험하는 것",
    options: ["모험", "안전", "휴식", "포기"],
    correct: "모험",
  },
];

/* ── 컴포넌트 ──────────────────────────────────────────── */

export default function PlaygroundPage() {
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [completedActivities, setCompletedActivities] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem("tori-playground");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [showCongrats, setShowCongrats] = useState(false);
  const [lastCompletedTitle, setLastCompletedTitle] = useState("");
  const [showSaveResult, setShowSaveResult] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [gameView, setGameView] = useState(false);
  const [gameStep, setGameStep] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [gamePicked, setGamePicked] = useState<string | null>(null);
  const [gameDone, setGameDone] = useState(false);

  useEffect(() => {
    localStorage.setItem("tori-playground", JSON.stringify(completedActivities));
  }, [completedActivities]);

  const currentStory = selectedStory ? RECENT_STORIES.find((s) => s.id === selectedStory) : null;
  const doneList = selectedStory ? (completedActivities[selectedStory] ?? []) : [];
  const allDone = doneList.length === ACTIVITIES.length;

  const enterActivity = (actId: string) => {
    setCurrentActivity(actId);
    setTextAnswer("");
    setSelectedChoice(null);
  };

  const handleCompleteActivity = () => {
    if (!selectedStory || !currentActivity) return;
    const act = ACTIVITIES.find((a) => a.id === currentActivity)!;
    setLastCompletedTitle(act.title);
    setCompletedActivities((prev) => {
      const existing = prev[selectedStory] ?? [];
      if (existing.includes(currentActivity)) return prev;
      return { ...prev, [selectedStory]: [...existing, currentActivity] };
    });
    setShowCongrats(true);
  };

  const handleCongratsClose = () => {
    setShowCongrats(false);
    setCurrentActivity(null);
  };

  const handleGameAnswer = (option: string) => {
    if (gamePicked) return;
    setGamePicked(option);
    if (option === GAME_QUESTIONS[gameStep].correct) {
      setGameScore((s) => s + 1);
    }
  };

  const handleGameNext = () => {
    if (gameStep < GAME_QUESTIONS.length - 1) {
      setGameStep((s) => s + 1);
      setGamePicked(null);
    } else {
      setGameDone(true);
    }
  };

  const resetGame = () => {
    setGameStep(0);
    setGameScore(0);
    setGamePicked(null);
    setGameDone(false);
  };

  /* ── 게임 뷰 ─────────────────────────────────────────── */
  if (gameView && selectedStory && currentStory) {
    const q = GAME_QUESTIONS[gameStep];
    return (
      <main className="min-h-screen bg-background-100 dark:bg-background-50 text-foreground-950 flex flex-col">
        <TopNav isLoggedIn={true} />
        <FoldSidebar />
        <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12 flex-1 flex flex-col">
          <div className="px-4 md:px-8 lg:px-12 flex-1 flex flex-col">
            <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
              <div className="pt-6 mb-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setGameView(false); resetGame(); }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-background-200 bg-background-50 hover:bg-primary-50 text-sm font-label text-foreground-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                  활동으로 돌아가기
                </button>
                <span className="text-xs font-label text-foreground-400">
                  {gameStep + 1} / {GAME_QUESTIONS.length}
                </span>
              </div>

              {gameDone ? (
                /* 게임 완료 화면 */
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
                  <div className="text-6xl animate-bounce">🏆</div>
                  <div>
                    <h2 className="font-heading text-2xl md:text-3xl text-foreground-950 mb-2">
                      게임 완료!
                    </h2>
                    <p className="text-foreground-500 text-sm">
                      {GAME_QUESTIONS.length}문제 중 <span className="font-semibold text-primary-600">{gameScore}개</span> 정답이에요
                    </p>
                  </div>
                  <div className={`px-6 py-4 rounded-2xl text-sm font-label ${gameScore === GAME_QUESTIONS.length ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : gameScore >= 2 ? "bg-primary-50 text-primary-700 border border-primary-200" : "bg-background-100 text-foreground-600 border border-background-200"}`}>
                    {gameScore === GAME_QUESTIONS.length
                      ? "🌟 완벽해요! 모든 낱말을 다 알고 있군요!"
                      : gameScore >= 2
                        ? "잘했어요! 조금 더 연습하면 완벽해질 거예요."
                        : "괜찮아요! 동화를 다시 읽으면서 낱말을 익혀봐요."}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetGame}
                      className="px-6 py-2.5 rounded-xl border border-background-200 bg-background-50 hover:bg-background-100 text-sm font-label text-foreground-700 transition-colors cursor-pointer"
                    >
                      다시 도전하기
                    </button>
                    <button
                      type="button"
                      onClick={() => { setGameView(false); resetGame(); }}
                      className="px-6 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-foreground-950 text-sm font-label font-semibold transition-colors cursor-pointer"
                    >
                      활동으로 돌아가기
                    </button>
                  </div>
                </div>
              ) : (
                /* 퀴즈 화면 */
                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                  <div className="w-full rounded-3xl bg-gradient-to-br from-primary-50 to-amber-50 border border-primary-100 p-6 md:p-8 text-center">
                    <p className="text-xs font-label text-foreground-400 mb-3">낱말의 뜻을 보고 알맞은 낱말을 골라보세요</p>
                    <p className="text-lg md:text-xl font-label font-semibold text-foreground-950 leading-relaxed">
                      "{q.definition}"
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {q.options.map((opt) => {
                      const isCorrect = opt === q.correct;
                      const isPicked = opt === gamePicked;
                      let cls = "rounded-2xl border-2 py-4 text-base font-label font-semibold transition-all cursor-pointer ";
                      if (!gamePicked) {
                        cls += "border-background-200 bg-background-50 hover:border-primary-400 hover:bg-primary-50 text-foreground-800";
                      } else if (isPicked && isCorrect) {
                        cls += "border-emerald-400 bg-emerald-50 text-emerald-700";
                      } else if (isPicked && !isCorrect) {
                        cls += "border-rose-400 bg-rose-50 text-rose-700";
                      } else if (isCorrect) {
                        cls += "border-emerald-400 bg-emerald-50 text-emerald-700";
                      } else {
                        cls += "border-background-200 bg-background-100 text-foreground-400";
                      }
                      return (
                        <button key={opt} type="button" onClick={() => handleGameAnswer(opt)} className={cls}>
                          {gamePicked && isCorrect && "✓ "}{opt}
                        </button>
                      );
                    })}
                  </div>
                  {gamePicked && (
                    <button
                      type="button"
                      onClick={handleGameNext}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-amber-400 text-foreground-950 font-label font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer"
                    >
                      {gameStep < GAME_QUESTIONS.length - 1 ? "다음 문제" : "결과 보기"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── 활동 상세 뷰 ─────────────────────────────────────── */
  if (currentActivity && selectedStory && currentStory) {
    const act = ACTIVITIES.find((a) => a.id === currentActivity)!;
    const content = ACTIVITY_CONTENT[currentActivity];
    const isDone = doneList.includes(currentActivity);
    const canSubmit =
      content.type === "text"
        ? textAnswer.trim().length > 0
        : selectedChoice !== null;

    return (
      <main className="min-h-screen bg-background-100 dark:bg-background-50 text-foreground-950 flex flex-col">
        <TopNav isLoggedIn={true} />
        <FoldSidebar />

        <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12 flex-1 flex flex-col">
          <div className="px-4 md:px-8 lg:px-12 flex-1 flex flex-col">
            <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">

              {/* 헤더 */}
              <div className="pt-6 mb-6 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentActivity(null)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-background-200 bg-background-50 hover:bg-primary-50 text-sm font-label text-foreground-700 transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                  활동 목록으로
                </button>
                {isDone && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-label">
                    <i className="ri-check-double-line"></i>완료된 활동
                  </span>
                )}
              </div>

              {/* 활동 카드 */}
              <div className="flex-1 flex flex-col gap-5">
                {/* 이미지 + 타이틀 */}
                <div className="rounded-3xl overflow-hidden border border-background-200 bg-background-50 flex flex-col sm:flex-row">
                  <div className="w-full sm:w-40 aspect-[4/3] sm:aspect-auto sm:h-auto flex-shrink-0 relative overflow-hidden bg-secondary-100">
                    <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex flex-col justify-center">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-label mb-2 ${act.tagColor}`}>
                      {act.title}
                    </span>
                    <p className="text-sm text-foreground-600 leading-relaxed">{content.intro}</p>
                  </div>
                </div>

                {/* 질문 */}
                <div className="rounded-2xl bg-background-50 border border-background-200 p-5 md:p-6">
                  <p className="font-label font-semibold text-foreground-950 mb-4 leading-relaxed">
                    {content.question}
                  </p>

                  {content.type === "text" && (
                    <textarea
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder={content.placeholder}
                      rows={4}
                      className="w-full rounded-xl border border-background-200 bg-background-100 px-4 py-3 text-sm font-label text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none transition"
                    />
                  )}

                  {content.type === "emotion" && (
                    <div className="grid grid-cols-3 gap-2">
                      {content.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedChoice(opt)}
                          className={`py-3 rounded-xl border-2 text-sm font-label transition-all cursor-pointer hover:scale-105 active:scale-95 ${selectedChoice === opt ? "border-primary-500 bg-primary-50 text-primary-700 font-semibold" : "border-background-200 bg-background-100 text-foreground-700 hover:border-primary-300"}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {content.type === "choice" && (
                    <div className="grid grid-cols-2 gap-3">
                      {content.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedChoice(opt)}
                          className={`py-4 rounded-2xl border-2 text-base font-label font-semibold transition-all cursor-pointer hover:scale-105 active:scale-95 ${selectedChoice === opt ? "border-primary-500 bg-primary-50 text-primary-700" : "border-background-200 bg-background-100 text-foreground-800 hover:border-primary-300"}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 완료 버튼 */}
                <button
                  type="button"
                  onClick={handleCompleteActivity}
                  disabled={!canSubmit}
                  className={`w-full py-3.5 rounded-xl font-label font-semibold text-sm transition-all duration-200 shadow-md ${canSubmit ? "bg-gradient-to-r from-primary-500 to-amber-400 text-foreground-950 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-primary-200/50" : "bg-background-200 text-foreground-400 cursor-not-allowed"}`}
                >
                  {isDone ? "다시 제출하기" : "활동 완료"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 축하 모달 */}
        {showCongrats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-950/50 backdrop-blur-sm px-4">
            <div className="w-full max-w-sm rounded-3xl bg-background-50 p-7 shadow-2xl text-center border border-background-200">
              <div className="text-5xl mb-4 animate-bounce">🎉</div>
              <h2 className="font-heading text-xl text-foreground-950 mb-2">축하합니다!</h2>
              <p className="text-sm text-foreground-600 leading-relaxed mb-6">
                <span className="font-semibold text-primary-600">{lastCompletedTitle}</span>을 완료했습니다!<br />
                정말 잘했어요 ✨
              </p>
              <button
                type="button"
                onClick={handleCongratsClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-amber-400 text-foreground-950 font-label font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </main>
    );
  }

  /* ── 4가지 활동 카드 뷰 ───────────────────────────────── */
  if (selectedStory && currentStory) {
    return (
      <main className="min-h-screen bg-background-100 dark:bg-background-50 text-foreground-950 flex flex-col">
        <TopNav isLoggedIn={true} />
        <FoldSidebar />

        <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12 flex-1 flex flex-col">
          <div className="px-4 md:px-8 lg:px-12 flex-1 flex flex-col">
            <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">

              {/* 헤더 */}
              <div className="pt-6 mb-8">
                {/* 뒤로가기 */}
                <button
                  type="button"
                  onClick={() => setSelectedStory(null)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-background-200 bg-background-50 hover:bg-primary-50 text-sm font-label text-foreground-700 transition-colors cursor-pointer whitespace-nowrap mb-6"
                >
                  <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                  동화 목록으로
                </button>

                {/* 태그 + 저장 버튼 row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-400 text-white text-xs font-label font-semibold shadow-sm">
                    <i className="ri-gamepad-line text-xs"></i>
                    토리 동화 놀이마당
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSaveResult(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white text-sm font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95 shadow-md shadow-rose-200/60"
                  >
                    🌟 놀이결과 저장하고 홈으로
                  </button>
                </div>

                {/* 중앙 정렬 제목 */}
                <h1 className="font-heading text-2xl md:text-4xl font-bold text-foreground-950 leading-snug text-center mb-5">
                  {currentStory.title}
                </h1>

                {/* 전체 완료 배너 */}
                {allDone && (
                  <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-primary-50 border border-emerald-200 text-sm font-label text-emerald-700 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <i className="ri-trophy-line text-amber-500 text-base"></i>
                      모든 활동을 완료했어요! 이제 낱말 게임에 도전해봐요 🎮
                    </span>
                    <button
                      type="button"
                      onClick={() => { resetGame(); setGameView(true); }}
                      className="flex-shrink-0 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-primary-500 text-foreground-950 text-xs font-label font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                    >
                      🎮 게임 시작하기
                    </button>
                  </div>
                )}
              </div>

              {/* 활동 카드 */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-7 w-full">
                  {ACTIVITIES.map((act) => {
                    const isDone = doneList.includes(act.id);
                    return (
                      <div
                        key={act.id}
                        className={`flex flex-col rounded-2xl border overflow-hidden transition-all ${isDone ? "border-emerald-300 ring-2 ring-emerald-200" : "border-background-200 dark:border-background-300 hover:border-primary-300"}`}
                      >
                        <div className="w-full aspect-[2/3] bg-secondary-100 relative overflow-hidden">
                          <img
                            src={act.image}
                            alt={act.title}
                            className={`w-full h-full object-cover transition-all duration-300 ${isDone ? "brightness-75" : ""}`}
                          />
                          {isDone && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-24 h-24 rounded-full border-[3px] border-emerald-400 bg-white/85 flex flex-col items-center justify-center rotate-[-12deg] shadow-lg">
                                <i className="ri-check-double-line text-emerald-500 text-3xl leading-none"></i>
                                <span className="text-emerald-600 text-[11px] font-bold tracking-widest mt-0.5">완료</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col gap-2.5 bg-background-50 dark:bg-background-100">
                          <div className="text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-label dark:text-foreground-950 ${act.tagColor}`}>
                              {act.title}
                            </span>
                            <p className="text-xs text-foreground-500 mt-1.5">{act.subtitle}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => enterActivity(act.id)}
                            className={`w-full py-2.5 rounded-xl text-xs font-label font-semibold transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95 ${isDone ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100" : "bg-primary-100 text-primary-700 hover:bg-primary-200 border border-primary-200"}`}
                          >
                            {isDone ? "✓ 다시 하기" : "활동 시작하기"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 놀이결과 저장 모달 */}
        {showSaveResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-950/50 backdrop-blur-sm px-4">
            <div className="w-full max-w-sm rounded-3xl bg-background-50 p-7 shadow-2xl text-center border border-background-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <i className="ri-shield-check-line text-emerald-600 text-2xl"></i>
              </div>
              <h2 className="font-heading text-lg text-foreground-950 mb-2">전송 완료!</h2>
              <p className="text-sm text-foreground-600 leading-relaxed mb-6">
                놀이 결과가 <span className="font-semibold text-emerald-600">부모 안심 대시보드</span>로<br />
                실시간 전달되었습니다 ✅
              </p>
              <button
                type="button"
                onClick={() => { setShowSaveResult(false); setSelectedStory(null); }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-amber-400 text-foreground-950 font-label font-semibold text-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-md"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </main>
    );
  }

  /* ── 동화 목록 뷰 ─────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-background-100 dark:bg-background-50 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12">
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-5xl mx-auto">

            <div className="pt-8 mb-10 text-center">
              <h1 className="font-heading text-3xl md:text-4xl text-foreground-950 mb-3">
                토리 동화 놀이마당
              </h1>
              <p className="text-sm md:text-base text-foreground-500 leading-relaxed">
                책을 읽은 뒤 낱말 복습 게임과 마음 칭찬 퀴즈를 풀며<br className="hidden sm:block" />
                어휘력을 재미있게 완성해 보세요!
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {RECENT_STORIES.map((story) => {
                const doneCount = (completedActivities[story.id] ?? []).length;
                const allStoreDone = doneCount === ACTIVITIES.length;
                const inProgress = doneCount > 0 && !allStoreDone;

                return (
                  <div
                    key={story.id}
                    className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 overflow-hidden flex flex-col"
                  >
                    <div className="w-full aspect-[4/3] relative overflow-hidden bg-secondary-50 flex items-center justify-center">
                      <img
                        src={story.image}
                        alt={story.title}
                        className={`w-full h-full ${story.id === "s-006" ? "object-contain" : "object-cover"}`}
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-background-50/95 backdrop-blur text-xs font-label text-foreground-900 whitespace-nowrap">
                        {story.tag}
                      </span>
                      {allStoreDone && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-label whitespace-nowrap">
                          🎉 완료
                        </span>
                      )}
                      {inProgress && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-primary-500 text-foreground-950 text-xs font-label whitespace-nowrap">
                          {doneCount}/4
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1 gap-2">
                      <h3 className="text-sm font-label font-semibold text-foreground-950 line-clamp-2 leading-snug">
                        {story.title}
                      </h3>
                      <p className="text-xs text-foreground-500 leading-relaxed flex-1">
                        {STORY_DESCRIPTIONS[story.id]}
                      </p>
                      {doneCount > 0 && (
                        <div className="flex items-center gap-1.5">
                          {ACTIVITIES.map((act) => (
                            <div
                              key={act.id}
                              className={`w-2 h-2 rounded-full transition-colors ${(completedActivities[story.id] ?? []).includes(act.id) ? "bg-emerald-500" : "bg-background-200"}`}
                            />
                          ))}
                          <span className="text-xs text-foreground-400 ml-0.5">{doneCount}/4 완료</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedStory(story.id)}
                        className={`w-full py-2.5 rounded-xl text-xs font-label font-semibold transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95 shadow-sm ${
                          allStoreDone
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : inProgress
                              ? "bg-gradient-to-r from-primary-400 to-primary-500 text-foreground-950 hover:from-primary-500 hover:to-primary-600 shadow-primary-200"
                              : "bg-gradient-to-r from-primary-500 to-amber-400 text-foreground-950 hover:from-primary-600 hover:to-amber-500 shadow-primary-200"
                        }`}
                      >
                        {allStoreDone ? "🏆 모두 완료!" : inProgress ? "놀이터 이어가기" : "퀴즈 놀이터 입장"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
