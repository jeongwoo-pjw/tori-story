import { useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import {
  RECENT_STORIES,
  ALL_STORIES,
  BOOKSHELF_FILTERS,
} from "@/mocks/bookshelf";

const STATUS_LABEL: Record<string, string> = {
  reading: "읽는 중",
  completed: "완독",
  deleted: "지움",
};

const STATUS_STYLE: Record<string, string> = {
  reading: "bg-secondary-100 text-secondary-900 dark:text-foreground-950",
  completed: "bg-primary-100 text-primary-900 dark:text-foreground-950",
  deleted: "bg-foreground-100 text-foreground-900",
};

export default function BookshelfPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const matchesSearch = (title: string, tag: string) =>
    !searchQuery || title.includes(searchQuery) || tag.includes(searchQuery);

  const filteredRecent = RECENT_STORIES.filter((s) => matchesSearch(s.title, s.tag));

  const filteredStories = ALL_STORIES.filter((story) => {
    if (activeFilter === "deleted") return false;
    const filterOk = activeFilter === "all" || story.status === activeFilter;
    return filterOk && matchesSearch(story.title, story.tag);
  });

  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12">
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-heading text-2xl md:text-3xl text-foreground-950 mb-1">
                  내 책장
                </h1>
                <p className="text-sm text-foreground-500">총 {ALL_STORIES.length}권</p>
              </div>
              {/* Premium link button */}
              <button
                type="button"
                onClick={() => setShowPopup(true)}
                className="px-4 py-2 rounded-full text-xs font-label border border-accent-300 bg-accent-100 text-accent-900 dark:text-foreground-950 hover:bg-accent-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                프리미엄 보기
              </button>
            </div>

            {/* Recent stories cards */}
            <div className="relative mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground-800">
                  최근에 읽은 동화
                </h2>
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400 text-sm pointer-events-none"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="동화 검색..."
                    className="pl-8 pr-4 py-2 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-100 text-sm font-label text-foreground-950 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-400 w-44 md:w-56 transition-all"
                  />
                </div>
              </div>
              {filteredRecent.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-foreground-400">
                  <i className="ri-search-line text-3xl mb-2"></i>
                  <p className="text-sm font-label">검색 결과가 없어요</p>
                </div>
              ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredRecent.map((story) => (
                  <div
                    key={story.id}
                    className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 overflow-hidden"
                  >
                    <div className="w-full aspect-[4/3] relative overflow-hidden bg-secondary-50 flex items-center justify-center">
                      <img
                        src={story.image}
                        alt={story.title}
                        className={`w-full h-full ${story.id === "s-006" ? "object-contain" : "object-cover"}`}
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-background-50/95 backdrop-blur text-xs font-label text-foreground-900 whitespace-nowrap">
                        {story.tag}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-label text-foreground-950 mb-1 line-clamp-1">
                        {story.title}
                      </h3>
                      <p className="text-xs text-foreground-500 mb-3">
                        마지막으로 읽은 날: {story.lastRead}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground-500">
                          {story.progress}% 읽음
                        </span>
                        <Link
                          to={`/viewer/${story.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 text-xs font-label transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {story.progress === 100 ? "다시 읽기" : "이어 읽기"}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>

            {/* Saved stories table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground-800">
                  저장된 동화 전체
                </h2>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-2 mb-4">
                {BOOKSHELF_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${
                      filter.id === activeFilter
                        ? "bg-foreground-800 dark:bg-background-300 text-background-50 dark:text-foreground-950"
                        : "bg-secondary-100 dark:bg-background-200 text-foreground-700 border border-secondary-200 dark:border-background-300 hover:bg-secondary-200 dark:hover:bg-background-300"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-background-200/70 dark:border-background-300/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-background-100 dark:bg-background-200 border-b border-background-200/70 dark:border-background-300/50">
                        <th className="text-left py-3 px-4 text-xs font-label text-foreground-500">
                          동화 제목
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-label text-foreground-500 hidden sm:table-cell">
                          태그
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-label text-foreground-500 hidden md:table-cell">
                          생성일
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-label text-foreground-500">
                          진행 상태
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-label text-foreground-500 hidden md:table-cell">
                          마지막 열림
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-label text-foreground-500">
                          액션
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStories.map((story, idx) => (
                        <tr
                          key={story.id}
                          className={`border-b border-background-200/70 dark:border-background-300/50 ${
                            idx % 2 === 0 ? "bg-background-50 dark:bg-background-100" : "bg-background-100 dark:bg-background-200"
                          }`}
                        >
                          <td className="py-3 px-4 text-foreground-950 font-label">
                            {story.title}
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-secondary-100 text-foreground-600 text-xs font-label whitespace-nowrap">
                              {story.tag}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-foreground-500 hidden md:table-cell">
                            {story.createdAt}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-1 rounded-md text-xs font-label ${STATUS_STYLE[story.status]}`}
                            >
                              {STATUS_LABEL[story.status]}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-foreground-500 hidden md:table-cell">
                            {story.lastRead}
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              to={`/viewer/${story.id}`}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 text-xs font-label transition-colors cursor-pointer whitespace-nowrap"
                            >
                              {story.status === "completed" ? "다시 읽기" : "이어 읽기"}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup: Bookshelf is full */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-950/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-7 shadow-xl">
            <div className="mb-5 text-center">
              <span className="inline-block text-2xl mb-3">🔔</span>
              <h2 className="text-base font-label text-foreground-950 mb-2">서비스 정식 준비중</h2>
              <p className="text-xs text-foreground-500 leading-relaxed">
                현재 프리미엄 결제 모듈 연동 및 카드 지불 심사가 정식 등록 절차에 따라 최종 진행중입니다!<br />
                다음 업데이트 시 바로 오픈될 예정입니다.
              </p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowPopup(false)}
                className="flex-1 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors cursor-pointer whitespace-nowrap">
                알림 받기
              </button>
              <button type="button" onClick={() => setShowPopup(false)}
                className="flex-1 py-3 rounded-xl bg-secondary-100 hover:bg-secondary-200 text-foreground-700 font-label text-sm transition-colors cursor-pointer whitespace-nowrap">
                확인하기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
