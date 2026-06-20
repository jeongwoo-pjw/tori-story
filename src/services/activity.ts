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

// ── 연령 단계 판별 ────────────────────────────────────────────────

type AgeTier = 1 | 2 | 3;

function getAgeTier(age: number): AgeTier {
  if (age <= 4) return 1;
  if (age <= 7) return 2;
  return 3;
}

// ── 연령 단계별 독후활동 지침 ─────────────────────────────────────

interface ActivityTierSpec {
  tierLabel: string;
  comprehensionGuide: string;
  perspectiveGuide: string;
  vocabularyGuide: string;
  emotionGuide: string;
  creativeGuide: string;
  answerGuide: string;
}

const ACTIVITY_TIER_SPEC: Record<AgeTier, ActivityTierSpec> = {
  1: {
    tierLabel: "2~4세 (영유아)",
    comprehensionGuide:
      "동화에서 가장 기억에 남는 장면 하나를 고르는 단순 질문. 예: '주인공이 어떤 걸 했어요?' / '어디서 무슨 일이 일어났나요?'. 예/아니오로 답하거나 한 단어·한 문장으로 답할 수 있는 수준.",
    perspectiveGuide:
      "다른 등장인물(동물 친구 등)에게 감정 이입하는 쉬운 질문. 예: '○○가 기뻤을까요, 슬펐을까요?' / '○○라면 어떻게 했을까요?'. 2~3단어로 답할 수 있는 수준.",
    vocabularyGuide:
      "동화에 나온 1~2음절 쉬운 낱말 4개. 뜻은 그림으로 설명하듯 아주 짧게(한 어절~한 문장). 예시 문장은 5~8어절 이내의 짧은 문장.",
    emotionGuide:
      "동화를 읽고 느낀 감정을 고르는 질문. 예: '이 동화를 읽고 어떤 기분이 들었어요? 기뻐요, 슬퍼요, 신기해요?' 선택지를 제시하는 형태로.",
    creativeGuide:
      "동화 속 장면을 따라 그리거나 주인공에게 하고 싶은 말을 한 문장으로 적는 활동. 글쓰기보다 말하기·그리기 중심.",
    answerGuide:
      "모범답안은 2~3세 아이가 말할 법한 짧은 표현(1~2문장)으로. 어려운 단어 없이 구어체로.",
  },
  2: {
    tierLabel: "5~7세 (유아)",
    comprehensionGuide:
      "동화 내용을 이해했는지 확인하는 개방형 질문 1가지. 사건의 원인이나 결과를 묻는 형태. 예: '왜 주인공은 ○○을 했나요?' / '주인공이 ○○한 다음 어떻게 됐나요?'. 2~3문장으로 답할 수 있는 수준.",
    perspectiveGuide:
      "다른 등장인물의 시점에서 이야기를 바라보는 질문. 예: '○○의 입장에서 이 상황이 어떻게 느껴졌을까요?'. 감정과 이유를 함께 말하도록 유도.",
    vocabularyGuide:
      "동화에 나온 2~3음절 낱말 6개. 뜻은 한 문장으로 쉽게 설명. 예시 문장은 아이가 일상에서 쓸 수 있는 10~15어절 문장.",
    emotionGuide:
      "동화를 읽으며 느낀 감정과 그 이유를 함께 이야기하는 질문. 예: '이 동화를 읽고 어떤 감정이 느껴졌나요? 왜 그런 기분이 들었는지도 말해보세요.'",
    creativeGuide:
      "이야기의 결말을 바꾸거나 다음 이야기를 상상해서 2~3문장으로 써보는 활동. 힌트는 시작 문장 형태로 제공.",
    answerGuide:
      "모범답안은 5~7세 눈높이에서 2~3문장으로. 쉬운 어휘와 간단한 접속사 사용. 구어체 중심.",
  },
  3: {
    tierLabel: "8~9세 (아동)",
    comprehensionGuide:
      "동화의 주제나 인물의 심리 변화를 묻는 심층 질문. 예: '주인공이 마음을 바꾼 이유는 무엇인가요?' / '이 이야기에서 가장 중요한 교훈은 무엇이라고 생각하나요?'. 자신의 생각을 근거와 함께 3~5문장으로 표현할 수 있는 수준.",
    perspectiveGuide:
      "다른 등장인물의 관점에서 사건을 재해석하는 질문. 예: '만약 ○○가 이 이야기를 썼다면 어떤 부분을 다르게 썼을까요?'. 논리적 추론을 요구하는 형태.",
    vocabularyGuide:
      "동화에 나온 3음절 이상 어휘 또는 한자어·감정 어휘 6개. 뜻은 정확하게 한 문장으로. 예시 문장은 실생활과 연결되는 15~20어절 문장.",
    emotionGuide:
      "동화 속 상황과 연결하여 자신의 경험을 떠올리고 감정을 탐색하는 질문. 예: '이 동화에서 ○○가 ○○할 때 어떤 감정이 느껴졌나요? 비슷한 경험이 있다면 이야기해보세요.'",
    creativeGuide:
      "이야기를 이어서 쓰거나 결말을 완전히 바꾸는 창의 글쓰기. 인물의 성격과 이야기 흐름을 유지하면서 4~6문장 이상 써보도록 유도.",
    answerGuide:
      "모범답안은 8~9세 수준에서 3~5문장으로. 한자어·감정 어휘 포함 가능. 논리적 흐름(이유·근거 포함)이 있는 문어체.",
  },
};

// ── 프롬프트 빌더 ────────────────────────────────────────────────

function buildActivityPrompt(story: GeneratedStory, age: number): string {
  const tier = getAgeTier(age);
  const spec = ACTIVITY_TIER_SPEC[tier];

  const pagesText = story.pages
    .map((p, i) => `[${i + 1}페이지] ${p.text}`)
    .join("\n");

  return `동화 제목: "${story.title}"
동화 내용:
${pagesText}

위 동화를 읽은 아이(${age}세, ${spec.tierLabel})를 위한 독후활동 자료를 생성해주세요.

━━━ 연령 단계 지침 [${spec.tierLabel}] ━━━
이 지침을 반드시 준수하여 각 활동을 구성하세요.

[이해 확인 질문] ${spec.comprehensionGuide}
[관점 바꾸기 질문] ${spec.perspectiveGuide}
[낱말 카드] ${spec.vocabularyGuide}
[감정 탐색 질문] ${spec.emotionGuide}
[창의 활동] ${spec.creativeGuide}
[모범답안 기준] ${spec.answerGuide}

JSON만 반환하세요. 다른 텍스트는 절대 포함하지 마세요.

{
  "comprehension": {
    "question": "${spec.tierLabel}에 맞는 이해 확인 질문",
    "modelAnswer": "${spec.tierLabel} 눈높이 모범답안"
  },
  "perspective": {
    "question": "${spec.tierLabel}에 맞는 관점 바꾸기 질문"
  },
  "vocabulary": [
    {"word": "낱말1", "meaning": "뜻 (${tier === 1 ? "한 어절~한 문장" : "한 문장"})", "example": "예시 문장"},
    {"word": "낱말2", "meaning": "뜻", "example": "예시 문장"},
    {"word": "낱말3", "meaning": "뜻", "example": "예시 문장"}${tier !== 1 ? `,
    {"word": "낱말4", "meaning": "뜻", "example": "예시 문장"},
    {"word": "낱말5", "meaning": "뜻", "example": "예시 문장"},
    {"word": "낱말6", "meaning": "뜻", "example": "예시 문장"}` : ""}
  ],
  "emotion": {
    "question": "${spec.tierLabel}에 맞는 감정 탐색 질문"
  },
  "creative": {
    "prompt": "${spec.tierLabel}에 맞는 창의 활동 주제",
    "hint": "활동을 도와주는 힌트 (1문장)"
  }
}`;
}

// ── API 호출 ──────────────────────────────────────────────────────

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

  // 1단계는 낱말 카드를 4개로 제한 (프롬프트에서 3개 요청했지만 API가 더 줄 수도 있음)
  const tier = getAgeTier(age);
  if (tier === 1 && parsed.vocabulary) {
    parsed.vocabulary = parsed.vocabulary.slice(0, 4);
  }

  const result: ActivityData = { storyId, ...parsed };
  saveActivityData(result);
  return result;
}
