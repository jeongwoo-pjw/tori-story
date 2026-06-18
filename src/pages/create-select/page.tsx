import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";

const TOPIC_TAGS = [
  "용기", "나눔", "우정", "모험", "사랑", "지혜", "희망", "꿈", "가족", "친구",
  "바다탐험", "우주여행", "동물원", "숲속", "왕국", "마법", "요정", "드래곤",
];

const KOREAN_MOTIF_CHIPS = [
  "🏯 고즈넉한 한옥",
  "👘 고운 전통 한복",
  "🎒 도깨비 요술",
  "🎭 신명나는 탈춤",
  "🏡 풍성한 한옥 정원",
  "🐯 꼬마 호랑이 신선",
  "🥮 요술 꿀 약과",
  "✨ 달님 별님 전설",
];

const ART_STYLES = [
  {
    id: "watercolor",
    label: "수채화",
    desc: "부드럽고 꿈같은 수채화 느낌",
    img: "https://readdy.ai/api/search-image?query=Watercolor%20painting%20style%20illustration%20soft%20pastel%20colors%20dreamy%20children%20book%20art%20gentle%20brush%20strokes%20warm%20light%20whimsical%20fairy%20tale%20atmosphere%20Korean%20traditional%20elements%20in%20watercolor%20style&width=400&height=300&seq=art-watercolor&orientation=landscape",
  },
  {
    id: "fairytale",
    label: "동화용",
    desc: "클래식 동화책 일러스트 느낌",
    img: "https://readdy.ai/api/search-image?query=Classic%20children%20book%20illustration%20style%20storybook%20art%20warm%20rich%20colors%20detailed%20hand%20drawn%20feel%20enchanting%20magical%20forest%20scene%20Korean%20folk%20tale%20illustration%20style%20traditional%20storybook%20aesthetic&width=400&height=300&seq=art-fairytale&orientation=landscape",
  },
  {
    id: "pixel",
    label: "픽셀",
    desc: "레트로 픽셀 아트 느낌",
    img: "https://readdy.ai/api/search-image?query=Pixel%20art%20style%20illustration%20retro%20game%20aesthetic%20colorful%20blocky%20pixels%20charming%20cute%20characters%20Korean%20traditional%20setting%20in%20pixel%20art%20vibrant%20colors%20nostalgic%20digital%20art%20style&width=400&height=300&seq=art-pixel&orientation=landscape",
  },
  {
    id: "ink",
    label: "잉크",
    desc: "잉크와 펜으로 그린 느낌",
    img: "https://readdy.ai/api/search-image?query=Ink%20sketch%20illustration%20style%20pen%20and%20ink%20drawing%20delicate%20lines%20monochrome%20with%20subtle%20color%20washes%20Korean%20traditional%20ink%20painting%20influence%20elegant%20minimal%20art%20storytelling%20illustration%20style&width=400&height=300&seq=art-ink&orientation=landscape",
  },
];

function ProtagonistSection({
  name,
  setName,
  age,
  setAge,
}: {
  name: string;
  setName: (v: string) => void;
  age: number;
  setAge: (v: number) => void;
}) {
  const [ageInput, setAgeInput] = useState(String(age));

  const handleSliderChange = (val: number) => {
    setAge(val);
    setAgeInput(String(val));
  };

  const handleAgeInputChange = (v: string) => {
    setAgeInput(v);
    const n = parseInt(v, 10);
    if (!isNaN(n) && n >= 2 && n <= 9) {
      setAge(n);
    }
  };

  return (
    <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
          <i className="ri-user-smile-line text-primary-700 w-4 h-4 flex items-center justify-center text-sm"></i>
        </span>
        <h3 className="font-heading text-base md:text-lg text-foreground-950">주인공 정보</h3>
      </div>
      <div className="flex flex-col md:flex-row gap-5 md:gap-8">
        <div className="flex-1">
          <label className="block text-sm font-label text-foreground-700 mb-2">
            주인공 이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 민준이"
            className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-label text-foreground-700 mb-2">
            아이 나이
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={2}
              max={9}
              value={age}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, oklch(var(--primary-500)) 0%, oklch(var(--primary-500)) ${((age - 2) / 7) * 100}%, oklch(var(--primary-100)) ${((age - 2) / 7) * 100}%, oklch(var(--primary-100)) 100%)`,
                accentColor: "oklch(var(--primary-500))",
              }}
            />
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="text"
                value={ageInput}
                onChange={(e) => handleAgeInputChange(e.target.value)}
                className="w-12 px-2 py-1.5 rounded-lg border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm text-center"
              />
              <span className="text-sm font-label text-foreground-600">세</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopicSection({
  selected,
  setSelected,
  customTopic,
  setCustomTopic,
  customOpen,
  setCustomOpen,
}: {
  selected: string[];
  setSelected: (v: string[]) => void;
  customTopic: string;
  setCustomTopic: (v: string) => void;
  customOpen: boolean;
  setCustomOpen: (v: boolean) => void;
}) {
  const toggle = (tag: string) => {
    if (selected.includes(tag)) {
      setSelected(selected.filter((t) => t !== tag));
    } else {
      setSelected([...selected, tag]);
    }
  };

  return (
    <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-7 h-7 rounded-full bg-accent-100 flex items-center justify-center">
          <i className="ri-lightbulb-line text-accent-700 w-4 h-4 flex items-center justify-center text-sm"></i>
        </span>
        <h3 className="font-heading text-base md:text-lg text-foreground-950">동화 주제</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {TOPIC_TAGS.map((tag) => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={`px-4 py-2 rounded-full text-sm font-label transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                  : "bg-secondary-100 text-foreground-700 border border-secondary-200 hover:border-primary-300 hover:bg-primary-50/50"
              }`}
            >
              {tag}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setCustomOpen(!customOpen)}
          className={`px-4 py-2 rounded-full text-sm font-label transition-colors cursor-pointer whitespace-nowrap ${
            customOpen
              ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
              : "bg-accent-100 text-accent-900 border border-accent-200 hover:bg-accent-200"
          }`}
        >
          + 직접입력
        </button>
      </div>
      {customOpen && (
        <div className="mt-3">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="원하는 주제를 직접 입력해보세요"
            className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
          />
        </div>
      )}
    </div>
  );
}


function ArtStyleSection({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
          <i className="ri-palette-line text-primary-700 w-4 h-4 flex items-center justify-center text-sm"></i>
        </span>
        <h3 className="font-heading text-base md:text-lg text-foreground-950">그림체 선택</h3>
      </div>
      <p className="text-sm text-foreground-600 mb-4">
        동화의 분위기를 결정하는 그림 스타일을 선택하세요.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {ART_STYLES.map((style) => {
          const active = selected === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => setSelected(style.id)}
              className={`relative rounded-2xl border overflow-hidden text-left transition-all cursor-pointer ${
                active
                  ? "border-primary-500 ring-2 ring-primary-300"
                  : "border-background-200 hover:border-primary-300"
              }`}
            >
              <div className="w-full h-28 md:h-32">
                <img
                  src={style.img}
                  alt={style.label}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-3">
                <p className="font-label text-sm text-foreground-950">{style.label}</p>
                <p className="text-xs text-foreground-500 mt-0.5">{style.desc}</p>
              </div>
              {active && (
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <i className="ri-check-line text-background-50 w-4 h-4 flex items-center justify-center text-xs"></i>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CreateSelectPage() {
  const navigate = useNavigate();
  const [protagonistName, setProtagonistName] = useState("");
  const [age, setAge] = useState(5);
  const [topics, setTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState("");
  const [customTopicOpen, setCustomTopicOpen] = useState(false);
  const [koreanMotifs, setKoreanMotifs] = useState<string[]>([]);
  const [motifOpen, setMotifOpen] = useState(true);
  const [artStyle, setArtStyle] = useState("watercolor");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/create/progress");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-background-100 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      {/* Content */}
      <div className="pl-[var(--sidebar-width)] pt-16 md:pt-20 pb-12">
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Sticky header with title + CTAs */}
            <div className="sticky top-14 md:top-16 z-30 bg-background-100/95 backdrop-blur border-b border-background-200/70 py-4 mb-6 -mx-4 px-4 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12">
              <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <h1 className="font-heading text-2xl md:text-3xl text-foreground-950 shrink-0">
                  빠른 동화 만들기
                </h1>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-background-200 bg-background-50 hover:bg-primary-50 text-sm font-label text-foreground-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                    홈 화면 돌아가기
                  </Link>
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 text-sm font-label transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="ri-loader-4-line w-4 h-4 flex items-center justify-center animate-spin"></i>
                        생성 중...
                      </>
                    ) : (
                      <>
                        동화 만들기
                        <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Form sections */}
            <div className="space-y-5">
              <ProtagonistSection
                name={protagonistName}
                setName={setProtagonistName}
                age={age}
                setAge={setAge}
              />

              <TopicSection
                selected={topics}
                setSelected={setTopics}
                customTopic={customTopic}
                setCustomTopic={setCustomTopic}
                customOpen={customTopicOpen}
                setCustomOpen={setCustomTopicOpen}
              />

              {/* Korean motif section */}
              <div className="rounded-2xl bg-primary-50/20 border-2 border-primary-500 ring-2 ring-primary-400/40 p-5 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                      <i className="ri-landscape-line text-primary-700 w-4 h-4 flex items-center justify-center text-sm"></i>
                    </span>
                    <h3 className="font-heading text-base md:text-lg text-foreground-950">토리동화 시그니처 한국형 모티브</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMotifOpen(!motifOpen)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-primary-400/50 text-primary-600 font-label text-sm hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {motifOpen ? "접기" : "펼치기"}
                    {motifOpen
                      ? <i className="ri-arrow-up-s-line w-4 h-4 flex items-center justify-center"></i>
                      : <i className="ri-arrow-down-s-line w-4 h-4 flex items-center justify-center"></i>
                    }
                  </button>
                </div>
                {motifOpen && (
                  <>
                    <p className="text-xs text-foreground-500 mb-4 ml-9">
                      한옥, 전통 한복, 도깨비 주머니, 탈춤, 풍성한 정원 등 원하는 모티프를 자유롭게 다중 선택해보세요!
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {KOREAN_MOTIF_CHIPS.map((chip) => {
                        const active = koreanMotifs.includes(chip);
                        return (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => {
                              if (active) {
                                setKoreanMotifs(koreanMotifs.filter((m) => m !== chip));
                              } else {
                                setKoreanMotifs([...koreanMotifs, chip]);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-label transition-colors cursor-pointer whitespace-nowrap ${
                              active
                                ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                                : "bg-primary-100/60 text-foreground-700 border border-primary-200 hover:border-primary-400 hover:bg-primary-100"
                            }`}
                          >
                            {chip}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <ArtStyleSection selected={artStyle} setSelected={setArtStyle} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
