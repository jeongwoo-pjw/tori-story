import { useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";

const ACTIVITIES = [
  {
    id: "comprehension",
    title: "이해력 활동",
    subtitle: "이야기를 다시 떠올려요",
    path: "/report/comprehension",
    tagColor: "bg-primary-100 text-primary-900",
  },
  {
    id: "emotion",
    title: "감정탐색",
    subtitle: "상상을 이어가요",
    path: "/report/emotion",
    tagColor: "bg-accent-100 text-accent-900",
  },
  {
    id: "creative",
    title: "창의력 활동",
    subtitle: "손으로 만들어봐요",
    path: "/report/creative",
    tagColor: "bg-secondary-100 text-secondary-900",
  },
  {
    id: "vocabulary",
    title: "어휘활동",
    subtitle: "오늘의 말을 배워봐요",
    path: "/report/vocabulary",
    tagColor: "bg-foreground-100 text-foreground-900",
  },
];

export default function PlaygroundPage() {
  const [selected, setSelected] = useState(0);

  return (
    <main className="min-h-screen bg-background-100 dark:bg-background-50 text-foreground-950 flex flex-col">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12 flex-1 flex flex-col">
        <div className="px-4 md:px-8 lg:px-12 flex-1 flex flex-col">
          <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
            {/* Header bar */}
            <div className="flex items-center justify-between mb-8 pt-4">
              <Link
                to="/viewer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-100 hover:bg-primary-50 dark:hover:bg-background-200 text-sm font-label text-foreground-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center"></i>
                다시 읽기
              </Link>
              <h1 className="font-heading text-2xl md:text-3xl text-foreground-950">
                토리네 놀이마당
              </h1>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 text-sm font-label transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-check-line w-4 h-4 flex items-center justify-center"></i>
                활동 완료
              </button>
            </div>

            {/* Activity cards - centered vertically */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
                {ACTIVITIES.map((act, idx) => (
                  <Link
                    key={act.id}
                    to={act.path}
                    onClick={() => setSelected(idx)}
                    className={`group flex flex-col rounded-2xl border overflow-hidden transition-all cursor-pointer ${
                      idx === selected
                        ? "border-primary-500 ring-2 ring-primary-300"
                        : "border-background-200 dark:border-background-300 hover:border-primary-300"
                    }`}
                  >
                    <div className="w-full aspect-[3/4] bg-secondary-100 flex items-center justify-center relative overflow-hidden">
                      <div className="w-12 h-12 rounded-xl bg-secondary-200 flex items-center justify-center">
                        <i className="ri-image-line w-6 h-6 flex items-center justify-center text-secondary-500 text-xl"></i>
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded-md text-xs font-label mb-2 dark:text-foreground-950 ${act.tagColor}`}>
                        {act.title}
                      </span>
                      <p className="text-xs text-foreground-500">
                        {act.subtitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Navigation arrows */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setSelected((prev) => Math.max(prev - 1, 0))}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-background-50 dark:bg-background-200 border border-background-200 dark:border-background-300 hover:bg-primary-50 dark:hover:bg-background-300 transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-left-s-line w-5 h-5 flex items-center justify-center text-foreground-500"></i>
                </button>
                <button
                  type="button"
                  onClick={() => setSelected((prev) => Math.min(prev + 1, ACTIVITIES.length - 1))}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-background-50 dark:bg-background-200 border border-background-200 dark:border-background-300 hover:bg-primary-50 dark:hover:bg-background-300 transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-right-s-line w-5 h-5 flex items-center justify-center text-foreground-500"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
