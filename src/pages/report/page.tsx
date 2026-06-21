import { useState, useEffect, useRef } from "react";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import { getStoryById, saveAnalyticsRecord } from "@/services/library";
import { useLibrary } from "@/hooks/useLibrary";
import { getActivityData, generateActivityData, type ActivityData } from "@/services/activity";
import { getDummyThumbnail } from "@/services/dummyLookup";

/* ── 상수 ─────────────────────────────────────────────── */

const ACTIVITIES = [
  { id: "comprehension", title: "이해력 활동", subtitle: "이야기를 다시 떠올려요", tagColor: "bg-primary-100 text-primary-900", image: `${__BASE_PATH__}activity-comprehension.png` },
  { id: "emotion", title: "감정탐색", subtitle: "감정을 느끼고 표현해요", tagColor: "bg-accent-100 text-accent-900", image: `${__BASE_PATH__}activity-emotion.png` },
  { id: "creative", title: "창의력 활동", subtitle: "손으로 만들어봐요", tagColor: "bg-secondary-100 text-secondary-900", image: `${__BASE_PATH__}activity-creative.png` },
  { id: "vocabulary", title: "어휘활동", subtitle: "오늘의 말을 배워봐요", tagColor: "bg-foreground-100 text-foreground-900", image: `${__BASE_PATH__}activity-vocabulary.png` },
];

const EMOTION_OPTIONS = ["😊 기쁨", "😢 슬픔", "😮 놀람", "😰 걱정", "😌 평온", "🥰 따뜻함"];

/* ── 브레이크아웃 게임 ──────────────────────────────────── */

type Brick = { x: number; y: number; color: string; alive: boolean; points: number };

function BreakoutGame({ onExit }: { onExit: () => void }) {
  const cvs = useRef<HTMLCanvasElement>(null);
  const g = useRef({
    paddleX: 205, ballX: 250, ballY: 550, bvx: 3, bvy: -4,
    bricks: [] as Brick[],
    score: 0, lives: 3, level: 1, best: 0,
    running: false, paused: false,
    mouseX: null as number | null,
    keys: { left: false, right: false },
    raf: 0,
  });
  const [overlay, setOverlay] = useState({ show: true, title: "BREAKOUT", sub: "마우스나 방향키로 패들을 조작하세요", btn: "게임 시작" });
  const [hud, setHud] = useState({ score: 0, best: 0, level: 1, lives: "♥♥♥" });

  const W = 500, H = 600, PW = 90, PH = 12, BR = 7;
  const COLS = ["#ff6b6b", "#ffd93d", "#6efff1", "#a78bfa", "#5eead4"];

  const buildBricks = () => {
    g.current.bricks = [];
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 8; c++)
        g.current.bricks.push({ x: 18 + c * 60, y: 60 + r * 24, color: COLS[r % 5], alive: true, points: (5 - r) * 10 });
  };

  const draw = () => {
    const canvas = cvs.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const s = g.current;
    ctx.fillStyle = "#131830"; ctx.fillRect(0, 0, W, H);
    s.bricks.forEach(b => {
      if (!b.alive) return;
      ctx.fillStyle = b.color; ctx.beginPath();
      (ctx as any).roundRect(b.x, b.y, 56, 20, 4); ctx.fill();
    });
    ctx.fillStyle = "#6efff1"; ctx.beginPath();
    (ctx as any).roundRect(s.paddleX, H - 30, PW, PH, 6); ctx.fill();
    ctx.fillStyle = "#eef0fa"; ctx.beginPath();
    ctx.arc(s.ballX, s.ballY, BR, 0, Math.PI * 2); ctx.fill();
  };

  const loopRef = useRef<FrameRequestCallback>(() => {});

  const gameOver = () => {
    const s = g.current; s.running = false; cancelAnimationFrame(s.raf);
    setOverlay({ show: true, title: "게임 오버", sub: `점수: ${s.score} · 레벨 ${s.level}${s.score === s.best && s.score > 0 ? " 🏆 최고기록!" : ""}`, btn: "↻ 다시 시작" });
  };

  const levelUp = () => {
    const s = g.current; s.level++;
    s.paddleX = 205; s.ballX = 250; s.ballY = 550;
    const sp = Math.min(Math.abs(s.bvx) * 1.1, 12);
    s.bvx = s.bvx > 0 ? sp : -sp;
    s.bvy = -Math.min(Math.abs(s.bvy) * 1.1, 12);
    buildBricks();
    setHud(h => ({ ...h, level: s.level }));
  };

  const update = () => {
    const s = g.current;
    if (s.keys.left) s.paddleX -= 7;
    if (s.keys.right) s.paddleX += 7;
    if (s.mouseX !== null) s.paddleX = s.mouseX - PW / 2;
    s.paddleX = Math.max(0, Math.min(W - PW, s.paddleX));
    s.ballX += s.bvx; s.ballY += s.bvy;
    if (s.ballX < BR || s.ballX > W - BR) s.bvx = -s.bvx;
    if (s.ballY < BR) s.bvy = -s.bvy;
    if (s.ballY > H - 30 - BR && s.ballY < H - 30 + PH && s.ballX > s.paddleX && s.ballX < s.paddleX + PW) {
      s.bvy = -Math.abs(s.bvy);
      s.bvx = ((s.ballX - s.paddleX) / PW - 0.5) * 8;
    }
    if (s.ballY > H + 20) {
      s.lives--;
      setHud(h => ({ ...h, lives: "♥".repeat(Math.max(s.lives, 0)) || "–" }));
      if (s.lives <= 0) { gameOver(); return; }
      s.ballX = 250; s.ballY = H - 50; s.bvx = 3; s.bvy = -4;
    }
    for (const b of s.bricks) {
      if (!b.alive) continue;
      if (s.ballX + BR > b.x && s.ballX - BR < b.x + 56 && s.ballY + BR > b.y && s.ballY - BR < b.y + 20) {
        b.alive = false; s.score += b.points; s.bvy = -s.bvy;
        if (s.score > s.best) { s.best = s.score; localStorage.setItem("breakout-best", String(s.best)); }
        setHud(h => ({ ...h, score: s.score, best: s.best }));
        break;
      }
    }
    if (s.bricks.every(b => !b.alive)) levelUp();
  };

  loopRef.current = () => {
    if (!g.current.paused) { update(); draw(); }
    g.current.raf = requestAnimationFrame(loopRef.current);
  };

  const startGame = () => {
    const s = g.current;
    s.score = 0; s.lives = 3; s.level = 1;
    s.best = parseInt(localStorage.getItem("breakout-best") || "0", 10);
    s.paddleX = 205; s.ballX = 250; s.ballY = 550;
    s.bvx = Math.random() > 0.5 ? 3 : -3; s.bvy = -4;
    buildBricks();
    setHud({ score: 0, best: s.best, level: 1, lives: "♥♥♥" });
    setOverlay(o => ({ ...o, show: false }));
    s.running = true; s.paused = false;
    cancelAnimationFrame(s.raf);
    g.current.raf = requestAnimationFrame(loopRef.current);
  };

  const togglePause = () => {
    const s = g.current; if (!s.running) return;
    s.paused = !s.paused;
    if (s.paused) setOverlay({ show: true, title: "일시정지", sub: "스페이스 또는 버튼으로 재개", btn: "재개하기" });
    else setOverlay(o => ({ ...o, show: false }));
  };

  useEffect(() => {
    const s = g.current;
    s.best = parseInt(localStorage.getItem("breakout-best") || "0", 10);
    setHud(h => ({ ...h, best: s.best }));
    buildBricks(); draw();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { s.keys.left = true; e.preventDefault(); }
      if (e.key === "ArrowRight") { s.keys.right = true; e.preventDefault(); }
      if (e.key === " ") { e.preventDefault(); if (!s.running) startGame(); else togglePause(); }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") s.keys.left = false;
      if (e.key === "ArrowRight") s.keys.right = false;
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      cancelAnimationFrame(s.raf);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <main className="min-h-screen bg-background-100 dark:bg-background-50 text-foreground-950 flex flex-col">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />
      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12 flex-1 flex flex-col">
        <div className="px-4 md:px-8 lg:px-12 flex-1 flex flex-col">
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
            <div className="pt-6 mb-4">
              <button
                type="button"
                onClick={onExit}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-background-200 bg-background-50 hover:bg-primary-50 text-sm font-label text-foreground-700 transition-colors cursor-pointer"
              >
                <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                활동으로 돌아가기
              </button>
            </div>
            <div style={{ maxWidth: 560, margin: "0 auto", width: "100%" }}>
              {/* HUD */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {([["SCORE", hud.score], ["BEST", hud.best], ["LEVEL", hud.level], ["LIVES", hud.lives]] as [string, string | number][]).map(([label, val]) => (
                  <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: "#131830", border: "1px solid #1f2545" }}>
                    <span className="block text-[10px] tracking-widest mb-0.5" style={{ color: "#8b91b5" }}>{label}</span>
                    <b className="text-lg font-label" style={{ color: "#6efff1", fontFeatureSettings: '"tnum"' }}>{val}</b>
                  </div>
                ))}
              </div>
              {/* Canvas + overlay */}
              <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "500/600", border: "1px solid #1f2545" }}>
                <canvas
                  ref={cvs}
                  width={W}
                  height={H}
                  className="w-full h-full block"
                  style={{ cursor: "none", background: "#131830" }}
                  onMouseMove={e => {
                    const r = cvs.current!.getBoundingClientRect();
                    g.current.mouseX = ((e.clientX - r.left) / r.width) * W;
                  }}
                  onMouseLeave={() => { g.current.mouseX = null; }}
                  onTouchMove={e => {
                    e.preventDefault();
                    const r = cvs.current!.getBoundingClientRect();
                    g.current.mouseX = ((e.touches[0].clientX - r.left) / r.width) * W;
                  }}
                />
                {overlay.show && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center" style={{ background: "rgba(10,14,31,.92)" }}>
                    <h2 className="text-2xl font-label font-bold tracking-wider" style={{ color: "#eef0fa" }}>{overlay.title}</h2>
                    <p className="text-sm font-label" style={{ color: "#8b91b5" }}>{overlay.sub}</p>
                    <button
                      type="button"
                      onClick={startGame}
                      className="mt-2 px-7 py-3 rounded-full font-label font-bold text-sm cursor-pointer transition-all hover:brightness-110"
                      style={{ background: "#6efff1", color: "#0a0e1f" }}
                    >
                      {overlay.btn}
                    </button>
                  </div>
                )}
              </div>
              <p className="text-center text-xs mt-3 font-label" style={{ color: "#8b91b5" }}>← → 방향키 또는 마우스 이동 · 스페이스 일시정지</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ── 컴포넌트 ──────────────────────────────────────────── */

export default function PlaygroundPage() {
  const library = useLibrary();

  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [completedActivities, setCompletedActivities] = useState<Record<string, string[]>>(() => {
    try { const saved = localStorage.getItem("tori-playground"); return saved ? JSON.parse(saved) : {}; } catch { return {}; }
  });
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [lastCompletedTitle, setLastCompletedTitle] = useState("");
  const [showSaveResult, setShowSaveResult] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [gameView, setGameView] = useState(false);

  useEffect(() => {
    localStorage.setItem("tori-playground", JSON.stringify(completedActivities));
  }, [completedActivities]);

  const currentEntry = selectedStory ? library.find((e) => e.id === selectedStory) : null;
  const doneList = selectedStory ? (completedActivities[selectedStory] ?? []) : [];
  const allDone = doneList.length === ACTIVITIES.length;

  const enterActivity = (actId: string) => {
    setCurrentActivity(actId);
    setTextAnswer("");
    setSelectedChoice(null);
    setActivityError(null);

    if (!selectedStory) return;
    const cached = getActivityData(selectedStory);
    if (cached) {
      setActivityData(cached);
      return;
    }

    const story = getStoryById(selectedStory);
    const age = currentEntry?.age ?? 5;
    if (!story) {
      setActivityData(null);
      return;
    }

    setActivityLoading(true);
    generateActivityData(selectedStory, story, age)
      .then((data) => { setActivityData(data); setActivityLoading(false); })
      .catch((err: Error) => { setActivityError(err.message); setActivityLoading(false); });
  };

  const handleCompleteActivity = () => {
    if (!selectedStory || !currentActivity || !currentEntry) return;
    const act = ACTIVITIES.find((a) => a.id === currentActivity)!;
    setLastCompletedTitle(act.title);
    setCompletedActivities((prev) => {
      const existing = prev[selectedStory] ?? [];
      if (existing.includes(currentActivity)) return prev;
      return { ...prev, [selectedStory]: [...existing, currentActivity] };
    });

    // save analytics
    const today = new Date().toISOString().slice(0, 10);
    const existing = completedActivities[selectedStory] ?? [];
    const newCompleted = existing.includes(currentActivity) ? existing : [...existing, currentActivity];
    const vocabCount = newCompleted.includes("vocabulary") ? 6 : 0;
    saveAnalyticsRecord({
      date: today,
      storyId: selectedStory,
      storyTitle: currentEntry.title,
      emotionChoice: currentActivity === "emotion" ? (selectedChoice ?? undefined) : undefined,
      completedActivities: newCompleted,
      vocabCount,
    });

    setShowCongrats(true);
  };

  const handleCongratsClose = () => { setShowCongrats(false); setCurrentActivity(null); };

  /* ── 게임 뷰 ─────────────────────────────────────────── */
  if (gameView && selectedStory && currentEntry) {
    return <BreakoutGame onExit={() => setGameView(false)} />;
  }

  /* ── 활동 상세 뷰 ─────────────────────────────────────── */
  if (currentActivity && selectedStory && currentEntry) {
    const act = ACTIVITIES.find((a) => a.id === currentActivity)!;
    const isDone = doneList.includes(currentActivity);
    const isText = currentActivity === "comprehension" || currentActivity === "creative";
    const isEmotion = currentActivity === "emotion";
    const canSubmit = isText ? textAnswer.trim().length > 0 : selectedChoice !== null;

    const getQuestion = (): string => {
      if (!activityData) return "활동 질문을 불러오는 중...";
      if (currentActivity === "comprehension") return activityData.comprehension.question;
      if (currentActivity === "emotion") return activityData.emotion.question;
      if (currentActivity === "creative") return activityData.creative.prompt;
      if (currentActivity === "vocabulary") return "오늘 동화에서 배운 낱말 카드를 확인해보세요!";
      return "";
    };

    const getPlaceholder = (): string => {
      if (currentActivity === "comprehension") return "주인공의 마음을 상상하며 적어보세요...";
      if (currentActivity === "creative") return activityData?.creative.hint ?? "자유롭게 상상해서 적어보세요...";
      return "답변을 입력해 주세요";
    };

    const getModelAnswer = (): string | null => {
      if (!activityData) return null;
      if (currentActivity === "comprehension") return activityData.comprehension.modelAnswer;
      return null;
    };

    const [showAnswer, setShowAnswer] = useState(false);

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
                <div className="rounded-3xl overflow-hidden border border-background-200 bg-background-50 flex flex-col sm:flex-row">
                  <div className="w-full sm:w-40 aspect-[4/3] sm:aspect-auto sm:h-auto flex-shrink-0 relative overflow-hidden bg-secondary-100">
                    <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex flex-col justify-center">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-label mb-2 ${act.tagColor}`}>{act.title}</span>
                    <p className="text-sm text-foreground-600 leading-relaxed">{act.subtitle}</p>
                  </div>
                </div>

                {activityLoading ? (
                  <div className="rounded-2xl bg-background-50 border border-background-200 p-10 flex flex-col items-center gap-3">
                    <i className="ri-loader-4-line text-3xl text-primary-500 animate-spin"></i>
                    <p className="text-sm font-label text-foreground-500">Solar AI가 활동 질문을 만들고 있어요...</p>
                  </div>
                ) : activityError ? (
                  <div className="rounded-2xl bg-red-50 border border-red-200 p-5 text-center">
                    <p className="text-sm text-red-600 font-label">{activityError}</p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-background-50 border border-background-200 p-5 md:p-6">
                    <p className="font-label font-semibold text-foreground-950 mb-4 leading-relaxed">{getQuestion()}</p>

                    {/* 어휘 카드 */}
                    {currentActivity === "vocabulary" && activityData && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {activityData.vocabulary.map((card, i) => (
                          <div key={i} className="rounded-xl border border-primary-200 bg-primary-50/40 p-3">
                            <p className="font-heading text-base text-primary-700 mb-1">{card.word}</p>
                            <p className="text-xs text-foreground-600 leading-snug mb-1.5">{card.meaning}</p>
                            <p className="text-xs text-foreground-400 italic leading-snug">"{card.example}"</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 텍스트 답변 */}
                    {isText && (
                      <textarea
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        placeholder={getPlaceholder()}
                        rows={4}
                        className="w-full rounded-xl border border-background-200 bg-background-100 px-4 py-3 text-sm font-label text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none transition"
                      />
                    )}

                    {/* 감정 선택 */}
                    {isEmotion && (
                      <div className="grid grid-cols-3 gap-2">
                        {EMOTION_OPTIONS.map((opt) => (
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

                    {/* 어휘 완료 선택 버튼 */}
                    {currentActivity === "vocabulary" && activityData && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setSelectedChoice("done")}
                          className={`w-full py-3 rounded-xl border-2 text-sm font-label transition-all cursor-pointer ${selectedChoice === "done" ? "border-primary-500 bg-primary-50 text-primary-700" : "border-background-200 bg-background-100 text-foreground-700 hover:border-primary-300"}`}
                        >
                          {selectedChoice === "done" ? "✓ 낱말을 모두 확인했어요!" : "낱말 카드를 모두 확인했어요"}
                        </button>
                      </div>
                    )}

                    {/* 모범답안 */}
                    {isText && getModelAnswer() && textAnswer.trim().length > 0 && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => setShowAnswer(!showAnswer)}
                          className="text-xs text-primary-600 underline cursor-pointer font-label"
                        >
                          {showAnswer ? "모범답안 닫기" : "모범답안 확인하기"}
                        </button>
                        {showAnswer && (
                          <div className="mt-2 rounded-xl bg-primary-50 border border-primary-200 p-3">
                            <p className="text-xs font-label text-primary-800 leading-relaxed">{getModelAnswer()}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCompleteActivity}
                  disabled={!canSubmit || activityLoading}
                  className={`w-full py-3.5 rounded-xl font-label font-semibold text-sm transition-all duration-200 shadow-md ${canSubmit && !activityLoading ? "bg-gradient-to-r from-primary-500 to-amber-400 text-foreground-950 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-primary-200/50" : "bg-background-200 text-foreground-400 cursor-not-allowed"}`}
                >
                  {isDone ? "다시 제출하기" : "활동 완료"}
                </button>
              </div>
            </div>
          </div>
        </div>
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
  if (selectedStory && currentEntry) {
    return (
      <main className="min-h-screen bg-background-100 dark:bg-background-50 text-foreground-950 flex flex-col">
        <TopNav isLoggedIn={true} />
        <FoldSidebar />
        <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12 flex-1 flex flex-col">
          <div className="px-4 md:px-8 lg:px-12 flex-1 flex flex-col">
            <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">

              {/* 헤더: 동화목록으로 · 제목 · 저장버튼 동일 선상 */}
              <div className="pt-6 mb-5">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedStory(null)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-background-200 bg-background-50 hover:bg-primary-50 text-sm font-label text-foreground-700 transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                  >
                    <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                    동화 목록으로
                  </button>
                  <h1 className="font-heading text-lg md:text-2xl font-bold text-foreground-950 text-center flex-1 min-w-0 line-clamp-1">
                    {currentEntry.title}
                  </h1>
                  <button
                    type="button"
                    onClick={() => setShowSaveResult(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white text-sm font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95 shadow-md shadow-rose-200/60 flex-shrink-0"
                  >
                    🌟 저장하고 홈으로
                  </button>
                </div>
              </div>

              {/* 활동 카드 */}
              <div className="flex-1 flex flex-col items-center justify-center">
                {/* 전체 완료 배너 */}
                {allDone && (
                  <div className="w-full mb-5 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-primary-50 border border-emerald-200 text-sm font-label text-emerald-700 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <i className="ri-trophy-line text-amber-500 text-base"></i>
                      모든 활동을 완료했어요! 이제 신나는 게임을 통해 머리를 식혀봐요 🎮
                    </span>
                    <button
                      type="button"
                      onClick={() => setGameView(true)}
                      className="flex-shrink-0 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-primary-500 text-foreground-950 text-xs font-label font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
                    >
                      🎮 게임 시작하기
                    </button>
                  </div>
                )}
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

            {library.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-foreground-400">
                <i className="ri-quill-pen-line text-5xl mb-4"></i>
                <p className="text-base font-label mb-2">아직 만든 동화가 없어요</p>
                <p className="text-sm mb-5">동화를 먼저 만들고 독후활동을 시작해보세요!</p>
                <a href="/create" className="px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-foreground-950 text-sm font-label transition-colors cursor-pointer">
                  동화 만들기
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {library.map((entry) => {
                  const doneCount = (completedActivities[entry.id] ?? []).length;
                  const allStoreDone = doneCount === ACTIVITIES.length;
                  const inProgress = doneCount > 0 && !allStoreDone;
                  return (
                    <div
                      key={entry.id}
                      className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 overflow-hidden flex flex-col"
                    >
                      <div className="w-full aspect-[4/3] relative overflow-hidden bg-secondary-50 flex items-center justify-center">
                        {(() => {
                          const src = entry.image || getDummyThumbnail(entry.title);
                          return src ? (
                            <img src={src} alt={entry.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary-50">
                              <i className="ri-book-open-line text-3xl text-primary-300"></i>
                            </div>
                          );
                        })()}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-background-50/95 backdrop-blur text-xs font-label text-foreground-900 whitespace-nowrap">
                          {entry.tag}
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
                          {entry.title}
                        </h3>
                        <p className="text-xs text-foreground-500 leading-relaxed flex-1">
                          {entry.tag} 관련 어휘와 감정을 탐색해요
                        </p>
                        {doneCount > 0 && (
                          <div className="flex items-center gap-1.5">
                            {ACTIVITIES.map((act) => (
                              <div
                                key={act.id}
                                className={`w-2 h-2 rounded-full transition-colors ${(completedActivities[entry.id] ?? []).includes(act.id) ? "bg-emerald-500" : "bg-background-200"}`}
                              />
                            ))}
                            <span className="text-xs text-foreground-400 ml-0.5">{doneCount}/4 완료</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedStory(entry.id)}
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
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
