import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const { signInWithEmail, signUpWithEmail, signInWithKakao } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (tab === "signup" && password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    if (tab === "login") {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        onClose();
      }
    } else {
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setError(error);
      } else {
        setInfo("가입 확인 이메일을 발송했습니다. 메일함을 확인해 주세요.");
      }
    }
    setLoading(false);
  }

  async function handleKakao() {
    setError(null);
    setLoading(true);
    const { error } = await signInWithKakao();
    if (error) setError(error);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-background-50 dark:bg-background-100 border border-background-200 dark:border-background-300 p-7 relative">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-background-200 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="닫기"
        >
          <i className="ri-close-line text-foreground-500 text-lg"></i>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <i className="ri-book-open-fill text-white text-sm"></i>
          </div>
          <span className="font-logo text-xl text-primary-500">토리동화</span>
        </div>

        {/* Tab */}
        <div className="flex mb-6 rounded-xl bg-background-100 dark:bg-background-200 p-1">
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setError(null); setInfo(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-label transition-colors cursor-pointer whitespace-nowrap ${
                tab === t
                  ? "bg-background-50 dark:bg-background-300 text-foreground-950 shadow-sm"
                  : "text-foreground-600 hover:text-foreground-800"
              }`}
            >
              {t === "login" ? "로그인" : "회원가입"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-label text-foreground-600 block mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-foreground-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="이메일 입력"
            />
          </div>
          <div>
            <label className="text-xs font-label text-foreground-600 block mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-foreground-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="비밀번호 입력"
            />
          </div>
          {tab === "signup" && (
            <div>
              <label className="text-xs font-label text-foreground-600 block mb-1">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-foreground-950 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="비밀번호 재입력"
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
          )}
          {info && (
            <p className="text-xs text-primary-700 bg-primary-50 dark:bg-primary-900/20 rounded-lg px-3 py-2">{info}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-primary-500 text-white font-label text-sm hover:bg-primary-600 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "처리 중..." : tab === "login" ? "로그인" : "회원가입"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-background-200 dark:bg-background-300"></div>
          <span className="text-xs text-foreground-500">또는</span>
          <div className="flex-1 h-px bg-background-200 dark:bg-background-300"></div>
        </div>

        {/* Kakao */}
        <button
          type="button"
          onClick={handleKakao}
          disabled={loading}
          className="w-full py-3 rounded-full bg-[#FEE500] text-[#3C1E1E] font-label text-sm flex items-center justify-center gap-2 hover:bg-[#f0d800] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 3C7.03 3 3 6.36 3 10.5c0 2.65 1.72 4.98 4.32 6.34l-.9 3.32a.25.25 0 0 0 .38.27L10.9 18.1A10.6 10.6 0 0 0 12 18c4.97 0 9-3.36 9-7.5S16.97 3 12 3z" fill="#3C1E1E"/>
          </svg>
          카카오로 계속하기
        </button>
      </div>
    </div>
  );
}
