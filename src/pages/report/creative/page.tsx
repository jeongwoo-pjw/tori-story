import { useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import SubmitModal from "@/components/feature/SubmitModal";
import { STORY } from "@/mocks/story-viewer";

const TABS = [
  { id: "story", label: "이야기 이어쓰기" },
  { id: "draw", label: "장면 그리기" },
];

const EMOTION_TAGS = [
  { id: "sad", label: "슬픔", icon: "ri-emotion-sad-line" },
  { id: "happy", label: "행복", icon: "ri-emotion-happy-line" },
  { id: "excited", label: "신남", icon: "ri-emotion-laugh-line" },
  { id: "surprised", label: "놀람", icon: "ri-emotion-normal-line" },
  { id: "angry", label: "화남", icon: "ri-emotion-unhappy-line" },
  { id: "scared", label: "무서움", icon: "ri-emotion-sad-line" },
];

export default function CreativePage() {
  const [activeTab, setActiveTab] = useState("story");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [continuationText, setContinuationText] = useState("");
  const [drawSlideIdx, setDrawSlideIdx] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const toggleEmotion = (id: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  return (
    <main className="min-h-screen bg-background-100 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12">
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="font-heading text-2xl md:text-3xl text-foreground-950 mb-2">
                창작 활동
              </h1>
              <p className="text-sm text-foreground-500">
                오늘 배운 어휘를 활용해 나만의 이야기를 만들어보세요.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-label transition-colors whitespace-nowrap cursor-pointer ${
                    tab.id === activeTab
                      ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                      : "bg-secondary-100 text-foreground-700 border border-secondary-200 hover:bg-secondary-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Story continuation */}
            {activeTab === "story" && (
              <div className="space-y-4 mb-6">
                {/* Story info display */}
                <div className="rounded-2xl border border-background-200 bg-background-50 p-5 md:p-6">
                  <div className="mb-4">
                    <p className="text-xs text-foreground-500 mb-1">제목</p>
                    <p className="text-sm font-label text-foreground-950">
                      {STORY.title}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-foreground-500 mb-1">줄거리</p>
                    <p className="text-sm text-foreground-700 leading-relaxed">
                      {STORY.pages[0]?.text}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-500 mb-1">결말</p>
                    <p className="text-sm text-foreground-700 leading-relaxed">
                      {STORY.pages[STORY.pages.length - 1]?.text}
                    </p>
                  </div>
                </div>

                {/* Emotion tags */}
                <div className="flex items-center gap-3 flex-wrap">
                  {EMOTION_TAGS.map((tag) => {
                    const selected = selectedEmotions.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleEmotion(tag.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${
                          selected
                            ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                            : "bg-secondary-100 text-foreground-700 border border-secondary-200 hover:bg-secondary-200"
                        }`}
                      >
                        <i
                          className={`${tag.icon} w-3.5 h-3.5 flex items-center justify-center`}
                        ></i>
                        {tag.label}
                      </button>
                    );
                  })}
                </div>

                {/* Continuation textarea */}
                <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
                  <p className="text-sm font-label text-foreground-700 mb-2">
                    이야기를 이어서 써보세요
                  </p>
                  <textarea
                    value={continuationText}
                    onChange={(e) => setContinuationText(e.target.value)}
                    placeholder="원하는 결말의 감정을 선택하면 더 쉽게 상상할 수 있도록 도와줄게요!&#10;이곳에 나만의 이야기를 이어서 작성해보세요."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm resize-none min-h-[120px]"
                  />
                </div>
              </div>
            )}

            {/* Scene drawing */}
            {activeTab === "draw" && (
              <div className="space-y-4 mb-6">
                {/* Drawing canvas placeholder */}
                <div className="rounded-2xl border border-dashed border-background-300 bg-background-50 h-[400px] flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-secondary-100 flex items-center justify-center mb-3">
                    <i className="ri-brush-line w-8 h-8 flex items-center justify-center text-secondary-400 text-2xl"></i>
                  </div>
                  <p className="text-sm text-foreground-400 font-label">
                    이곳에 오늘의 장면을 그려보세요
                  </p>
                </div>

                {/* Horizontal slide story text */}
                <div className="rounded-2xl bg-background-50 border border-background-200/70 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${drawSlideIdx * 100}%)` }}
                    >
                      {STORY.pages.map((page, idx) => (
                        <div key={idx} className="w-full flex-shrink-0 p-5 md:p-6">
                          <div className="flex items-start gap-3 mb-3">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 text-primary-900 text-xs font-label flex-shrink-0">
                              {idx + 1}
                            </span>
                            <p className="text-sm text-foreground-700 leading-relaxed">
                              {page.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Slide arrows + pagination */}
                  <div className="flex items-center justify-center gap-3 pb-5">
                    <button
                      type="button"
                      onClick={() =>
                        setDrawSlideIdx((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={drawSlideIdx === 0}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border border-background-200 transition-colors cursor-pointer ${
                        drawSlideIdx === 0
                          ? "opacity-50 pointer-events-none"
                          : "bg-background-50 hover:bg-primary-50"
                      }`}
                    >
                      <i className="ri-arrow-left-s-line w-5 h-5 flex items-center justify-center text-foreground-500"></i>
                    </button>
                    <span className="text-sm font-label text-foreground-700">
                      {drawSlideIdx + 1} / {STORY.pages.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDrawSlideIdx((prev) =>
                          Math.min(prev + 1, STORY.pages.length - 1)
                        )
                      }
                      disabled={drawSlideIdx === STORY.pages.length - 1}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border border-background-200 transition-colors cursor-pointer ${
                        drawSlideIdx === STORY.pages.length - 1
                          ? "opacity-50 pointer-events-none"
                          : "bg-background-50 hover:bg-primary-50"
                      }`}
                    >
                      <i className="ri-arrow-right-s-line w-5 h-5 flex items-center justify-center text-foreground-500"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom actions */}
            <div className="flex items-center justify-between">
              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary-100 hover:bg-secondary-200 text-foreground-700 font-label text-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                놀이마당으로
              </Link>
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                답변 제출
              </button>
            </div>
          </div>
        </div>
      </div>

      <SubmitModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
      />
    </main>
  );
}
