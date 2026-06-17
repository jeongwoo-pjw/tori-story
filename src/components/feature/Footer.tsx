import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-secondary-100 border-t border-secondary-200 mt-0">
      <div className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                <i className="ri-book-open-line text-background-50 text-lg w-5 h-5 flex items-center justify-center"></i>
              </span>
              <span className="font-heading text-2xl text-primary-500">토리동화</span>
              <span className="text-xs font-label text-foreground-600 ml-1">AI FAIRY TALE</span>
            </div>
            <p className="text-sm text-foreground-700 leading-relaxed max-w-md">
              상상이 이야기가 되는 곳. 아이의 작은 상상과 소중한 하루를 담아 세상에 하나뿐인 맞춤 동화를 만들어드려요.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button
                type="button"
                aria-label="인스타그램"
                className="w-9 h-9 rounded-full bg-background-50 hover:bg-primary-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-instagram-line text-foreground-900 w-4 h-4 flex items-center justify-center"></i>
              </button>
              <button
                type="button"
                aria-label="유튜브"
                className="w-9 h-9 rounded-full bg-background-50 hover:bg-primary-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-youtube-line text-foreground-900 w-4 h-4 flex items-center justify-center"></i>
              </button>
              <button
                type="button"
                aria-label="카카오"
                className="w-9 h-9 rounded-full bg-background-50 hover:bg-primary-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-kakao-talk-line text-foreground-900 w-4 h-4 flex items-center justify-center"></i>
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-foreground-950 mb-3">
              <a href="#service" className="hover:text-primary-700">서비스</a>
            </h4>
            <ul className="space-y-2 text-sm text-foreground-700">
              <li>
                <Link to="/create/select" className="hover:text-primary-700 cursor-pointer">
                  동화 만들기
                </Link>
              </li>
              <li>
                <Link to="/library" className="hover:text-primary-700 cursor-pointer">
                  내 책장
                </Link>
              </li>
              <li>
                <Link to="/plan" className="hover:text-primary-700 cursor-pointer">
                  구독 플랜
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary-700 cursor-pointer">
                  부모 내 아이 모아보기
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-foreground-950 mb-3">
              <a href="#help" className="hover:text-primary-700">고객지원</a>
            </h4>
            <ul className="space-y-2 text-sm text-foreground-700">
              <li>
                <a href="#faq" className="hover:text-primary-700 cursor-pointer" rel="nofollow">
                  자주 묻는 질문
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary-700 cursor-pointer" rel="nofollow">
                  문의하기
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-primary-700 cursor-pointer" rel="nofollow">
                  이용약관
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-primary-700 cursor-pointer" rel="nofollow">
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-secondary-300/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-foreground-600">© 2026 토리동화. 모든 이야기는 우리 아이를 위해.</p>
          <p className="text-xs text-foreground-600 whitespace-nowrap">made with ♥ for little dreamers</p>
        </div>
      </div>
    </footer>
  );
}
