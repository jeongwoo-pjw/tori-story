export interface StoryPage {
  text: string;
  image: string;
}

export interface GeneratedStory {
  title: string;
  pages: StoryPage[];
}

export interface StoryRequest {
  name: string;
  age: number;
  topics: string[];
  motifs: string[];
  artStyle: string;
  length: "short" | "normal" | "long";
  gender?: string;
  moral?: string;
  customTopic?: string;
}

const ART_STYLE_DESC: Record<string, string> = {
  watercolor: "watercolor painting style soft pastel colors dreamy gentle",
  fairytale: "classic children book illustration warm rich colors storybook",
  pixel: "pixel art style retro colorful blocky charming",
  ink: "ink sketch pen and ink drawing delicate lines monochrome",
};

// ── 연령 단계 판별 ──────────────────────────────────────────────

type AgeTier = 1 | 2 | 3;

function getAgeTier(age: number): AgeTier {
  if (age <= 4) return 1;
  if (age <= 7) return 2;
  return 3;
}

// ── 연령 단계별 프롬프트 지침 ────────────────────────────────────
// 참고: 2025년 문해력 교육을 위한 그림책의 수준 평정기준 개발 연구 (KCI)
// Fountas & Pinnell(1996) 10가지 텍스트 특성 기반 한국형 8개 범주 적용

interface AgeTierSpec {
  tierLabel: string;
  linesPerPage: string;
  sentenceRule: string;
  vocabularyRule: string;
  characterAgeRule: string;
  structureRule: string;
  exampleWords: string;
}

const AGE_TIER_SPEC: Record<AgeTier, AgeTierSpec> = {
  1: {
    tierLabel: "2~4세 수준 (초기 문해 단계 1~3)",
    linesPerPage: "페이지당 1줄 (최대 2줄). 한 문장이 한 줄을 넘지 않도록 짧게.",
    sentenceRule:
      "주어+서술어 단문 구조만 사용. 문장 길이는 6~10어절 이내. 의성어·의태어(퐁당, 냠냠, 깡충깡충, 폭신폭신 등) 적극 활용. 반복 패턴 문장 권장.",
    vocabularyRule:
      "1~2음절 기본 어휘만 사용. 예) 엄마, 아빠, 밥, 물, 해, 달, 꽃, 나무, 강아지, 고양이, 아기, 손, 발, 눈, 코, 입. 한자어·외래어·추상어 절대 사용 금지. 아이가 일상에서 이미 듣는 말만 사용.",
    characterAgeRule:
      `주인공 나이는 ${0}~4세 영유아 또는 그와 비슷한 아기 동물 캐릭터로 설정하여 독자(2~4세)가 공감할 수 있도록 함.`,
    structureRule:
      "하루 일상(밥 먹기, 목욕, 잠자리 등) 또는 단순한 탐색·발견 구조. 기승전결 불필요. 따뜻하고 안심되는 결말.",
    exampleWords: "예시 어휘: 뽀글뽀글, 도란도란, 살금살금, 아장아장, 엄마, 따뜻해, 맛있어",
  },
  2: {
    tierLabel: "5~7세 수준 (초기 문해 단계 4~7)",
    linesPerPage: "페이지당 2~3줄. 한 문장은 15어절 이내.",
    sentenceRule:
      "단문과 접속 복문(~하고, ~해서, ~했지만) 혼용 가능. 대화문 포함 권장. 감정 표현 문장 포함.",
    vocabularyRule:
      "2~3음절 생활 어휘 중심. 예) 궁금하다, 신기하다, 도와주다, 친구, 모험, 약속, 용기, 나누다. 낯선 어휘는 문맥으로 뜻을 유추할 수 있게 앞뒤 설명 포함. 한자어 최소화, 쉬운 표현 우선.",
    characterAgeRule:
      `주인공 나이는 5~7세 어린이 또는 그에 상응하는 어린 동물 캐릭터. 독자와 비슷한 또래가 겪을 법한 상황(유치원, 친구 사귀기, 새로운 경험) 반영.`,
    structureRule:
      "기승전결 구조. 문제 상황 발생 → 주인공이 고민·도전 → 해결 → 교훈·여운. 감정 변화 흐름 포함.",
    exampleWords: "예시 어휘: 두근두근, 설레다, 포기하지 않다, 서로 돕다, 소중하다, 자랑스럽다",
  },
  3: {
    tierLabel: "8~9세 수준 (초기 문해 단계 8~10)",
    linesPerPage: "페이지당 2~3줄. 한 문장은 20어절 이내.",
    sentenceRule:
      "복문·접속절·종속절 자유롭게 사용. 비유·묘사 표현 가능. 인물의 내면 심리 서술 포함.",
    vocabularyRule:
      "3음절 이상 어휘, 한자어(노력, 용기, 책임, 지혜, 배려), 감정 어휘(후회스럽다, 뿌듯하다, 간절하다), 한국 문화 전통 어휘(두레, 정(情), 나눔) 적극 사용. 문맥 속에서 자연스럽게 어휘 뜻 드러나도록 서술.",
    characterAgeRule:
      `주인공 나이는 7~9세 어린이 또는 성숙한 동물 캐릭터. 도덕적 선택·갈등·성장 경험을 통해 독자(8~9세)가 깊이 공감하고 사고할 수 있는 서사.`,
    structureRule:
      "입체적 기승전결. 복수의 갈등 구조 가능. 주인공의 내면 성장, 관계 변화, 가치관 형성을 중심으로 전개. 여운 있는 열린 결말 가능.",
    exampleWords: "예시 어휘: 간절히, 후회, 책임감, 보람차다, 서로의 마음, 정성을 다해, 지혜롭게",
  },
};

// ── 프롬프트 빌더 ────────────────────────────────────────────────

function buildPrompt(req: StoryRequest): string {
  const pageCount = req.length === "short" ? 6 : req.length === "normal" ? 10 : 15;
  const topics = [...req.topics, req.customTopic?.trim()]
    .filter(Boolean)
    .join(", ");
  const motifs = req.motifs.join(", ");

  const tier = getAgeTier(req.age);
  const spec = AGE_TIER_SPEC[tier];
  const genderText =
    req.gender === "boy" ? ", 남자아이" : req.gender === "girl" ? ", 여자아이" : "";

  // 1단계(2~4세)는 characterAgeRule에 실제 age 범위가 고정돼야 하므로 치환
  const characterAgeRule =
    tier === 1
      ? `주인공 나이는 2~4세 영유아 또는 그와 비슷한 아기 동물 캐릭터로 설정하여 독자(2~4세)가 공감할 수 있도록 함.`
      : spec.characterAgeRule;

  return `당신은 한국 문화를 사랑하는 아동 동화 작가입니다.
아래 조건에 맞는 한국어 동화를 작성해주세요.

주인공: ${req.name || "주인공"} (${req.age}세${genderText})
주제: ${topics || "우정과 용기"}
${motifs ? `한국 문화 요소: ${motifs}` : ""}
${req.moral ? `전달할 교훈: ${req.moral}` : ""}

━━━ 연령 단계 지침 [${spec.tierLabel}] ━━━
[텍스트 분량] ${spec.linesPerPage}
[문장 규칙] ${spec.sentenceRule}
[어휘 기준] ${spec.vocabularyRule}
[캐릭터 연령] ${characterAgeRule}
[서사 구조] ${spec.structureRule}
[참고 어휘 예시] ${spec.exampleWords}

이 연령 지침을 철저히 준수하는 것이 가장 중요합니다.
${tier === 1 ? "※ 1단계: 절대로 어려운 단어·긴 문장·추상적 개념을 쓰지 마세요. 아기가 엄마에게 들을 법한 말만 사용하세요." : ""}
${tier === 3 ? "※ 3단계: 어휘와 서사의 깊이를 높이되, 초등 2~3학년이 이해할 수 있는 범위를 유지하세요." : ""}

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요:
{
  "title": "동화 제목",
  "imageKeyword": "핵심 장면을 영어로 한 문장 (이미지 검색용)",
  "pages": [
    {"text": "페이지 내용", "sceneKeyword": "이 페이지 장면을 영어로 한 문장"},
    ...
  ]
}

조건:
- 총 ${pageCount}페이지
- 각 페이지 텍스트는 위 [텍스트 분량] 지침을 엄수
- 한국의 문화적 요소를 자연스럽게 녹여주세요
- imageKeyword와 sceneKeyword는 영어로만 작성`;
}

// ── API 호출 ──────────────────────────────────────────────────────

export async function generateStory(req: StoryRequest): Promise<GeneratedStory> {
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
      messages: [{ role: "user", content: buildPrompt(req) }],
      temperature: 0.85,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Solar API 오류 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content: string = data.choices[0].message.content;

  let parsed: {
    title: string;
    imageKeyword: string;
    pages: { text: string; sceneKeyword: string }[];
  };

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON을 찾을 수 없습니다.");
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Solar API 응답 파싱 실패: " + content.slice(0, 200));
  }

  const styleDesc = ART_STYLE_DESC[req.artStyle] ?? ART_STYLE_DESC.watercolor;

  const pages: StoryPage[] = parsed.pages.map((page, i) => {
    const scene = page.sceneKeyword ?? parsed.imageKeyword ?? "Korean fairy tale scene";
    const query = encodeURIComponent(
      `${scene} ${styleDesc} Korean fairy tale children book art warm magical`
    );
    return {
      text: page.text,
      image: `https://readdy.ai/api/search-image?query=${query}&width=1200&height=600&seq=solar-p${i}&orientation=landscape`,
    };
  });

  return { title: parsed.title, pages };
}

export const STORY_REQUEST_KEY = "tori_story_request";
export const STORY_RESULT_KEY = "tori_story_result";

// ── 대시보드 데이터 분석 ──────────────────────────────────────────

export interface DashboardAnalysis {
  mainInterest: string;
  mainEmotion: string;
  personalityInsight: string;
  repeatThemes: Array<{ icon: string; title: string }>;
  readingInsight: string;
}

export async function analyzeChildData(params: {
  childName: string;
  childAge: number;
  tags: string[];
  titles: string[];
  emotions: string[];
  totalVocab: number;
}): Promise<DashboardAnalysis> {
  const apiKey = import.meta.env.VITE_SOLAR_API_KEY;
  if (!apiKey) throw new Error("VITE_SOLAR_API_KEY가 설정되지 않았습니다.");

  const tagList = params.tags.slice(0, 20).join(", ") || "없음";
  const titleList = params.titles.slice(0, 10).join(", ") || "없음";
  const emotionList = params.emotions.filter(Boolean).slice(0, 20).join(", ") || "없음";

  const prompt = `당신은 아동 독서 성향 분석 전문가입니다.
아래 아이의 독서 기록을 분석하여 JSON으로만 응답하세요.

아이: ${params.childName} (${params.childAge}세)
읽은 동화 주제 태그: ${tagList}
읽은 동화 제목: ${titleList}
감정 반응 기록: ${emotionList}
누적 어휘 학습: ${params.totalVocab}개

아래 JSON 형식으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요:
{
  "mainInterest": "주요 관심사 2단어 이내",
  "mainEmotion": "주로 느끼는 감정 1단어",
  "personalityInsight": "아이 성향 분석 문장 40자 이내 (~해요 말투)",
  "repeatThemes": [
    {"icon": "이모지 1개", "title": "반복 테마 설명 15자 이내"},
    {"icon": "이모지 1개", "title": "반복 테마 설명 15자 이내"},
    {"icon": "이모지 1개", "title": "반복 테마 설명 15자 이내"}
  ],
  "readingInsight": "독서 패턴 한 줄 코멘트 30자 이내 (~해요 말투)"
}`;

  const response = await fetch("https://api.upstage.ai/v1/solar/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "solar-pro",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Solar API 오류 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content: string = data.choices[0].message.content;

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON 없음");
    return JSON.parse(jsonMatch[0]) as DashboardAnalysis;
  } catch {
    throw new Error("Solar 응답 파싱 실패: " + content.slice(0, 200));
  }
}
