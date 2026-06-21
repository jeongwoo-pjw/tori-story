import type { GeneratedStory, StoryRequest, DashboardAnalysis } from "./solar";

export interface LibraryEntry {
  id: string;
  title: string;
  tag: string;
  createdAt: string;      // "YYYY.MM.DD"
  status: "reading" | "completed";
  lastReadAt: string;     // ISO date string
  image: string;
  liked: boolean;
  progress: number;       // 0–100
  age: number;
}

export interface AnalyticsRecord {
  date: string;           // "YYYY-MM-DD"
  storyId: string;
  storyTitle: string;
  emotionChoice?: string;
  completedActivities: string[];
  vocabCount: number;
}

const LIBRARY_KEY = "tori_library";
const STORY_PREFIX = "tori_story_";
const ANALYTICS_KEY = "tori_analytics";

export function getLibrary(): LibraryEntry[] {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    return raw ? (JSON.parse(raw) as LibraryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveLibrary(entries: LibraryEntry[]) {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent("tori:library-updated"));
}

export function addToLibrary(story: GeneratedStory, request: StoryRequest, thumbnailImage?: string): LibraryEntry {
  const id = `s-${Date.now()}`;
  const now = new Date();
  const createdAt = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;

  const topicParts = [...(request.topics ?? [])];
  if (request.customTopic?.trim()) topicParts.push(request.customTopic.trim());
  const tag = topicParts.slice(0, 2).join(" · ") || "동화";

  const entry: LibraryEntry = {
    id,
    title: story.title,
    tag,
    createdAt,
    status: "reading",
    lastReadAt: now.toISOString(),
    image: thumbnailImage ?? story.pages[0]?.image ?? "",
    liked: false,
    progress: 0,
    age: request.age ?? 5,
  };

  localStorage.setItem(`${STORY_PREFIX}${id}`, JSON.stringify(story));
  // 같은 주인공 이름의 기존 항목을 제거하고 새 항목으로 교체
  const existing = getLibrary().filter((e) => !e.title.includes(request.name));
  saveLibrary([entry, ...existing]);
  return entry;
}

export function getStoryById(id: string): GeneratedStory | null {
  try {
    const raw = localStorage.getItem(`${STORY_PREFIX}${id}`);
    return raw ? (JSON.parse(raw) as GeneratedStory) : null;
  } catch {
    return null;
  }
}

export function updateStoryStatus(
  id: string,
  progress: number,
  status: "reading" | "completed",
  liked?: boolean
) {
  const library = getLibrary();
  const idx = library.findIndex((e) => e.id === id);
  if (idx === -1) return;
  library[idx] = {
    ...library[idx],
    progress,
    status,
    lastReadAt: new Date().toISOString(),
    ...(liked !== undefined ? { liked } : {}),
  };
  saveLibrary(library);
}

export function getLastReadLabel(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);
  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  return `${diffDays}일 전`;
}

// ── analytics ─────────────────────────────────────────────

export function getAnalytics(): AnalyticsRecord[] {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    return raw ? (JSON.parse(raw) as AnalyticsRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveAnalyticsRecord(record: AnalyticsRecord) {
  const records = getAnalytics();
  const existing = records.findIndex((r) => r.storyId === record.storyId && r.date === record.date);
  if (existing >= 0) {
    records[existing] = { ...records[existing], ...record };
  } else {
    records.push(record);
  }
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(records));
}

/** 최근 N일의 날짜별 어휘 습득량 계산 */
export function computeVocabGrowth(days: 7 | 30): { day: string; value: number }[] {
  const records = getAnalytics();
  const result: { day: string; value: number }[] = [];
  const today = new Date();
  let cumulative = 0;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayRecords = records.filter((r) => r.date === key);
    const dayVocab = dayRecords.reduce((sum, r) => sum + r.vocabCount, 0);
    cumulative += dayVocab;
    const label = days === 7
      ? ["일", "월", "화", "수", "목", "금", "토"][d.getDay()]
      : String(d.getDate());
    result.push({ day: label, value: cumulative });
  }
  return result;
}

/** 감정 분포 계산 */
export function computeEmotionDistribution(): { label: string; value: number; color: string }[] {
  const records = getAnalytics();
  const counts: Record<string, number> = {};
  for (const r of records) {
    if (r.emotionChoice) {
      const name = r.emotionChoice.replace(/^\S+\s/, ""); // 이모지 제거
      counts[name] = (counts[name] ?? 0) + 1;
    }
  }
  const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1;
  const COLORS = ["bg-primary-500", "bg-accent-500", "bg-secondary-500", "bg-emerald-500", "bg-violet-500"];
  return Object.entries(counts).map(([label, count], i) => ({
    label,
    value: Math.round((count / total) * 100),
    color: COLORS[i % COLORS.length],
  }));
}

// ── 대시보드 통계 ──────────────────────────────────────────────────

export function computeWeeklyStats() {
  const library = getLibrary();
  const analytics = getAnalytics();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weeklyCompleted = library.filter(
    (e) => e.status === "completed" && new Date(e.lastReadAt) >= weekAgo
  ).length;

  const weeklyVocab = analytics
    .filter((a) => new Date(a.date) >= weekAgo)
    .reduce((sum, a) => sum + a.vocabCount, 0);

  return { weeklyCompleted, weeklyVocab };
}

export function computeMonthlyStats() {
  const library = getLibrary();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyCompleted = library.filter(
    (e) => e.status === "completed" && new Date(e.lastReadAt) >= startOfMonth
  ).length;

  return { monthlyCompleted };
}

export function computeReadingStreak() {
  const analytics = getAnalytics();
  if (analytics.length === 0) return 0;

  const uniqueDates = [...new Set(analytics.map((a) => a.date))].sort().reverse();
  let streak = 0;
  const cursor = new Date();

  for (const dateStr of uniqueDates) {
    if (dateStr === cursor.toISOString().slice(0, 10)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// ── 대시보드 분석 캐시 ─────────────────────────────────────────────

const DASHBOARD_ANALYSIS_KEY = "tori_dashboard_analysis";
const ANALYSIS_TTL_MS = 60 * 60 * 1000; // 1시간

export function getCachedDashboardAnalysis(libraryLength: number): DashboardAnalysis | null {
  try {
    const raw = localStorage.getItem(DASHBOARD_ANALYSIS_KEY);
    if (!raw) return null;
    const { data, timestamp, cachedLength } = JSON.parse(raw);
    if (Date.now() - timestamp > ANALYSIS_TTL_MS) return null;
    if (cachedLength !== libraryLength) return null;
    return data as DashboardAnalysis;
  } catch {
    return null;
  }
}

export function setCachedDashboardAnalysis(data: DashboardAnalysis, libraryLength: number) {
  localStorage.setItem(
    DASHBOARD_ANALYSIS_KEY,
    JSON.stringify({ data, timestamp: Date.now(), cachedLength: libraryLength })
  );
}

/** 최근 읽은 동화 히스토리 */
export function computeReadingHistory(limit = 5) {
  return getLibrary()
    .slice(0, limit)
    .map((e) => ({
      id: e.id,
      title: e.title,
      readAt: getLastReadLabel(e.lastReadAt),
      emoji: "📖",
    }));
}
