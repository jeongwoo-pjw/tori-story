import { useState } from "react";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";

export default function SettingsPage() {
  const [filterEnabled, setFilterEnabled] = useState(true);
  const [filterLevel, setFilterLevel] = useState("low");
  const [minAge, setMinAge] = useState("3");
  const [maxAge, setMaxAge] = useState("5");
  const [storyApproval, setStoryApproval] = useState(true);
  const [contentApproval, setContentApproval] = useState(false);
  const [approvalMethod, setApprovalMethod] = useState("in-app");
  const [timeLimit, setTimeLimit] = useState(true);
  const [dailyTime, setDailyTime] = useState(60);

  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12">
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-heading text-2xl md:text-3xl text-foreground-950 mb-6">
              안전 관리 설정
            </h1>

            {/* 한국 콘텐츠 협회 인증 배지 */}
            <div className="rounded-2xl border border-primary-200 bg-primary-50/40 p-4 md:p-5 mb-8 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <i className="ri-shield-check-fill text-primary-500 text-xl"></i>
              </div>
              <div>
                <p className="text-sm font-label text-foreground-950 mb-1">
                  한국 콘텐츠 협회 연령별 콘텐츠 기준 준수
                </p>
                <p className="text-xs text-foreground-500 leading-relaxed">
                  토리동화는 한국 콘텐츠 협회의 연령별 콘텐츠 선별 기준을 준수하여, 각 연령대에 적합한 콘텐츠만을 제공하도록 인증받았습니다.<br />아이의 발달 단계에 맞는 안전한 이야기 환경을 보장합니다.
                </p>
              </div>
            </div>

            {/* 유해 콘텐츠 필터 */}
            <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6 mb-6">
              <h2 className="text-base font-label text-foreground-950 mb-2">
                유해 콘텐츠 필터
              </h2>
              <p className="text-xs text-foreground-500 mb-4">
                부적절한 언어, 폭력적 표현, 선정적 내용을 자동으로 차단합니다.
              </p>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-label text-foreground-700">
                  필터 활성화
                </span>
                <button
                  type="button"
                  onClick={() => setFilterEnabled(!filterEnabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    filterEnabled ? "bg-primary-500" : "bg-secondary-300 dark:bg-background-400"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background-50 dark:bg-background-300 shadow-md transition-transform ${
                      filterEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>

              {filterEnabled && (
                <div>
                  <span className="text-sm font-label text-foreground-700 mb-2 block">
                    필터 강도
                  </span>
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option value="low">낮음 — 기본 필터만 적용</option>
                    <option value="medium">중간 — 일부 민감 주제 제한</option>
                    <option value="high">높음 — 모든 유해 콘텐츠 차단</option>
                  </select>
                </div>
              )}
            </div>

            {/* 연령 기준 설정 */}
            <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6 mb-6">
              <h2 className="text-base font-label text-foreground-950 mb-2">
                연령 기준 설정
              </h2>
              <p className="text-xs text-foreground-500 mb-4">
                자녀의 연령에 맞는 콘텐츠만 표시됩니다. 슬라이더를 조절해 적절한 연령 범위를 지정하세요.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-label text-foreground-700 mb-2 block">
                    최소 연령
                  </span>
                  <select
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option value="3">3세</option>
                    <option value="4">4세</option>
                    <option value="5">5세</option>
                    <option value="6">6세</option>
                  </select>
                </div>
                <div>
                  <span className="text-sm font-label text-foreground-700 mb-2 block">
                    최대 연령
                  </span>
                  <select
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option value="5">5세</option>
                    <option value="6">6세</option>
                    <option value="7">7세</option>
                    <option value="8">8세</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 부모 승인 게이트 */}
            <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6 mb-6">
              <h2 className="text-base font-label text-foreground-950 mb-2">
                부모 승인 게이트
              </h2>
              <p className="text-xs text-foreground-500 mb-4">
                자녀가 새로운 동화를 생성하거나 외부 콘텐츠를 불러올 때 보호자의 승인을 요청합니다.
              </p>

              <div className="space-y-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-label text-foreground-700">
                    동화 생성 시 승인 요청
                  </span>
                  <button
                    type="button"
                    onClick={() => setStoryApproval(!storyApproval)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      storyApproval ? "bg-primary-500" : "bg-secondary-300 dark:bg-background-400"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background-50 dark:bg-background-300 shadow-md transition-transform ${
                        storyApproval ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-label text-foreground-700">
                    외부 콘텐츠 불러오기 시 승인 요청
                  </span>
                  <button
                    type="button"
                    onClick={() => setContentApproval(!contentApproval)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      contentApproval ? "bg-primary-500" : "bg-secondary-300 dark:bg-background-400"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background-50 dark:bg-background-300 shadow-md transition-transform ${
                        contentApproval ? "translate-x-5" : "translate-x-0"
                      }`}
                    ></span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-sm font-label text-foreground-700 mb-2 block">
                  승인 방식
                </span>
                <select
                  value={approvalMethod}
                  onChange={(e) => setApprovalMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="in-app">앱 내 알림</option>
                  <option value="email">이메일</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>

            {/* 이용 시간 제한 */}
            <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
              <h2 className="text-base font-label text-foreground-950 mb-2">
                이용 시간 제한
              </h2>
              <p className="text-xs text-foreground-500 mb-4">
                하루 동화 이용 시간을 제한하여 자녀의 건강한 디지털 습관을 형성하세요.
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-label text-foreground-700">
                  시간 제한 활성화
                </span>
                <button
                  type="button"
                  onClick={() => setTimeLimit(!timeLimit)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                    timeLimit ? "bg-primary-500" : "bg-secondary-300 dark:bg-background-400"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background-50 dark:bg-background-300 shadow-md transition-transform ${
                      timeLimit ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></span>
                </button>
              </div>

              <div className="mb-4">
                <span className="text-sm font-label text-foreground-700 mb-2 block">
                  하루 최대 이용 시간
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDailyTime(Math.max(10, dailyTime - 10))}
                    className="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-background-200 hover:bg-secondary-200 dark:hover:bg-background-300 flex items-center justify-center cursor-pointer"
                  >
                    <i className="ri-subtract-line w-4 h-4 flex items-center justify-center text-foreground-500"></i>
                  </button>
                  <span className="text-2xl font-heading text-foreground-950 w-20 text-center">
                    {dailyTime}분
                  </span>
                  <button
                    type="button"
                    onClick={() => setDailyTime(Math.min(180, dailyTime + 10))}
                    className="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-background-200 hover:bg-secondary-200 dark:hover:bg-background-300 flex items-center justify-center cursor-pointer"
                  >
                    <i className="ri-add-line w-4 h-4 flex items-center justify-center text-foreground-500"></i>
                  </button>
                </div>
              </div>

              {/* Weekly schedule */}
              <div>
                <span className="text-sm font-label text-foreground-700 mb-2 block">
                  요일별 이용 가능 시간
                </span>
                <div className="grid grid-cols-7 gap-2">
                  {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
                    <div
                      key={day}
                      className="rounded-xl bg-background-100 dark:bg-background-200 border border-background-200/70 dark:border-background-300/50 p-3 text-center"
                    >
                      <span className="text-xs font-label text-foreground-700 block mb-1">
                        {day}
                      </span>
                      <span className="text-[10px] text-foreground-500">
                        09:00-21:00
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
