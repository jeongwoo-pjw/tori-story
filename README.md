# 토리동화 🐰📖

> **상상이 이야기가 되는 곳** — AI가 우리 아이만을 위한 세상에 하나뿐인 동화를 만들어드립니다.

[![Deploy to GitHub Pages](https://github.com/jeongwoo-pjw/tori-story/actions/workflows/deploy.yml/badge.svg)](https://github.com/jeongwoo-pjw/tori-story/actions/workflows/deploy.yml)

**라이브 사이트** → https://jeongwoo-pjw.github.io/tori-story/

---

## 프로젝트 소개

토리동화는 아이의 이름·나이·좋아하는 것만 입력하면 AI가 한국적 정서를 담은 맞춤 동화책을 즉시 생성해주는 서비스입니다. 부모는 아이의 성장 리포트와 독서 이력을 대시보드에서 한눈에 확인할 수 있습니다.

## 주요 기능

| 기능 | 설명 |
|------|------|
| **선택형 동화** | 장르·주인공·배경을 고르면 AI가 동화 생성 |
| **대화형 동화** | 아이와 채팅하듯 대화하며 이야기 완성 |
| **내 책장** | 생성한 동화 저장·조회·공유 |
| **성장 분석** | 어휘력·창의력·감정·독해력 리포트 |
| **부모 대시보드** | 자녀 독서 현황 및 성장 데이터 시각화 |
| **구독 플랜** | Free / Premium 구독 관리 |

## 기술 스택

- **Frontend** — React 19, TypeScript, Vite 8
- **Routing** — React Router DOM v7
- **Styling** — Tailwind CSS v3 (oklch 색상 토큰)
- **UI** — Remix Icon, Font Awesome, Google Fonts (Jua, Gowun Dodum 등)
- **국제화** — i18next
- **드래그&드롭** — @dnd-kit/core
- **배포** — GitHub Pages (GitHub Actions 자동 CI/CD)

## 로컬 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 프로젝트 구조

```
src/
├── components/feature/   # 공통 컴포넌트 (TopNav, Sidebar, Footer 등)
├── i18n/                 # 다국어 설정
├── mocks/                # 목업 데이터
├── pages/                # 페이지별 컴포넌트
│   ├── home/
│   ├── bookshelf/
│   ├── create-chat/
│   ├── create-select/
│   ├── dashboard/
│   ├── report/
│   ├── settings/
│   ├── subscription/
│   └── viewer/
└── router/               # 라우터 설정
```

## 배포 구조

`main` 브랜치에 push하면 GitHub Actions가 자동으로:
1. `npm ci` 의존성 설치
2. `BASE_PATH=/tori-story/` 환경변수로 Vite 빌드
3. `out/index.html` → `out/404.html` 복사 (SPA 라우팅 지원)
4. GitHub Pages에 배포

---

made with ♥ for little dreamers
