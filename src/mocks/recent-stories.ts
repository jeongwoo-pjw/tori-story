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
    id: "s-001",
    title: "도깨비 방망이와 지우의 모험",
    hero: "지우",
    date: "2026.06.14",
    tag: "도깨비 · 용기",
    cover:
      "https://readdy.ai/api/search-image?query=Cute%20Korean%20children%20fairytale%20book%20cover%20illustration%2C%20small%20kid%20wearing%20hanbok%20holding%20a%20glowing%20dokkaebi%20magic%20club%2C%20friendly%20cartoon%20goblin%20character%20with%20round%20horns%20in%20background%2C%20pastel%20pink%20and%20cream%20background%2C%20soft%20warm%20lighting%2C%20rounded%20shapes%2C%20storybook%20gouache%20illustration%2C%20harmonious%20composition%20with%20twinkling%20stars&width=600&height=800&seq=story-cover-dokkaebi-01&orientation=portrait",
  },
  {
    id: "s-002",
    title: "한옥 마을의 작은 호랑이 친구",
    hero: "서윤",
    date: "2026.06.10",
    tag: "한옥 · 우정",
    cover:
      "https://readdy.ai/api/search-image?query=Cute%20Korean%20fairytale%20book%20cover%2C%20little%20girl%20in%20traditional%20hanbok%20hugging%20a%20small%20friendly%20cartoon%20tiger%20cub%20inside%20a%20cozy%20hanok%20village%20courtyard%2C%20pastel%20peach%20cream%20background%2C%20soft%20pink%20cherry%20blossoms%2C%20rounded%20gentle%20shapes%2C%20warm%20storybook%20gouache%20illustration&width=600&height=800&seq=story-cover-tiger-02&orientation=portrait",
  },
  {
    id: "s-003",
    title: "설날 밤, 별빛 떡국 이야기",
    hero: "지호",
    date: "2026.06.05",
    tag: "설날 · 가족",
    cover:
      "https://readdy.ai/api/search-image?query=Korean%20fairytale%20cover%20illustration%2C%20family%20enjoying%20Seollal%20Lunar%20New%20Year%20night%2C%20small%20children%20in%20hanbok%20eating%20rice%20cake%20soup%20tteokguk%20under%20twinkling%20starry%20sky%2C%20warm%20cozy%20interior%2C%20pastel%20cream%20background%2C%20rounded%20gentle%20shapes%2C%20soft%20gouache%20storybook%20style&width=600&height=800&seq=story-cover-seollal-03&orientation=portrait",
  },
  {
    id: "s-004",
    title: "제주 바람과 작은 해녀의 노래",
    hero: "유나",
    date: "2026.06.01",
    tag: "제주 · 자연",
    cover:
      "https://readdy.ai/api/search-image?query=Cute%20Korean%20fairytale%20book%20cover%2C%20little%20girl%20haenyeo%20diver%20with%20snorkel%20mask%20on%20Jeju%20island%20beach%2C%20soft%20ocean%20waves%2C%20friendly%20dolphin%20peeking%20out%2C%20pastel%20pink%20cream%20sky%2C%20rounded%20gentle%20shapes%2C%20warm%20gouache%20storybook%20illustration%2C%20harmonious%20composition&width=600&height=800&seq=story-cover-jeju-04&orientation=portrait",
  },
  {
    id: "s-005",
    title: "탈춤 추는 토끼 달이",
    hero: "민준",
    date: "2026.05.28",
    tag: "탈춤 · 지혜",
    cover:
      "https://readdy.ai/api/search-image?query=Korean%20fairytale%20cover%20illustration%2C%20cute%20cartoon%20rabbit%20dancing%20traditional%20Korean%20mask%20dance%20talchum%20holding%20a%20colorful%20wooden%20mask%2C%20small%20child%20cheering%20in%20background%2C%20pastel%20peach%20pink%20background%2C%20rounded%20gentle%20shapes%2C%20warm%20gouache%20storybook%20illustration&width=600&height=800&seq=story-cover-talchum-05&orientation=portrait",
  },
  {
    id: "s-006",
    title: "한복 입은 아기 별의 첫 여행",
    hero: "다온",
    date: "2026.05.20",
    tag: "한복 · 자연",
    cover:
      "https://readdy.ai/api/search-image?query=Cute%20Korean%20fairytale%20cover%20illustration%2C%20baby%20star%20character%20wearing%20small%20pink%20hanbok%20floating%20gently%20over%20night%20sky%2C%20friendly%20cloud%20friends%20around%2C%20pastel%20cream%20and%20soft%20pink%20background%20with%20twinkling%20stars%2C%20rounded%20gentle%20shapes%2C%20warm%20gouache%20storybook%20illustration&width=600&height=800&seq=story-cover-star-06&orientation=portrait",
  },
];
