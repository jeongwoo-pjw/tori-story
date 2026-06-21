import { BrowserRouter, useNavigate } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useEffect, useRef, useState } from "react";

function AuthErrorBanner() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("error=")) return;

    const params = new URLSearchParams(hash.slice(1));
    const code = params.get("error_code");
    const desc = params.get("error_description");

    if (code === "otp_expired") {
      setMessage("인증 링크가 만료됐습니다. 다시 회원가입하거나 로그인해 주세요.");
    } else if (params.get("error")) {
      const detail = desc ? ` (${decodeURIComponent(desc.replace(/\+/g, " "))})` : code ? ` [${code}]` : "";
      setMessage(`인증 중 오류가 발생했습니다.${detail}`);
    }

    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  if (!message) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] w-full max-w-sm px-4">
      <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-3 shadow-lg">
        <i className="ri-error-warning-line text-red-500 mt-0.5 flex-shrink-0"></i>
        <p className="text-sm text-red-700 flex-1">{message}</p>
        <button
          type="button"
          onClick={() => setMessage(null)}
          className="text-red-400 hover:text-red-600 flex-shrink-0 cursor-pointer"
        >
          <i className="ri-close-line"></i>
        </button>
      </div>
    </div>
  );
}

function AuthRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // undefined = 아직 초기 세션 체크 전, null = 로그아웃 상태, string = 로그인된 유저 ID
  const knownUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (loading) return;

    const currentId = user?.id ?? null;

    if (knownUserId.current === undefined) {
      // 첫 세션 체크 완료 — 현재 로그인 상태를 기준으로 저장 (페이지 새로고침 시 이동 안 함)
      knownUserId.current = currentId;
      return;
    }

    // 로그아웃 → 로그인으로 전환된 경우에만 홈으로 이동
    if (currentId && !knownUserId.current) {
      navigate("/");
    }
    knownUserId.current = currentId;
  }, [user?.id, loading, navigate]);

  return null;
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <AuthProvider>
          <AuthErrorBanner />
          <AuthRedirect />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
