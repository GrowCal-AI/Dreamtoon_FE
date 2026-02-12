# DreamToon Lab 구현 가이드

이 문서는 DreamToon Lab 프로젝트를 완성하기 위해 필요한 구체적인 구현 단계를 설명합니다.

## 목차
1. [개발 환경 설정](#개발-환경-설정)
2. [백엔드 API 구현](#백엔드-api-구현)
3. [AI/ML 기능 구현](#aiml-기능-구현)
4. [프론트엔드 연동](#프론트엔드-연동)
5. [배포](#배포)

---

## 개발 환경 설정

### 1. 프로젝트 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env
# .env 파일을 열어 필요한 API 키 입력

# 3. 개발 서버 실행
npm run dev
```

### 2. 추천 VSCode 확장

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

---

## 백엔드 API 구현

### 1. 기술 스택 선택

추천 스택:
- **Node.js + Express** (간단한 REST API)
- **NestJS** (엔터프라이즈급 구조)
- **Python FastAPI** (AI/ML 통합 용이)

### 2. 필수 API 엔드포인트

#### 인증 API
```
POST /api/auth/signup       # 회원가입
POST /api/auth/login        # 로그인
POST /api/auth/logout       # 로그아웃
GET  /api/auth/me          # 현재 사용자 정보
```

#### 꿈 관리 API
```
GET    /api/dreams              # 모든 꿈 조회
GET    /api/dreams/:id          # 특정 꿈 조회
POST   /api/dreams              # 꿈 생성
PATCH  /api/dreams/:id          # 꿈 수정
DELETE /api/dreams/:id          # 꿈 삭제
POST   /api/dreams/:id/favorite # 즐겨찾기 토글
```

#### 웹툰 생성 API
```
POST /api/webtoon/generate     # 웹툰 생성 요청
GET  /api/webtoon/status/:id   # 생성 상태 확인
```

#### 분석 API
```
GET /api/analytics/health-index    # Dream Health Index
GET /api/analytics/emotions        # 감정 분석 데이터
GET /api/analytics/patterns        # 꿈 패턴 분석
```

#### 음성 처리 API
```
POST /api/voice/transcribe     # 음성 → 텍스트 변환
```

### 3. 데이터베이스 스키마 예시 (PostgreSQL)

```sql
-- Users 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Dreams 테이블
CREATE TABLE dreams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  input_method VARCHAR(20) CHECK (input_method IN ('text', 'voice')),
  style VARCHAR(50),
  recorded_at TIMESTAMP,
  webtoon_url TEXT,
  video_url TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Scenes 테이블
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dream_id UUID REFERENCES dreams(id) ON DELETE CASCADE,
  scene_number INT NOT NULL,
  description TEXT,
  emotion VARCHAR(50),
  image_url TEXT,
  narration TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dream Analysis 테이블
CREATE TABLE dream_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dream_id UUID REFERENCES dreams(id) ON DELETE CASCADE,
  emotions JSONB,
  tension_level INT,
  control_level INT,
  is_nightmare BOOLEAN,
  repeating_symbols TEXT[],
  relationship_patterns TEXT[],
  has_resolution BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## AI/ML 기능 구현

### 1. LLM 기반 장면 분해 엔진

**사용 가능한 모델:**
- OpenAI GPT-4
- Anthropic Claude
- Google Gemini
- Llama 3 (오픈소스)

**프롬프트 예시:**

```python
system_prompt = """
당신은 꿈 내용을 웹툰 스토리로 변환하는 AI입니다.
사용자가 입력한 꿈을 3-6개의 장면으로 나누어주세요.

각 장면마다 다음 정보를 제공해주세요:
1. scene_number: 장면 번호
2. description: 장면 설명 (이미지 생성용)
3. characters: 등장 인물 목록
4. emotion: 주요 감정 (joy, anxiety, anger, sadness, surprise, peace)
5. background_keywords: 배경 키워드 (최대 5개)
6. narration: 나레이션
7. dialogue: 대사 (있다면)

JSON 형식으로 응답해주세요.
"""

user_prompt = f"""
꿈 내용: {dream_content}
스타일: {dream_style}
"""
```

**구현 예시 (Python):**

```python
from openai import OpenAI

def decompose_dream_to_scenes(dream_content: str, style: str):
    client = OpenAI(api_key="your-api-key")

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        response_format={"type": "json_object"}
    )

    scenes = json.loads(response.choices[0].message.content)
    return scenes
```

### 2. 이미지 생성

**사용 가능한 모델:**
- Stable Diffusion XL
- DALL-E 3
- Midjourney API
- Leonardo.ai

**캐릭터 일관성 유지 방법:**
1. **LoRA (Low-Rank Adaptation)**: 캐릭터 학습
2. **ControlNet**: 포즈/구도 제어
3. **IP-Adapter**: 이미지 참조 기반 생성

**프롬프트 예시:**

```python
def generate_scene_image(scene: dict, style: str):
    # Stable Diffusion 예시
    prompt = f"""
    {style} style webtoon illustration,
    {scene['description']},
    characters: {', '.join(scene['characters'])},
    background: {', '.join(scene['background_keywords'])},
    emotion: {scene['emotion']},
    high quality, detailed, professional artwork
    """

    negative_prompt = "low quality, blurry, distorted, ugly"

    # API 호출 (예: Replicate)
    image_url = replicate.run(
        "stability-ai/sdxl",
        input={
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "width": 768,
            "height": 1024
        }
    )

    return image_url
```

### 3. 감정 분석 AI

**접근 방법:**
1. **Transformer 기반 감정 분석 모델** (KoBERT, KoELECTRA)
2. **Zero-shot Classification** (GPT-4)
3. **Rule-based + ML 하이브리드**

**구현 예시:**

```python
from transformers import pipeline

def analyze_dream_emotions(dream_content: str):
    # 사전학습된 감정 분석 모델 사용
    classifier = pipeline(
        "text-classification",
        model="beomi/KcELECTRA-base-v2022"
    )

    # 또는 GPT-4로 더 정교한 분석
    emotions = {
        "joy": 0,
        "anxiety": 0,
        "anger": 0,
        "sadness": 0,
        "surprise": 0,
        "peace": 0
    }

    # 프롬프트로 감정 점수화
    prompt = f"""
    다음 꿈 내용을 분석하여 각 감정의 강도를 0-100점으로 평가해주세요:
    - 기쁨 (joy)
    - 불안 (anxiety)
    - 분노 (anger)
    - 슬픔 (sadness)
    - 놀람 (surprise)
    - 평온 (peace)

    꿈 내용: {dream_content}

    JSON 형식으로 응답해주세요.
    """

    # GPT-4 호출
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )

    return json.loads(response.choices[0].message.content)
```

### 4. Dream Health Index 계산

```python
def calculate_dream_health_index(user_dreams: list):
    """
    최근 2주-1달 간의 꿈을 분석하여 건강 지수 계산
    """
    # 최근 30일 꿈 필터링
    recent_dreams = filter_recent_dreams(user_dreams, days=30)

    # 1. 스트레스 지수 (악몽 빈도, 긴장도 평균)
    nightmare_ratio = sum(1 for d in recent_dreams if d.is_nightmare) / len(recent_dreams)
    avg_tension = sum(d.tension_level for d in recent_dreams) / len(recent_dreams)
    stress_level = (nightmare_ratio * 50 + avg_tension * 0.5)

    # 2. 불안 지수 (불안 감정 평균)
    avg_anxiety = sum(d.emotions['anxiety'] for d in recent_dreams) / len(recent_dreams)
    anxiety_level = avg_anxiety

    # 3. 정서 회복력 (해결 구조 비율, 통제감 평균)
    resolution_ratio = sum(1 for d in recent_dreams if d.has_resolution) / len(recent_dreams)
    avg_control = sum(d.control_level for d in recent_dreams) / len(recent_dreams)
    emotional_resilience = (resolution_ratio * 50 + avg_control * 0.5)

    # 4. 수면의 질 (평온 감정, 악몽 반비례)
    avg_peace = sum(d.emotions['peace'] for d in recent_dreams) / len(recent_dreams)
    sleep_quality = avg_peace * (1 - nightmare_ratio)

    return {
        "stress_level": stress_level,
        "anxiety_level": anxiety_level,
        "emotional_resilience": emotional_resilience,
        "sleep_quality": sleep_quality,
        "nightmare_ratio": nightmare_ratio
    }
```

### 5. 음성-텍스트 변환

**사용 가능한 API:**
- OpenAI Whisper
- Google Speech-to-Text
- AWS Transcribe
- Naver Clova Speech

**구현 예시:**

```python
from openai import OpenAI

def transcribe_voice(audio_file_path: str):
    client = OpenAI(api_key="your-api-key")

    with open(audio_file_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language="ko"  # 한국어 지정
        )

    return transcription.text
```

---

## 프론트엔드 연동

### 1. API 서비스 구현

[src/services/api.ts](src/services/api.ts) 파일에서 실제 API 호출 구현:

```typescript
// 예시: 꿈 생성
export const dreamAPI = {
  createDream: async (data: DreamInputForm): Promise<DreamEntry> => {
    const response = await fetch(`${API_BASE_URL}/dreams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to create dream')
    }

    return response.json()
  }
}
```

### 2. 커스텀 훅 수정

[src/hooks/useDreams.ts](src/hooks/useDreams.ts)에서 Mock 데이터 대신 실제 API 호출:

```typescript
useEffect(() => {
  const loadInitialData = async () => {
    setLoading(true)
    try {
      const dreams = await dreamAPI.getAllDreams(userId)
      const profile = await userAPI.getProfile(userId)

      setDreams(dreams)
      setUserProfile(profile)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  loadInitialData()
}, [])
```

### 3. 음성 녹음 기능 구현

```typescript
// src/hooks/useVoiceRecorder.ts
export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorderRef.current = mediaRecorder

    const chunks: BlobPart[] = []
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      setAudioBlob(blob)
    }

    mediaRecorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  return { isRecording, audioBlob, startRecording, stopRecording }
}
```

---

## 배포

### 1. 프론트엔드 배포 (Vercel)

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 2. 백엔드 배포 옵션

#### Option A: AWS EC2 + Docker
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Option B: Railway / Render
- GitHub 연동으로 자동 배포
- 환경변수 설정
- DB 연결

### 3. 이미지 저장소

**AWS S3 설정:**
```typescript
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-northeast-2'
})

export async function uploadImage(file: Buffer, filename: string) {
  const params = {
    Bucket: 'dreamtoon-lab-images',
    Key: filename,
    Body: file,
    ContentType: 'image/png',
    ACL: 'public-read'
  }

  const result = await s3.upload(params).promise()
  return result.Location
}
```

---

## 다음 단계

1. **백엔드 API 개발 시작**
   - Node.js/Express 또는 FastAPI 선택
   - 기본 CRUD API 구현
   - 인증 시스템 구축

2. **AI 통합**
   - OpenAI API 키 발급
   - 장면 분해 프롬프트 최적화
   - 이미지 생성 API 선택 및 테스트

3. **데이터베이스 설정**
   - PostgreSQL 또는 MongoDB 선택
   - 스키마 구현
   - 마이그레이션 스크립트

4. **프론트엔드-백엔드 연동**
   - API 서비스 구현
   - 에러 처리 개선
   - 로딩 상태 UX 향상

5. **테스트 및 최적화**
   - 성능 테스트
   - 보안 점검
   - 사용자 피드백 수집

---

궁금한 점이 있으면 이슈를 등록해주세요!
