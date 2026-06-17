# 토리동화 개발일지

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

#### 브랜드 에셋
- `public/favicon.svg` — 토리 캐릭터(토끼 귀) + 책 + 별 아이콘 제작

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
