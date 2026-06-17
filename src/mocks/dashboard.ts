export const CHILD_PROFILE = {
  name: "한담이",
  age: 6,
  interests: ["한복", "바다", "동물"],
  recentEmotion: "호기심",
  avatar: "https://readdy.ai/api/search-image?query=Cute%20korean%20child%20character%20avatar%20illustration%20soft%20pastel%20colors%20round%20friendly%20face%20simple%20clean%20background%20children%20book%20art%20style&width=120&height=120&seq=dashboard-avatar-01&orientation=squarish",
};

export const READING_HISTORY = [
  {
    id: 1,
    title: "토끼와 달빛 숲",
    subtitle: "최근 읽은 동화",
    readAt: "25:03 읽음",
  },
  {
    id: 2,
    title: "거북이의 도전",
    subtitle: "3번 이상 다시 읽은 동화",
    readAt: "14:03 읽음",
  },
  {
    id: 3,
    title: "반짝반짝 작은 별",
    subtitle: "독후기록에 적힌 동화",
    readAt: "14:03 읽음",
  },
];

export const READING_REPORT = {
  monthlyGoal: 23,
  monthlyRead: 12,
  avgTime: "12분",
  savedCount: 12,
};

export const NOTIFICATIONS = [
  {
    id: 1,
    message: "오늘의 동화 추천이 도착했어요!",
    unread: true,
  },
  {
    id: 2,
    message: "한담이가 '토끼와 달빛 숲'을 완독했어요",
    unread: false,
  },
];

export const FOCUS_SETTINGS = {
  enabled: true,
  readingTime: { hours: 1, minutes: 46 },
  remainingTime: "32:10",
  autoStop: true,
};

export const WEEKLY_READING_DATA = [
  { day: "월", value: 120 },
  { day: "화", value: 148 },
  { day: "수", value: 160 },
  { day: "목", value: 192 },
  { day: "금", value: 210 },
  { day: "토", value: 248 },
  { day: "일", value: 272 },
];

export const LAST_WEEK_READING_DATA = [
  { day: "월", value: 85 },
  { day: "화", value: 102 },
  { day: "수", value: 118 },
  { day: "목", value: 135 },
  { day: "금", value: 158 },
  { day: "토", value: 175 },
  { day: "일", value: 198 },
];

export const MONTHLY_READING_DATA = [
  { day: "1", value: 28 },
  { day: "2", value: 36 },
  { day: "3", value: 52 },
  { day: "4", value: 65 },
  { day: "5", value: 78 },
  { day: "6", value: 85 },
  { day: "7", value: 102 },
  { day: "8", value: 115 },
  { day: "9", value: 122 },
  { day: "10", value: 139 },
  { day: "11", value: 148 },
  { day: "12", value: 160 },
  { day: "13", value: 172 },
  { day: "14", value: 190 },
  { day: "15", value: 198 },
  { day: "16", value: 215 },
  { day: "17", value: 222 },
  { day: "18", value: 238 },
  { day: "19", value: 248 },
  { day: "20", value: 255 },
  { day: "21", value: 268 },
  { day: "22", value: 278 },
  { day: "23", value: 285 },
  { day: "24", value: 298 },
  { day: "25", value: 310 },
  { day: "26", value: 318 },
  { day: "27", value: 332 },
  { day: "28", value: 340 },
  { day: "29", value: 355 },
  { day: "30", value: 368 },
];

// New: emotion data for pie chart
export const EMOTION_DATA = [
  { label: "기쁨", value: 64, color: "bg-primary-500" },
  { label: "놀람", value: 20, color: "bg-accent-500" },
  { label: "슬픔", value: 18, color: "bg-secondary-500" },
];

// New: recommendation cards
export const RECOMMENDATIONS = [
  {
    id: 1,
    title: "공룡 이야기를 자주 선택해요",
    icon: "ri-earthquake-line",
    color: "text-primary-600",
  },
  {
    id: 2,
    title: "밤 배경 이야기에서 집중 시간이 길어요",
    icon: "ri-moon-line",
    color: "text-accent-600",
  },
  {
    id: 3,
    title: "우서준 장면은 빠르게 넘기는 경향이 있어요",
    icon: "ri-arrow-right-line",
    color: "text-secondary-600",
  },
];

// New: children list for selection cards
export const CHILDREN_LIST = [
  {
    id: "c1",
    name: "김담이",
    age: 5,
    recent: "최근 읽은 동화: 신규 2개",
    favGenre: "동화",
    lastRead: 5,
  },
  {
    id: "c2",
    name: "김둘째",
    age: 3,
    recent: "최근 읽은 동화: 선규 5개",
    favGenre: "동화",
    lastRead: 2,
  },
];
