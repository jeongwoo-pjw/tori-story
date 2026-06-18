import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";

// 5. 바다탐험·우주여행·동물원·숲속·왕국·마법·요정·드래곤 제거
const TOPIC_TAGS = [
  "용기", "나눔", "우정", "모험", "사랑", "지혜", "희망", "꿈", "가족", "친구",
];

const CHAT_TOPIC_CHIPS = [
  "우정과 나눔", "용기와 도전", "가족 사랑", "상상력 모험", "자연과 동물",
];

const GENDER_OPTIONS = [
  { value: "boy", label: "남자아이" },
  { value: "girl", label: "여자아이" },
  { value: "none", label: "선택 안 함" },
];

const LENGTH_CARDS = [
  { id: "short", label: "짧음", pages: "5~6페이지", isPro: false, desc: "잠자리 직전, 가볍고 알찬 집중 독서 분량" },
  { id: "normal", label: "보통", pages: "8~14페이지", isPro: true, desc: "다채로운 낱말공부와 풍성한 대화형 퀴즈까지 여유롭게 소화하는 표준 분량" },
  { id: "long", label: "길게", pages: "15~20페이지", isPro: true, desc: "아이와 풍성한 스토리를 만들고 교감할 수 있는 긴 분량" },
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
    label: "동화풍 일러스트",
    desc: "클래식 동화책 일러스트 느낌",
    img: "https://readdy.ai/api/search-image?query=Classic%20children%20book%20illustration%20style%20storybook%20art%20warm%20rich%20colors%20detailed%20hand%20drawn%20feel%20enchanting%20magical%20forest%20scene%20Korean%20folk%20tale%20illustration%20style%20traditional%20storybook%20aesthetic&width=400&height=300&seq=art-fairytale&orientation=landscape",
  },
  {
    id: "pixel",
    label: "픽셀 크레용",
    desc: "레트로 픽셀 아트 느낌",
    img: "https://readdy.ai/api/search-image?query=Pixel%20art%20style%20illustration%20retro%20game%20aesthetic%20colorful%20blocky%20pixels%20charming%20cute%20characters%20Korean%20traditional%20setting%20in%20pixel%20art%20vibrant%20colors%20nostalgic%20digital%20art%20style&width=400&height=300&seq=art-pixel&orientation=landscape",
  },
  {
    id: "ink",
    label: "잉크 스케치",
    desc: "잉크와 펜으로 그린 느낌",
    img: "https://readdy.ai/api/search-image?query=Ink%20sketch%20illustration%20style%20pen%20and%20ink%20drawing%20delicate%20lines%20monochrome%20with%20subtle%20color%20washes%20Korean%20traditional%20ink%20painting%20influence%20elegant%20minimal%20art%20storytelling%20illustration%20style&width=400&height=300&seq=art-ink&orientation=landscape",
  },
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

const STEPS = [
  { num: 1, label: "주인공 설정" },
  { num: 2, label: "주제 설정" },
  { num: 3, label: "그림체 설정" },
  { num: 4, label: "동화 설정" },
];

// ── ProtagonistSection: 선택형 탭 전용, 박스 없이 flat ──────────────
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
    if (!isNaN(n) && n >= 2 && n <= 9) setAge(n);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
      <div className="flex-1">
        <label className="block text-xs font-label text-foreground-500 mb-1.5">주인공 이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 민준이"
          className="w-full px-3 py-2 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-label text-foreground-500 mb-1.5">아이 나이</label>
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
              className="w-11 px-2 py-1.5 rounded-lg border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm text-center"
            />
            <span className="text-xs font-label text-foreground-500">세</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── KoreanMotifSection: 박스 유지 ────────────────────────────────────
function KoreanMotifSection({
  motifs,
  setMotifs,
  open,
  setOpen,
}: {
  motifs: string[];
  setMotifs: (v: string[]) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <div className="rounded-2xl bg-primary-50/20 border-2 border-primary-500 ring-2 ring-primary-400/40 p-4 md:p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
            <i className="ri-landscape-line text-primary-700 text-xs flex items-center justify-center"></i>
          </span>
          <h3 className="font-heading text-sm md:text-base text-foreground-950">토리동화 시그니처 한국형 모티브</h3>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-label text-xs transition-colors cursor-pointer whitespace-nowrap ${
            open
              ? "border border-background-200 bg-background-50 hover:bg-background-100 text-foreground-600"
              : "bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950"
          }`}
        >
          {open ? "미적용" : "한국 모티브 생성"}
          {open
            ? <i className="ri-arrow-up-s-line w-3.5 h-3.5 flex items-center justify-center"></i>
            : <i className="ri-arrow-down-s-line w-3.5 h-3.5 flex items-center justify-center"></i>
          }
        </button>
      </div>
      {open && (
        <>
          <p className="text-xs text-foreground-500 mb-3 ml-8">
            한옥, 전통 한복, 도깨비 주머니, 탈춤, 풍성한 정원 등 원하는 모티프를 자유롭게 다중 선택해보세요!
          </p>
          <div className="flex flex-wrap gap-1.5">
            {KOREAN_MOTIF_CHIPS.map((chip) => {
              const active = motifs.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() =>
                    active
                      ? setMotifs(motifs.filter((m) => m !== chip))
                      : setMotifs([...motifs, chip])
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${
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
  );
}

export default function CreatePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"select" | "chat">("select");

  // ── 선택형 state ─────────────────────────────────────────────────
  const [selectName, setSelectName] = useState("");
  const [selectAge, setSelectAge] = useState(5);
  const [selectTopics, setSelectTopics] = useState<string[]>([]);
  const [customSelectTopic, setCustomSelectTopic] = useState("");
  const [customSelectTopicOpen, setCustomSelectTopicOpen] = useState(false);
  const [selectArtStyle, setSelectArtStyle] = useState("watercolor");
  const [selectMotifs, setSelectMotifs] = useState<string[]>([]);
  const [selectMotifOpen, setSelectMotifOpen] = useState(true);

  // ── 대화형 state ─────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [chatName, setChatName] = useState("");
  const [chatAge, setChatAge] = useState("");
  const [gender, setGender] = useState("none");
  const [chatTopics, setChatTopics] = useState<string[]>([]);
  const [customChatTopic, setCustomChatTopic] = useState("");
  const [customChatTopicOpen, setCustomChatTopicOpen] = useState(false);
  const [moral, setMoral] = useState("");
  const [chatArtStyle, setChatArtStyle] = useState("");
  const [artStyleDesc, setArtStyleDesc] = useState("");
  const [length, setLength] = useState("short");
  const [chatMotifs, setChatMotifs] = useState<string[]>([]);
  const [chatMotifOpen, setChatMotifOpen] = useState(true);

  // ── 공통 ─────────────────────────────────────────────────────────
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); navigate("/create/progress"); }, 1500);
  };

  const toggleChatTopic = (tag: string) =>
    chatTopics.includes(tag)
      ? setChatTopics(chatTopics.filter((t) => t !== tag))
      : setChatTopics([...chatTopics, tag]);

  // ── 공통 버튼 ────────────────────────────────────────────────────
  const homeBtn = (
    <Link
      to="/"
      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-background-200 bg-background-50 hover:bg-primary-50 text-sm font-label text-foreground-700 transition-colors whitespace-nowrap cursor-pointer"
    >
      <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
      홈 화면 돌아가기
    </Link>
  );

  const createBtn = (
    <button
      type="button"
      onClick={handleCreate}
      disabled={isSubmitting}
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
    >
      {isSubmitting ? (
        <><i className="ri-loader-4-line w-4 h-4 animate-spin"></i>생성 중...</>
      ) : (
        <>동화 만들기<i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i></>
      )}
    </button>
  );

  const nextBtn = (
    <button type="button" onClick={() => setCurrentStep((s) => Math.min(s + 1, 4))}
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors whitespace-nowrap cursor-pointer">
      다음단계<i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
    </button>
  );

  const prevBtn = (
    <button type="button" onClick={() => setCurrentStep((s) => Math.max(s - 1, 1))}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-background-200 bg-background-50 hover:bg-primary-50 text-foreground-700 font-label text-sm transition-colors whitespace-nowrap cursor-pointer">
      <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>이전단계
    </button>
  );

  const navRow = (right: React.ReactNode) => (
    <div className="flex items-center justify-between pt-5 mt-2 border-t border-background-200/60">
      {homeBtn}
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background-100 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12">
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">

            {/* ── 1. 탭 전환: primary 컬러 강조 ── */}
            <div className="flex items-center justify-center py-5">
              <div className="flex bg-primary-50 border-2 border-primary-300 rounded-full p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => setTab("select")}
                  className={`px-5 py-2 rounded-full text-sm font-label transition-all cursor-pointer whitespace-nowrap ${
                    tab === "select"
                      ? "bg-primary-500 text-foreground-950 dark:text-foreground-950 shadow-sm"
                      : "text-primary-700 hover:bg-primary-100"
                  }`}
                >
                  선택형 만들기
                </button>
                <button
                  type="button"
                  onClick={() => setTab("chat")}
                  className={`px-5 py-2 rounded-full text-sm font-label transition-all cursor-pointer whitespace-nowrap ${
                    tab === "chat"
                      ? "bg-primary-500 text-foreground-950 dark:text-foreground-950 shadow-sm"
                      : "text-primary-700 hover:bg-primary-100"
                  }`}
                >
                  대화형 만들기
                </button>
              </div>
            </div>

            {/* ── 8. 전체 콘텐츠 박스: primary 스트로크 강조 ── */}
            <div className="rounded-3xl border-2 border-primary-300 bg-background-50 shadow-[0_0_0_4px_oklch(var(--primary-100)/0.5)] p-5 md:p-7">

              {/* 3·4. 박스 제목 + 설명 */}
              <div className="mb-5 pb-4 border-b border-background-200/60">
                <h2 className="font-heading text-lg md:text-xl text-foreground-950">
                  {tab === "select" ? "1분만에 빠른 동화 만들기" : "심도 있는 대화로 나만의 동화 만들기"}
                </h2>
                <p className="text-xs text-foreground-500 mt-1">
                  {tab === "select"
                    ? "원하는 설정을 선택해 나만의 동화를 바로 만들어보세요."
                    : "대화를 통해 특별한 나만의 동화를 만들어갑니다."}
                </p>
              </div>

              {/* ════════ 선택형 탭 ════════ */}
              {tab === "select" && (
                <div className="divide-y divide-background-200/60">

                  {/* 주인공 정보 — flat */}
                  <div className="py-4 first:pt-0">
                    <div className="flex items-center gap-1.5 mb-3">
                      <i className="ri-user-smile-line text-primary-600 text-sm"></i>
                      <h3 className="text-sm font-heading text-foreground-950">주인공 정보</h3>
                    </div>
                    <ProtagonistSection
                      name={selectName}
                      setName={setSelectName}
                      age={selectAge}
                      setAge={setSelectAge}
                    />
                  </div>

                  {/* 동화 주제 — flat */}
                  <div className="py-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <i className="ri-lightbulb-line text-accent-600 text-sm"></i>
                      <h3 className="text-sm font-heading text-foreground-950">동화 주제</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {TOPIC_TAGS.map((tag) => {
                        const active = selectTopics.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() =>
                              active
                                ? setSelectTopics(selectTopics.filter((t) => t !== tag))
                                : setSelectTopics([...selectTopics, tag])
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${
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
                        onClick={() => setCustomSelectTopicOpen(!customSelectTopicOpen)}
                        className={`px-3 py-1.5 rounded-full text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${
                          customSelectTopicOpen
                            ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                            : "bg-accent-100 text-accent-900 border border-accent-200 hover:bg-accent-200"
                        }`}
                      >
                        + 직접입력
                      </button>
                    </div>
                    {customSelectTopicOpen && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={customSelectTopic}
                          onChange={(e) => setCustomSelectTopic(e.target.value)}
                          placeholder="원하는 주제를 직접 입력해보세요"
                          className="w-full px-3 py-2 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* 한국형 모티브 — 박스 유지 */}
                  <div className="py-4">
                    <KoreanMotifSection
                      motifs={selectMotifs}
                      setMotifs={setSelectMotifs}
                      open={selectMotifOpen}
                      setOpen={setSelectMotifOpen}
                    />
                  </div>

                  {/* 그림체 선택 — flat, 이미지 높이 축소 */}
                  <div className="py-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <i className="ri-palette-line text-primary-600 text-sm"></i>
                      <h3 className="text-sm font-heading text-foreground-950">그림체 선택</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {ART_STYLES.map((style) => {
                        const active = selectArtStyle === style.id;
                        return (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setSelectArtStyle(style.id)}
                            className={`relative rounded-xl border overflow-hidden text-left transition-all cursor-pointer ${
                              active
                                ? "border-primary-500 ring-2 ring-primary-300"
                                : "border-background-200 hover:border-primary-300"
                            }`}
                          >
                            <div className="w-full h-20">
                              <img src={style.img} alt={style.label} className="w-full h-full object-cover object-top" />
                            </div>
                            <div className="px-2 py-1.5">
                              <p className="font-label text-xs text-foreground-950 truncate">{style.label}</p>
                            </div>
                            {active && (
                              <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                                <i className="ri-check-line text-background-50 text-[10px]"></i>
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 하단 nav */}
                  {navRow(createBtn)}
                </div>
              )}

              {/* ════════ 대화형 탭 ════════ */}
              {tab === "chat" && (
                <div>
                  {/* 스텝 인디케이터 */}
                  <div className="flex items-center justify-center gap-0 mb-6">
                    {STEPS.map((step, index) => {
                      const active = step.num === currentStep;
                      const completed = step.num < currentStep;
                      return (
                        <div key={step.num} className="flex items-center">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(step.num)}
                            className="flex flex-col items-center gap-1.5 cursor-pointer px-2"
                          >
                            <span className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-label transition-colors ${
                              active ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                                : completed ? "bg-primary-100 text-primary-700"
                                : "bg-secondary-200 text-secondary-700"
                            }`}>
                              {completed ? <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i> : step.num}
                            </span>
                            <span className={`text-xs font-label whitespace-nowrap ${
                              active ? "text-primary-700" : completed ? "text-primary-600" : "text-secondary-700"
                            }`}>{step.label}</span>
                          </button>
                          {index < STEPS.length - 1 && (
                            <div className="w-8 md:w-12 h-px bg-secondary-200 mb-5 mx-1 md:mx-2"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* STEP 1: 주인공 설정 */}
                  {currentStep === 1 && (
                    <div className="space-y-5">
                      <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6">
                        <label className="block text-sm font-label text-foreground-700 mb-2">오늘 이야기의 주인공은 누구인가요?</label>
                        <textarea
                          value={chatName}
                          onChange={(e) => setChatName(e.target.value)}
                          placeholder="둥근 얼굴에 노란 한복을 입은 여자아이 '미희', 하얀 털이 복실거리는 강아지 '아띠'"
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm resize-none min-h-[72px]"
                        />
                      </div>
                      <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6">
                        <label className="block text-sm font-label text-foreground-700 mb-2">아이의 나이(또는 학년)를 알려주세요.</label>
                        <input
                          type="text"
                          value={chatAge}
                          onChange={(e) => setChatAge(e.target.value)}
                          placeholder="예: 5세, 초등학교 1학년"
                          className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                        />
                      </div>
                      <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6">
                        <label className="block text-sm font-label text-foreground-700 mb-3">아이의 성별을 선택해 주세요.</label>
                        <div className="flex items-center gap-4">
                          {GENDER_OPTIONS.map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="gender" value={opt.value}
                                checked={gender === opt.value} onChange={() => setGender(opt.value)}
                                className="w-4 h-4 accent-primary-500 cursor-pointer" />
                              <span className="text-sm text-foreground-700">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {navRow(nextBtn)}
                    </div>
                  )}

                  {/* STEP 2: 주제 설정 */}
                  {currentStep === 2 && (
                    <div className="space-y-5">
                      <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6">
                        <label className="block text-sm font-label text-foreground-700 mb-2">어떤 주제의 동화를 원하시나요?</label>
                        <p className="text-xs text-foreground-500 mb-3">아이에게 전하고 싶은 이야기의 분위기를 선택해주세요.</p>
                        <div className="flex flex-wrap gap-2">
                          {CHAT_TOPIC_CHIPS.map((tag) => {
                            const active = chatTopics.includes(tag);
                            return (
                              <button key={tag} type="button" onClick={() => toggleChatTopic(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-label transition-colors cursor-pointer whitespace-nowrap ${
                                  active ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                                    : "bg-secondary-100 text-foreground-700 border border-secondary-200 hover:border-primary-300 hover:bg-primary-50/50"
                                }`}>{tag}</button>
                            );
                          })}
                          <button type="button" onClick={() => setCustomChatTopicOpen(!customChatTopicOpen)}
                            className={`px-4 py-2 rounded-full text-sm font-label transition-colors cursor-pointer whitespace-nowrap ${
                              customChatTopicOpen ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                                : "bg-accent-100 text-accent-900 border border-accent-200 hover:bg-accent-200"
                            }`}>+ 직접 입력</button>
                        </div>
                        {customChatTopicOpen && (
                          <div className="mt-3">
                            <textarea value={customChatTopic} onChange={(e) => setCustomChatTopic(e.target.value)}
                              placeholder="원하는 주제를 직접 입력해보세요" rows={2}
                              className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm resize-none min-h-[48px]" />
                          </div>
                        )}
                      </div>
                      <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6">
                        <label className="block text-sm font-label text-foreground-700 mb-2">동화를 통해 전달하고 싶은 교훈이 있나요?</label>
                        <p className="text-xs text-foreground-500 mb-3">예: 친구와 사이좋게 지내는 법, 포기하지 않는 마음</p>
                        <textarea value={moral} onChange={(e) => setMoral(e.target.value)}
                          placeholder="전달하고 싶은 교훈을 입력해주세요" rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm resize-none min-h-[72px]" />
                      </div>
                      {navRow(<>{prevBtn}{nextBtn}</>)}
                    </div>
                  )}

                  {/* STEP 3: 그림체 설정 */}
                  {currentStep === 3 && (
                    <div className="space-y-5">
                      <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6">
                        <label className="block text-sm font-label text-foreground-700 mb-2">동화의 분위기를 결정하는 그림 스타일을 선택하세요.</label>
                        <textarea value={artStyleDesc} onChange={(e) => setArtStyleDesc(e.target.value)}
                          placeholder="예: 빈티지한 무드가 느껴지는 그림체였으면 좋겠어" rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm resize-none min-h-[72px] mb-5" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                          {ART_STYLES.map((style) => {
                            const active = chatArtStyle === style.id;
                            return (
                              <button key={style.id} type="button" onClick={() => setChatArtStyle(style.id)}
                                className={`relative rounded-2xl border overflow-hidden text-left transition-all cursor-pointer ${
                                  active ? "border-primary-500 ring-2 ring-primary-300" : "border-background-200 hover:border-primary-300"
                                }`}>
                                <div className="w-full h-28 md:h-32">
                                  <img src={style.img} alt={style.label} className="w-full h-full object-cover object-top" />
                                </div>
                                <div className="p-3">
                                  <p className="font-label text-sm text-foreground-950">{style.label}</p>
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
                      {navRow(<>{prevBtn}{nextBtn}</>)}
                    </div>
                  )}

                  {/* STEP 4: 동화 설정 */}
                  {currentStep === 4 && (
                    <div className="space-y-5">
                      <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6">
                        <p className="text-sm font-heading text-foreground-950 mb-4">동화 분량</p>
                        <div className="grid grid-cols-3 gap-3">
                          {LENGTH_CARDS.map((card) => {
                            const active = length === card.id;
                            return (
                              <button key={card.id} type="button"
                                onClick={() => { if (card.isPro) setShowPremiumModal(true); else setLength(card.id); }}
                                className={`relative flex flex-col items-start gap-2 py-4 px-4 rounded-2xl border transition-all cursor-pointer text-left ${
                                  active ? "border-primary-500 bg-primary-50 ring-2 ring-primary-300"
                                    : "border-background-200 bg-background-50 hover:border-primary-300 hover:bg-primary-50/40"
                                }`}>
                                {!card.isPro && active && (
                                  <span className="absolute top-2.5 right-3 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                                    <i className="ri-check-line text-background-50 text-xs"></i>
                                  </span>
                                )}
                                <div className="flex items-center gap-2 pr-8 flex-wrap">
                                  <span className="font-heading text-base md:text-lg text-foreground-950">{card.label}</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs text-foreground-500 whitespace-nowrap">{card.pages}</span>
                                    {card.isPro && (
                                      <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-amber-900 text-[10px] font-label font-semibold leading-none">PRO</span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-foreground-500 leading-relaxed">{card.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <KoreanMotifSection motifs={chatMotifs} setMotifs={setChatMotifs} open={chatMotifOpen} setOpen={setChatMotifOpen} />
                      {navRow(createBtn)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 프리미엄 구독 모달 */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-950/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-7 shadow-xl">
            <div className="mb-5 text-center">
              <span className="inline-block text-2xl mb-3">🔔</span>
              <h2 className="text-base font-label text-foreground-950 mb-2">서비스 정식 준비중</h2>
              <p className="text-xs text-foreground-500 leading-relaxed">
                현재 프리미엄 결제 모듈 연동 및 카드 지불 심사가 정식 등록 절차에 따라 최종 진행중입니다!<br />
                다음 업데이트 시 바로 오픈될 예정입니다.
              </p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors cursor-pointer whitespace-nowrap">
                알림 받기
              </button>
              <button type="button" onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-3 rounded-xl bg-secondary-100 hover:bg-secondary-200 text-foreground-700 font-label text-sm transition-colors cursor-pointer whitespace-nowrap">
                확인하기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
