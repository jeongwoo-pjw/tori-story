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
  { day: "월", value: 4 },
  { day: "화", value: 9 },
  { day: "수", value: 14 },
  { day: "목", value: 18 },
  { day: "금", value: 23 },
  { day: "토", value: 27 },
  { day: "일", value: 30 },
];

export const LAST_WEEK_READING_DATA = [
  { day: "월", value: 3 },
  { day: "화", value: 7 },
  { day: "수", value: 12 },
  { day: "목", value: 16 },
  { day: "금", value: 20 },
  { day: "토", value: 24 },
  { day: "일", value: 28 },
];

export const MONTHLY_READING_DATA = [
  { day: "1",  value: 0  }, { day: "2",  value: 1  }, { day: "3",  value: 1  },
  { day: "4",  value: 2  }, { day: "5",  value: 3  }, { day: "6",  value: 3  },
  { day: "7",  value: 5  }, { day: "8",  value: 6  }, { day: "9",  value: 7  },
  { day: "10", value: 8  }, { day: "11", value: 9  }, { day: "12", value: 9  },
  { day: "13", value: 11 }, { day: "14", value: 12 }, { day: "15", value: 13 },
  { day: "16", value: 14 }, { day: "17", value: 15 }, { day: "18", value: 15 },
  { day: "19", value: 17 }, { day: "20", value: 18 }, { day: "21", value: 19 },
  { day: "22", value: 20 }, { day: "23", value: 21 }, { day: "24", value: 21 },
  { day: "25", value: 23 }, { day: "26", value: 25 }, { day: "27", value: 26 },
  { day: "28", value: 27 }, { day: "29", value: 29 }, { day: "30", value: 30 },
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
    title: "'한옥' 관련 탐색 낱말을 찾아보고 질문해요",
    icon: "🏯",
    color: "text-primary-600",
  },
  {
    id: 2,
    title: "'바다' 공간이 연출될 때 마음 퀴즈 버튼을 집중해서 가장 먼저 터치해요",
    icon: "🌊",
    color: "text-accent-600",
  },
  {
    id: 3,
    title: "동화 줄거리 순서와 퀴즈의 대화 맥락을 골고루 파악하며 대답 수치도 고르게 뛰어나요",
    icon: "🧠",
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
