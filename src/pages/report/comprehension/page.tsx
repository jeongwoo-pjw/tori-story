import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import SubmitModal from "@/components/feature/SubmitModal";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { STORY } from "@/mocks/story-viewer";

const TABS = [
  { id: "content", label: "내용 확인하기" },
  { id: "order", label: "순서 맞추기" },
  { id: "perspective", label: "관점 바꾸기" },
];

const CONTENT_QUESTION = {
  title: "이해 문제",
  question: "이야기에서 주인공은 어떤 어려움을 겪었나요?",
  placeholder: "답변을 입력해 주세요",
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function SortableImageCard({
  id,
  image,
  text,
  pageNum,
}: {
  id: string;
  image: string;
  text: string;
  pageNum: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-4 rounded-2xl bg-background-50 border border-background-200/70 p-3 md:p-4 cursor-grab active:cursor-grabbing hover:bg-primary-50/50 transition-colors"
    >
      <img
        src={image}
        alt={`${pageNum}페이지`}
        className="w-32 h-20 object-cover rounded-xl flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-label text-foreground-500 mb-1">
          {pageNum}페이지
        </p>
        <p className="text-sm text-foreground-700 line-clamp-2">{text}</p>
      </div>
      <i className="ri-drag-move-line w-5 h-5 flex items-center justify-center text-foreground-400 flex-shrink-0"></i>
    </div>
  );
}

export default function ComprehensionPage() {
  const [activeTab, setActiveTab] = useState("content");
  const [answer, setAnswer] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [shuffled, setShuffled] = useState(() =>
    shuffle(
      STORY.pages.map((p, i) => ({
        ...p,
        pageNum: i + 1,
        id: `page-${i}`,
      }))
    )
  );
  const [slideIdx, setSlideIdx] = useState(0);
  const [perspectiveAnswers, setPerspectiveAnswers] = useState<Record<number, string>>();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setShuffled((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handlePerspectiveChange = (idx: number, value: string) => {
    setPerspectiveAnswers((prev) => ({ ...prev, [idx]: value }));
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
                이해력 활동
              </h1>
              <p className="text-sm text-foreground-500">
                동화 내용을 얼마나 이해했는지 확인하고, 핵심 장면을 되짚어
                볼 수 있어요.
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

            {/* Content tab */}
            {activeTab === "content" && (
              <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6 mb-6">
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 rounded-md bg-secondary-100 text-secondary-900 text-xs font-label mb-2">
                    {CONTENT_QUESTION.title}
                  </span>
                  <h3 className="font-heading text-base text-foreground-950">
                    {CONTENT_QUESTION.question}
                  </h3>
                </div>
                <p className="text-sm text-foreground-500 mb-3">
                  답변을 입력해 주세요
                </p>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={CONTENT_QUESTION.placeholder}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm resize-none min-h-[96px]"
                />
              </div>
            )}

            {/* Order tab */}
            {activeTab === "order" && (
              <div className="mb-6">
                <p className="text-sm text-foreground-500 mb-4">
                  아래 장면을 올바른 순서대로 배열해보세요. 카드를 끌어서
                  순서를 바꿀 수 있어요.
                </p>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={shuffled.map((i) => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {shuffled.map((item) => (
                        <SortableImageCard
                          key={item.id}
                          id={item.id}
                          image={item.image}
                          text={item.text}
                          pageNum={item.pageNum}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {/* Perspective tab */}
            {activeTab === "perspective" && (
              <div className="mb-6">
                <p className="text-sm text-foreground-500 mb-4">
                  동화 장면을 넘기며, 다른 관점에서 이야기를 다시 써보세요.
                </p>
                <div className="rounded-2xl bg-background-50 border border-background-200/70 overflow-hidden mb-4">
                  <div className="relative overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${slideIdx * 100}%)` }}
                    >
                      {STORY.pages.map((page, idx) => (
                        <div key={idx} className="w-full flex-shrink-0">
                          <div className="w-full aspect-[16/9] relative overflow-hidden">
                            <img
                              src={page.image}
                              alt={`${STORY.title} ${idx + 1}페이지`}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Original text + blank textarea */}
                  <div className="p-4 md:p-5 border-t border-background-200/70">
                    <p className="text-sm text-foreground-500 mb-2">
                      원래 이야기
                    </p>
                    <p className="text-sm text-foreground-700 leading-relaxed mb-4">
                      {STORY.pages[slideIdx]?.text}
                    </p>
                    <textarea
                      value={perspectiveAnswers[slideIdx] || ""}
                      onChange={(e) =>
                        handlePerspectiveChange(slideIdx, e.target.value)
                      }
                      placeholder="이 문장을 다른 관점에서 다시 써보세요"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm resize-none min-h-[72px]"
                    />
                  </div>
                </div>
                {/* Slide arrows */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSlideIdx((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={slideIdx === 0}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border border-background-200 transition-colors cursor-pointer ${
                      slideIdx === 0
                        ? "opacity-50 pointer-events-none"
                        : "bg-background-50 hover:bg-primary-50"
                    }`}
                  >
                    <i className="ri-arrow-left-s-line w-5 h-5 flex items-center justify-center text-foreground-500"></i>
                  </button>
                  <span className="text-sm font-label text-foreground-700">
                    {slideIdx + 1} / {STORY.pages.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSlideIdx((prev) =>
                        Math.min(prev + 1, STORY.pages.length - 1)
                      )
                    }
                    disabled={slideIdx === STORY.pages.length - 1}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border border-background-200 transition-colors cursor-pointer ${
                      slideIdx === STORY.pages.length - 1
                        ? "opacity-50 pointer-events-none"
                        : "bg-background-50 hover:bg-primary-50"
                    }`}
                  >
                    <i className="ri-arrow-right-s-line w-5 h-5 flex items-center justify-center text-foreground-500"></i>
                  </button>
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
