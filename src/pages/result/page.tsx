import { Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import { DUMMY_BOOK_KEY, type DummyBook } from "@/services/dummyLookup";

function loadBook(): DummyBook | null {
  try {
    const raw = localStorage.getItem(DUMMY_BOOK_KEY);
    return raw ? (JSON.parse(raw) as DummyBook) : null;
  } catch {
    return null;
  }
}

export default function ResultPage() {
  const book = loadBook();

  if (!book) {
    return (
      <main className="min-h-screen bg-background-50 flex flex-col items-center justify-center gap-4">
        <TopNav isLoggedIn={true} />
        <p className="text-foreground-500 mt-20">동화 데이터를 찾을 수 없어요.</p>
        <Link
          to="/create"
          className="text-primary-600 underline text-sm"
        >
          다시 만들기
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto pt-10">

          {/* 동화 제목 */}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-center text-foreground-950 mb-2 leading-snug">
            {book.title}
          </h1>
          <p className="text-center text-sm text-foreground-400 mb-8">
            {book.name} · {book.age}세 · {book.theme}
          </p>

          {/* 썸네일 */}
          <div className="rounded-3xl overflow-hidden mb-12 bg-background-200 shadow-md">
            <div className="w-full aspect-[4/3] relative">
              <img
                src={`/books/${book.thumbnail}`}
                alt={book.title}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  el.style.display = "none";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-8xl opacity-10 select-none">📖</span>
              </div>
            </div>
          </div>

          {/* 페이지 1~6 */}
          <div className="space-y-10">
            {book.pages.map((page) => (
              <div
                key={page.page}
                className="rounded-3xl border border-background-200 overflow-hidden shadow-sm bg-white"
              >
                {/* 이미지 */}
                <div className="w-full aspect-[4/3] relative bg-background-100">
                  <img
                    src={`/books/${page.image}`}
                    alt={`${page.page}페이지`}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      el.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-7xl opacity-10 select-none">🖼️</span>
                  </div>
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/40 text-white text-xs font-label backdrop-blur-sm">
                    {page.page}쪽
                  </span>
                </div>

                {/* 줄거리 텍스트 */}
                <div className="px-6 md:px-8 py-6">
                  <p className="text-lg md:text-xl leading-loose font-body text-foreground-700">
                    {page.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 하단 액션 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-14">
            <Link
              to="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-background-200 bg-background-50 hover:bg-background-100 text-foreground-700 font-label text-sm transition-colors cursor-pointer"
            >
              <i className="ri-add-line"></i>
              새로운 동화 만들기
            </Link>
            <Link
              to="/bookshelf"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary-500 hover:bg-primary-600 text-foreground-950 font-label text-sm transition-colors cursor-pointer"
            >
              <i className="ri-book-shelf-line"></i>
              책장으로 가기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
