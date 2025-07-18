# OASIS FE Admin

OASIS FE Admin은 Vue 3, Vuetify 3, Vite 기반의 어드민 대시보드 프로젝트입니다.

## 주요 기술 스택

- [Vue 3](https://vuejs.org/)
- [Vuetify 3](https://vuetifyjs.com/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [ApexCharts](https://apexcharts.com/)

## 프로젝트 구조

```
oasis-fe-admin/
├── public/                # 정적 파일 (favicon, logo 등)
├── src/
│   ├── @core/             # 공통 유틸, SCSS, 헬퍼 등
│   ├── @layouts/          # 레이아웃 컴포넌트 및 스타일
│   ├── assets/            # 이미지, 스타일 등
│   ├── components/        # 공통 컴포넌트
│   ├── layouts/           # 레이아웃 구현
│   ├── pages/             # 라우트별 페이지
│   ├── plugins/           # 플러그인, 라우터, Vuetify 설정 등
│   ├── views/             # 세부 뷰 컴포넌트
│   └── main.js            # 앱 진입점
├── package.json
├── vite.config.js
└── README.md
```

## 설치 및 실행

```bash
# 패키지 설치 (npm 또는 pnpm)
npm install
# 또는
pnpm install

# 개발 서버 실행
npm run dev
# 또는
pnpm dev

# 빌드
npm run build
# 또는
pnpm build
```

## 주요 명령어

- `npm run dev` : 개발 서버 실행
- `npm run build` : 프로덕션 빌드
- `npm run preview` : 빌드 결과 미리보기
- `npm run lint` : 코드 린트

## 커스텀

- **로고/이미지**: `public/` 폴더에 위치
- **로딩화면**: `index.html`에서 `<img src="/logo_oasis.png" />` 사용
- **라우팅**: `src/plugins/router/routes.js`에서 관리
- **글로벌 스타일**: `src/@core/scss/`, `src/assets/styles/`

## 문의

- FE 담당자: 최지은

---

본 프로젝트는 내부 관리용으로, 외부 배포/공개를 금합니다.
