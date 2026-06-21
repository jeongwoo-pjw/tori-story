# 토리동화 📖

> **상상이 이야기가 되는 곳** — AI가 우리 아이만을 위한 세상에 하나뿐인 동화를 만들어드립니다.

[![Deploy to GitHub Pages](https://github.com/jeongwoo-pjw/tori-story/actions/workflows/deploy.yml/badge.svg)](https://github.com/jeongwoo-pjw/tori-story/actions/workflows/deploy.yml)

**라이브 사이트** → https://jeongwoo-pjw.github.io/tori-story/

---

## 프로젝트 소개

토리동화는 아이의 이름·나이·좋아하는 것만 입력하면 AI가 한국적 정서를 담은 맞춤 동화책을 즉시 생성해주는 서비스입니다. 부모는 아이의 성장 리포트와 독서 이력을 대시보드에서 한눈에 확인할 수 있습니다.

## 주요 기능

| 기능 | 설명 |
|------|------|
| **로그인** | 이메일+비밀번호 / 카카오 소셜 로그인 (Supabase Auth) |
| **선택형 동화** | 장르·주인공·배경을 고르면 Solar AI가 동화 생성 |
| **대화형 동화** | 4단계 위저드 대화를 통해 나만의 이야기 완성 |
| **내 책장** | 생성한 동화 localStorage 저장·조회, 더미 동화 3편 데모 제공 |
| **성장 분석** | 어휘력·창의력·감정·독해력 리포트 |
| **부모 대시보드** | 자녀 독서 현황 + Solar AI 성향 분석 (관심사·감정·반복 테마) |
| **동화 놀이마당** | 독서 후 4가지 연령별 맞춤 활동 + 미니게임 3종 |
| **구독 플랜** | Free / Premium 구독 관리 |

### 🎮 놀이마당 연령별 활동 (데모 3편)

| 동화 | 나이 | 이해력 | 감정탐색 | 창의력 | 어휘 |
|------|------|--------|----------|--------|------|
| 수인이와 반짝반짝 가족의 하루 | 7세 | 6조각 퍼즐 | 이모지 감정 카드 | 드로잉 캔버스 캐러셀 | 낱말 드로잉 캐러셀 |
| 민준이의 용기있는 한복 여행 | 7세 | 9조각 퍼즐 | 이모지 감정 카드 | 줄거리 카드 + 글쓰기 | 6낱말 드로잉 캐러셀 |
| 미희와 신나는 탈춤 축제 | 5세 | 카드 순서 맞추기 + 글쓰기 | 이모지 감정 카드 | 줄거리 카드 + 글쓰기 | 낱말 카드 그리드 + 퀴즈 |

- 오류 카드 실시간 빨간 하이라이트 + "순서를 다시 기억해봐요" 힌트
- 글쓰기 활동마다 "모범답안 확인하기" 토글 제공
- 모든 활동 완료 후 미니게임 3종 (블록깨기 · 카드 뒤집기 · 테트리스) 해금

## 기술 스택

- **Frontend** — React 19, TypeScript, Vite 8
- **Routing** — React Router DOM v7
- **Styling** — Tailwind CSS v3 (oklch 색상 토큰)
- **UI** — Remix Icon, Font Awesome, Google Fonts (Jua, Gowun Dodum 등), 망고보드 별별체(산돌구름)
- **인증 / DB** — Supabase (이메일+비밀번호, 카카오 OAuth)
- **AI** — Solar API (`solar-pro`) — 동화 생성 + 아이 독서 성향 분석
- **국제화** — i18next
- **드래그&드롭** — @dnd-kit/core
- **배포** — GitHub Pages (GitHub Actions 자동 CI/CD)

## 로컬 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_SOLAR_API_KEY 입력

# 개발 서버 실행 (http://localhost:3001)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 프로젝트 구조

```
src/
├── components/feature/   # 공통 컴포넌트 (TopNav, Sidebar, Footer, LoginModal 등)
├── contexts/             # React Context (AuthContext)
├── lib/                  # 외부 클라이언트 초기화 (supabase.ts)
├── i18n/                 # 다국어 설정
├── mocks/                # 목업 데이터
├── pages/                # 페이지별 컴포넌트
│   ├── home/             # 홈 (Hero, EntryCards, WhyTori, SubscriptionPlan 등)
│   ├── bookshelf/
│   ├── create/           # 선택형·대화형 통합 동화 만들기 (탭 전환)
│   ├── create-progress/  # 생성 중 로딩
│   ├── dashboard/        # 부모 대시보드 + Solar 성향 분석
│   ├── report/
│   ├── settings/
│   ├── subscription/
│   └── viewer/
├── router/               # 라우터 설정
└── services/
    ├── solar.ts          # Solar API (동화 생성 + analyzeChildData)
    └── library.ts        # localStorage 도서관 관리 + 통계 헬퍼
```

## 배포 구조

`main` 브랜치에 push하면 GitHub Actions가 자동으로:
1. `npm ci` 의존성 설치
2. `BASE_PATH=/tori-story/` 환경변수로 Vite 빌드
3. `out/index.html` → `out/404.html` 복사 (SPA 라우팅 지원)
4. GitHub Pages에 배포

---

made with ♥ for little dreamers
