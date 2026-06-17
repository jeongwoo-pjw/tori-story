import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/feature/TopNav";
import FoldSidebar from "@/components/feature/FoldSidebar";

const INTEREST_TAGS = [
  "모험", "우정", "가족", "자연", "동물", "학습", "판타지", "일상"
];

const READING_LENGTH_OPTIONS = [
  "매우 짧음", "짧음", "보통", "김", "매우 김"
];

const READING_SPEED_OPTIONS = [
  "느림", "보통", "빠름"
];

const IMAGE_PREF_OPTIONS = [
  "그림 많음", "보통", "그림 적음"
];

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("한담이");
  const [birthYear, setBirthYear] = useState("2018");
  const [gender, setGender] = useState("남아");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["한복", "바다", "동물"]);
  const [readingLength, setReadingLength] = useState("보통");
  const [readingSpeed, setReadingSpeed] = useState("보통");
  const [imagePref, setImagePref] = useState("보통");

  const toggleInterest = (tag: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= 5) return prev;
      return [...prev, tag];
    });
  };

  return (
    <main className="min-h-screen bg-background-50 text-foreground-950">
      <TopNav isLoggedIn={true} />
      <FoldSidebar />

      <div className="pl-[var(--sidebar-width)] pt-14 md:pt-16 pb-12">
        <div className="px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-heading text-2xl md:text-3xl text-foreground-950 mb-8">
              아이 프로필
            </h1>

            {/* 기본 정보 */}
            <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6 mb-6">
              <h2 className="text-base font-label text-foreground-950 mb-4">
                기본 정보
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-label text-foreground-700 mb-1.5 block">
                    아이 이름
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-label text-foreground-700 mb-1.5 block">
                    생년월일
                  </label>
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    {Array.from({ length: 15 }, (_, i) => 2014 + i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-label text-foreground-700 mb-1.5 block">
                    성별
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option value="남아">남아</option>
                    <option value="여아">여아</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 관심사 */}
            <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6 mb-6">
              <h2 className="text-base font-label text-foreground-950 mb-2">
                관심사
              </h2>
              <p className="text-xs text-foreground-500 mb-4">
                관심 있는 주제를 선택해주세요
              </p>

              <div className="flex flex-wrap gap-2">
                {INTEREST_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-4 py-2 rounded-full text-xs font-label transition-colors cursor-pointer whitespace-nowrap ${
                      selectedInterests.includes(tag)
                        ? "bg-primary-500 text-foreground-950 dark:text-foreground-950"
                        : "bg-secondary-100 text-foreground-700 border border-secondary-200 hover:bg-secondary-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 읽기 성향 */}
            <div className="rounded-2xl bg-background-50 border border-background-200/70 p-5 md:p-6 mb-6">
              <h2 className="text-base font-label text-foreground-950 mb-4">
                읽기 성향
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-label text-foreground-700 mb-1.5 block">
                    선호 도서 길이
                  </label>
                  <select
                    value={readingLength}
                    onChange={(e) => setReadingLength(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    {READING_LENGTH_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-label text-foreground-700 mb-1.5 block">
                    읽기 속도
                  </label>
                  <select
                    value={readingSpeed}
                    onChange={(e) => setReadingSpeed(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    {READING_SPEED_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-label text-foreground-700 mb-1.5 block">
                    그림 선호도
                  </label>
                  <select
                    value={imagePref}
                    onChange={(e) => setImagePref(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-background-200 bg-background-50 text-sm font-label text-foreground-950 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    {IMAGE_PREF_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-5 py-3 rounded-xl bg-secondary-100 hover:bg-secondary-200 text-foreground-700 font-label text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-5 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-foreground-950 dark:text-foreground-950 font-label text-sm transition-colors cursor-pointer whitespace-nowrap"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
