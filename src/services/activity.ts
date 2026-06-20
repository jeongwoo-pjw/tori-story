import type { GeneratedStory } from "./solar";

export interface VocabCard {
  word: string;
  meaning: string;
  example: string;
}

export interface ActivityData {
  storyId: string;
  comprehension: {
    question: string;
    modelAnswer: string;
  };
  perspective: {
    question: string;
  };
  vocabulary: VocabCard[];
  emotion: {
    question: string;
  };
  creative: {
    prompt: string;
    hint: string;
  };
}

const ACTIVITY_PREFIX = "tori_activity_";

export function getActivityData(storyId: string): ActivityData | null {
  try {
    const raw = localStorage.getItem(`${ACTIVITY_PREFIX}${storyId}`);
    return raw ? (JSON.parse(raw) as ActivityData) : null;
  } catch {
    return null;
  }
}

function saveActivityData(data: ActivityData) {
  localStorage.setItem(`${ACTIVITY_PREFIX}${data.storyId}`, JSON.stringify(data));
}

function buildActivityPrompt(story: GeneratedStory, age: number): string {
  const pagesText = story.pages
    .map((p, i) => `[${i + 1}페이지] ${p.text}`)
    .join("\n");

  return `동화 제목: "${story.title}"
동화 내용:
${pagesText}

위 동화를 읽은 아이(${age}세)를 위한 독후활동 자료를 아래 JSON 형식으로 생성해주세요.
JSON만 반환하세요. 다른 텍스트는 절대 포함하지 마세요.

{
  "comprehension": {
    "question": "동화 내용을 이해했는지 확인하는 질문 1가지 (개방형)",
    "modelAnswer": "모범 답안 (2-3문장, ${age}세 눈높이)"
  },
  "perspective": {
    "question": "다른 등장인물의 시점에서 이야기를 다시 바라보는 관점 바꾸기 질문"
  },
  "vocabulary": [
    {"word": "동화에 나온 낱말1", "meaning": "뜻 (한 문장)", "example": "예시 문장"},
    {"word": "동화에 나온 낱말2", "meaning": "뜻", "example": "예시 문장"},
    {"word": "동화에 나온 낱말3", "meaning": "뜻", "example": "예시 문장"},
    {"word": "동화에 나온 낱말4", "meaning": "뜻", "example": "예시 문장"},
    {"word": "동화에 나온 낱말5", "meaning": "뜻", "example": "예시 문장"},
    {"word": "동화에 나온 낱말6", "meaning": "뜻", "example": "예시 문장"}
  ],
  "emotion": {
    "question": "이 동화를 읽으며 어떤 감정이 느껴졌나요? (동화 내용과 연결된 감정 탐색 질문)"
  },
  "creative": {
    "prompt": "이야기를 이어서 쓰거나 결말을 바꾸는 창의 글쓰기 주제",
    "hint": "글쓰기를 도와주는 힌트 (1문장)"
  }
}`;
}

export async function generateActivityData(
  storyId: string,
  story: GeneratedStory,
  age: number
): Promise<ActivityData> {
  const existing = getActivityData(storyId);
  if (existing) return existing;

  const apiKey = import.meta.env.VITE_SOLAR_API_KEY;
  if (!apiKey) throw new Error("VITE_SOLAR_API_KEY가 설정되지 않았습니다.");

  const response = await fetch("https://api.upstage.ai/v1/solar/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "solar-pro",
      messages: [{ role: "user", content: buildActivityPrompt(story, age) }],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Solar API 오류 (${response.status}): ${text}`);
  }

  const data = await response.json();
  const content: string = data.choices[0].message.content;

  let parsed: Omit<ActivityData, "storyId">;
  try {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("JSON not found");
    parsed = JSON.parse(match[0]);
  } catch {
    throw new Error("활동 데이터 파싱 실패: " + content.slice(0, 200));
  }

  const result: ActivityData = { storyId, ...parsed };
  saveActivityData(result);
  return result;
}
