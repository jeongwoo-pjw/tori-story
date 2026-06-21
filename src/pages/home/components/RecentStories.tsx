import { useRef } from "react";
import { Link } from "react-router-dom";
import { getDummyThumbnail } from "@/services/dummyLookup";
import { useLibrary } from "@/hooks/useLibrary";

type RecentStoriesProps = {
  isLoggedIn: boolean;
};

export default function RecentStories({ isLoggedIn }: RecentStoriesProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const allLibrary = useLibrary();

  if (!isLoggedIn) return null;

  const library = allLibrary.slice(0, 10);

  const scrollBy = (dir: number) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  if (library.length === 0) {
    return (
      <section className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-secondary-100/70">
        <div className="max-w-7xl mx-auto text-center py-12">
          <i className="ri-book-open-line text-5xl text-foreground-300 mb-4 block"></i>
          <p className="font-heading text-lg text-foreground-500 mb-2">아직 읽은 동화가 없어요</p>
          <p className="text-sm text-foreground-400 mb-6">동화를 만들고 첫 이야기를 시작해보세요!</p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-500 hover:bg-primary-600 text-foreground-950 font-label text-sm transition-colors cursor-pointer"
          >
            동화 만들기
            <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-secondary-100/70">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <h4 className="font-heading text-xl md:text-2xl text-foreground-950">
              최근 읽은 동화
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="이전"
              className="w-10 h-10 rounded-full bg-background-50 hover:bg-primary-100 border border-background-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-s-line text-foreground-900 text-lg w-5 h-5 flex items-center justify-center"></i>
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="다음"
              className="w-10 h-10 rounded-full bg-background-50 hover:bg-primary-100 border border-background-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <i className="ri-arrow-right-s-line text-foreground-900 text-lg w-5 h-5 flex items-center justify-center"></i>
            </button>
            <Link
              to="/bookshelf"
              className="ml-2 hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-full bg-background-50 hover:bg-primary-100 border border-background-200 text-sm font-label text-foreground-900 transition-colors whitespace-nowrap cursor-pointer"
            >
              내 책장 가기
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
            </Link>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {library.map((entry) => {
            const cover = entry.image || getDummyThumbnail(entry.title);
            return (
              <div
                key={entry.id}
                className="snap-start flex-shrink-0 w-[320px] md:w-[380px] group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden bg-background-50 border border-background-200 group-hover:border-primary-300 transition-all">
                  <div className="aspect-[4/3] overflow-hidden bg-secondary-50 flex items-center justify-center">
                    {cover ? (
                      <img
                        src={cover}
                        alt={`${entry.title} 동화 표지`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-50">
                        <i className="ri-book-open-line text-4xl text-primary-300"></i>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background-50/95 backdrop-blur text-xs font-label text-foreground-900 whitespace-nowrap">
                    {entry.tag}
                  </div>
                  {entry.status === "completed" && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary-500 text-foreground-950 text-xs font-label whitespace-nowrap">
                      완독
                    </div>
                  )}
                </div>
                <div className="mt-0 px-4 py-4 rounded-b-2xl bg-background-50/90 border border-t-0 border-background-200 flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-sm text-foreground-950 line-clamp-1">
                      {entry.title}
                    </p>
                    <p className="mt-1.5 text-xs text-foreground-600">{entry.createdAt}</p>
                  </div>
                  <Link
                    to={`/viewer?id=${entry.id}`}
                    className="flex-shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 text-xs font-label transition-colors whitespace-nowrap cursor-pointer"
                  >
                    이어 읽기
                    <i className="ri-arrow-right-line w-3 h-3 flex items-center justify-center"></i>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
