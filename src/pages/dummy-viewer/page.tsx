import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import books from "@/data/dummyBooks.json";
import { addToLibrary, updateStoryStatus } from "@/services/library";

type DummyBook = (typeof books)[number];

function getBook(id: string | null): DummyBook | null {
  if (!id) return books[0] ?? null;
  return books.find((b) => String(b.id) === id) ?? books[0] ?? null;
}

const formatText = (text: string) =>
  text.split(". ").map((s, i, arr) => (
    <span key={i}>
      {s}{i < arr.length - 1 ? "." : ""}
      {i < arr.length - 1 && <br />}
    </span>
  ));

export default function DummyViewerPage() {
  const [searchParams] = useSearchParams();
  const book = getBook(searchParams.get("id"));

  const [currentPage, setCurrentPage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editPageIdx, setEditPageIdx] = useState(0);
  const [editDrafts, setEditDrafts] = useState<string[]>([]);
  const [pageTexts, setPageTexts] = useState<string[]>(
    () => book?.pages.map((p) => p.text) ?? []
  );
  const [entryId, setEntryId] = useState<string | null>(null);

  const touchStartX = useRef<number | null>(null);
  const registered = useRef(false);

  // 책을 열면 라이브러리에 자동 등록
  useEffect(() => {
    if (!book || registered.current) return;
    registered.current = true;
    const story = {
      title: book.title,
      pages: book.pages.map((p) => ({ text: p.text, image: `/books/${p.image}` })),
    };
    const request = {
      name: book.name,
      age: book.age,
      topics: [book.theme],
      motifs: [book.koreanMotif],
      artStyle: book.style,
      length: "short" as const,
    };
    const entry = addToLibrary(story, request, `/books/${book.thumbnail}`);
    setEntryId(entry.id);
  }, [book]);

  // 페이지 변경 시 읽기 진행률 업데이트
  useEffect(() => {
    if (!entryId || !book) return;
    const totalPages = book.pages.length;
    const pct = Math.round(((currentPage + 1) / totalPages) * 100);
    const status = currentPage === totalPages - 1 ? "completed" : "reading";
    updateStoryStatus(entryId, pct, status);
  }, [currentPage, entryId, book]);

  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setFullscreen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen]);

  if (!book) {
    return (
      <main className="min-h-screen bg-background-50 flex items-center justify-center">
        <p className="text-foreground-500">동화를 찾을 수 없어요.</p>
      </main>
    );
  }

  const totalPages = book.pages.length;
  const isLastPage = currentPage === totalPages - 1;

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) setCurrentPage(page);
  }, [totalPages]);

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) handlePrev();
    else if (diff < -50) handleNext();
    touchStartX.current = null;
  };

  function openEdit() {
    setEditDrafts([...pageTexts]);
    setEditPageIdx(currentPage);
    setEditOpen(true);
  }

  function saveEdit() {
    setPageTexts([...editDrafts]);
    setEditOpen(false);
  }

  const imgSrc = (filename: string) => `/books/${filename}`;

  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12">
        {/* Toolbar */}
        <div className="sticky top-14 md:top-16 z-30 border-b py-3 px-4 md:px-8 lg:px-12 -mx-4 md:-mx-8 lg:-mx-12 bg-background-50/95 backdrop-blur border-background-200/70">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <Link
              to="/dummy-books"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border shadow-sm hover:scale-105 active:scale-95 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            >
              <i className="ri-arrow-left-line"></i>
              목록으로
            </Link>

            <div className="flex items-center gap-2">
              {/* 풀화면 */}
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border shadow-sm hover:scale-105 active:scale-95 bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-100"
              >
                <i className="ri-fullscreen-line"></i>
                풀화면으로 보기
              </button>

              {/* 텍스트 편집 */}
              <button
                type="button"
                onClick={openEdit}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border shadow-sm hover:scale-105 active:scale-95 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
              >
                <i className="ri-edit-line"></i>
                텍스트 편집
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 md:px-8 lg:px-12 pt-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-center font-heading text-3xl md:text-5xl font-bold mb-2">
              {book.title}
            </h1>
            <p className="text-center text-sm text-foreground-400 mb-8">
              주인공: {book.name} · {book.age}세 · {book.theme}
            </p>

            {/* Swiper */}
            <div
              className="relative overflow-hidden rounded-3xl border-2 border-dashed border-background-200"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentPage * 100}%)` }}
              >
                {book.pages.map((page, idx) => (
                  <div
                    key={idx}
                    className="w-full flex-shrink-0 flex flex-row min-h-[460px] md:min-h-[600px]"
                  >
                    {/* Image */}
                    <div className="w-3/5 relative overflow-hidden bg-background-100">
                      <img
                        src={imgSrc(page.image)}
                        alt={`${book.title} ${idx + 1}페이지`}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-8xl opacity-10 select-none">🖼️</span>
                      </div>
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentPage === 0}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center z-10 transition-all cursor-pointer ${currentPage === 0 ? "opacity-0 pointer-events-none" : "text-white/80 hover:text-white drop-shadow-lg"}`}
                      >
                        <i className="ri-arrow-left-s-line text-3xl"></i>
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={isLastPage}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center z-10 transition-all cursor-pointer ${isLastPage ? "opacity-0 pointer-events-none" : "text-white/80 hover:text-white drop-shadow-lg"}`}
                      >
                        <i className="ri-arrow-right-s-line text-3xl"></i>
                      </button>
                    </div>

                    {/* Text */}
                    <div className="w-2/5 p-8 md:p-12 flex flex-col bg-background-50">
                      <div className="mb-4 flex-shrink-0">
                        <span className="px-3 py-1 rounded-full text-xs font-label border bg-primary-50 text-primary-600 border-primary-200">
                          {idx + 1} / {totalPages} 쪽
                        </span>
                      </div>
                      <div className="flex-1 flex items-center">
                        <p className="text-xl md:text-2xl leading-loose font-body text-foreground-700">
                          {formatText(pageTexts[idx] ?? page.text)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentPage === 0}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap border shadow-sm ${currentPage === 0 ? "opacity-30 pointer-events-none bg-slate-100 text-slate-400 border-slate-200" : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:scale-105 active:scale-95"}`}
              >
                <i className="ri-arrow-left-s-line"></i>
                이전 페이지
              </button>

              <div className="flex items-center gap-2">
                {book.pages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToPage(idx)}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${idx === currentPage ? "w-4 h-4 bg-primary-600" : idx < currentPage ? "w-3 h-3 bg-primary-300" : "w-3 h-3 bg-primary-100 border border-primary-300"}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={isLastPage}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-label font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shadow-md hover:scale-105 active:scale-95 ${isLastPage ? "opacity-30 pointer-events-none bg-slate-100 text-slate-400 border border-slate-200" : "bg-gradient-to-r from-primary-500 to-primary-600 text-foreground-950 hover:from-primary-600 hover:to-primary-700 shadow-primary-300/40"}`}
              >
                다음 페이지
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen */}
      {fullscreen && (
        <div className="fixed inset-0 z-[100] bg-foreground-950 flex">
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer z-10"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
          <div className="w-3/5 relative overflow-hidden bg-foreground-800">
            <img
              src={imgSrc(book.pages[currentPage].image)}
              alt={`${book.title} ${currentPage + 1}페이지`}
              className="w-full h-full object-cover object-top"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-8xl opacity-10 select-none">🖼️</span>
            </div>
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPage === 0}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors cursor-pointer z-10 ${currentPage === 0 ? "opacity-0 pointer-events-none" : ""}`}
            >
              <i className="ri-arrow-left-s-line text-3xl"></i>
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={isLastPage}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors cursor-pointer z-10 ${isLastPage ? "opacity-0 pointer-events-none" : ""}`}
            >
              <i className="ri-arrow-right-s-line text-3xl"></i>
            </button>
          </div>
          <div className="w-2/5 flex flex-col p-10 md:p-14 bg-foreground-900 overflow-auto">
            <p className="text-xs text-foreground-400 mb-6">{currentPage + 1} / {totalPages} 쪽</p>
            <div className="flex-1 flex items-center">
              <p className="text-xl md:text-2xl leading-loose font-body text-foreground-100">
                {formatText(pageTexts[currentPage] ?? "")}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-8 flex-shrink-0">
              {book.pages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToPage(idx)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${idx === currentPage ? "w-4 h-4 bg-primary-400" : "w-2.5 h-2.5 bg-foreground-700 hover:bg-foreground-500"}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Text Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-background-50 shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-background-200 flex-shrink-0">
              <h2 className="font-heading text-lg font-bold text-foreground-950">텍스트 편집</h2>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-background-200 text-foreground-500 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <div className="flex gap-1.5 px-6 py-3 border-b border-background-100 flex-shrink-0 overflow-x-auto">
              {book.pages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setEditPageIdx(idx)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-label font-semibold transition-all cursor-pointer border ${idx === editPageIdx ? "bg-amber-500 text-white border-amber-400" : "bg-background-100 text-foreground-500 border-background-200 hover:bg-background-200"}`}
                >
                  {idx + 1}쪽
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <p className="text-xs text-foreground-400 mb-2">{editPageIdx + 1}쪽 / 총 {totalPages}쪽</p>
              <textarea
                className="w-full h-48 rounded-2xl border border-background-200 bg-background-100 px-4 py-3 text-base font-body text-foreground-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={editDrafts[editPageIdx] ?? ""}
                onChange={(e) =>
                  setEditDrafts((prev) => {
                    const next = [...prev];
                    next[editPageIdx] = e.target.value;
                    return next;
                  })
                }
              />
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-background-200 flex-shrink-0">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-background-200 bg-background-50 hover:bg-background-100 text-foreground-700 font-label text-sm transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-label text-sm font-semibold transition-colors cursor-pointer"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
