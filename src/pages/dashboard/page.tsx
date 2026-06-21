import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import {
  CHILD_PROFILE,
  READING_REPORT,
  NOTIFICATIONS,
  FOCUS_SETTINGS,
} from "@/mocks/dashboard";
import {
  getLibrary,
  getAnalytics,
  computeVocabGrowth,
  computeEmotionDistribution,
  computeReadingHistory,
  computeWeeklyStats,
  computeMonthlyStats,
  computeReadingStreak,
  getCachedDashboardAnalysis,
  setCachedDashboardAnalysis,
} from "@/services/library";
import { analyzeChildData, type DashboardAnalysis } from "@/services/solar";

const MOCK_EMOTION_DIST = [
  { label: "기쁨",   value: 60 },
  { label: "따뜻함", value: 25 },
  { label: "평온",   value: 15 },
];

function firstEmoji(str: string): string {
  if (!str) return "📖";
  try {
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return [...seg.segment(str)][0]?.segment ?? str[0] ?? "📖";
  } catch {
    return str[0] ?? "📖";
  }
}

export default function DashboardPage() {
  const [animHeights, setAnimHeights] = useState<number[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showChildDropdown, setShowChildDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("이번 주");

  const library = useMemo(() => getLibrary(), []);
  const { weeklyCompleted, weeklyVocab } = useMemo(() => computeWeeklyStats(), []);
  const streak = useMemo(() => computeReadingStreak(), []);
  const { monthlyCompleted } = useMemo(() => computeMonthlyStats(), []);
  const MONTHLY_GOAL = 10;
  const weeklyData = useMemo(() => computeVocabGrowth(7), []);
  const monthlyData = useMemo(() => computeVocabGrowth(30), []);
  const readingHistory = useMemo(() => computeReadingHistory(5), []);
  const emotionDist = useMemo(() => computeEmotionDistribution(), []);


  const readingData = useMemo(
    () =>
      selectedPeriod === "이번 달"
        ? monthlyData
        : weeklyData,
    [selectedPeriod, monthlyData, weeklyData]
  );
  const maxValue = useMemo(
    () => Math.max(...readingData.map((d) => d.value), 1),
    [readingData]
  );
  const [progressAnimating, setProgressAnimating] = useState(false);
  const [focusHours, setFocusHours] = useState(FOCUS_SETTINGS.readingTime.hours);
  const [focusMinutes, setFocusMinutes] = useState(FOCUS_SETTINGS.readingTime.minutes);
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);
  const [autoLimit, setAutoLimit] = useState(true);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [totalTimerSeconds, setTotalTimerSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [analysis, setAnalysis] = useState<DashboardAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const CIRC = 87.96;
  const timerArc =
    autoLimit && totalTimerSeconds > 0
      ? (timerSeconds / totalTimerSeconds) * CIRC
      : autoLimit
      ? CIRC
      : 0;

  const monthlyPercent = MONTHLY_GOAL > 0
    ? Math.min(100, Math.round((monthlyCompleted / MONTHLY_GOAL) * 100))
    : 0;

  const handleAutoLimitToggle = () => {
    const next = !autoLimit;
    setAutoLimit(next);
    if (next) {
      const total = focusHours * 3600 + focusMinutes * 60;
      const secs = total > 0 ? total : 1800;
      setTimerSeconds(secs);
      setTotalTimerSeconds(secs);
      setIsTimerRunning(true);
    } else {
      setIsTimerRunning(false);
      setTimerSeconds(0);
      setTotalTimerSeconds(0);
    }
  };

  const yAxisTicks = useMemo(() => {
    const max = Math.max(...readingData.map((d) => d.value));
    const step = Math.ceil(max / 3 / 5) * 5;
    const ticks: number[] = [];
    for (let i = 0; i <= 3; i++) ticks.push(i * step);
    return ticks;
  }, [readingData]);

  const formattedTimer = useMemo(() => {
    const h = Math.floor(timerSeconds / 3600);
    const m = Math.floor((timerSeconds % 3600) / 60);
    const s = timerSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [timerSeconds]);

  useEffect(() => {
    const targets = readingData.map((d) =>
      maxValue > 0 ? (d.value / maxValue) * 100 : 0
    );
    setAnimHeights(readingData.map(() => 0));
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimHeights(targets));
    });
    return () => cancelAnimationFrame(frame);
  }, [readingData, maxValue]);

  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) { setIsTimerRunning(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };
  }, [isTimerRunning, timerSeconds > 0]);

  useEffect(() => {
    setProgressAnimating(false);
    const t = setTimeout(() => setProgressAnimating(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const cached = getCachedDashboardAnalysis(library.length);
    if (cached) { setAnalysis(cached); return; }
    if (library.length === 0) return;

    const analytics = getAnalytics();
    const tags = library.map((e) => e.tag);
    const titles = library.map((e) => e.title);
    const emotions = analytics.map((a) => a.emotionChoice).filter((e): e is string => Boolean(e));
    const totalVocab = analytics.reduce((sum, a) => sum + a.vocabCount, 0);

    setAnalysisLoading(true);
    analyzeChildData({
      childName: CHILD_PROFILE.name,
      childAge: CHILD_PROFILE.age,
      tags,
      titles,
      emotions,
      totalVocab,
    })
      .then((result) => {
        setAnalysis(result);
        setCachedDashboardAnalysis(result, library.length);
      })
      .catch(console.error)
      .finally(() => setAnalysisLoading(false));
  }, [library.length]);

  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12">
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">

            <div className="mb-6">
              <h1 className="font-label text-2xl md:text-3xl text-foreground-950 mb-1">내 아이 모아보기</h1>
              <p className="text-sm font-label text-foreground-500">한담이의 학습 활동과 독서 기록을 한눈에 확인하세요.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

              {/* ── 왼쪽 컬럼 ── */}
              <div className="flex-1 min-w-0 space-y-6">

                {/* 어휘 성장 추이 */}
                <div className="rounded-2xl bg-background-100 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h2 className="font-label text-lg text-foreground-950">어휘 성장 추이</h2>
                      <p className="text-xs font-label text-foreground-500 mt-1">누적 어휘량 (단어 수)</p>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-100 text-xs font-label text-foreground-700 cursor-pointer hover:bg-background-100 dark:hover:bg-background-200 transition-colors"
                      >
                        {selectedPeriod}
                        <i className="ri-arrow-down-s-line w-3 h-3 flex items-center justify-center text-foreground-400"></i>
                      </button>
                      {showPeriodDropdown && (
                        <div className="absolute right-0 mt-1 w-32 rounded-xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 shadow-lg z-30 p-1.5">
                          {["이번 주", "지난 주", "이번 달"].map((period) => (
                            <button
                              key={period}
                              type="button"
                              onClick={() => { setSelectedPeriod(period); setShowPeriodDropdown(false); }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${
                                selectedPeriod === period ? "bg-primary-50 text-primary-700" : "text-foreground-700 hover:bg-background-100"
                              }`}
                            >
                              {period}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-0 h-48 md:h-56 mt-5 bg-background-50 dark:bg-background-200/40 rounded-xl p-2 pb-0">
                    <div className="flex flex-col justify-between items-end pr-2 pb-5 flex-shrink-0 w-9">
                      {[...yAxisTicks].reverse().map((tick) => (
                        <span key={tick} className="text-[9px] font-label text-foreground-400 dark:text-foreground-600 leading-none">{tick}</span>
                      ))}
                    </div>
                    <div className="flex-1 flex items-end gap-2 relative justify-evenly overflow-hidden">
                      {readingData.map((item, idx) => {
                        const isMax = item.value === maxValue;
                        const isMonthly = selectedPeriod === "이번 달";
                        const currentHeight = animHeights[idx] ?? 0;
                        const isHovered = hoveredBarIdx === idx;
                        const barW = isMonthly ? 14 : 28;
                        return (
                          <div key={item.day} className="h-full flex flex-col justify-end items-center gap-1.5 flex-shrink-0" style={{ width: `${barW}px` }}>
                            {item.value > 0 && (
                              <span className={`font-label text-foreground-600 dark:text-foreground-500 leading-none ${isMonthly ? "text-[9px]" : "text-xs"}`}>
                                {item.value}
                              </span>
                            )}
                            <div
                              className="w-full rounded-t-md cursor-pointer"
                              style={{
                                height: currentHeight > 0 ? `${currentHeight}%` : "0%",
                                minHeight: item.value > 0 ? "4px" : "0px",
                                backgroundColor: isMax ? "oklch(var(--primary-500))" : isHovered ? "oklch(var(--secondary-400))" : "oklch(var(--secondary-500))",
                                transition: `height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.05}s`,
                              }}
                              onMouseEnter={() => setHoveredBarIdx(idx)}
                              onMouseLeave={() => setHoveredBarIdx(null)}
                            />
                            <span className={`font-label text-foreground-400 dark:text-foreground-600 ${isMonthly ? "text-[8px]" : "text-[10px]"} leading-none`}>
                              {item.day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-3 flex-wrap gap-2">
                    <p className="text-xs font-label text-foreground-500">※ 독서 완료 및 놀이마당 낱말 퀴즈 시 실시간 가산</p>
                    <p className="text-xs font-label text-primary-500 whitespace-nowrap">
                      이번 주 동화에서 학습한 누적 단어:{" "}
                      <span className="font-bold text-sm">{readingData[readingData.length - 1]?.value ?? 0}</span>개
                    </p>
                  </div>
                </div>

                {/* ── 2×2 그리드 ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* 자녀별 요약 */}
                  <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-6">
                    <h2 className="font-label text-base font-semibold text-foreground-950 mb-1">자녀별 요약</h2>
                    <p className="text-xs font-label text-foreground-400 dark:text-foreground-600 mb-4 leading-snug">로그인 중인 아이의 독서 진척도 및 지능 교감 상태</p>
                    <div className="rounded-xl bg-background-100 dark:bg-background-200 border border-background-200/60 dark:border-background-300/50 p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <img src={CHILD_PROFILE.avatar} alt={CHILD_PROFILE.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                        <div>
                          <p className="text-sm font-label text-foreground-950">{CHILD_PROFILE.name}({CHILD_PROFILE.age}세)</p>
                          <p className="text-xs font-label text-primary-500 mt-0.5">
                            이번주 완독 {weeklyCompleted}편 · 신규 어휘 학습 {weeklyVocab}개
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 rounded-lg border border-background-300/60 dark:border-background-400/50 p-3 text-center">
                          <p className="text-[11px] font-label text-foreground-400 mb-1">주요 관심사</p>
                          <p className="text-sm font-label font-semibold text-primary-600 dark:text-primary-400">
                            {analysisLoading ? <i className="ri-loader-4-line animate-spin" /> : (analysis?.mainInterest ?? "—")}
                          </p>
                        </div>
                        <div className="flex-1 rounded-lg border border-background-300/60 dark:border-background-400/50 p-3 text-center">
                          <p className="text-[11px] font-label text-foreground-400 mb-1">교감 감정</p>
                          <p className="text-sm font-label font-semibold text-accent-600 dark:text-accent-400">
                            {analysisLoading ? <i className="ri-loader-4-line animate-spin" /> : (analysis?.mainEmotion ?? "—")}
                          </p>
                        </div>
                        <div className="flex-1 rounded-lg border border-background-300/60 dark:border-background-400/50 p-3 text-center">
                          <p className="text-[11px] font-label text-foreground-400 mb-1">연속 독서</p>
                          <p className="text-sm font-label font-semibold text-secondary-600 dark:text-secondary-400">{streak}일</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <i className="ri-sparkling-2-line text-accent-400 text-sm flex-shrink-0 mt-0.5"></i>
                        <p className="text-xs font-label text-foreground-500 dark:text-foreground-600 leading-relaxed">
                          {analysisLoading
                            ? "AI가 독서 기록을 분석하고 있어요..."
                            : (analysis?.personalityInsight ?? "독서 기록이 쌓이면 성향 분석이 시작돼요.")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 반복 요청 테마 */}
                  <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-6 flex flex-col">
                    <h2 className="font-label text-base font-semibold text-foreground-950 mb-1">반복 요청 테마</h2>
                    <p className="text-xs font-label text-foreground-400 dark:text-foreground-600 mb-4 leading-snug">아이가 주도적으로 누적하여 열람한 단어 및 핵심 취향</p>
                    <div className="flex flex-col gap-2 flex-1">
                      {analysisLoading ? (
                        <div className="flex-1 flex items-center justify-center text-foreground-400 py-6">
                          <i className="ri-loader-4-line animate-spin text-2xl"></i>
                        </div>
                      ) : (analysis?.repeatThemes ?? []).length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-foreground-400 py-6">
                          <i className="ri-book-search-line text-2xl"></i>
                          <p className="text-xs font-label">동화를 읽으면 테마가 분석돼요</p>
                        </div>
                      ) : (
                        (analysis?.repeatThemes ?? []).map((theme, i) => (
                          <div key={i} className="flex items-center gap-3 rounded-xl bg-background-100 dark:bg-background-200 p-3.5 flex-1">
                            <span className="text-lg flex-shrink-0 leading-none">{firstEmoji(theme.icon)}</span>
                            <p className="text-xs font-label text-foreground-700 dark:text-foreground-400 leading-snug">{theme.title}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 집중 시간 설정 */}
                  <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-label text-foreground-700 dark:text-foreground-900">집중 시간 설정</p>
                        <p className="text-xs font-label text-foreground-400 dark:text-foreground-500 mt-1 leading-snug">규칙적인 독서습관 및 눈 피로 보호 기능</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoLimitToggle}
                        aria-label="자동제한 토글"
                        className={`relative mt-0.5 w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ml-2 ${autoLimit ? "bg-primary-500" : "bg-background-300 dark:bg-background-400"}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${autoLimit ? "left-5" : "left-0.5"}`} />
                      </button>
                    </div>

                    <div className="flex gap-3 mb-4">
                      <div className="flex-1 rounded-xl bg-background-100 dark:bg-background-200 border border-background-200/60 dark:border-background-300/50 p-4 flex flex-col items-center gap-2.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl font-label font-semibold text-foreground-950 leading-none tabular-nums">{focusHours}</span>
                          <span className="text-sm font-label text-foreground-400 dark:text-foreground-500">시간</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setFocusHours((h) => Math.min(h + 1, 23))} className="w-8 h-7 rounded-md flex items-center justify-center bg-background-200 dark:bg-background-300 hover:bg-primary-100 cursor-pointer transition-colors">
                            <i className="ri-arrow-up-s-line text-foreground-500"></i>
                          </button>
                          <button type="button" onClick={() => setFocusHours((h) => Math.max(h - 1, 0))} className="w-8 h-7 rounded-md flex items-center justify-center bg-background-200 dark:bg-background-300 hover:bg-primary-100 cursor-pointer transition-colors">
                            <i className="ri-arrow-down-s-line text-foreground-500"></i>
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 rounded-xl bg-background-100 dark:bg-background-200 border border-background-200/60 dark:border-background-300/50 p-4 flex flex-col items-center gap-2.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl font-label font-semibold text-foreground-950 leading-none tabular-nums">{focusMinutes}</span>
                          <span className="text-sm font-label text-foreground-400 dark:text-foreground-500">분</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setFocusMinutes((m) => Math.min(m + 5, 55))} className="w-8 h-7 rounded-md flex items-center justify-center bg-background-200 dark:bg-background-300 hover:bg-primary-100 cursor-pointer transition-colors">
                            <i className="ri-arrow-up-s-line text-foreground-500"></i>
                          </button>
                          <button type="button" onClick={() => setFocusMinutes((m) => Math.max(m - 5, 0))} className="w-8 h-7 rounded-md flex items-center justify-center bg-background-200 dark:bg-background-300 hover:bg-primary-100 cursor-pointer transition-colors">
                            <i className="ri-arrow-down-s-line text-foreground-500"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 잔여 이용 시간 박스 — 타이머 텍스트가 원형 왼쪽에 바로 붙음 */}
                    <div className="mt-auto rounded-xl bg-background-100 dark:bg-background-200 border border-background-200/60 dark:border-background-300/50 p-3.5 flex items-center gap-3">
                      <span className="flex-1 text-xs font-label text-foreground-500 dark:text-foreground-600 whitespace-nowrap">잔여 이용 시간</span>
                      <div className="flex items-center gap-2">
                        {autoLimit ? (
                          <span className="text-sm font-label text-foreground-950 dark:text-foreground-800 tabular-nums">{formattedTimer}</span>
                        ) : (
                          <span className="text-sm font-label text-foreground-400 dark:text-foreground-500">제한 해제</span>
                        )}
                        <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
                          <svg viewBox="0 0 36 36" className="w-full h-full absolute inset-0" style={{ transform: "rotate(-90deg)" }}>
                            <circle cx="18" cy="18" r="14" fill="none" stroke="oklch(var(--primary-100))" strokeWidth="3.5" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke={autoLimit ? "oklch(var(--primary-500))" : "oklch(var(--background-300))"} strokeWidth="3.5" strokeLinecap="round" strokeDasharray={`${timerArc.toFixed(2)} ${CIRC}`} style={{ transition: "stroke-dasharray 1s linear, stroke 0.3s" }} />
                          </svg>
                          <i className="ri-timer-line text-sm text-primary-500 relative z-10"></i>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 감정 반응 — flex-col, 버블박스 flex-1 */}
                  <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-6 flex flex-col">
                    <h2 className="font-label text-base font-semibold text-foreground-950 mb-1">감정 반응</h2>
                    <p className="text-xs font-label text-foreground-400 dark:text-foreground-600 mb-4 leading-snug">놀이마당 후 아이가 발각한 자율 정서 교감 분포도 (실시간 누계)</p>
                    {/* 버블 컨테이너 — flex-1로 남은 높이 채움 */}
                    <div className="flex-1 rounded-xl bg-background-100 dark:bg-background-200 border border-background-200/60 dark:border-background-300/50 min-h-[200px] flex items-center justify-center overflow-hidden">
                      <div className="flex items-center">
                        {(emotionDist.length > 0 ? emotionDist.slice(0, 3) : MOCK_EMOTION_DIST).map((e, idx) => {
                          const sizes = [140, 110, 90];
                          const yOffsets = [0, 22, -18];
                          const margins = ["-24px", "-18px", "0px"];
                          const colorVars = ["oklch(var(--primary-500))", "oklch(var(--accent-500))", "oklch(var(--secondary-500))"];
                          const fontSizes = ["text-3xl", "text-xl", "text-lg"];
                          const labelSizes = ["text-xs", "text-[11px]", "text-[10px]"];
                          const size = sizes[idx] ?? 90;
                          return (
                            <div key={e.label} style={{ transform: `translateY(${yOffsets[idx] ?? 0}px)`, marginRight: margins[idx] ?? "0px", zIndex: 3 - idx, position: "relative" }}>
                              <div
                                className="animate-pulse-bubble flex flex-col items-center justify-center rounded-full"
                                style={{ width: size, height: size, backgroundColor: colorVars[idx] ?? colorVars[0], animationDelay: `${idx * 0.5}s` }}
                              >
                                <span className={`text-white font-label ${labelSizes[idx] ?? "text-xs"} leading-none mb-1`}>{e.label}</span>
                                <span className={`text-white font-label font-bold ${fontSizes[idx] ?? "text-lg"} leading-none`}>{e.value}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── 오른쪽 컬럼 ── */}
              <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
                {/* 상단 드롭다운 */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button type="button" onClick={() => { setShowNotif(!showNotif); setShowChildDropdown(false); setShowUserDropdown(false); }} className="relative w-10 h-10 rounded-full flex items-center justify-center border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-100 hover:bg-primary-50 dark:hover:bg-background-200 transition-colors cursor-pointer">
                      <i className="ri-notification-3-line w-5 h-5 flex items-center justify-center text-foreground-500"></i>
                      {NOTIFICATIONS.some((n) => n.unread) && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-500"></span>}
                    </button>
                    {showNotif && (
                      <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 shadow-lg z-30 p-4">
                        <p className="text-sm font-label text-foreground-700 mb-3">알림</p>
                        <div className="space-y-3">
                          {NOTIFICATIONS.map((n) => (
                            <div key={n.id} className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? "bg-accent-500" : "bg-secondary-300"}`}></div>
                              <p className="text-xs font-label text-foreground-600">{n.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button type="button" onClick={() => { setShowChildDropdown(!showChildDropdown); setShowNotif(false); setShowUserDropdown(false); }} className="flex items-center gap-1.5 rounded-full border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-100 px-3 py-1.5 hover:bg-primary-50 dark:hover:bg-background-200 transition-colors cursor-pointer">
                      <i className="ri-user-smile-line w-4 h-4 flex items-center justify-center text-foreground-400"></i>
                      <span className="text-xs font-label text-foreground-700 whitespace-nowrap">{CHILD_PROFILE.name}</span>
                      <i className="ri-arrow-down-s-line w-3 h-3 flex items-center justify-center text-foreground-400"></i>
                    </button>
                    {showChildDropdown && (
                      <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 shadow-lg z-30 p-2">
                        <button type="button" className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-label text-foreground-800 hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap">
                          <span className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs text-primary-800">6</span>
                          한담이 (6세)
                        </button>
                        <button type="button" className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-label text-foreground-800 hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap">
                          <span className="w-6 h-6 rounded-full bg-secondary-100 flex items-center justify-center text-xs text-secondary-800">3</span>
                          김둘째 (3세)
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button type="button" onClick={() => { setShowUserDropdown(!showUserDropdown); setShowNotif(false); setShowChildDropdown(false); }} className="flex items-center gap-1.5 rounded-full border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-100 px-3 py-1.5 hover:bg-primary-50 dark:hover:bg-background-200 transition-colors cursor-pointer">
                      <i className="ri-mail-line w-4 h-4 flex items-center justify-center text-foreground-400"></i>
                      <span className="text-xs font-label text-foreground-700 hidden sm:inline">toritori@naver.com</span>
                      <i className="ri-arrow-down-s-line w-3 h-3 flex items-center justify-center text-foreground-400"></i>
                    </button>
                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 shadow-lg z-30 p-2">
                        <Link to="/profile/edit" className="block px-3 py-2.5 rounded-xl text-sm font-label text-foreground-800 hover:bg-primary-50 transition-colors whitespace-nowrap cursor-pointer">프로필 편집</Link>
                        <Link to="/settings" className="block px-3 py-2.5 rounded-xl text-sm font-label text-foreground-800 hover:bg-primary-50 transition-colors whitespace-nowrap cursor-pointer">설정</Link>
                        <Link to="/subscription" className="block px-3 py-2.5 rounded-xl text-sm font-label text-foreground-800 hover:bg-primary-50 transition-colors whitespace-nowrap cursor-pointer">구독 관리</Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* 아이 프로필 */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <div className="flex flex-col items-center mb-5">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary-100 mb-3 relative">
                      <img src={CHILD_PROFILE.avatar} alt={CHILD_PROFILE.name} className="w-full h-full object-cover" />
                      <Link to="/profile/edit" className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-background-50 border border-background-200 flex items-center justify-center cursor-pointer">
                        <i className="ri-pencil-line w-3 h-3 flex items-center justify-center text-foreground-400"></i>
                      </Link>
                    </div>
                    <p className="text-sm font-label text-foreground-950">{CHILD_PROFILE.name} ({CHILD_PROFILE.age}세)</p>
                  </div>
                  <div className="mb-4 text-center">
                    <p className="text-xs font-label text-foreground-500 mb-2">아이 관심사</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {CHILD_PROFILE.interests.map((interest) => (
                        <span key={interest} className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary-100 text-secondary-900 text-xs font-label">{interest}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-label text-foreground-500 mb-2">최근 좋아한 감정</p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {[
                        { label: "기쁨",   icon: "ri-emotion-happy-line" },
                        { label: "따뜻함", icon: "ri-heart-line" },
                        { label: "평온",   icon: "ri-leaf-line" },
                      ].map(({ label, icon }) => (
                        <span key={label} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-100 text-accent-900 text-xs font-label">
                          <i className={`${icon} text-xs leading-none`}></i>{label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 읽은 동화 히스토리 */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-label text-foreground-700 dark:text-foreground-900">읽은 동화 히스토리</p>
                    <Link to="/bookshelf" className="text-xs font-label text-primary-500 hover:text-primary-600 transition-colors">자세히</Link>
                  </div>
                  <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                    {readingHistory.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-foreground-400">
                        <i className="ri-book-2-line text-2xl mb-2"></i>
                        <p className="text-xs font-label">아직 읽은 동화가 없어요</p>
                      </div>
                    ) : (
                      readingHistory.map((story) => (
                        <div key={story.id} className="flex items-center gap-3 rounded-xl bg-background-100 dark:bg-background-200 p-3">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-background-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-xl">{story.emoji}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-label text-foreground-950 truncate">{story.title}</p>
                            <p className="text-xs font-label text-foreground-500">최근 읽은 동화</p>
                          </div>
                          <span className="text-xs font-label text-foreground-400 dark:text-foreground-600 flex-shrink-0">{story.readAt}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 독서 리포트 */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <p className="text-sm font-label text-foreground-700 dark:text-foreground-900 mb-4">독서 리포트</p>
                  <div className="space-y-3">

                    {/* 평균 독서 시간 + 저장된 동화 — 2열 나란히, 텍스트 위 / 원형 아래 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-background-100 dark:bg-background-200 p-4 flex flex-col items-center gap-3">
                        <p className="text-xs font-label text-foreground-500 dark:text-foreground-700">평균 독서 시간</p>
                        <div className="relative w-[72px] h-[72px] flex-shrink-0">
                          <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="oklch(var(--background-300))" strokeWidth="2.5" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="oklch(var(--accent-500))" strokeWidth="2.5" strokeLinecap="round"
                              strokeDasharray={`${progressAnimating ? 40 : 0} ${100 - (progressAnimating ? 40 : 0)}`}
                              style={{ transition: progressAnimating ? "stroke-dasharray 1.2s ease-out 0s" : "none" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-label font-bold text-accent-500">{READING_REPORT.avgTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl bg-background-100 dark:bg-background-200 p-4 flex flex-col items-center gap-3">
                        <p className="text-xs font-label text-foreground-500 dark:text-foreground-700">저장된 동화</p>
                        <div className="relative w-[72px] h-[72px] flex-shrink-0">
                          <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="oklch(var(--background-300))" strokeWidth="2.5" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="oklch(var(--secondary-500))" strokeWidth="2.5" strokeLinecap="round"
                              strokeDasharray={`${progressAnimating ? 60 : 0} ${100 - (progressAnimating ? 60 : 0)}`}
                              style={{ transition: progressAnimating ? "stroke-dasharray 1.2s ease-out 0.15s" : "none" }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-label font-bold text-secondary-500">{library.length}편</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 이번달 독서량 */}
                    <div className="rounded-xl bg-background-100 dark:bg-background-200 p-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-label text-foreground-500 dark:text-foreground-700">이번달 독서량</p>
                        <p className="text-sm font-label font-semibold text-primary-500 mt-1">목표 달성률 {monthlyPercent}%</p>
                      </div>
                      <div className="relative w-[68px] h-[68px] flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="oklch(var(--background-300))" strokeWidth="2.5" />
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="oklch(var(--primary-500))" strokeWidth="2.5" strokeLinecap="round"
                            strokeDasharray={`${progressAnimating ? monthlyPercent : 0} ${100 - (progressAnimating ? monthlyPercent : 0)}`}
                            style={{ transition: progressAnimating ? "stroke-dasharray 1.2s ease-out 0.3s" : "none" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-label font-bold text-primary-500 text-center leading-tight">
                            {monthlyCompleted}/{MONTHLY_GOAL}편
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI 독서 코멘트 */}
                    {(analysis?.readingInsight || analysisLoading) && (
                      <div className="rounded-xl bg-primary-50/20 dark:bg-primary-950/30 border border-background-200/70 dark:border-primary-900/40 p-3.5 flex items-start gap-2">
                        <i className="ri-sparkling-2-line text-primary-500 text-sm flex-shrink-0 mt-0.5"></i>
                        <p className="text-xs font-label dark:!text-primary-300 leading-relaxed" style={{ color: "black" }}>
                          {analysisLoading ? "AI가 독서 패턴을 분석 중이에요..." : analysis?.readingInsight}
                        </p>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(showNotif || showChildDropdown || showUserDropdown || showPeriodDropdown) && (
        <div className="fixed inset-0 z-20" onClick={() => { setShowNotif(false); setShowChildDropdown(false); setShowUserDropdown(false); setShowPeriodDropdown(false); }}></div>
      )}
    </main>
  );
}
