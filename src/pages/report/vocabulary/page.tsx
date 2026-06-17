import { useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import SubmitModal from "@/components/feature/SubmitModal";

const VOCAB_CARDS = [
  {
    id: "c1",
    word: "용기",
    meaning: "두렵지만 옳은 일을 해내는 마음의 힘이에요.",
    isOpen: true,
  },
  {
    id: "c2",
    word: "강인하다",
    meaning: "어려움에도 굴하지 않고 꿋꿋이 이겨내는 마음이에요.",
    isOpen: false,
  },
  {
    id: "c3",
    word: "우정",
    meaning: "서로 돌보고 함께 기뻐하는 소중한 마음이에요.",
    isOpen: false,
  },
  {
    id: "c4",
    word: "호기심",
    meaning: "새로운 것에 대해 알고 싶어하는 마음이에요.",
    isOpen: false,
  },
  {
    id: "c5",
    word: "사랑",
    meaning: "소중한 사람을 따뜻하게 대하는 마음이에요.",
    isOpen: false,
  },
  {
    id: "c6",
    word: "새침하다",
    meaning: "겉으로는 차가워 보이지만 속은 따뜻한 태도예요.",
    isOpen: false,
  },
];

export default function VocabularyPage() {
  const [cards, setCards] = useState(VOCAB_CARDS);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const toggleCard = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isOpen: !c.isOpen } : c))
    );
  };

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
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
                어휘 활동
              </h1>
              <p className="text-sm text-foreground-500">
                오늘 만난 새로운 단어들을 확인하고, 뜻을 익혀보세요.
              </p>
            </div>

            {/* Tag badge — same as active tab */}
            <div className="mb-4">
              <span className="inline-block px-4 py-2 rounded-full bg-primary-500 text-foreground-950 dark:text-foreground-950 text-sm font-label">
                낱말카드
              </span>
            </div>

            {/* Hint text */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-secondary-300"></div>
              <p className="text-xs text-foreground-500">
                낱말의 의미를 확인하고 싶다면, 카드를 뒤집어보세요.
              </p>
            </div>

            {/* Vocab cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {cards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => toggleCard(card.id)}
                  className={`rounded-2xl border-2 border-dashed p-5 md:p-6 text-left transition-all cursor-pointer min-h-[160px] flex flex-col justify-center ${
                    card.isOpen
                      ? "border-foreground-300 bg-background-100"
                      : "border-background-300 bg-background-50 hover:bg-primary-50/50"
                  }`}
                >
                  {card.isOpen ? (
                    <>
                      <p className="font-heading text-xl text-foreground-950 mb-3">
                        {card.word}
                      </p>
                      <p className="text-sm text-foreground-600 leading-relaxed">
                        {card.meaning}
                      </p>
                    </>
                  ) : (
                    <p className="font-heading text-xl text-foreground-950 text-center">
                      {card.word}
                    </p>
                  )}
                </button>
              ))}
            </div>

            {/* Answer section — word meaning writing */}
            <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6 mb-6">
              <p className="text-sm font-label text-foreground-700 mb-4">
                각 낱말의 뜻을 작성해보세요
              </p>
              <div className="space-y-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4"
                  >
                    <p className="font-heading text-sm text-foreground-950 sm:w-24 flex-shrink-0 pt-2">
                      {card.word}
                    </p>
                    <textarea
                      value={answers[card.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(card.id, e.target.value)
                      }
                      placeholder={`'${card.word}'의 뜻을 자유롭게 유추해보세요.`}
                      rows={2}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm resize-none min-h-[56px]"
                    />
                  </div>
                ))}
              </div>
            </div>

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
