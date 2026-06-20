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

function buildPrompt(req: StoryRequest): string {
  const pageCount = req.length === "short" ? 6 : req.length === "normal" ? 10 : 15;
  const topics = [
    ...req.topics,
    req.customTopic?.trim(),
  ]
    .filter(Boolean)
    .join(", ");
  const motifs = req.motifs.join(", ");

  return `당신은 한국 문화를 사랑하는 아동 동화 작가입니다. 아래 조건에 맞는 한국어 동화를 작성해주세요.

주인공: ${req.name || "주인공"} (${req.age}세${req.gender === "boy" ? ", 남자아이" : req.gender === "girl" ? ", 여자아이" : ""})
주제: ${topics || "우정과 용기"}
${motifs ? `한국 문화 요소: ${motifs}` : ""}
${req.moral ? `전달할 교훈: ${req.moral}` : ""}

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
- 각 페이지는 2~4문장, ${req.age}세 아이가 이해할 수 있는 쉬운 언어
- 한국의 문화적 요소를 자연스럽게 녹여주세요
- imageKeyword와 sceneKeyword는 영어로만 작성`;
}

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
