import { useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";
import {
  PREMIUM_RECENT_STORIES,
  ALL_STORIES,
  BOOKSHELF_FILTERS,
  CARD_TABS,
} from "@/mocks/bookshelf";

const STATUS_LABEL: Record<string, string> = {
  reading: "읽는 중",
  completed: "완독",
  deleted: "지움",
};

const STATUS_STYLE: Record<string, string> = {
  reading: "bg-secondary-100 text-secondary-900",
  completed: "bg-primary-100 text-primary-900",
  deleted: "bg-foreground-100 text-foreground-900",
};

export default function BookshelfPremiumPage() {
  const [activeCardTab, setActiveCardTab] = useState("recent");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedStories, setLikedStories] = useState<Set<string>>(
    () => new Set(ALL_STORIES.filter((s) => s.liked).map((s) => s.id))
  );

  const filteredStories = ALL_STORIES.filter((story) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "deleted") return false;
    return story.status === activeFilter;
  }).filter((story) => {
    if (!searchQuery) return true;
    return story.title.includes(searchQuery);
  });

  const toggleLike = (id: string) => {
    setLikedStories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
                <p className="text-sm text-foreground-500">총 12권</p>
              </div>
            </div>

            {/* Card tabs */}
            <div className="flex items-center gap-2 mb-4">
              {CARD_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCardTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-label transition-colors whitespace-nowrap cursor-pointer ${
                    tab.id === activeCardTab
                      ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                      : "bg-secondary-100 text-foreground-700 border border-secondary-200 hover:bg-secondary-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Recent stories cards - 4 columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {PREMIUM_RECENT_STORIES.map((story) => (
                <div
                  key={story.id}
                  className="rounded-2xl bg-background-50 border border-background-200/70 overflow-hidden"
                >
                  <div className="w-full aspect-[16/10] relative overflow-hidden bg-secondary-100">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-label text-foreground-950 mb-1">
                      {story.title}
                    </h3>
                    <p className="text-xs text-foreground-500 mb-3">
                      마지막으로 읽은 날: {story.lastRead}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground-500">
                        {story.progress}% 읽음
                      </span>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 text-xs font-label transition-colors cursor-pointer whitespace-nowrap"
                      >
                        {story.progress === 100 ? "다시 읽기" : "이어 읽기"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Saved stories table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-label text-foreground-700">
                  저장된 동화 전체
                </h2>
                {/* Search */}
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-foreground-400 text-sm"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="제목으로 검색"
                    className="pl-9 pr-4 py-2 rounded-lg border border-background-200 bg-background-50 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 w-48 md:w-64"
                  />
                </div>
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
                        ? "bg-foreground-800 text-background-50"
                        : "bg-secondary-100 text-foreground-700 border border-secondary-200 hover:bg-secondary-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-background-200/70 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-background-100 border-b border-background-200/70">
                        <th className="text-left py-3 px-4 text-xs font-label text-foreground-500 w-12">
                          좋아요
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-label text-foreground-500">
                          동화 제목
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-label text-foreground-500">
                          생성일
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-label text-foreground-500">
                          진행 상태
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-label text-foreground-500">
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
                          className={`border-b border-background-200/70 ${
                            idx % 2 === 0 ? "bg-background-50" : "bg-background-100"
                          }`}
                        >
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => toggleLike(story.id)}
                              className="w-6 h-6 flex items-center justify-center cursor-pointer"
                            >
                              <i
                                className={`${
                                  likedStories.has(story.id)
                                    ? "ri-heart-fill text-accent-500"
                                    : "ri-heart-line text-foreground-400"
                                } w-5 h-5 flex items-center justify-center text-base`}
                              ></i>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-foreground-950 font-label">
                            {story.title}
                          </td>
                          <td className="py-3 px-4 text-foreground-500">
                            {story.createdAt}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-1 rounded-md text-xs font-label ${STATUS_STYLE[story.status]}`}
                            >
                              {STATUS_LABEL[story.status]}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-foreground-500">
                            {story.lastRead}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 text-xs font-label transition-colors cursor-pointer whitespace-nowrap"
                            >
                              {story.status === "completed" ? "다시 읽기" : "이어 읽기"}
                            </button>
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
    </main>
  );
}
