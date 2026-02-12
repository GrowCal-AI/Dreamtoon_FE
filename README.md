# DreamToon Lab 🌙

> 꿈을 웹툰/애니로 만들어주는 AI 꿈 헬스케어 플랫폼

당신의 무의식이 만든 이야기를 AI가 멋진 웹툰으로 만들어드립니다.

## 프로젝트 개요

**DreamToon Lab**은 사용자가 기록한 꿈을 AI가 자동으로 웹툰 형식의 스토리로 변환하고, 꿈 패턴을 분석하여 정서 및 건강 상태를 시각화하는 혁신적인 헬스케어 플랫폼입니다.

### 주요 차별점

1. **꿈 → 웹툰/애니 스토리 자동 연출**
   - LLM이 꿈 서술을 여러 장면으로 자동 분해
   - 통일된 캐릭터/배경 스타일로 이미지 생성
   - 세로 스크롤 웹툰 뷰 또는 모션 영상 재생

2. **꿈 기반 마음·건강 상태 점수화**
   - 다차원 꿈 감정 분석 (기쁨, 불안, 분노, 슬픔, 놀람, 평온)
   - Dream Health Index: 스트레스, 불안, 정서 회복력 등 종합 지표
   - AI 기반 인사이트 및 일일 코칭 제공

3. **입력 UX 최적화**
   - 텍스트 입력 및 음성 녹음 지원
   - 자동 장면 분리 및 구조화
   - 간편한 드림 카드 입력 폼

4. **한국 웹툰 문화 맞춤**
   - 로맨스, 학원물, 다크 판타지, 힐링 등 다양한 스타일 프리셋
   - 악몽을 귀여운 SD 캐릭터로 재해석하는 리프레임 모드
   - 시즌별 꿈 웹툰 앨범 제공

## 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구 (빠른 HMR)
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Framer Motion** - 애니메이션
- **Zustand** - 경량 상태 관리
- **React Router** - 라우팅
- **Recharts** - 데이터 시각화

### 최적화 기법
- **Code Splitting** - 청크 분할로 초기 로딩 속도 개선
- **Lazy Loading** - 컴포넌트 지연 로딩
- **Memoization** - React.memo, useMemo, useCallback 활용
- **Virtual Scrolling** - 대량 데이터 렌더링 최적화

## 프로젝트 구조

```
dream/
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   └── layout/        # 레이아웃 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   ├── store/             # Zustand 상태 관리
│   ├── types/             # TypeScript 타입 정의
│   ├── services/          # API 서비스
│   ├── hooks/             # 커스텀 훅
│   ├── utils/             # 유틸리티 함수
│   ├── App.tsx           # 메인 앱 컴포넌트
│   ├── main.tsx          # 엔트리 포인트
│   └── index.css         # 글로벌 스타일
├── public/               # 정적 파일
├── index.html           # HTML 템플릿
├── package.json         # 의존성 관리
├── tsconfig.json        # TypeScript 설정
├── vite.config.ts       # Vite 설정
├── tailwind.config.js   # Tailwind 설정
└── README.md           # 프로젝트 문서
```

## 시작하기

### 필수 요구사항
- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프리뷰
npm run preview
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

## 주요 기능

### 1. 홈페이지
- 서비스 소개
- 주요 기능 카드
- 사용자 통계 대시보드

### 2. 꿈 입력 페이지
- 텍스트/음성 입력 모드 전환
- 웹툰 스타일 선택 (로맨스, 학원물, 다크 판타지 등)
- 주요 감정 선택
- AI 웹툰 생성

### 3. 웹툰 뷰어
- 세로 스크롤 웹툰 형식
- 자동 재생 기능
- 장면별 나레이션 및 대사
- 즐겨찾기, 공유, 다운로드

### 4. 분석 대시보드
- Dream Health Index (스트레스, 불안, 정서 회복력 등)
- 감정 분포 레이더 차트
- 주간 꿈 기록 타임라인
- AI 인사이트 및 추천

### 5. 라이브러리
- 모든 꿈 기록 열람
- 검색 및 필터링
- 정렬 (최신순, 제목순)
- 즐겨찾기 관리

## React 최적화 기법

### 1. 컴포넌트 메모이제이션
```typescript
// React.memo로 불필요한 리렌더링 방지
const StyleCard = memo(({ style, isSelected, onClick }) => {
  // ...
})
```

### 2. 콜백 메모이제이션
```typescript
// useCallback으로 함수 재생성 방지
const handleInputChange = useCallback((field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}, [])
```

### 3. 값 메모이제이션
```typescript
// useMemo로 계산 비용이 큰 작업 최적화
const filteredDreams = useMemo(() => {
  return dreams.filter(/* ... */)
}, [dreams, searchQuery, filterStyle])
```

### 4. Code Splitting
```typescript
// vite.config.ts에서 수동 청크 분할
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'animation': ['framer-motion'],
  'charts': ['recharts'],
}
```

## UI/UX 디자인 특징

### 1. 그라디언트 디자인
- Purple, Pink, Indigo 계열의 드림풀한 색상 조합
- 유리 효과(Glass morphism) 적용

### 2. 애니메이션
- Framer Motion을 활용한 부드러운 전환
- 페이드인, 슬라이드업, 플로팅 효과
- 스태거 애니메이션으로 요소별 순차 등장

### 3. 반응형 디자인
- Mobile First 접근
- Tailwind의 반응형 클래스 활용
- 다양한 화면 크기 대응

## API 연동 가이드

현재 프로젝트는 Mock 데이터를 사용하고 있습니다. 실제 백엔드 API와 연동하려면:

1. [src/services/api.ts](src/services/api.ts) - API 엔드포인트 정의
2. [src/hooks/useDreams.ts](src/hooks/useDreams.ts) - API 호출 로직 수정
3. 환경변수 설정 (.env 파일)

```env
VITE_API_BASE_URL=https://your-api-url.com/api
```

## 향후 개발 과제

아래는 프로젝트를 완성하기 위해 추가로 개발해야 할 항목들입니다:

### 백엔드 API 개발
- [ ] 사용자 인증/인가 (JWT)
- [ ] 꿈 CRUD API
- [ ] 음성-텍스트 변환 API (Whisper 등)
- [ ] LLM 기반 꿈 장면 분해 엔진
- [ ] 이미지 생성 API (Stable Diffusion, DALL-E 등)
- [ ] 감정 분석 AI 모델
- [ ] Dream Health Index 계산 알고리즘

### AI/ML 기능
- [ ] 꿈 내용 → 장면 분해 프롬프트 엔지니어링
- [ ] 캐릭터 일관성 유지 (LoRA, ControlNet)
- [ ] 웹툰 스타일 프리셋 모델 학습
- [ ] 감정 분석 모델 fine-tuning
- [ ] 반복 심볼/패턴 추출 알고리즘
- [ ] 루시드 드림/악몽 분류 모델

### 프론트엔드 고도화
- [ ] 실제 음성 녹음 기능 구현
- [ ] 웹툰 이미지 로딩 상태 및 에러 처리
- [ ] 애니메이션 비디오 재생 기능
- [ ] 소셜 공유 기능 (카카오톡, 인스타그램)
- [ ] 다크 모드 지원
- [ ] PWA 적용 (오프라인 지원)
- [ ] 접근성 개선 (ARIA, 키보드 네비게이션)

### 데이터베이스
- [ ] 스키마 설계 (Users, Dreams, Scenes, Analysis)
- [ ] PostgreSQL/MongoDB 셋업
- [ ] 이미지 저장소 (AWS S3, Cloudinary)
- [ ] 캐싱 전략 (Redis)

### 인프라
- [ ] Docker 컨테이너화
- [ ] CI/CD 파이프라인
- [ ] 클라우드 배포 (AWS, GCP, Vercel)
- [ ] 모니터링 및 로깅 (Sentry, LogRocket)

### 추가 기능
- [ ] 꿈 공유 커뮤니티
- [ ] 꿈 해석 전문가 연결
- [ ] 리마인더 알림 (매일 꿈 기록)
- [ ] 꿈 일기 PDF 다운로드
- [ ] 친구 초대 및 꿈 공유
- [ ] 꿈 통계 리포트 (월간, 연간)

## 라이선스

MIT License

## 기여

프로젝트 개선을 위한 이슈 등록과 풀 리퀘스트를 환영합니다!

---

**DreamToon Lab** - 당신의 꿈이 예술이 되는 순간 ✨
