import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect, useState } from "react";

function AuthErrorBanner() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("error=")) return;

    const params = new URLSearchParams(hash.slice(1));
    const code = params.get("error_code");

    if (code === "otp_expired") {
      setMessage("인증 링크가 만료됐습니다. 다시 회원가입하거나 로그인해 주세요.");
    } else if (params.get("error")) {
      setMessage("인증 중 오류가 발생했습니다. 다시 시도해 주세요.");
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

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <AuthProvider>
          <AuthErrorBanner />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
