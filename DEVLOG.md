# 토리동화 개발일지

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
