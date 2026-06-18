import { useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";

const TABS = [
  { id: "status", label: "구독 현황" },
  { id: "compare", label: "요금제 비교" },
  { id: "payment", label: "결제 진행" },
  { id: "features", label: "프리미엄 기능" },
  { id: "pod", label: "실물 책 주문" },
];

const PLAN_FEATURES = [
  { feature: "월 동화 생성", free: "3편", premium: "무제한" },
  { feature: "기본 캐릭터", free: "5종", premium: "50종+" },
  { feature: "PDF 다운로드", free: "—", premium: "✓" },
  { feature: "광고 포함", free: "✓", premium: "없음" },
  { feature: "AI 맞춤 스토리 추천", free: "—", premium: "✓" },
  { feature: "우선 고객 지원", free: "—", premium: "✓" },
  { feature: "고화질 일러스트", free: "—", premium: "✓" },
  { feature: "다국어 TTS", free: "—", premium: "✓" },
];

const SUBSCRIPTION_BENEFITS = [
  { title: "무제한 동화 생성", desc: "매월 200개까지 동화를 만들 수 있습니다" },
  { title: "고급 텍스트 음성 변환", desc: "자연스럽고 감정 풍부한 목소리를 선택할 수 있습니다" },
  { title: "고급 일러스트 생성", desc: "더 정교하고 다양한 스타일의 일러스트를 생성합니다" },
  { title: "우선 지원", desc: "고객 지원팀으로부터 우선적으로 도움을 받습니다" },
];

const POD_OPTIONS = {
  stories: ["곰돌이의 모험", "토끼와 달빛 숲", "신데렐라", "잠자는 숲속의 공주"],
  covers: ["무선 제본 (기본)", "무선 제본 (고급)", "하드커버"],
  papers: ["일반 인쇄", "고급 인쇄", "친환경 인쇄"],
};

export default function SubscriptionPage() {
  const [activeTab, setActiveTab] = useState("status");
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [email, setEmail] = useState("");
  const [podStory, setPodStory] = useState("곰돌이의 모험");
  const [podCover, setPodCover] = useState("무선 제본 (기본)");
  const [podPaper, setPodPaper] = useState("일반 인쇄");
  const [podQty, setPodQty] = useState(1);

  const toggleBenefit = (title: string) => {
    setSelectedBenefits((prev) => {
      if (prev.includes(title)) return prev.filter((t) => t !== title);
      return [...prev, title];
    });
  };

  const podPrice = 9900;
  const shipping = 3000;
  const total = podPrice * podQty + shipping;

  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12">
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <h1 className="font-heading text-2xl md:text-3xl text-foreground-950 mb-6">
              구독·결제
            </h1>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-label transition-colors whitespace-nowrap cursor-pointer flex-shrink-0 ${
                    tab.id === activeTab
                      ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                      : "bg-secondary-100 dark:bg-background-200 text-foreground-700 border border-secondary-200 dark:border-background-300 hover:bg-secondary-200 dark:hover:bg-background-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* === 구독 현황 === */}
            {activeTab === "status" && (
              <div className="space-y-6">
                {/* Current plan */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs text-foreground-500 mb-1 block">
                        현재 플랜
                      </span>
                      <h2 className="text-lg font-label text-foreground-950">
                        무료 플랜
                      </h2>
                      <p className="text-xs text-foreground-500 mt-1">
                        월 5편 동화 생성 · 기본 테마
                      </p>
                    </div>
                    <Link
                      to="/subscription"
                      onClick={() => setActiveTab("compare")}
                      className="px-4 py-2 rounded-xl bg-foreground-800 dark:bg-background-300 hover:bg-foreground-900 dark:hover:bg-background-400 text-background-50 dark:text-foreground-950 text-xs font-label transition-colors cursor-pointer whitespace-nowrap"
                    >
                      플랜 변경하기
                    </Link>
                  </div>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5">
                    <p className="text-xs text-foreground-500 mb-2">다음 결제일</p>
                    <p className="text-sm font-label text-foreground-950">—</p>
                    <p className="text-xs text-foreground-500 mt-2">
                      무료 플랜은 자동 결제가 없습니다.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5">
                    <p className="text-xs text-foreground-500 mb-2">정구 예정 금액</p>
                    <p className="text-sm font-label text-foreground-950">—</p>
                    <p className="text-xs text-foreground-500 mt-2">
                      프리미엄으로 업그레이드 시 확인됩니다.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5">
                    <p className="text-xs text-foreground-500 mb-2">결제 수단</p>
                    <p className="text-sm font-label text-foreground-950">
                      등록된 결제 수단 없음
                    </p>
                    <p className="text-xs text-foreground-500 mt-2">
                      업그레이드 시 결제 수단을 추가할 수 있습니다.
                    </p>
                  </div>
                </div>

                {/* Premium benefits */}
                <div>
                  <h2 className="text-sm font-label text-foreground-700 mb-4">
                    프리미엄 혜택
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5">
                      <p className="text-sm font-label text-foreground-950 mb-1">
                        무제한 동화 생성
                      </p>
                      <p className="text-xs text-foreground-500">
                        월수 제한 없이 원하는 만큼 동화를 만들어보세요.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5">
                      <p className="text-sm font-label text-foreground-950 mb-1">
                        전체 테마·캐릭터 이용
                      </p>
                      <p className="text-xs text-foreground-500">
                        다양한 배경과 캐릭터로 특별한 이야기를 완성하세요.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5">
                      <p className="text-sm font-label text-foreground-950 mb-1">
                        고화질 PDF 저장
                      </p>
                      <p className="text-xs text-foreground-500">
                        완성된 동화를 고품질 PDF로 다운로드하고 인쇄하세요.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to="/subscription"
                    onClick={() => setActiveTab("compare")}
                    className="text-sm font-label text-primary-600 hover:text-primary-700 cursor-pointer"
                  >
                    프리미엄 시작하기
                  </Link>
                  <Link
                    to="/subscription"
                    onClick={() => setActiveTab("compare")}
                    className="text-sm font-label text-foreground-500 hover:text-foreground-700 cursor-pointer"
                  >
                    전체 플랜 비교
                  </Link>
                </div>
              </div>
            )}

            {/* === 요금제 비교 === */}
            {activeTab === "compare" && (
              <div className="space-y-6">
                <h2 className="text-sm font-label text-foreground-700">
                  요금제 비교
                </h2>
                <p className="text-xs text-foreground-500">
                  <Link
                    to="/subscription"
                    onClick={() => setActiveTab("status")}
                    className="text-primary-600 hover:text-primary-700 cursor-pointer"
                  >
                    구독·결제로 돌아가기
                  </Link>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Free */}
                  <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-6">
                    <span className="text-xs text-foreground-500 mb-1 block">
                      현재 플랜
                    </span>
                    <h3 className="text-lg font-label text-foreground-950 mb-1">
                      무료
                    </h3>
                    <p className="text-xs text-foreground-500 mb-4">
                      기본 동화 생성 기능을 무료로 이용 중입니다.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="text-xs text-foreground-600">월 3편 동화 생성</li>
                      <li className="text-xs text-foreground-600">기본 캐릭터 5종</li>
                      <li className="text-xs text-foreground-600">PDF 다운로드</li>
                      <li className="text-xs text-foreground-600">광고 포함</li>
                    </ul>
                    <button
                      type="button"
                      className="w-full py-3 rounded-xl bg-secondary-100 text-foreground-700 font-label text-sm cursor-pointer whitespace-nowrap"
                    >
                      현재 이용 중
                    </button>
                  </div>

                  {/* Premium */}
                  <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-6">
                    <span className="text-xs text-primary-600 mb-1 block">
                      추천
                    </span>
                    <h3 className="text-lg font-label text-foreground-950 mb-1">
                      프리미엄
                    </h3>
                    <p className="text-lg font-label text-foreground-950 mb-4">
                      월 9,900원
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="text-xs text-foreground-600">제한 없이 동화를 만들고 더 많은 혜택을 누리세요.</li>
                      <li className="text-xs text-foreground-600">무제한 동화 생성</li>
                      <li className="text-xs text-foreground-600">프리미엄 캐릭터 50종+</li>
                      <li className="text-xs text-foreground-600">PDF 다운로드 + 고화질 인쇄본</li>
                      <li className="text-xs text-foreground-600">광고 없음</li>
                      <li className="text-xs text-foreground-600">AI 맞춤 스토리 추천</li>
                      <li className="text-xs text-foreground-600">우선 고객 지원</li>
                    </ul>
                    <button
                      type="button"
                      onClick={() => setActiveTab("payment")}
                      className="w-full py-3 rounded-xl bg-foreground-800 dark:bg-background-300 hover:bg-foreground-900 dark:hover:bg-background-400 text-background-50 dark:text-foreground-950 font-label text-sm transition-colors cursor-pointer whitespace-nowrap"
                    >
                      프리미엄 시작하기
                    </button>
                  </div>
                </div>

                {/* Feature table */}
                <div>
                  <h2 className="text-sm font-label text-foreground-700 mb-4">
                    플랜별 상세 혜택
                  </h2>
                  <div className="rounded-2xl border border-background-200/70 dark:border-background-300/50 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-background-100 dark:bg-background-200 border-b border-background-200/70 dark:border-background-300/50">
                          <th className="text-left py-3 px-4 text-xs font-label text-foreground-500">
                            기능
                          </th>
                          <th className="text-center py-3 px-4 text-xs font-label text-foreground-500">
                            무료
                          </th>
                          <th className="text-center py-3 px-4 text-xs font-label text-foreground-500">
                            프리미엄
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {PLAN_FEATURES.map((row, idx) => (
                          <tr
                            key={row.feature}
                            className={`border-b border-background-200/70 dark:border-background-300/50 ${
                              idx % 2 === 0 ? "bg-background-50 dark:bg-background-100" : "bg-background-100 dark:bg-background-200"
                            }`}
                          >
                            <td className="py-3 px-4 text-foreground-950 font-label">
                              {row.feature}
                            </td>
                            <td className="py-3 px-4 text-center text-foreground-500">
                              {row.free}
                            </td>
                            <td className="py-3 px-4 text-center text-primary-600 font-label">
                              {row.premium}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* === 결제 진행 === */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <h2 className="text-sm font-label text-foreground-700">
                  결제 진행
                </h2>

                {/* Payment summary */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <h3 className="text-base font-label text-foreground-950 mb-4">
                    결제 요약
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground-500">선택 플랜</span>
                      <span className="text-xs font-label text-foreground-700">
                        프리미엄 월간 구독
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground-500">구독 기간</span>
                      <span className="text-xs font-label text-foreground-700">
                        2025.07.14 ~ 2025.08.13
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground-500">정상가</span>
                      <span className="text-xs font-label text-foreground-700">
                        12,900원
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground-500">할인</span>
                      <span className="text-xs font-label text-foreground-700">
                        0원
                      </span>
                    </div>
                    <div className="border-t border-background-200/70 dark:border-background-300/50 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-label text-foreground-950">
                          최종 결제 금액
                        </span>
                        <span className="text-lg font-label text-foreground-950">
                          12,900원
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card form */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <h3 className="text-base font-label text-foreground-950 mb-4">
                    결제 수단
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-label text-foreground-500 mb-1.5 block">
                        카드 번호
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-label text-foreground-500 mb-1.5 block">
                          유효 기간 (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-label text-foreground-500 mb-1.5 block">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          placeholder="CVC"
                          className="w-full px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-label text-foreground-500 mb-1.5 block">
                        카드 소유자 이름
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-label text-foreground-500 mb-1.5 block">
                        청구자 이메일
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <h3 className="text-base font-label text-foreground-950 mb-3">
                    결제 조건 안내
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-xs text-foreground-500">
                      구독은 매월 자동 갱신되며, 갱신 3일 전 이메일로 안내드립니다.
                    </li>
                    <li className="text-xs text-foreground-500">
                      구독 취소는 이메일이나 {'>'} 구독 관리에서 언제든지 가능합니다.
                    </li>
                    <li className="text-xs text-foreground-500">
                      결제 완료 즉시 프리미엄 기능이 활성화됩니다.
                    </li>
                  </ul>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("compare")}
                    className="px-5 py-3 rounded-xl bg-secondary-100 dark:bg-background-200 hover:bg-secondary-200 dark:hover:bg-background-300 text-foreground-700 font-label text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    이전
                  </button>
                  <button
                    type="button"
                    className="px-5 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    결제하기
                  </button>
                </div>
              </div>
            )}

            {/* === 프리미엄 기능 === */}
            {activeTab === "features" && (
              <div className="space-y-6">
                <h2 className="text-sm font-label text-foreground-700">
                  프리미엄 기능 사용
                </h2>

                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <p className="text-sm font-label text-foreground-950 mb-1">
                    현재 무료 플랜을 사용 중입니다
                  </p>
                  <p className="text-xs text-foreground-500 mb-4">
                    무제한 동화 생성, 고급 텍스트 음성 변환, 고급 일러스트 생성 등 프리미엄 기능을 이용하려면 구독이 필요합니다.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("compare")}
                      className="px-4 py-2.5 rounded-xl bg-secondary-100 dark:bg-background-200 hover:bg-secondary-200 dark:hover:bg-background-300 text-foreground-700 font-label text-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      구독 혜택 보기
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("payment")}
                      className="px-4 py-2.5 rounded-xl bg-foreground-800 dark:bg-background-300 hover:bg-foreground-900 dark:hover:bg-background-400 text-background-50 dark:text-foreground-950 font-label text-xs transition-colors cursor-pointer whitespace-nowrap"
                    >
                      지금 구독하기
                    </button>
                  </div>
                </div>

                {/* Subscription selection */}
                <div>
                  <h2 className="text-sm font-label text-foreground-700 mb-4">
                    구독 혜택
                  </h2>
                  <div className="space-y-3">
                    {SUBSCRIPTION_BENEFITS.map((b) => {
                      const isSelected = selectedBenefits.includes(b.title);
                      return (
                        <button
                          key={b.title}
                          type="button"
                          onClick={() => toggleBenefit(b.title)}
                          className={`w-full text-left rounded-2xl border p-5 transition-colors cursor-pointer ${
                            isSelected
                              ? "border-primary-400 bg-primary-50/30"
                              : "border-background-200/70 dark:border-background-300/50 bg-background-50 dark:bg-background-100 hover:bg-background-100 dark:hover:bg-background-200"
                          }`}
                        >
                          <p className="text-sm font-label text-foreground-950 mb-1">
                            {b.title}
                          </p>
                          <p className="text-xs text-foreground-500">
                            {b.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("compare")}
                    className="px-5 py-3 rounded-xl bg-secondary-100 dark:bg-background-200 hover:bg-secondary-200 dark:hover:bg-background-300 text-foreground-700 font-label text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("payment")}
                    className="px-5 py-3 rounded-xl bg-foreground-800 dark:bg-background-300 hover:bg-foreground-900 dark:hover:bg-background-400 text-background-50 dark:text-foreground-950 font-label text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    구독하기
                  </button>
                </div>
              </div>
            )}

            {/* === 실물 책 주문 === */}
            {activeTab === "pod" && (
              <div className="space-y-6">
                <h2 className="text-sm font-label text-foreground-700">
                  실물 책 주문 (POD)
                </h2>

                {/* Info card */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-base font-label text-foreground-950 mb-2">
                        내 동화를 소장용 책으로 만들어보세요
                      </h3>
                      <p className="text-xs text-foreground-500 mb-3">
                        AI가 만든 우리 아이 맞춤 동화를 실제 종이책으로 제작해 집으로 배송해 드립니다.
                      </p>
                      <ul className="space-y-1">
                        <li className="text-xs text-foreground-500">
                          · A5 무선 제본 / 풀리 인쇄 / 표지 코팅 포함
                        </li>
                        <li className="text-xs text-foreground-500">
                          · 주문 후 약 7~10 영업일 내 배송
                        </li>
                      </ul>
                    </div>
                    <div className="rounded-xl bg-secondary-100 flex items-center justify-center h-40 md:h-auto">
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src="https://readdy.ai/api/search-image?query=Cute%20children%20storybook%20printed%20book%20mockup%20on%20wooden%20table%20soft%20natural%20light%20pastel%20colors%20warm%20cozy%20atmosphere%20editorial%20product%20photography&width=400&height=280&seq=pod-book-preview-01&orientation=landscape"
                          alt="실물 책 미리보기"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order options */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <h3 className="text-base font-label text-foreground-950 mb-4">
                    주문 옵션 선택
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-label text-foreground-500 mb-1.5 block">
                        동화 선택
                      </label>
                      <select
                        value={podStory}
                        onChange={(e) => setPodStory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      >
                        {POD_OPTIONS.stories.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-label text-foreground-500 mb-1.5 block">
                        제본 유형
                      </label>
                      <select
                        value={podCover}
                        onChange={(e) => setPodCover(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      >
                        {POD_OPTIONS.covers.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-label text-foreground-500 mb-1.5 block">
                        인쇄 품질
                      </label>
                      <select
                        value={podPaper}
                        onChange={(e) => setPodPaper(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                      >
                        {POD_OPTIONS.papers.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-label text-foreground-500 mb-1.5 block">
                        수량
                      </label>
                      <div className="flex items-center gap-3">
                        <select
                          value={podQty}
                          onChange={(e) => setPodQty(Number(e.target.value))}
                          className="px-4 py-3 rounded-xl border border-background-200 dark:border-background-300 bg-background-50 dark:bg-background-200 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400 w-20"
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n}권
                            </option>
                          ))}
                        </select>
                        <span className="text-xs text-foreground-500">
                          권당 기본 제작비 9,900원 (배송비 별도)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order summary */}
                <div className="rounded-2xl bg-background-50 dark:bg-background-100 border border-background-200/70 dark:border-background-300/50 p-5 md:p-6">
                  <h3 className="text-base font-label text-foreground-950 mb-4">
                    주문 요금 요약
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground-500">
                        제작비 ({podQty}권 × 1)
                      </span>
                      <span className="text-xs font-label text-foreground-700">
                        {podPrice.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground-500">
                        표지 코팅 옵션
                      </span>
                      <span className="text-xs font-label text-foreground-700">
                        포함
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-foreground-500">배송비</span>
                      <span className="text-xs font-label text-foreground-700">
                        {shipping.toLocaleString()}원
                      </span>
                    </div>
                    <div className="border-t border-background-200/70 dark:border-background-300/50 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-label text-foreground-950">
                          합계
                        </span>
                        <span className="text-lg font-label text-foreground-950">
                          {total.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="px-5 py-3 rounded-xl bg-secondary-100 dark:bg-background-200 hover:bg-secondary-200 dark:hover:bg-background-300 text-foreground-700 font-label text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className="px-5 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    주문하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
