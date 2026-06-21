import { Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import books from "@/data/dummyBooks.json";

const STYLE_COLORS: Record<string, string> = {
  수채화: "bg-sky-50 text-sky-600 border-sky-200",
  동화풍: "bg-violet-50 text-violet-600 border-violet-200",
  연필드로잉: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function DummyBooksPage() {
  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-5xl mx-auto pt-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground-950 mb-2">
              샘플 동화 목록
            </h1>
            <p className="text-sm text-foreground-500">
              총 {books.length}권의 샘플 동화가 있어요.
            </p>
          </div>

          {/* Book grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Link
                key={book.id}
                to={`/dummy-viewer?id=${book.id}`}
                className="group rounded-3xl border border-background-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-[4/3] bg-background-100 overflow-hidden">
                  <img
                    src={`${__BASE_PATH__}books/${book.thumbnail}`}
                    alt={book.title}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-5xl opacity-20 select-none">📖</span>
                  </div>
                  {/* Age badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-label font-semibold bg-white/90 text-foreground-700 shadow-sm">
                    {book.age}세
                  </span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h2 className="font-heading text-base font-bold text-foreground-950 mb-1 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
                    {book.title}
                  </h2>
                  <p className="text-sm text-foreground-500 mb-3">
                    주인공: <span className="text-foreground-700 font-medium">{book.name}</span>
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-label border ${STYLE_COLORS[book.style] ?? "bg-background-100 text-foreground-500 border-background-200"}`}>
                      {book.style}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-label border bg-rose-50 text-rose-600 border-rose-200">
                      {book.theme}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-label border bg-emerald-50 text-emerald-600 border-emerald-200">
                      {book.koreanMotif}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-foreground-400">{book.pages.length}페이지</span>
                    <span className="text-xs font-label font-semibold text-primary-600 group-hover:underline">
                      읽기 →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
