import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Mock children data
const children = [
  { id: "c1", name: "김첫째", age: 5, interests: ["도깨비", "용기"] },
  { id: "c2", name: "김둘째", age: 3, interests: ["호랑이", "우정"] },
  { id: "c3", name: "김셋째", age: 7, interests: ["한복", "지혜"] },
];

// Theme cycle
const themes = [
  { name: "핑크베리", className: "theme-pinkberry", color: "#f4a8bc" },
  { name: "새벽민트", className: "theme-dawnmint",  color: "#BFECE9" },
  { name: "황금노을", className: "theme-goldendusk", color: "#FFE4A5" },
  { name: "달빛별",   className: "theme-moonstar",   color: "#C9DAFF" },
];

// Parent lock popup
function ParentLockPopup({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;

  const check = () => {
    if (parseInt(answer, 10) === a + b) {
      onSuccess();
    } else {
      setError(true);
      setAnswer("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 p-7 text-center relative">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-background-200 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="닫기"
        >
          <i className="ri-close-line text-foreground-500 w-5 h-5 flex items-center justify-center"></i>
        </button>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-full bg-accent-200 flex items-center justify-center">
            <i className="ri-lock-unlock-line text-accent-900 dark:text-foreground-950 w-4 h-4 flex items-center justify-center"></i>
          </span>
          <h3 className="font-heading text-lg text-foreground-950">부모 모드 작동중</h3>
        </div>
        <p className="text-sm text-foreground-700 mb-4">
          안전한 내 아이 모아보기로 진입하려면 아래 수식을 풀어주세요.
        </p>
        <div className="text-center py-4 bg-accent-100 dark:bg-accent-500/20 rounded-2xl mb-4">
          <p className="font-heading text-2xl text-foreground-950">
            {a} + {b} = ?
          </p>
        </div>
        <input
          type="number"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") check();
          }}
          className="w-full px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-center font-heading text-xl text-foreground-950 focus:outline-none focus:ring-2 focus:ring-accent-400 mb-3"
          placeholder="정답 입력"
        />
        {error && (
          <p className="text-xs text-accent-700 text-center mb-3">
            다시 풀어보세요!
          </p>
        )}
        <button
          type="button"
          onClick={check}
          className="w-full py-3 rounded-full bg-accent-500 text-foreground-950 dark:text-foreground-950 font-label text-sm hover:bg-accent-600 transition-colors cursor-pointer whitespace-nowrap"
        >
          부모 잠금 해제
        </button>
      </div>
    </div>
  );
}

type TopNavProps = {
  isLoggedIn?: boolean;
  onToggleLogin?: () => void;
};

export default function TopNav({ isLoggedIn = false, onToggleLogin }: TopNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"KO" | "EN">("KO");
  const [themeIdx, setThemeIdx] = useState(() => {
    try {
      const s = parseInt(localStorage.getItem("tori-theme") || "0", 10);
      return isNaN(s) ? 0 : Math.min(s, themes.length - 1);
    } catch { return 0; }
  });
  const [themePickOpen, setThemePickOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem("tori-dark") === "true"; } catch { return false; }
  });
  const [childOpen, setChildOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(children[0]);
  const [parentLockOpen, setParentLockOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Apply stored theme on mount
  useEffect(() => {
    const body = document.body;
    themes.forEach((t) => body.classList.remove(t.className));
    body.classList.add(themes[themeIdx].className);
  }, []);

  // Dark mode — sync to DOM and persist
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    try { localStorage.setItem("tori-dark", String(next)); } catch {}
  };

  // Theme apply
  const applyTheme = (idx: number) => {
    setThemeIdx(idx);
    const body = document.body;
    themes.forEach((t) => body.classList.remove(t.className));
    body.classList.add(themes[idx].className);
    try { localStorage.setItem("tori-theme", String(idx)); } catch {}
    setThemePickOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background-50/95 backdrop-blur-md border-b border-background-200/60"
            : "bg-background-50/80 backdrop-blur-sm border-b border-background-200/30"
        }`}
      >
        <div className="w-full px-4 md:px-6 lg:px-10">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo with icon — indented by sidebar width */}
            <Link to="/" className="flex items-center gap-2 md:gap-2.5 cursor-pointer pl-[var(--sidebar-width)]">
              <div className="w-7 h-7 flex-shrink-0 bg-primary-500 rounded-full flex items-center justify-center" aria-hidden="true">
                <i className="ri-book-open-fill text-white text-base leading-none"></i>
              </div>
              <span className="font-logo text-xl md:text-2xl text-primary-500 whitespace-nowrap">
                토리동화
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-3">
              {/* Language toggle — one-touch */}
              <button
                type="button"
                onClick={() => setLang((prev) => (prev === "KO" ? "EN" : "KO"))}
                className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-primary-100/50 transition-colors cursor-pointer"
                title={lang === "KO" ? "Switch to English" : "한국어로 전환"}
              >
                <span className="text-xs font-label text-foreground-800 whitespace-nowrap">
                  {lang}
                </span>
              </button>

              {/* Color switch — dropdown on touch */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setThemePickOpen((v) => !v)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-primary-100/50 transition-colors cursor-pointer"
                  title={themes[themeIdx].name}
                >
                  <span className="grid grid-cols-2 gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary-400"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground-400"></span>
                  </span>
                </button>
                {themePickOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 rounded-2xl bg-background-50 border border-primary-200 p-2 z-50">
                    {themes.map((theme, i) => (
                      <button
                        key={theme.className}
                        type="button"
                        onClick={() => applyTheme(i)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-label transition-colors cursor-pointer whitespace-nowrap ${
                          i === themeIdx
                            ? "bg-primary-100 text-primary-900"
                            : "text-foreground-800 hover:bg-primary-50"
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: theme.color }}></span>
                        {theme.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark mode — icon only */}
              <button
                type="button"
                onClick={toggleDark}
                className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors cursor-pointer ${
                  darkMode
                    ? "bg-foreground-800 text-background-50"
                    : "hover:bg-primary-100/50 text-foreground-700"
                }`}
                title={darkMode ? "라이트 모드" : "나이트 모드"}
              >
                <i className={`${darkMode ? "ri-moon-fill" : "ri-sun-line"} w-4 h-4 flex items-center justify-center text-sm`}></i>
              </button>

              {/* Logged-in specific */}
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <span className="text-foreground-300 text-sm select-none">|</span>
                  {/* Parent lock — with text */}
                  <button
                    type="button"
                    onClick={() => setParentLockOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-accent-100/60 border border-accent-300 hover:bg-accent-200/80 hover:border-accent-400 transition-colors cursor-pointer whitespace-nowrap"
                    title="부모잠금"
                  >
                    <i className="ri-lock-unlock-line text-accent-800 w-3.5 h-3.5 flex items-center justify-center text-xs"></i>
                    <span className="text-[11px] font-label text-accent-900 whitespace-nowrap">부모잠금</span>
                  </button>

                  {/* Child switcher — primary/pink color */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setChildOpen((v) => !v)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-50/40 border border-primary-200 hover:bg-primary-100/60 hover:border-primary-300 transition-colors cursor-pointer whitespace-nowrap`}
                    >
                      <i className="ri-user-smile-line text-foreground-700 w-4 h-4 flex items-center justify-center text-sm"></i>
                      <span className="text-xs font-label text-foreground-800 whitespace-nowrap">
                        {selectedChild.name}
                      </span>
                      <i className="ri-arrow-down-s-line text-foreground-600 w-3 h-3 flex items-center justify-center text-xs"></i>
                    </button>
                    {childOpen && (
                      <div className="absolute top-full right-0 mt-2 w-48 rounded-2xl bg-background-50 border border-primary-200 p-2 z-50">
                        {children.map((child) => (
                          <button
                            key={child.id}
                            type="button"
                            onClick={() => {
                              setSelectedChild(child);
                              setChildOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-label transition-colors cursor-pointer whitespace-nowrap ${
                              selectedChild.id === child.id
                                ? "bg-primary-100 text-primary-900"
                                : "text-foreground-800 hover:bg-primary-50"
                            }`}
                          >
                            <span className="w-6 h-6 rounded-full bg-primary-200 flex items-center justify-center text-xs text-primary-800">
                              {child.age}
                            </span>
                            {child.name} ({child.age}세)
                          </button>
                        ))}
                        <div className="my-1 border-t border-background-200"></div>
                        <button
                          type="button"
                          onClick={() => {
                            setChildOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-label text-foreground-700 hover:bg-secondary-100 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-user-add-line text-foreground-500 w-4 h-4 flex items-center justify-center"></i>
                          내 아이 추가하기
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Logout — icon only */}
                  <button
                    type="button"
                    onClick={onToggleLogin}
                    className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-primary-100/50 transition-colors cursor-pointer"
                    title="로그아웃"
                  >
                    <i className="ri-logout-circle-r-line text-foreground-700 w-4 h-4 flex items-center justify-center text-sm"></i>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/plan"
                    className="px-3 py-1.5 rounded-lg bg-primary-50/40 border border-primary-200 text-xs font-label text-foreground-700 hover:bg-primary-100/60 hover:border-primary-300 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    구독
                  </Link>
                  <button
                    type="button"
                    onClick={onToggleLogin}
                    className="px-3 py-1.5 rounded-lg bg-accent-100/60 border border-accent-300 text-xs font-label text-accent-900 hover:bg-accent-200/80 hover:border-accent-400 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    로그인
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary-100/50 cursor-pointer"
              aria-label="메뉴"
            >
              <i
                className={`text-foreground-900 text-xl w-5 h-5 flex items-center justify-center ${
                  menuOpen ? "ri-close-line" : "ri-menu-line"
                }`}
              ></i>
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 pt-2">
              <div className="rounded-2xl bg-background-50/95 backdrop-blur border border-primary-200 p-3 space-y-2">
                {/* Mobile controls row */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Language — one-touch */}
                  <button
                    type="button"
                    onClick={() => setLang((prev) => (prev === "KO" ? "EN" : "KO"))}
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50/40 border border-primary-200 cursor-pointer"
                  >
                    <span className="text-xs font-label text-foreground-800">{lang}</span>
                  </button>

                  {/* Color switch — dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setThemePickOpen((v) => !v)}
                      className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-primary-100/50 cursor-pointer"
                    >
                      <span className="grid grid-cols-2 gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-400"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-400"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground-400"></span>
                      </span>
                    </button>
                    {themePickOpen && (
                      <div className="absolute top-full left-0 mt-2 w-40 rounded-2xl bg-background-50 border border-primary-200 p-2 z-50">
                        {themes.map((theme, i) => (
                          <button
                            key={theme.className}
                            type="button"
                            onClick={() => applyTheme(i)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-label transition-colors cursor-pointer whitespace-nowrap ${
                              i === themeIdx
                                ? "bg-primary-100 text-primary-900"
                                : "text-foreground-800 hover:bg-primary-50"
                            }`}
                          >
                            <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: theme.color }}></span>
                            {theme.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dark mode — icon only */}
                  <button
                    type="button"
                    onClick={toggleDark}
                    className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-colors cursor-pointer ${
                      darkMode
                        ? "bg-foreground-800 border-foreground-700 text-background-50"
                        : "bg-primary-50/40 border-primary-200 text-foreground-700"
                    }`}
                  >
                    <i className={`${darkMode ? "ri-moon-fill" : "ri-sun-line"} w-4 h-4 flex items-center justify-center text-sm`}></i>
                  </button>
                </div>

                {isLoggedIn ? (
                  <div className="space-y-1 pt-2 border-t border-primary-200/70">
                    <button
                      type="button"
                      onClick={() => setParentLockOpen(true)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-label text-accent-900 bg-accent-100/60 border border-accent-300 cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-lock-unlock-line w-4 h-4 flex items-center justify-center"></i>
                      부모잠금
                    </button>
                    <div className="px-4 py-2">
                      <p className="text-xs text-foreground-600 mb-1.5 font-label">아이 선택</p>
                      <div className="flex gap-2">
                        {children.map((child) => (
                          <button
                            key={child.id}
                            type="button"
                            onClick={() => setSelectedChild(child)}
                            className={`px-3 py-1.5 rounded-full text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${
                              selectedChild.id === child.id
                                ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                                : "bg-primary-50 text-primary-900 border border-primary-200"
                            }`}
                          >
                            {child.name} ({child.age}세)
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onToggleLogin?.();
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-label text-foreground-900 bg-primary-50/40 border border-primary-200 cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-logout-circle-r-line w-4 h-4 flex items-center justify-center"></i>
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 pt-2 border-t border-primary-200/70">
                    <Link
                      to="/plan"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 rounded-xl text-sm font-label text-foreground-900 bg-primary-50/40 border border-primary-200 cursor-pointer whitespace-nowrap"
                    >
                      구독
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        onToggleLogin?.();
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-accent-100/60 border border-accent-300 text-sm font-label text-accent-900 hover:bg-accent-200/80 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      로그인
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Parent lock popup */}
      {parentLockOpen && (
        <ParentLockPopup
          onSuccess={() => {
            setParentLockOpen(false);
            window.location.href = `${window.location.origin}${__BASE_PATH__}/dashboard`;
          }}
          onClose={() => setParentLockOpen(false)}
        />
      )}

      {/* Click outside to close child dropdown */}
      {childOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setChildOpen(false)}
        ></div>
      )}

      {/* Click outside to close theme dropdown */}
      {themePickOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setThemePickOpen(false)}
        ></div>
      )}
    </>
  );
}
