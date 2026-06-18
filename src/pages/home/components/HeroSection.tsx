import { Link } from "react-router-dom";

interface HeroSectionProps {
  isLoggedIn?: boolean;
}

export default function HeroSection({ isLoggedIn = false }: HeroSectionProps) {
  return (
    <section
      className={`relative w-full flex flex-col items-center justify-center overflow-hidden ${
        isLoggedIn
          ? "h-[83.3vh] min-h-[500px]"
          : "min-h-screen"
      }`}
    >
      {/* Fullscreen background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={`${__BASE_PATH__}hero-bg.png`}
          alt="토리동화 히어로 배경"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
      </div>

      {/* Hero content - centered */}
      <div className="relative z-10 w-full px-4 md:px-8 text-center pt-16 md:pt-20">
        <p className="text-[10px] md:text-xs mb-3 flex justify-center flex-wrap">
          {"상상이 이야기가 되는 곳".split("").map((char, i) => (
            <span
              key={i}
              className="inline-block text-accent-400"
              style={{
                animation: "bounce-letter 2s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
                letterSpacing: "0.12em",
              }}
            >
              {char === " " ? " " : char}
            </span>
          ))}
        </p>

        <h2
          className="font-heading text-xl md:text-3xl lg:text-4xl text-white leading-tight max-w-3xl mx-auto animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          옛이야기처럼 오래 남을, 우리 아이만의 이야기
        </h2>

        <p
          className="mt-4 md:mt-5 text-xs md:text-sm text-white/80 leading-relaxed max-w-xl mx-auto animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          아이의 작은 상상과 소중한 하루를 담아
          <br className="hidden md:block" />
          하나뿐인 동화를 만드세요
        </p>

        {/* Floating stars */}
        <span className="absolute top-20 left-10 md:left-20 text-white/60 animate-twinkle">
          <i className="ri-star-fill text-xl w-6 h-6 flex items-center justify-center"></i>
        </span>
        <span className="absolute top-28 right-12 md:right-28 text-white/40 animate-twinkle" style={{ animationDelay: "0.7s" }}>
          <i className="ri-star-fill text-lg w-5 h-5 flex items-center justify-center"></i>
        </span>
        <span className="absolute top-16 right-1/4 text-white/50 animate-twinkle" style={{ animationDelay: "1.4s" }}>
          <i className="ri-star-fill text-base w-4 h-4 flex items-center justify-center"></i>
        </span>
      </div>

      {/* CTA Cards - bottom of hero */}
      <div className="relative z-10 w-full mt-8 md:mt-10 pb-10 md:pb-12">
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Card 1: 선택형 */}
          <div className="relative rounded-3xl bg-background-50/60 backdrop-blur-sm border border-background-200/60 overflow-hidden py-4 md:py-5 px-0 flex flex-col items-center text-center gap-3 hover:border-primary-300 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center relative overflow-hidden">
              <span className="absolute top-1.5 left-2 w-2 h-2 rounded-full bg-accent-400"></span>
              <span className="absolute top-3 right-2.5 w-1.5 h-1.5 rounded-full bg-secondary-500"></span>
              <span className="absolute bottom-2 left-3 w-2.5 h-2.5 rounded-full bg-primary-500"></span>
              <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-600"></span>
              <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-foreground-400"></span>
            </div>
            <div>
              <h3 className="font-heading text-base md:text-lg text-foreground-950">선택형 동화 만들기</h3>
              <p className="mt-1.5 text-[11px] md:text-xs text-foreground-700 leading-relaxed">
                주제, 주인공, 배경을 직접 골라
                <br />
                토리가 이야기를 완성해요.
              </p>
            </div>
            <Link
              to="/create/select"
              className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors whitespace-nowrap"
            >
              체험해보기
            </Link>
          </div>

          {/* Card 2: 대화형 */}
          <div className="relative rounded-3xl bg-background-50/60 backdrop-blur-sm border border-background-200/60 overflow-hidden py-4 md:py-5 px-0 flex flex-col items-center text-center gap-3 hover:border-accent-400 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-accent-100 flex items-center justify-center relative">
              <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded-md rounded-bl-sm bg-background-50 border border-accent-200">
                <span className="block w-5 h-0.5 rounded-full bg-accent-300 mb-0.5"></span>
                <span className="block w-3 h-0.5 rounded-full bg-accent-300"></span>
              </span>
              <span className="absolute top-1 right-1.5 px-1.5 py-0.5 rounded-md rounded-br-sm bg-accent-500 border border-accent-400">
                <span className="block w-4 h-0.5 rounded-full bg-background-50/80 mb-0.5"></span>
                <span className="block w-2.5 h-0.5 rounded-full bg-background-50/80"></span>
              </span>
            </div>
            <div>
              <h3 className="font-heading text-base md:text-lg text-foreground-950">대화형 동화 만들기</h3>
              <p className="mt-1.5 text-[11px] md:text-xs text-foreground-700 leading-relaxed">
                아이와의 대화 속에서
                <br />
                나만의 동화가 탄생해요.
              </p>
            </div>
            <Link
              to="/create/chat"
              className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-accent-500 hover:bg-accent-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors whitespace-nowrap"
            >
              체험해보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
