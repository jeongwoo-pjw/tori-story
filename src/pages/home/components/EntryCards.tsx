import { Link } from "react-router-dom";

const selectChips = ["우정", "용기", "자연", "정직", "가족", "지혜"];
const koreanChips = ["탈춤", "한복", "설날", "한옥", "도깨비", "호랑이", "제주"];

export default function EntryCards() {
  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-10 md:py-14">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl text-foreground-950">
            어떤 방식으로 동화를 만들까요?
          </h2>
          <p className="mt-2 text-sm md:text-base text-foreground-700">
            처음 오셨다면 간편한 선택형을, 더 특별한 이야기를 원하신다면 대화형을 선택해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: 선택형 */}
          <div className="relative rounded-3xl bg-background-50 border border-background-200 overflow-hidden group hover:border-primary-300 transition-all cursor-pointer p-7 flex flex-col gap-6">
            {/* Accent bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-3xl bg-primary-400"></div>

            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 mb-3">
                  <i className="ri-checkbox-circle-line text-primary-700 text-sm w-4 h-4 flex items-center justify-center"></i>
                  <span className="text-xs font-label text-primary-800 whitespace-nowrap">빠른 선택형</span>
                </div>
                <h3 className="font-heading text-xl md:text-2xl text-foreground-950">
                  ✨ 간편하게 만들기
                </h3>
                <p className="mt-2 text-sm text-foreground-700 leading-relaxed">
                  칩 선택 몇 번으로 AI가 알아서 동화를 만들어 드려요. 처음 오신 분께 딱 맞아요!
                </p>
              </div>

              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden flex-shrink-0 ml-3">
                <img
                  src="https://readdy.ai/api/search-image?query=Cute%20small%20cartoon%20Korean%20child%20tapping%20colorful%20round%20chips%20buttons%20on%20a%20magical%20floating%20screen%2C%20pastel%20pink%20background%2C%20rounded%20shapes%2C%20warm%20storybook%20gouache%20illustration%2C%20friendly%20and%20cheerful%2C%20no%20text&width=280&height=280&seq=entry-card-select-v3&orientation=squarish"
                  alt="선택형 동화 생성 일러스트"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Sample chips */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-foreground-600 mb-2 font-label">이야기 주제</p>
                <div className="flex flex-wrap gap-2">
                  {selectChips.map((chip) => (
                    <span
                      key={chip}
                      className="px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-label whitespace-nowrap"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-foreground-600 mb-2 font-label">한국 소재</p>
                <div className="flex flex-wrap gap-2">
                  {koreanChips.map((chip) => (
                    <span
                      key={chip}
                      className="px-3 py-1 rounded-full bg-accent-100 text-accent-800 text-xs font-label whitespace-nowrap"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/create/select"
              className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors whitespace-nowrap"
            >
              <i className="ri-magic-line w-4 h-4 flex items-center justify-center"></i>
              선택형으로 동화 만들기
            </Link>
          </div>

          {/* Card 2: 대화형 */}
          <div className="relative rounded-3xl bg-background-50 border border-background-200 overflow-hidden group hover:border-accent-400 transition-all cursor-pointer p-7 flex flex-col gap-6">
            {/* Accent bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-3xl bg-accent-500"></div>

            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 mb-3">
                  <i className="ri-chat-smile-3-line text-accent-700 text-sm w-4 h-4 flex items-center justify-center"></i>
                  <span className="text-xs font-label text-accent-800 whitespace-nowrap">대화형 위저드</span>
                </div>
                <h3 className="font-heading text-xl md:text-2xl text-foreground-950">
                  💬 세심하게 만들기
                </h3>
                <p className="mt-2 text-sm text-foreground-700 leading-relaxed">
                  AI와 단계별 대화를 통해 우리 아이만의 더 특별한 이야기를 만들어보세요.
                </p>
              </div>

              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden flex-shrink-0 ml-3">
                <img
                  src="https://readdy.ai/api/search-image?query=Cute%20small%20cartoon%20Korean%20child%20chatting%20with%20a%20friendly%20round%20AI%20robot%20companion%2C%20speech%20bubbles%20with%20small%20stars%2C%20pastel%20yellow%20cream%20background%2C%20rounded%20shapes%2C%20warm%20storybook%20gouache%20illustration%2C%20friendly%20and%20interactive%2C%20no%20text&width=280&height=280&seq=entry-card-chat-v3&orientation=squarish"
                  alt="대화형 동화 생성 일러스트"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Wizard steps */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "ri-user-smile-line", label: "1단계", sub: "주인공 설정" },
                { icon: "ri-hearts-line", label: "2단계", sub: "주제 선택" },
                { icon: "ri-palette-line", label: "3단계", sub: "그림체 선택" },
                { icon: "ri-book-3-line", label: "4단계", sub: "동화 완성" },
              ].map((step) => (
                <div
                  key={step.label}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-secondary-100 border border-secondary-200"
                >
                  <span className="w-7 h-7 rounded-full bg-background-50 flex items-center justify-center flex-shrink-0">
                    <i className={`${step.icon} text-foreground-900 text-sm w-4 h-4 flex items-center justify-center`}></i>
                  </span>
                  <div>
                    <p className="text-xs text-foreground-600 font-label leading-none">{step.label}</p>
                    <p className="text-xs md:text-sm font-label text-foreground-900 whitespace-nowrap">
                      {step.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/create/chat"
              className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-accent-500 hover:bg-accent-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors whitespace-nowrap"
            >
              <i className="ri-chat-smile-3-line w-4 h-4 flex items-center justify-center"></i>
              대화형으로 동화 만들기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
