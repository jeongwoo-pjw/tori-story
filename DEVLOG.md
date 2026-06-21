# 토리동화 개발일지

---

## 2026-06-22 — v0.6.0 연령별 놀이마당 활동 완성 (민준이 · 미희)

### 작업 내용

#### 1. 민준이 놀이마당 (`MijunActivities.tsx` 신규 생성)

**이해력** — 9조각(3×3) 드래그 스왑 퍼즐  
- `background-size: 300% 300%`, `background-position: ${col*50}% ${row*50}%` 공식으로 조각 위치 계산
- HTML5 drag-and-drop + 터치 드래그 지원 (touchAction: none)

**감정탐색** — SuinEmotionActivity 재활용 (이모지 2열 그리드)

**창의력** — `MijunCreativeCard` + textarea + 모범답안 토글  
- 썸네일 + 제목(`text-base`) + 줄거리/결말(`text-sm`) 카드
- 텍스트 입력 시작 시 "모범답안 확인하기" 링크 노출

**어휘** — 6낱말 드로잉 캔버스 캐러셀 (`MijunVocabActivity`)  
- 낱말: 용기 / 한복 / 징검다리 / 자신감 / 축제 / 응원
- 마지막 카드 도달 시 "활동 완료" 버튼 활성화

---

#### 2. 미희 놀이마당 (`MiheeActivities.tsx` 신규 생성)

**이해력** — 2-박스 레이아웃
- **박스 1**: 6장 카드 순서 맞추기 드래그 리오더
  - 잘못된 위치 카드: `border #fca5a5` + `background #fef2f2` 강조
  - 이동 발생 시 "순서를 다시 기억해봐요 🔄" 힌트 텍스트 표시
  - 정답 시 초록 완료 배지
- **박스 2**: 이해력 질문 + textarea + 모범답안 토글

**감정탐색** — SuinEmotionActivity 재활용

**창의력** — `MiheeCreativeCard` + textarea + 모범답안 토글

**어휘** — 낱말 카드 그리드 → 퀴즈 2단계 플로우
- 낱말 6개: 탈춤 / 탈 / 축제 / 우정 / 나눔 / 공연
- 1단계: 2×3 카드 그리드 (word + meaning + example) → "낱말 카드를 모두 확인했어요" 버튼
- 2단계: 뜻 제시 → 낱말 입력 퀴즈 (`MiheeVocabQuiz`)
- 퀴즈 상단에 "모범답안 확인하기" 토글 (낱말 카드 그리드 재표시)
- 6개 모두 입력 완료 시 "활동 완료" 버튼 활성화

---

#### 3. AI 에러 처리 개선

Solar API 키 미설정 시 3개 데모 동화 모두 AI 호출 없이 하드코딩 활동으로 fallback:

```ts
// enterActivity()
if (title === "수인이..." || title === "민준이..." || title === "미희...") {
  setActivityData(null);
  return; // AI 호출 생략
}
```

---

### 커밋 이력

| 커밋 | 내용 |
|------|------|
| `53a8a6e` | feat: 수인이 동화 연령별 놀이마당 활동 추가 |
| `a25b09a` | feat: 연령별 데모 놀이마당 활동 커스텀 콘텐츠 추가 (민준이·미희) |

---

## 2026-06-22 — v0.5.0 미니게임 확장 · 대시보드 UX 개선 · 더미 동화 연동

### 작업 내용

#### 1. 미니게임 3종 체제 전환

기존 단독 브레이크아웃 게임에서 3종 선택 방식으로 전환했습니다.

**추가된 게임**

| 게임 | 파일 | 주요 사양 |
|------|------|----------|
| 카드 뒤집기 | `MemoryMatchGame.tsx` | 3단계 난이도(4×3/4×4/5×4), 최고기록 localStorage 저장 |
| 테트리스 | `TetrisGame.tsx` | 방향키 조작, 스페이스 하드드롭, 레벨별 속도 증가 |

**게임 전환 UX**

- 활동 완료 후 "게임 선택" 화면 → 3종 카드 그리드
- 인게임 상단 탭(`GameShell` 컴포넌트)으로 게임 간 즉시 전환 가능
- 딥네이비 배경 + 민트/바이올렛 액센트 탭 스타일

#### 2. 더미 동화 라이브러리 연동

`dummyBooks.json` 3편을 `useLibrary` 훅을 통해 책장·놀이마당·홈에 자동 반영:

```ts
// library.ts — 더미 데이터 자동 삽입
if (library.length === 0) injectDummyBooks();
```

- 책장 그리드에 더미 동화 썸네일 표시
- 홈 "최근 읽은 동화" 섹션 실시간 연동
- 놀이마당 동화 선택 목록에 더미 동화 포함

#### 3. 대시보드 감정 태그 아이콘 교체

최근 좋아한 감정 태그의 Font Awesome 이모티콘 적용 및 라이트 모드 텍스트 컬러 수정.

**readingInsight 개선** — Solar API 미설정 시 폴백 텍스트 표시:

```tsx
{analysis?.readingInsight || "독서 기록이 쌓이면 AI가 코멘트를 남겨드려요."}
```

---

### 커밋 이력

| 커밋 | 내용 |
|------|------|
| `f026265` | feat: 더미 동화 라이브러리 연동 및 책장/놀이마당/홈 실시간 반영 |
| `85fbf8f` | feat: Tetris·MemoryMatch 게임 추가, 게임 선택 화면 |
| `1bf3d09` | feat: 대시보드 감정 이모지, 책장 링크, 게임 카드 UI |
| `2255682` | fix: readingInsight 라이트모드 텍스트, 감정 RI 아이콘 |
| `59e45df` | fix: readingInsight box 항상 표시 (폴백 텍스트) |

---

## 2026-06-21 — v0.4.0 Solar 대시보드 분석 · CTA 라우팅 수정 · UI 개선

### 작업 내용

#### 1. 대시보드 Solar API 데이터 분석 연동

아이 성장 분석 페이지(`/dashboard`)의 세 섹션에 실제 Solar AI 분석 결과를 연결했습니다.

**`src/services/solar.ts` — `analyzeChildData` 함수 추가**

아이의 독서 기록(태그 목록, 동화 제목, 감정 반응, 누적 어휘 수)을 Solar `solar-pro` 모델에 전송하고 구조화된 JSON 분석 결과를 받아옵니다.

```ts
export interface DashboardAnalysis {
  mainInterest: string;      // 주요 관심사
  mainEmotion: string;       // 주로 느끼는 감정
  personalityInsight: string; // 아이 성향 분석 문장
  repeatThemes: Array<{ icon: string; title: string }>; // 반복 테마 3개
  readingInsight: string;    // 독서 패턴 한 줄 코멘트
}
```

**`src/services/library.ts` — 통계 헬퍼 함수 추가**

| 함수 | 반환값 | 설명 |
|------|--------|------|
| `computeWeeklyStats()` | `{ weeklyCompleted, weeklyVocab }` | 최근 7일 완독 수·어휘 수 |
| `computeMonthlyStats()` | `{ monthlyCompleted }` | 이번달 완독 수 |
| `computeReadingStreak()` | `number` | 현재 연속 독서일 수 |
| `getCachedDashboardAnalysis(libraryLength)` | `DashboardAnalysis \| null` | 1시간 TTL + 도서관 길이 검사 |
| `setCachedDashboardAnalysis(data, libraryLength)` | `void` | localStorage 캐시 저장 |

**`src/pages/dashboard/page.tsx` — 세 섹션 연동**

- **자녀별 요약**: 이번주 완독·어휘는 `computeWeeklyStats()`, 주요 관심사·교감 감정·성향 분석은 Solar AI 결과 표시, 연속 독서는 `computeReadingStreak()` 실값
- **반복 요청 테마**: `RECOMMENDATIONS` mock 제거 → `analysis.repeatThemes` 배열로 교체. 데이터 없으면 "동화를 읽으면 테마가 분석돼요" 안내 표시
- **독서 리포트 이번달 독서량**: `computeMonthlyStats()` 실데이터, 목표 10편 기준
- **독서 리포트 AI 코멘트**: `analysis.readingInsight` 파란 박스로 표시
- 분석 중 로딩 스피너(`ri-loader-4-line animate-spin`) 표시

**캐시 전략**: 동일 도서관 길이 + 1시간 미경과 시 Solar API 호출 없이 localStorage 캐시를 사용합니다.

---

#### 2. CTA 버튼 라우팅 수정

홈 화면의 "선택형 만들기" · "대화형 만들기" CTA 버튼이 구 개별 페이지(`/create/select`, `/create/chat`)로 연결되던 문제를 수정했습니다.

| 수정 전 | 수정 후 |
|---------|---------|
| `/create/select` | `/create` (선택형 탭 기본값) |
| `/create/chat` | `/create?tab=chat` |

- `HeroSection.tsx`, `EntryCards.tsx`, `FreeTrialSection.tsx` 링크 일괄 수정
- `create/page.tsx`에 `useSearchParams` 추가 → `?tab=chat` 파라미터로 대화형 탭 자동 선택

---

#### 3. UI 통일성 · 가독성 개선

**WhyToriSection 아이콘 박스 통일**

"왜 토리동화일까요" 섹션의 6개 카드 아이콘 박스를 모두 동일한 스타일로 통일했습니다.

- 변경 전: 카드마다 다른 `bg`, `iconColor` (bg-primary-100 ~ bg-accent-50)
- 변경 후: 전체 `bg-primary-100 / text-primary-700` 통일

**구독플랜 칩 컬러 개선**

라이트모드 가독성 저하 문제 해결을 위해 배경 채도를 높이고 텍스트를 진하게 조정했습니다.

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 배경 | `-100 / -50` | `-200 / -300/60` |
| 텍스트 | `-700 ~ -800` | `-900 ~ -950` |
| 테두리 | `-200` | `-300 / -400/60` |
| 다크모드 | 미지원 | `dark:bg-*-900/30 dark:text-*-300 dark:border-*-800/40` |

---

### 커밋 이력 (2026-06-21)

| 커밋 해시 | 내용 |
|-----------|------|
| `e31855b` | feat: Solar 대시보드 분석, CTA 라우팅 수정, UI 통일성 개선 |

---

### 알려진 이슈 / 다음 스텝

- [ ] 로그인 후 자녀 프로필을 DB에서 불러오기 (현재 mock 데이터)
- [ ] 보호된 라우트 — 미로그인 시 홈으로 리다이렉트
- [ ] Solar API 키 미설정 시 대시보드 폴백 UI 고도화
- [ ] 결제 시스템 연동 (구독 플랜)

---

## 2026-06-20 — v0.3.0 Supabase 인증 연동 (이메일 · 카카오 로그인)

### 작업 내용

#### 1. Supabase 클라이언트 설정

`src/lib/supabase.ts`를 신규 생성하여 Supabase JS 클라이언트를 초기화합니다.  
환경 변수(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)를 Vite의 `import.meta.env`로 주입하여 키가 소스코드에 노출되지 않도록 분리했습니다.

#### 2. AuthContext — 전역 인증 상태 관리

`src/contexts/AuthContext.tsx`에 React Context 기반 인증 레이어를 구현했습니다.

| 항목 | 내용 |
|------|------|
| 제공 값 | `user`, `session`, `isLoggedIn`, `loading` |
| 이메일 로그인 | `signInWithPassword` |
| 이메일 회원가입 | `signUp` + `emailRedirectTo`로 현재 앱 URL 명시 |
| 카카오 로그인 | `signInWithOAuth({ provider: 'kakao' })` + OIDC 스코프 지정 |
| 로그아웃 | `signOut` + 사이드바 너비 초기화 |

`onAuthStateChange` 리스너로 토큰 갱신·세션 변경을 자동 반영합니다.

```ts
supabase.auth.onAuthStateChange((_event, session) => {
  setSession(session);
  setUser(session?.user ?? null);
});
```

#### 3. LoginModal 컴포넌트

`src/components/feature/LoginModal.tsx`를 신규 생성했습니다.

- 로그인 / 회원가입 탭 전환
- 이메일 + 비밀번호 폼 (비밀번호 확인 유효성 검사)
- 카카오 로그인 버튼 (노란 배경 + 카카오 로고 SVG)
- 에러·안내 메시지 인라인 표시

#### 4. TopNav — props → Context 전환

기존 `isLoggedIn?: boolean` / `onToggleLogin?` props를 제거하고 `useAuth()`로 교체했습니다.

- **로그인 버튼** → `loginModalOpen` 상태로 LoginModal 렌더
- **로그아웃 버튼** → `signOut()` 호출
- 기존 props는 `_props`로 수신 후 무시 (하위 호환)

#### 5. 카카오 KOE205 오류 해결

Supabase가 카카오 OAuth를 OIDC 방식으로 처리하기 때문에, 카카오 개발자 콘솔에서 **OpenID Connect 활성화** 및 **동의항목** 설정이 필요했습니다.  
코드에서도 `scopes: "profile_nickname profile_image account_email openid"`를 명시하여 누락 없이 요청합니다.

#### 6. 이메일 확인 리다이렉트 수정

Supabase `Site URL`이 이전 프로젝트(`start04`)로 설정되어 확인 메일의 링크가 잘못된 도메인으로 연결되는 문제를 수정했습니다.

- `signUpWithEmail`에 `emailRedirectTo: window.location.origin` 추가
- Supabase 대시보드 Site URL → `http://localhost:3001` 변경
- Redirect URLs에 `http://localhost:3001` / `http://localhost:3001/**` 추가

#### 7. 동화 생성 요청 LocalStorage 저장

create 3종 페이지(`/create`, `/create/select`, `/create/chat`)에서 `handleCreate` 시 동화 생성 요청 객체를 `STORY_REQUEST_KEY`로 localStorage에 저장한 뒤 `/create/progress`로 이동하도록 변경했습니다 (기존 setTimeout 더미 로직 제거).

---

### 커밋 이력 (2026-06-20)

| 커밋 해시 | 내용 |
|-----------|------|
| `58f2bed` | feat: Supabase 인증 연동 (이메일/카카오 로그인) |

---

### 알려진 이슈 / 다음 스텝

- [ ] 로그인 후 자녀 프로필을 DB에서 불러오기 (현재 mock 데이터)
- [ ] 보호된 라우트 — 미로그인 시 홈으로 리다이렉트
- [ ] 이메일 확인 완료 후 자동 로그인 처리

---

## 2026-06-19 — v0.2.0 놀이마당 전면 개편 · UI 디테일 개선

### 작업 내용

#### 1. 히어로 섹션 메인 카피 폰트 사이즈 조정

히어로 h2의 반응형 폰트 사이즈를 조정했습니다.

- 변경 전: `text-xl sm:text-2xl md:text-3xl lg:text-4xl`
- 변경 후: `text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl`
- 대형 뷰포트(xl 이상)에서 한 단계 더 크게 표시되도록 추가

---

#### 2. 동화 놀이마당(`/report`) 전면 개편

##### 2-1. "토리 동화 놀이마당" 오렌지 배지 태그 삭제

활동 카드 헤더에 있던 주황색 배지 태그를 제거했습니다.

```tsx
// 삭제된 코드
<span className="inline-flex ... bg-orange-400 ...">토리 동화 놀이마당</span>
```

##### 2-2. 활동 카드 헤더 레이아웃 재구성

기존에 제목·태그·저장버튼이 세로로 쌓이던 구조를 단일 가로 행으로 재구성했습니다.

- 변경 전: 제목 블록 + 오렌지 태그 + 저장 버튼 (세로 스택)
- 변경 후: `flex items-center justify-between` 한 줄

```
← 동화 목록으로  |  [동화 제목 — 가운데 정렬]  |  🌟 저장하고 홈으로
```

세 요소가 동일 선상에 위치하며, 제목은 `flex-1 text-center`로 자연스럽게 가운데 배치됩니다.

##### 2-3. 낱말카드 퀴즈 → 브레이크아웃 캔버스 게임으로 교체

기존 낱말카드 퀴즈 전체를 제거하고 HTML Canvas 기반 브레이크아웃(Breakout) 게임을 구현했습니다.

**제거된 코드:**
- `GAME_QUESTIONS` 상수 배열
- `gameStep`, `gameScore`, `gamePicked`, `gameDone` 상태값
- `handleGameAnswer`, `handleGameNext`, `resetGame` 핸들러

**추가된 `BreakoutGame` 컴포넌트 주요 사양:**

| 항목 | 내용 |
|------|------|
| 캔버스 크기 | 500 × 600 |
| 벽돌 배치 | 5행 × 8열 = 40개, 5색 OKLCH 계열 |
| 점수 체계 | 행별 점수 차등 (1행 50점 ~ 5행 10점) |
| 레벨업 | 벽돌 전부 파괴 시 다음 레벨, 속도 10% 증가 (최대 12) |
| 조작 방식 | 마우스 이동 / ← → 방향키 / 터치 드래그 |
| 일시정지 | 스페이스바 또는 재개 버튼 |
| 최고점수 | `localStorage("breakout-best")` 영구 저장 |
| HUD | SCORE · BEST · LEVEL · LIVES 4분할 상단 표시 |
| 테마 | 딥 네이비(`#131830`) 배경 + 민트 네온(`#6EFFF1`) 패들 |

게임 루프는 `loopRef.current` 패턴으로 구현하여 RAF 콜백 내 stale closure 문제를 방지했습니다.

```tsx
loopRef.current = () => {
  if (!g.current.paused) { update(); draw(); }
  g.current.raf = requestAnimationFrame(loopRef.current);
};
```

##### 2-4. 전체 완료 배너 — 텍스트 변경 및 위치 이동

- **텍스트**: "이제 낱말 게임에 도전해봐요" → "이제 신나는 게임을 통해 머리를 식혀봐요"
- **위치**: 헤더 섹션 하단 → 활동 카드 그리드 바로 위로 이동
  - 이전: `헤더(제목행 + 배너)` / 이후: `헤더(제목행만)` + `[배너] + [카드 그리드]`

---

### 커밋 이력 (2026-06-19)

| 커밋 해시 | 내용 |
|-----------|------|
| `11556e0` | feat(playground): replace quiz with Breakout game, restructure header layout |
| `dc18e07` | fix(playground): update banner text and move above activity cards grid |

---

## 2026-06-18 — v0.1.2 로고 폰트 교체

### 작업 내용

#### 로고 텍스트 폰트 변경

GNB(TopNav)와 Footer의 "토리동화" 로고 텍스트 폰트를 **망고보드 별별체(산돌구름)**로 교체했습니다.

- 기존: `font-heading` (Gowun Batang 계열)
- 변경: `font-logo` → `MangoBoardByeolbyeol`
- CDN: `https://cdn.jsdelivr.net/gh/projectnoonnu/2405-3@1.1/MangoByeolbyeol.woff2`

#### 구현 방식

- `index.css`에 `@font-face` 선언 추가 (`font-display: swap` 적용)
- `:root`에 `--font-logo` CSS 변수 분리 — 헤딩 전체가 아닌 로고에만 영향
- `tailwind.config.ts`에 `font-logo` 유틸리티 추가
- TopNav / Footer 로고 span에 `font-logo` 클래스 적용

> 폰트 적용 범위를 `--font-heading`과 분리함으로써 나머지 제목 스타일에 영향을 주지 않습니다.

---

## 2026-06-18 — v0.1.1 브랜드 에셋 정제

### 작업 내용

#### 파비콘 / 로고 디자인 반복 개선

초기 토끼 귀 + 책 디자인에서 출발해 피드백을 반영하며 아래 순서로 개선했습니다.

**1차 — 오픈 북 + 눈 캐릭터 도입**
- 펼쳐진 책 양쪽 페이지에 눈을 하나씩 배치
- 동공을 오른쪽으로 치우쳐 "오른쪽 바라보는" 표정 표현
- 속눈썹, 홍채 하이라이트 포함한 사실적 눈 스타일

**2차 — 유아틱한 2D 카툰 눈으로 단순화**
- 속눈썹 전체 제거
- clipPath로 흰동자 안에 검은 동자가 반 채워진 카툰 눈 구현
- 흰 하이라이트 점 제거 → 더 플랫한 2D 느낌
- 별 색상 → `#f3cc67` 노란색

**3차 — 컬러 시스템 정비**
- 배경 원: primary-500 → **primary-300** `oklch(0.88 0.062 10)` (더 연한 핑크)
- 책 외곽선 + 척추선: 기존 다크 핑크 → **primary-500** `oklch(0.78 0.118 14)`
- 눈 테두리: 핑크 계열 → **얇은 블랙** `#333 / 0.8px`
- 척추선: 두꺼운 블록 → 3px 얇은 선, 책 스트로크와 동일 컬러

#### GNB / 푸터 로고 교체
- TopNav: `ri-book-open-line` 아이콘 → `favicon.svg` img 태그 (28×28)
- Footer: `ri-book-open-line` 아이콘 → `favicon.svg` img 태그 (40×40)
- index.html: `lang="en"` → `lang="ko"`, 타이틀·설명 토리동화로 수정

#### 문서
- `README.md` — 프로젝트 소개, 기술 스택, 기능 목록, 실행법, 배포 구조 작성
- `DEVLOG.md` — 개발일지 초안 작성

---

## 2026-06-18 — v0.1.0 초기 배포

### 작업 내용

#### UI 설계 및 구현
- Readdy AI 툴을 활용해 전체 UI 프로토타입 설계
- Vite 8 + React 19 + TypeScript 기반 프로젝트 셋업
- Tailwind CSS oklch 색상 토큰 시스템 구성 (background / primary / secondary / accent / foreground)
- 반응형 레이아웃 구현 (모바일 ↔ 데스크탑)
- 다크모드 지원 구조 설계

#### 구현된 페이지
| 페이지 | 경로 | 비고 |
|--------|------|------|
| 홈 | `/` | 히어로 섹션, 기능 소개, 최근 동화, CTA |
| 선택형 동화 만들기 | `/create/select` | 장르/주인공/배경 선택 UI |
| 대화형 동화 만들기 | `/create/chat` | 채팅 인터페이스 |
| 생성 진행중 | `/create/progress` | 로딩 애니메이션 |
| 동화 뷰어 | `/viewer` | 페이지 넘기기 UI |
| 내 책장 | `/bookshelf` | 그리드 레이아웃, 검색/필터 |
| 책장 (프리미엄) | `/bookshelf/premium` | 프리미엄 전용 콘텐츠 |
| 부모 대시보드 | `/dashboard` | 성장 데이터 차트 |
| 성장 리포트 | `/report` | 탭 기반 리포트 |
| 어휘력 리포트 | `/report/vocabulary` | |
| 독해력 리포트 | `/report/comprehension` | |
| 창의력 리포트 | `/report/creative` | |
| 감정 리포트 | `/report/emotion` | |
| 설정 | `/settings` | 프로필, 알림, 테마 설정 |
| 구독 | `/subscription` | 플랜 비교 및 결제 UI |
| 프로필 수정 | `/profile/edit` | |

#### 공통 컴포넌트
- `TopNav` — 로고, 다크모드 토글, 언어 변경, 부모잠금, 자녀 전환, 모바일 메뉴
- `FoldSidebar` — 접히는 사이드바 (56px ↔ 224px), 서브메뉴 지원
- `Footer` — 서비스 링크, SNS, 법적 고지
- `SubmitModal` — 동화 완성 후 격려 팝업

#### 배포 환경 구성
- GitHub Actions 워크플로우 작성 (`.github/workflows/deploy.yml`)
- `BASE_PATH=/tori-story/` 환경변수로 Vite base path 동적 설정
- SPA 라우팅 지원: `out/index.html` → `out/404.html` 복사
- GitHub Pages (정적 호스팅) 자동 배포

### 기술적 결정 사항

**왜 oklch 색상 토큰?**
oklch는 지각적으로 균일한 색상 공간으로, 밝기와 채도를 독립적으로 조정할 수 있어 다크모드 색상 시스템 구성에 유리합니다.

**왜 `basename={__BASE_PATH__}` 패턴?**
GitHub Pages는 `/{repo-name}/` 하위 경로로 서빙되기 때문에 BrowserRouter의 basename을 빌드 시점에 주입해야 합니다. `__BASE_PATH__` 전역 변수를 vite.config.ts의 `define`으로 주입하는 방식을 채택했습니다.

**왜 SPA 404.html 복사?**
GitHub Pages는 존재하지 않는 경로 요청 시 자동으로 `404.html`을 서빙합니다. `index.html`을 그대로 복사해두면 클라이언트 라우터가 URL을 처리하므로 새로고침/직접접근 시 404가 발생하지 않습니다.

### 알려진 이슈 / 다음 스텝

- [ ] 실제 AI API 연동 (현재 모든 데이터는 mock)
- [ ] 인증/로그인 플로우 구현
- [ ] 결제 시스템 연동 (구독 플랜)
- [ ] 동화 생성 AI 파이프라인 구축
- [ ] 성능 최적화 (이미지 lazy load, 코드 스플리팅)
- [ ] 접근성 개선 (WCAG 2.1 AA)
- [ ] 단위 테스트 / E2E 테스트 추가
