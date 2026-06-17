const features = [
  {
    icon: "ri-magic-line",
    title: "맞춤형 AI 동화",
    desc: "아이의 이름, 나이, 좋아하는 것을 반영한 단 하나의 동화를 만들어요",
    bg: "bg-primary-100",
    iconColor: "text-primary-800",
  },
  {
    icon: "ri-palette-line",
    title: "DALL·E 삽화",
    desc: "장면마다 따뜻하고 아름다운 그림책 같은 일러스트를 그려드려요",
    bg: "bg-accent-100",
    iconColor: "text-accent-800",
  },
  {
    icon: "ri-mic-2-line",
    title: "원어민 TTS",
    desc: "한국어부터 영어, 일본어, 중국어, 스페인어까지 자연스러운 음성으로",
    bg: "bg-secondary-200",
    iconColor: "text-secondary-900",
  },
  {
    icon: "ri-line-chart-line",
    title: "부모 인사이트",
    desc: "독서량, 어휘 성장, 감정 패턴까지 한눈에 보여드려요",
    bg: "bg-primary-100",
    iconColor: "text-primary-800",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs md:text-sm font-label">
            왜 호롱빛 궁궐일까요?
          </span>
          <h2 className="mt-4 font-heading text-2xl md:text-3xl text-foreground-950">
            매일 밤, 새로운 이야기가 우리 아이를 기다려요
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
