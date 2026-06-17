import { useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import SubmitModal from "@/components/feature/SubmitModal";

const TABS = [
  { id: "card", label: "감정카드고르기" },
  { id: "diary", label: "감정 일기 쓰기" },
];

const EMOTIONS = [
  {
    id: "sad",
    label: "슬픔",
    emoji: "😢",
    desc: "주인공이 혼자 남겨졌을 때 많이 슬프다고 했어요.",
  },
  {
    id: "empathy",
    label: "공감",
    emoji: "💕",
    desc: "친구가 도와줬으면 좋겠다고 표현했어요.",
  },
  {
    id: "fear",
    label: "두려움",
    emoji: "😰",
    desc: "어두운 숲 장면에서 무서웠다고 이야기했어요.",
  },
  {
    id: "relief",
    label: "안도",
    emoji: "😌",
    desc: "끝날에서 주인공이 집으로 돌아와 마음이 놓인다고 했어요.",
  },
  {
    id: "curious",
    label: "궁금함",
    emoji: "🧐",
    desc: "다음에 어떤 모험이 기다릴지 궁금하다고 했어요.",
  },
];

export default function EmotionPage() {
  const [activeTab, setActiveTab] = useState("card");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [diaryEmotion, setDiaryEmotion] = useState<string | null>(null);
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryContent, setDiaryContent] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const toggleEmotion = (id: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

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
                감정 탐색
              </h1>
              <p className="text-sm text-foreground-500">
                동화를 읽은 후 아이가 느낀 감정을 기록해보세요.
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

            {/* Card tab */}
            {activeTab === "card" && (
              <div className="space-y-3 mb-6">
                {EMOTIONS.map((emotion) => {
                  const selected = selectedEmotions.includes(emotion.id);
                  return (
                    <div
                      key={emotion.id}
                      className="flex items-center justify-between rounded-2xl bg-background-50 border border-background-200/70 p-4 md:p-5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl select-none">{emotion.emoji}</span>
                        <div>
                          <p className="font-label text-sm text-foreground-950 mb-1">
                            {emotion.label}
                          </p>
                          <p className="text-xs text-foreground-500">
                            {emotion.desc}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleEmotion(emotion.id)}
                        className={`px-4 py-2 rounded-full text-xs font-label transition-colors whitespace-nowrap cursor-pointer ${
                          selected
                            ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                            : "bg-secondary-100 text-foreground-700 border border-secondary-200 hover:bg-secondary-200"
                        }`}
                      >
                        {selected ? "선택됨" : "선택"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Diary tab */}
            {activeTab === "diary" && (
              <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6 mb-6">
                <div className="mb-5">
                  <p className="text-xs text-foreground-500 mb-1">날짜</p>
                  <p className="text-sm font-label text-foreground-950">
                    {today}
                  </p>
                </div>

                <div className="mb-5">
                  <p className="text-xs text-foreground-500 mb-2">
                    오늘의 감정
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {EMOTIONS.map((emotion) => {
                      const selected = diaryEmotion === emotion.id;
                      return (
                        <button
                          key={emotion.id}
                          type="button"
                          onClick={() =>
                            setDiaryEmotion(selected ? null : emotion.id)
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${
                            selected
                              ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                              : "bg-secondary-100 text-foreground-700 border border-secondary-200 hover:bg-secondary-200"
                          }`}
                        >
                          <span className="text-sm">{emotion.emoji}</span>
                          {emotion.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-xs text-foreground-500 mb-2">일기 제목</p>
                  <input
                    type="text"
                    value={diaryTitle}
                    onChange={(e) => setDiaryTitle(e.target.value)}
                    placeholder="오늘의 일기 제목을 입력하세요"
                    className="w-full px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                  />
                </div>

                <div>
                  <p className="text-xs text-foreground-500 mb-2">일기 내용</p>
                  <textarea
                    value={diaryContent}
                    onChange={(e) => setDiaryContent(e.target.value)}
                    placeholder="오늘 읽은 동화를 생각하며 느낀 감정을 일기로 써보세요"
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm resize-none min-h-[144px]"
                  />
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
