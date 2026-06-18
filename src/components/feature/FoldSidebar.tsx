import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const sidebarMenus = [
  {
    icon: "ri-book-open-line",
    label: "동화 만들기",
    subItems: [
      { label: "선택형 동화", path: "/create/select" },
      { label: "대화형 동화", path: "/create/chat" },
    ],
  },
  { icon: "ri-puzzle-line", label: "놀이마당", path: "/report" },
  { icon: "ri-book-3-line", label: "내 책장", path: "/bookshelf" },
  { icon: "ri-dashboard-line", label: "아이 성장 분석", path: "/dashboard" },
  { icon: "ri-settings-3-line", label: "설정", path: "/settings" },
  { icon: "ri-vip-crown-line", label: "구독", path: "/subscription" },
];

const userProfile = {
  name: "김민준",
  avatar: "https://readdy.ai/api/search-image?query=Soft%20warm%20pastel%20illustration%20of%20a%20friendly%20parent%20avatar%20portrait%20gentle%20smile%20minimalist%20style%20clean%20background%20warm%20cream%20tones&width=100&height=100&seq=avatar-001&orientation=squarish",
};

export default function FoldSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const location = useLocation();

  const toggleExpand = () => setExpanded((v) => !v);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      expanded ? "224px" : "56px"
    );
  }, [expanded]);

  const toggleSub = (label: string) => {
    setOpenSub(openSub === label ? null : label);
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (subItems: { path: string }[]) =>
    subItems.some((sub) => location.pathname === sub.path);

  return (
    <aside
      className={`fixed left-0 top-14 md:top-16 bottom-0 z-40 bg-background-50/95 dark:bg-background-50 backdrop-blur border-r border-background-200/50 transition-all duration-300 flex flex-col ${
        expanded ? "w-56" : "w-14"
      }`}
    >
      {/* Toggle area */}
      <div className="p-3 border-b border-background-200/40 flex items-center justify-between">
        <button
          type="button"
          onClick={toggleExpand}
          className="flex items-center justify-center rounded-lg py-1.5 px-1.5 hover:bg-primary-50/30 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="w-[18px] h-[18px] fill-foreground-400"
          >
            <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zm0 128c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm224 128c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H192c17.7 0 32 14.3 32 32z" />
          </svg>
        </button>
        {expanded && (
          <button
            type="button"
            onClick={toggleExpand}
            className="rounded-lg p-1 hover:bg-primary-50/30 transition-colors cursor-pointer"
          >
            <i className="ri-arrow-left-s-line w-5 h-5 flex items-center justify-center text-foreground-400"></i>
          </button>
        )}
      </div>

      {/* Menu items */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5">
        {sidebarMenus.map((item) => {
          const hasSub = !!item.subItems;
          const isSubOpen = openSub === item.label;
          const active = item.path
            ? isActive(item.path)
            : item.subItems
            ? isParentActive(item.subItems)
            : false;

          return (
            <div key={item.label} className="relative">
              {hasSub ? (
                <button
                  type="button"
                  onClick={() => toggleSub(item.label)}
                  className={`w-full flex items-center gap-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-primary-500 text-background-50 hover:bg-primary-600"
                      : "text-foreground-500 hover:bg-primary-50/40 hover:text-primary-600"
                  } ${
                    expanded ? "px-3 py-3 gap-3" : "justify-center py-3 px-0"
                  }`}
                >
                  <i className={`${item.icon} w-5 h-5 flex items-center justify-center text-base flex-shrink-0`}></i>
                  {expanded && (
                    <span className="text-sm font-label truncate">
                      {item.label}
                    </span>
                  )}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`w-full flex items-center gap-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-primary-500 text-background-50 hover:bg-primary-600"
                      : "text-foreground-500 hover:bg-primary-50/40 hover:text-primary-600"
                  } ${
                    expanded ? "px-3 py-3 gap-3" : "justify-center py-3 px-0"
                  }`}
                >
                  <i className={`${item.icon} w-5 h-5 flex items-center justify-center text-base flex-shrink-0`}></i>
                  {expanded && (
                    <span className="text-sm font-label truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              )}
              {/* Submenu */}
              {hasSub && isSubOpen && (
                <div
                  className={`${
                    expanded ? "pl-10 pr-2 pb-1 space-y-0.5" : "absolute left-14 w-40 bg-background-50 border border-background-200/60 rounded-xl shadow-lg p-2 z-50 space-y-0.5"
                  }`}
                >
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      className={`block px-3 py-2 rounded-lg text-sm font-label transition-colors whitespace-nowrap ${
                        isActive(sub.path)
                          ? "bg-primary-50 text-primary-700"
                          : "text-foreground-500 hover:text-primary-600 hover:bg-primary-50/30"
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Divider line */}
      <div className="border-t border-background-200/40" />

      {/* Profile */}
      <div className="p-3">
        <div
          className={`flex items-center gap-3 ${
            expanded ? "" : "justify-center"
          }`}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          </div>
          {expanded && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-label text-foreground-950 truncate">
                  {userProfile.name}
                </p>
                <span className="inline-block px-1.5 py-[1px] rounded text-[9px] font-label bg-accent-500 text-foreground-950 dark:text-foreground-950 leading-tight flex-shrink-0">
                  PREMIUM
                </span>
              </div>
              <p className="text-[11px] text-foreground-500 truncate leading-tight mt-0.5">
                6세 여자아이
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
