import { Link } from "react-router-dom";

const planFeatures = [
  { label: "무제한 동화 생성",    bg: "bg-primary-200 dark:bg-primary-900/30",   text: "text-primary-900 dark:text-primary-300",   border: "border-primary-300 dark:border-primary-800/40" },
  { label: "고화질 저장 · PDF 출력", bg: "bg-accent-200 dark:bg-accent-900/30",  text: "text-accent-900 dark:text-accent-300",     border: "border-accent-300 dark:border-accent-800/40" },
  { label: "AI 음성 나레이션",    bg: "bg-secondary-200 dark:bg-secondary-900/30", text: "text-secondary-900 dark:text-secondary-300", border: "border-secondary-300 dark:border-secondary-800/40" },
  { label: "독후 활동 연계",      bg: "bg-primary-300/60 dark:bg-primary-900/30", text: "text-primary-950 dark:text-primary-300",   border: "border-primary-400/60 dark:border-primary-800/40" },
  { label: "독서 습관 리포트",    bg: "bg-accent-300/60 dark:bg-accent-900/30",  text: "text-accent-950 dark:text-accent-300",     border: "border-accent-400/60 dark:border-accent-800/40" },
];

export default function FreeTrialSection() {
  return (
    <>
      {/* Section 1: Free Trial CTA — wide background with image */}
      <section className="relative w-full py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://readdy.ai/api/search-image?query=Soft%20dreamy%20fairytale%20landscape%20background%2C%20gentle%20rolling%20hills%20in%20warm%20pastel%20pink%20and%20cream%20tones%2C%20floating%20glowing%20lanterns%20casting%20warm%20golden%20light%2C%20magical%20sparkles%20and%20stars%20scattered%20in%20the%20air%2C%20a%20serene%20twilight%20sky%20with%20hints%20of%20lavender%20and%20soft%20peach%2C%20storybook%20gouache%20illustration%20style%2C%20bokeh%20effect%2C%20peaceful%20and%20inviting%20atmosphere%2C%20no%20text%2C%20no%20characters%2C%20abstract%20and%20painterly%20with%20soft%20focus&width=1920&height=900&seq=freetrial-bg-storybook&orientation=landscape"
            alt=""
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-primary-100/75 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-foreground-950">
            지금 바로 첫 동화를 무료로 만들어보세요
          </h2>
          <p className="mt-3 text-sm md:text-base text-foreground-700">
            가입 없이도 체험 가능하며, 저장은 로그인 후 이용할 수 있습니다
          </p>
          <div className="mt-6">
            <Link
              to="/create"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 font-label text-base transition-colors whitespace-nowrap cursor-pointer"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Subscription Plan — boxed card with Hero CTA style */}
      <section className="w-full px-4 md:px-8 lg:px-12 py-20 md:py-28 bg-secondary-100/70">
        <div className="max-w-7xl mx-auto">
          {/* Boxed card */}
          <div className="rounded-3xl bg-background-50 border border-background-200 p-6 md:p-10">
            {/* Title row: title+desc on left, CTA on right */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h3 className="font-heading text-xl md:text-2xl text-foreground-950">
                  토리동화 구독플랜
                </h3>
                <p className="mt-1 text-sm text-foreground-700">
                  무제한 동화 생성, 고화질 저장, 오디오 나레이션을 이용할 수 있습니다.
                </p>
              </div>
              <Link
                to="/subscription"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-foreground-900 hover:bg-foreground-800 text-background-50 font-label text-sm transition-colors whitespace-nowrap cursor-pointer flex-shrink-0"
              >
                구독혜택보기
                <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
              </Link>
            </div>

            {/* Colorful chips */}
            <div className="flex flex-wrap items-center gap-2">
              {planFeatures.map((feature) => (
                <div
                  key={feature.label}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${feature.bg} ${feature.text} border ${feature.border}`}
                >
                  <i className="ri-check-line w-4 h-4 flex items-center justify-center text-sm"></i>
                  <span className="text-xs font-label whitespace-nowrap">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
