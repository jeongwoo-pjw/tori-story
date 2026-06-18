export type RecentStory = {
  id: string;
  title: string;
  hero: string;
  date: string;
  tag: string;
  cover: string;
};

export const recentStories: RecentStory[] = [
  {
    id: "s-004",
    title: "제주 바람과 작은 해녀의 노래",
    hero: "유나",
    date: "2026.06.01",
    tag: "제주 · 자연",
    cover: `${__BASE_PATH__}story-jeju.png`,
  },
  {
    id: "s-005",
    title: "탈춤 추는 토끼 달이",
    hero: "민준",
    date: "2026.05.28",
    tag: "탈춤 · 지혜",
    cover: `${__BASE_PATH__}story-talchum.png`,
  },
  {
    id: "s-001",
    title: "도깨비 방망이와 지우의 모험",
    hero: "지우",
    date: "2026.06.14",
    tag: "도깨비 · 용기",
    cover: `${__BASE_PATH__}story-dokkaebi.png`,
  },
  {
    id: "s-006",
    title: "한복 입은 아기 별의 첫 여행",
    hero: "다온",
    date: "2026.05.20",
    tag: "한복 · 자연",
    cover: `${__BASE_PATH__}story-star.png`,
  },
  {
    id: "s-003",
    title: "설날 밤, 별빛 떡국 이야기",
    hero: "지호",
    date: "2026.06.05",
    tag: "설날 · 가족",
    cover: `${__BASE_PATH__}story-seollal.png`,
  },
];
