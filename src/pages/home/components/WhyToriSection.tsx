import { Link } from "react-router-dom";

const features = [
  {
    icon: "ri-user-smile-line",
    title: "완전 맞춤 제작",
    desc: "아이 이름과 취향이 담긴 이야기로 몰입감을 높여요",
    bg: "bg-primary-100",
    iconColor: "text-primary-800",
  },
  {
    icon: "ri-shield-check-line",
    title: "안전한 콘텐츠",
    desc: "모든 동화는 연령별 안전 기준을 준수해 제작돼요",
    bg: "bg-secondary-200",
    iconColor: "text-secondary-900",
  },
  {
    icon: "ri-book-2-line",
    title: "내 책장 보관",
    desc: "만든 동화를 저장하고 언제든 다시 읽을 수 있어요",
    bg: "bg-accent-100",
    iconColor: "text-accent-800",
  },
  {
    icon: "ri-line-chart-line",
    title: "독서 습관 관리",
    desc: "아이의 독서 패턴을 분석해 건강한 습관을 만들어요",
    bg: "bg-primary-100",
    iconColor: "text-primary-800",
  },
  {
    icon: "ri-mic-2-line",
    title: "음성 지원",
    desc: "AI 보이스가 동화를 직접 읽어주어 몰입도를 높여요",
    bg: "bg-accent-100",
    iconColor: "text-accent-800",
  },
  {
    icon: "ri-pencil-ruler-line",
    title: "독후 활동 연계",
    desc: "동화를 다 읽은 후 퀴즈와 그림 그리기 등 활동을 제공해요",
    bg: "bg-secondary-200",
    iconColor: "text-secondary-900",
  },
];

export default function WhyToriSection() {
  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-14 md:py-20 bg-background-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-200 text-secondary-900 text-xs md:text-sm font-label">
            왜 토리동화인가요
          </span>
          <h2 className="mt-4 font-heading text-2xl md:text-3xl text-foreground-950">
            토리동화가 특별한 이유
          </h2>
          <p className="mt-3 text-sm md:text-base text-foreground-700">
            아이를 위한 동화, 이제 직접 만들어보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, idx) => (
            <div
              key={f.title}
              className="rounded-2xl bg-background-50 border border-background-200 p-6 hover:border-primary-300 transition-all"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4`}>
                <i className={`${f.icon} ${f.iconColor} text-2xl w-6 h-6 flex items-center justify-center`}></i>
              </div>
              <h3 className="font-heading text-lg text-foreground-950">{f.title}</h3>
              <p className="mt-2 text-sm text-foreground-700 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
