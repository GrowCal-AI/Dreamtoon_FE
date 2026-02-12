# ============================================

# API 연동 가이드

# ============================================

## 🔑 OpenAI API로 구현 가능한 기능 (현재 프로젝트)

### 1. ✅ 꿈 내용 분석 (GPT-4/GPT-4-turbo)

- **기능**: 꿈 텍스트 입력 → 감정/장면/상징 자동 추출
- **사용 페이지**: DreamInputPage
- **API**: `POST https://api.openai.com/v1/chat/completions`
- **구현 파일**: `src/services/openai.ts` (생성 필요)

### 2. ✅ 이미지 생성 (DALL-E 3)

- **기능**: 각 꿈 장면마다 이미지 자동 생성
- **사용 페이지**: WebtoonViewPage
- **API**: `POST https://api.openai.com/v1/images/generations`
- **품질**: 1024x1024 고화질

### 3. ✅ 음성 → 텍스트 변환 (Whisper)

- **기능**: 음성으로 꿈 내용 녹음 → 텍스트 변환
- **사용 페이지**: DreamInputPage (음성 입력 모드)
- **API**: `POST https://api.openai.com/v1/audio/transcriptions`

### 4. ✅ 분석 대시보드 데이터 생성 (GPT-4)

- **기능**: 꿈 패턴 분석, 건강 지수 계산
- **사용 페이지**: AnalyticsPage
- **구현**: 누적된 꿈 데이터를 GPT로 분석

---

## ⚠️ 추가 API 연동이 필요한 기능

### 1. ❌ 동영상 생성

- **현재 상태**: 타입만 정의됨 (`videoUrl` 필드)
- **필요 API**:
  - Runway Gen-3 API
  - Pika Labs API
  - Stable Video Diffusion
- **비용**: 비쌈 (선택사항)

### 2. △ 고품질 이미지 (선택)

- **DALL-E 3 대안**: Stable Diffusion XL, Flux
- **필요 API**: Replicate 또는 Stability AI
- **장점**: 더 저렴하고 커스터마이징 가능
- **단점**: 프롬프트 엔지니어링 필요

---

## 💰 비용 예상 (OpenAI API 기준)

| 기능        | 모델     | 1회 비용    | 설명                 |
| ----------- | -------- | ----------- | -------------------- |
| 꿈 분석     | GPT-4    | ~$0.01-0.03 | 입력 1000토큰 기준   |
| 이미지 생성 | DALL-E 3 | $0.04       | 1024x1024 이미지 1장 |
| 음성 변환   | Whisper  | $0.006/분   | 1분 녹음 기준        |

**예시**: 꿈 1개 등록 (장면 3개) = 분석 $0.02 + 이미지 $0.12 = **$0.14**

---

## 🚀 시작 방법

1. **OpenAI API 키 발급**

   ```bash
   # https://platform.openai.com/api-keys
   ```

2. **환경 변수 설정**

   ```bash
   cp .env.example .env
   # .env 파일 열어서 API 키 입력
   ```

3. **OpenAI 서비스 구현**

   ```bash
   # src/services/openai.ts 생성 (다음 단계에서 제공)
   ```

4. **서버 재시작**
   ```bash
   npm run dev
   ```

---

## 📝 구현 우선순위

### Phase 1: OpenAI만 사용 (권장)

- [x] 목업 데이터로 UI 완성
- [ ] OpenAI API 연동 (분석 + 이미지 + 음성)
- [ ] 로컬 스토리지로 데이터 저장

### Phase 2: 백엔드 추가 (선택)

- [ ] Express/FastAPI 서버 구축
- [ ] PostgreSQL 데이터베이스
- [ ] 인증 시스템

### Phase 3: 고급 기능 (선택)

- [ ] 동영상 생성
- [ ] 소셜 공유 기능
- [ ] 꿈 일기 커뮤니티
