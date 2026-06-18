import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import {
  CHILD_PROFILE,
  READING_HISTORY,
  READING_REPORT,
  NOTIFICATIONS,
  FOCUS_SETTINGS,
  WEEKLY_READING_DATA,
  LAST_WEEK_READING_DATA,
  MONTHLY_READING_DATA,
  EMOTION_DATA,
  RECOMMENDATIONS,
  CHILDREN_LIST,
} from "@/mocks/dashboard";

export default function DashboardPage() {
  const [animHeights, setAnimHeights] = useState<number[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showChildDropdown, setShowChildDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("이번 주");
  const [selectedChild, setSelectedChild] = useState("한담이");
  const readingData = selectedPeriod === "이번 달" ? MONTHLY_READING_DATA : selectedPeriod === "지난 주" ? LAST_WEEK_READING_DATA : WEEKLY_READING_DATA;
  const maxValue = Math.max(...readingData.map((d) => d.value));
  const [progressAnimating, setProgressAnimating] = useState(false);
  const [pieAnimating, setPieAnimating] = useState(false);
  const [focusHours, setFocusHours] = useState(FOCUS_SETTINGS.readingTime.hours);
  const [focusMinutes, setFocusMinutes] = useState(FOCUS_SETTINGS.readingTime.minutes);
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [totalTimerSeconds, setTotalTimerSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const yAxisTicks = useMemo(() => {
    const max = Math.max(...readingData.map((d) => d.value));
    const step = Math.ceil(max / 4 / 10) * 10;
    const ticks: number[] = [];
    for (let i = 0; i <= 4; i++) {
      ticks.push(i * step);
    }
    return ticks;
  }, [readingData]);

  const barHeights = useMemo(() => {
    const maxY = yAxisTicks[yAxisTicks.length - 1];
    if (maxY === 0) return readingData.map(() => 0);
    return readingData.map((d) => (d.value / maxY) * 100);
  }, [readingData, yAxisTicks]);

  const formattedTimer = useMemo(() => {
    const h = Math.floor(timerSeconds / 3600);
    const m = Math.floor((timerSeconds % 3600) / 60);
    const s = timerSeconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [timerSeconds]);

  useEffect(() => {
    const targets = readingData.map((d) => maxValue > 0 ? (d.value / maxValue) * 100 : 0);
    setAnimHeights(readingData.map(() => 0));
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimHeights(targets);
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [readingData, maxValue]);

  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isTimerRunning, timerSeconds > 0]);

  useEffect(() => {
    setProgressAnimating(false);
    setPieAnimating(false);
    const t = setTimeout(() => {
      setProgressAnimating(true);
      setPieAnimating(true);
    }, 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12">
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            {/* Title only */}
            <div className="mb-6">
              <h1 className="font-heading text-2xl md:text-3xl text-foreground-950 mb-1">
                내 아이 모아보기
              </h1>
              <p className="text-sm text-foreground-500">
                한담이의 학습 활동과 독서 기록을 한눈에 확인하세요.
              </p>
            </div>

            {/* Main grid */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left column */}
              <div className="flex-1 min-w-0 space-y-6">
                {/* Learning progress graph */}
                <div className="rounded-2xl bg-background-100 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-md bg-primary-100 text-primary-900 text-xs font-label">
                        어휘 성장 추이
                      </span>
                      <p className="text-[10px] text-foreground-400 mt-1.5 ml-0.5">
                        누적 어휘량 (단어 수)
                      </p>
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
                              onClick={() => {
                                setSelectedPeriod(period);
                                setShowPeriodDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${
                                selectedPeriod === period
                                  ? "bg-primary-50 text-primary-700"
                                  : "text-foreground-700 hover:bg-background-100"
                              }`}
                            >
                              {period}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bar chart with Y-axis */}
                  <div className="flex gap-0 h-48 md:h-56 mt-5">
                    {/* Y-axis labels */}
                    <div className="flex flex-col justify-between items-end pr-2 pb-5 flex-shrink-0 w-9">
                      {[...yAxisTicks].reverse().map((tick) => (
                        <span key={tick} className="text-[9px] text-foreground-400 dark:text-foreground-600 font-label leading-none">
                          {tick}
                        </span>
                      ))}
                    </div>

                    {/* Bars area */}
                    <div className="flex-1 flex items-end gap-2 relative justify-evenly overflow-hidden">
                      {/* Horizontal grid lines */}
                      {yAxisTicks.map((tick) => (
                        <div
                          key={tick}
                          className="absolute left-0 right-0 border-t border-background-200/40"
                          style={{
                            bottom: `${(tick / yAxisTicks[yAxisTicks.length - 1]) * 100}%`,
                          }}
                        ></div>
                      ))}

                      {/* Bars */}
                      {readingData.map((item, idx) => {
                        const isMax = item.value === maxValue;
                        const isMonthly = selectedPeriod === "이번 달";
                        const targetPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                        const currentHeight = animHeights[idx] ?? 0;
                        const isHovered = hoveredBarIdx === idx;
                        const barW = isMonthly ? 14 : 28;
                        return (
                          <div
                            key={item.day}
                            className="h-full flex flex-col justify-end items-center gap-1.5 flex-shrink-0"
                            style={{ width: `${barW}px` }}
                          >
                            <div
                              className="w-full rounded-t-md cursor-pointer relative"
                              style={{
                                height: currentHeight > 0 ? `${currentHeight}%` : '0%',
                                minHeight: item.value > 0 ? '4px' : '0px',
                                backgroundColor: isMax
                                  ? 'oklch(var(--primary-500))'
                                  : isHovered
                                    ? 'oklch(var(--secondary-400))'
                                    : 'oklch(var(--secondary-500))',
                                transition: `height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.05}s`,
                              }}
                              onMouseEnter={() => setHoveredBarIdx(idx)}
                              onMouseLeave={() => setHoveredBarIdx(null)}
                            >
                              {isHovered && (
                                <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 px-2 py-0.5 rounded-md bg-foreground-950 text-background-50 text-[10px] font-label whitespace-nowrap pointer-events-none">
                                  {item.value}단어
                                </div>
                              )}
                            </div>
                            <span className={`font-label text-foreground-400 dark:text-foreground-600 ${isMonthly ? "text-[8px]" : "text-[10px]"} leading-none`}>
                              {item.day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footnote */}
                  <p className="text-[9px] text-foreground-300 dark:text-foreground-500 mt-3 text-right">
                    ※ 독서 완료 및 놀이마당 낱말 퀴즈 시 실시간 가산
                  </p>
                </div>

                {/* Focus time settings with children cards */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <div className="mb-4">
                    <p className="text-sm font-label text-foreground-700">
                      집중 시간 설정
                    </p>
                  </div>

                  {/* Time settings row: 독서시간 + 잔여종료시간 + CTA */}
                  <div className="flex flex-col lg:flex-row gap-3 mb-4">
                    {/* 독서 시간 설정 */}
                    <div className="flex-1 rounded-xl bg-background-100 dark:bg-background-200 border border-background-200/70 dark:border-background-300/50 p-4">
                      <p className="text-xs text-foreground-500 dark:text-foreground-700 mb-3">
                        독서 시간 설정
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* 시 */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => setFocusHours((h) => Math.min(h + 1, 23))}
                              className="w-5 h-5 rounded flex items-center justify-center bg-secondary-100 dark:bg-background-300 hover:bg-secondary-200 dark:hover:bg-background-400 cursor-pointer transition-colors"
                            >
                              <i className="ri-arrow-up-s-line w-3 h-3 flex items-center justify-center text-foreground-400"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFocusHours((h) => Math.max(h - 1, 0))}
                              className="w-5 h-5 rounded flex items-center justify-center bg-secondary-100 dark:bg-background-300 hover:bg-secondary-200 dark:hover:bg-background-400 cursor-pointer transition-colors"
                            >
                              <i className="ri-arrow-down-s-line w-3 h-3 flex items-center justify-center text-foreground-400"></i>
                            </button>
                          </div>
                          <span className="text-2xl font-heading text-foreground-950 w-8 text-center">
                            {focusHours}
                          </span>
                          <span className="text-sm text-foreground-500 whitespace-nowrap">시</span>
                        </div>

                        {/* 분 */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => setFocusMinutes((m) => Math.min(m + 5, 55))}
                              className="w-5 h-5 rounded flex items-center justify-center bg-secondary-100 dark:bg-background-300 hover:bg-secondary-200 dark:hover:bg-background-400 cursor-pointer transition-colors"
                            >
                              <i className="ri-arrow-up-s-line w-3 h-3 flex items-center justify-center text-foreground-400"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => setFocusMinutes((m) => Math.max(m - 5, 0))}
                              className="w-5 h-5 rounded flex items-center justify-center bg-secondary-100 dark:bg-background-300 hover:bg-secondary-200 dark:hover:bg-background-400 cursor-pointer transition-colors"
                            >
                              <i className="ri-arrow-down-s-line w-3 h-3 flex items-center justify-center text-foreground-400"></i>
                            </button>
                          </div>
                          <span className="text-2xl font-heading text-foreground-950 w-8 text-center">
                            {focusMinutes}
                          </span>
                          <span className="text-sm text-foreground-500 whitespace-nowrap">분</span>
                        </div>
                      </div>
                    </div>

                    {/* 잔여 종료 시간 */}
                    <div className="flex-1 rounded-xl bg-background-100 dark:bg-background-200 border border-background-200/70 dark:border-background-300/50 p-4">
                      <p className="text-xs text-foreground-500 dark:text-foreground-700 mb-2">
                        잔여 종료 시간
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-2 border-primary-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-label font-mono text-foreground-950 leading-none">
                            {isTimerRunning && totalTimerSeconds > 0
                              ? formattedTimer
                              : "--:--"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full transition-all duration-700 ease-out"
                              style={{
                                width: isTimerRunning && totalTimerSeconds > 0
                                  ? `${(timerSeconds / totalTimerSeconds) * 100}%`
                                  : progressAnimating ? "65%" : "0%",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 타이머 시작 CTA */}
                    <div className="flex-shrink-0 flex flex-col items-stretch justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!isTimerRunning) {
                            const total = focusHours * 3600 + focusMinutes * 60;
                            const secs = total > 0 ? total : 60;
                            setTimerSeconds(secs);
                            setTotalTimerSeconds(secs);
                            setIsTimerRunning(true);
                          } else {
                            setIsTimerRunning(false);
                          }
                        }}
                        className="px-6 py-3 rounded-xl bg-primary-500 text-background-50 text-sm font-label cursor-pointer hover:bg-primary-600 transition-colors whitespace-nowrap w-full flex items-center justify-center gap-1.5"
                      >
                        <i className={`${isTimerRunning ? 'ri-pause-line' : 'ri-timer-line'} w-4 h-4 flex items-center justify-center`}></i>
                        {isTimerRunning ? '일시정지' : '타이머 시작'}
                      </button>
                      {!isTimerRunning && timerSeconds > 0 && (
                        <button
                          type="button"
                          onClick={() => setTimerSeconds(0)}
                          className="text-[10px] text-foreground-400 hover:text-foreground-600 cursor-pointer transition-colors text-center"
                        >
                          초기화
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Children selection cards */}
                  <div className="space-y-3">
                    {CHILDREN_LIST.map((child) => (
                      <div
                        key={child.id}
                        className={`rounded-xl border p-4 cursor-pointer transition-colors ${
                          selectedChild === child.name
                            ? "border-primary-400 bg-primary-50/30"
                            : "border-background-200/70 dark:border-background-300/50 bg-background-50 dark:bg-background-100 hover:bg-background-100 dark:hover:bg-background-200"
                        }`}
                        onClick={() => setSelectedChild(child.name)}
                        onKeyDown={() => {}}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-label text-foreground-950">
                                아이
                              </span>
                              <span className="text-sm font-label text-primary-600">
                                {child.name} ({child.age}세)
                              </span>
                            </div>
                            <p className="text-xs text-foreground-500">
                              {child.recent}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <div className="px-3 py-1.5 rounded-lg bg-secondary-100 dark:bg-background-300 text-xs font-label text-foreground-700 dark:text-foreground-950">
                              {child.favGenre}
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-secondary-100 dark:bg-background-300 text-xs font-label text-foreground-700 dark:text-foreground-950">
                              {child.lastRead}편
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom row: Recommendations + Emotion chart */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recommendations */}
                  <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                    <div className="space-y-3">
                      {RECOMMENDATIONS.map((rec) => (
                        <div
                          key={rec.id}
                          className="flex items-center gap-3 rounded-xl bg-background-100 dark:bg-background-200 p-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-secondary-100 flex items-center justify-center flex-shrink-0">
                            <i className={`${rec.icon} w-4 h-4 flex items-center justify-center ${rec.color}`}></i>
                          </div>
                          <p className="text-xs font-label text-foreground-700">
                            {rec.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Emotion pie chart */}
                  <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                    <div className="flex items-center justify-center">
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <circle
                            cx="18"
                            cy="18"
                            r="15.915"
                            fill="none"
                            stroke="oklch(var(--primary-500))"
                            strokeWidth="3"
                            strokeDasharray={`${pieAnimating ? EMOTION_DATA[0].value : 0} ${100 - (pieAnimating ? EMOTION_DATA[0].value : 0)}`}
                            strokeDashoffset="0"
                            style={{ transition: pieAnimating ? "stroke-dasharray 1.2s ease-out" : "none" }}
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="15.915"
                            fill="none"
                            stroke="oklch(var(--accent-500))"
                            strokeWidth="3"
                            strokeDasharray={`${pieAnimating ? EMOTION_DATA[1].value : 0} ${100 - (pieAnimating ? EMOTION_DATA[1].value : 0)}`}
                            strokeDashoffset={`${pieAnimating ? -EMOTION_DATA[0].value : 0}`}
                            style={{ transition: pieAnimating ? "stroke-dasharray 1.2s ease-out 0.2s, stroke-dashoffset 1.2s ease-out 0.2s" : "none" }}
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="15.915"
                            fill="none"
                            stroke="oklch(var(--secondary-500))"
                            strokeWidth="3"
                            strokeDasharray={`${pieAnimating ? EMOTION_DATA[2].value : 0} ${100 - (pieAnimating ? EMOTION_DATA[2].value : 0)}`}
                            strokeDashoffset={`${pieAnimating ? -(EMOTION_DATA[0].value + EMOTION_DATA[1].value) : 0}`}
                            style={{ transition: pieAnimating ? "stroke-dasharray 1.2s ease-out 0.4s, stroke-dashoffset 1.2s ease-out 0.4s" : "none" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-xs font-label text-foreground-500">기쁨</p>
                            <p className="text-lg font-heading text-primary-500">
                              {EMOTION_DATA[0].value}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-4">
                      {EMOTION_DATA.map((e) => (
                        <div key={e.label} className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${e.color}`}></span>
                          <span className="text-xs font-label text-foreground-700">
                            {e.label} {e.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
                {/* Top dropdowns - above child profile */}
                <div className="flex items-center gap-2">
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotif(!showNotif);
                        setShowChildDropdown(false);
                        setShowUserDropdown(false);
                      }}
                      className="relative w-10 h-10 rounded-full flex items-center justify-center border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-100 hover:bg-primary-50 dark:hover:bg-background-200 transition-colors cursor-pointer"
                    >
                      <i className="ri-notification-3-line w-5 h-5 flex items-center justify-center text-foreground-500"></i>
                      {NOTIFICATIONS.some((n) => n.unread) && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-500"></span>
                      )}
                    </button>
                    {showNotif && (
                      <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 shadow-lg z-30 p-4">
                        <p className="text-sm font-label text-foreground-700 mb-3">
                          알림
                        </p>
                        <div className="space-y-3">
                          {NOTIFICATIONS.map((n) => (
                            <div key={n.id} className="flex items-start gap-3">
                              <div
                                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                  n.unread ? "bg-accent-500" : "bg-secondary-300"
                                }`}
                              ></div>
                              <p className="text-xs text-foreground-600">
                                {n.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Child dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowChildDropdown(!showChildDropdown);
                        setShowNotif(false);
                        setShowUserDropdown(false);
                      }}
                      className="flex items-center gap-1.5 rounded-full border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-100 px-3 py-1.5 hover:bg-primary-50 dark:hover:bg-background-200 transition-colors cursor-pointer"
                    >
                      <i className="ri-user-smile-line w-4 h-4 flex items-center justify-center text-foreground-400"></i>
                      <span className="text-xs font-label text-foreground-700 whitespace-nowrap">
                        {CHILD_PROFILE.name}
                      </span>
                      <i className="ri-arrow-down-s-line w-3 h-3 flex items-center justify-center text-foreground-400"></i>
                    </button>
                    {showChildDropdown && (
                      <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 shadow-lg z-30 p-2">
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-label text-foreground-800 hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <span className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs text-primary-800">
                            6
                          </span>
                          한담이 (6세)
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-label text-foreground-800 hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <span className="w-6 h-6 rounded-full bg-secondary-100 flex items-center justify-center text-xs text-secondary-800">
                            3
                          </span>
                          김둘째 (3세)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* User dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserDropdown(!showUserDropdown);
                        setShowNotif(false);
                        setShowChildDropdown(false);
                      }}
                      className="flex items-center gap-1.5 rounded-full border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-100 px-3 py-1.5 hover:bg-primary-50 dark:hover:bg-background-200 transition-colors cursor-pointer"
                    >
                      <i className="ri-mail-line w-4 h-4 flex items-center justify-center text-foreground-400"></i>
                      <span className="text-xs font-label text-foreground-700 hidden sm:inline">
                        toritori@naver.com
                      </span>
                      <i className="ri-arrow-down-s-line w-3 h-3 flex items-center justify-center text-foreground-400"></i>
                    </button>
                    {showUserDropdown && (
                      <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 shadow-lg z-30 p-2">
                        <Link
                          to="/profile/edit"
                          className="block px-3 py-2.5 rounded-xl text-sm font-label text-foreground-800 hover:bg-primary-50 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          프로필 편집
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-3 py-2.5 rounded-xl text-sm font-label text-foreground-800 hover:bg-primary-50 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          설정
                        </Link>
                        <Link
                          to="/subscription"
                          className="block px-3 py-2.5 rounded-xl text-sm font-label text-foreground-800 hover:bg-primary-50 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          구독 관리
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Child profile */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary-100 mb-3 relative">
                      <img
                        src={CHILD_PROFILE.avatar}
                        alt={CHILD_PROFILE.name}
                        className="w-full h-full object-cover"
                      />
                      <Link
                        to="/profile/edit"
                        className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-background-50 border border-background-200 flex items-center justify-center cursor-pointer"
                      >
                        <i className="ri-pencil-line w-3 h-3 flex items-center justify-center text-foreground-400"></i>
                      </Link>
                    </div>
                    <p className="text-sm font-label text-foreground-950">
                      아이 이름: {CHILD_PROFILE.name} ({CHILD_PROFILE.age}세)
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-foreground-500 mb-2">
                      아이 관심사:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CHILD_PROFILE.interests.map((interest) => (
                        <span
                          key={interest}
                          className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary-100 text-secondary-900 text-xs font-label"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-foreground-500 mb-2">
                      최근 좋아한 감정:
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🧐</span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent-100 text-accent-900 text-xs font-label">
                        {CHILD_PROFILE.recentEmotion}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reading history */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <p className="text-sm font-label text-foreground-700 dark:text-foreground-900 mb-4">
                    읽은 동화 히스토리
                  </p>
                  <div className="space-y-3">
                    {READING_HISTORY.map((story) => (
                      <div
                        key={story.id}
                        className="flex items-center gap-3 rounded-xl bg-background-100 dark:bg-background-200 p-3"
                      >
                        <div className="w-10 h-10 rounded-xl bg-secondary-200 flex items-center justify-center flex-shrink-0">
                          <i className="ri-book-line w-5 h-5 flex items-center justify-center text-secondary-500"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-label text-foreground-950 truncate">
                            {story.title}
                          </p>
                          <p className="text-xs text-foreground-500">
                            {story.subtitle}
                          </p>
                        </div>
                        <span className="text-xs text-foreground-400 dark:text-foreground-600 flex-shrink-0">
                          {story.readAt}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reading report */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <p className="text-sm font-label text-foreground-700 dark:text-foreground-900 mb-4">
                    독서 리포트
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Monthly read */}
                    <div className="flex flex-col items-center rounded-xl bg-background-100 dark:bg-background-200 p-4">
                      <p className="text-xs text-foreground-500 dark:text-foreground-700 mb-2 text-center">
                        이번달 독서량
                      </p>
                      <div className="w-14 h-14 rounded-full border-2 border-primary-500 flex items-center justify-center mb-1">
                        <span className="text-sm font-label text-foreground-950">
                          {READING_REPORT.monthlyRead}/
                          {READING_REPORT.monthlyGoal}
                        </span>
                      </div>
                    </div>

                    {/* Avg time */}
                    <div className="flex flex-col items-center rounded-xl bg-background-100 dark:bg-background-200 p-4">
                      <p className="text-xs text-foreground-500 dark:text-foreground-700 mb-2 text-center">
                        평균 독서 시간
                      </p>
                      <div className="w-14 h-14 rounded-full border-2 border-accent-500 flex items-center justify-center mb-1">
                        <span className="text-sm font-label text-foreground-950">
                          {READING_REPORT.avgTime}
                        </span>
                      </div>
                    </div>

                    {/* Saved count */}
                    <div className="flex flex-col items-center rounded-xl bg-background-100 dark:bg-background-200 p-4">
                      <p className="text-xs text-foreground-500 dark:text-foreground-700 mb-2 text-center">
                        저장된 동화
                      </p>
                      <div className="w-14 h-14 rounded-full border-2 border-secondary-500 flex items-center justify-center mb-1">
                        <span className="text-sm font-label text-foreground-950">
                          {READING_REPORT.savedCount}편
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotif || showChildDropdown || showUserDropdown || showPeriodDropdown) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => {
            setShowNotif(false);
            setShowChildDropdown(false);
            setShowUserDropdown(false);
            setShowPeriodDropdown(false);
          }}
        ></div>
      )}
    </main>
  );
}
