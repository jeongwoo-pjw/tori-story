import { useRef } from "react";
import { Link } from "react-router-dom";
import { recentStories } from "@/mocks/recent-stories";

type RecentStoriesProps = {
  isLoggedIn: boolean;
};

export default function RecentStories({ isLoggedIn }: RecentStoriesProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  if (!isLoggedIn) return null;

  const scrollBy = (dir: number) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16 bg-secondary-100/70">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <h4 className="font-heading text-xl md:text-2xl text-foreground-950">
              <a href="#recent" className="cursor-pointer">최근 읽은 동화</a>
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
              to="/library"
              className="ml-2 hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-full bg-background-50 hover:bg-primary-100 border border-background-200 text-sm font-label text-foreground-900 transition-colors whitespace-nowrap cursor-pointer"
            >
              내 책장가기
              <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
            </Link>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {recentStories.map((story) => (
            <div
              key={story.id}
              className="snap-start flex-shrink-0 w-[320px] md:w-[380px] group cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden bg-background-50 border border-background-200 group-hover:border-primary-300 transition-all">
                {/* Story cover image */}
                <div className="aspect-[4/3] overflow-hidden bg-secondary-50 flex items-center justify-center">
                  <img
                    src={story.cover}
                    alt={`${story.title} 동화 표지`}
                    className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${story.id === "s-006" ? "object-contain" : "object-cover"}`}
                  />
                </div>
                {/* Tag badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background-50/95 backdrop-blur text-xs font-label text-foreground-900 whitespace-nowrap">
                  {story.tag}
                </div>
              </div>
              {/* Title, date, and continue button — with background */}
              <div className="mt-0 px-4 py-4 rounded-b-2xl bg-background-50/90 border border-t-0 border-background-200 flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm text-foreground-950 line-clamp-1">
                    {story.title}
                  </p>
                  <p className="mt-1.5 text-xs text-foreground-600">{story.date} · 2일 전</p>
                </div>
                <Link
                  to={`/viewer/${story.id}`}
                  className="flex-shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 text-xs font-label transition-colors whitespace-nowrap cursor-pointer"
                >
                  이어 읽기
                  <i className="ri-arrow-right-line w-3 h-3 flex items-center justify-center"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
