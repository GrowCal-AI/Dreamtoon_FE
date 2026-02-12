import { DreamEntry, DreamInputForm, DreamScene, EmotionType } from "@/types";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error(
    "⚠️ OPENAI_API_KEY가 설정되지 않았습니다. .env 파일을 확인하세요.",
  );
}

// OpenAI API 호출 헬퍼
async function callOpenAI(endpoint: string, body: any) {
  const response = await fetch(`https://api.openai.com/v1${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `OpenAI API Error: ${error.error?.message || response.statusText}`,
    );
  }

  return response.json();
}

/**
 * 1. 꿈 내용 분석 - GPT-4로 감정, 장면, 상징 추출
 */
export async function analyzeDream(
  dreamInput: DreamInputForm,
): Promise<Partial<DreamEntry>> {
  const systemPrompt = `당신은 꿈 분석 전문가입니다. 
사용자의 꿈 내용을 분석하여 다음을 JSON 형식으로 추출하세요:

1. 꿈을 3-5개의 주요 장면(scenes)으로 분할
2. 각 장면마다:
   - sceneNumber: 장면 번호 (1부터 시작)
   - description: 장면 설명 (50자 이내)
   - characters: 등장인물 배열
   - emotion: 주요 감정 (joy/anxiety/anger/sadness/surprise/peace 중 하나)
   - backgroundKeywords: 배경 키워드 배열 (3-5개)
   - narration: 내레이션 (한 문장)
   - dialogue: 대화가 있다면 [{character: "이름", text: "대사"}] 형식
3. 전체 꿈의 감정 분석 (emotions): {joy: 0-100, anxiety: 0-100, ...}
4. tensionLevel: 긴장도 (0-100)
5. controlLevel: 제어 수준 (0-100, 루시드 드림 정도)
6. isNightmare: 악몽 여부 (true/false)
7. repeatingSymbols: 반복되는 상징 배열
8. relationshipPatterns: 관계 패턴 배열
9. hasResolution: 해결 구조 여부

응답은 반드시 유효한 JSON만 출력하세요.`;

  const userPrompt = `꿈 제목: ${dreamInput.title}
꿈 내용: ${dreamInput.content}
스타일: ${dreamInput.style}
${dreamInput.mainEmotion ? `주요 감정: ${dreamInput.mainEmotion}` : ""}
${dreamInput.characters ? `등장인물: ${dreamInput.characters.join(", ")}` : ""}
${dreamInput.location ? `장소: ${dreamInput.location.join(", ")}` : ""}`;

  try {
    const result = await callOpenAI("/chat/completions", {
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const analysis = JSON.parse(result.choices[0].message.content);

    return {
      scenes: analysis.scenes.map((scene: any, index: number) => ({
        id: `s${index + 1}`,
        sceneNumber: scene.sceneNumber || index + 1,
        description: scene.description,
        characters: scene.characters || [],
        emotion: scene.emotion as EmotionType,
        backgroundKeywords: scene.backgroundKeywords || [],
        narration: scene.narration,
        dialogue: scene.dialogue,
      })) as DreamScene[],
      analysis: {
        emotions: analysis.emotions,
        tensionLevel: analysis.tensionLevel,
        controlLevel: analysis.controlLevel,
        isNightmare: analysis.isNightmare,
        repeatingSymbols: analysis.repeatingSymbols || [],
        relationshipPatterns: analysis.relationshipPatterns || [],
        hasResolution: analysis.hasResolution,
      },
      tags: analysis.repeatingSymbols?.slice(0, 5) || [],
    };
  } catch (error) {
    console.error("꿈 분석 실패:", error);
    throw error;
  }
}

/**
 * 2. 웹툰 이미지 생성 - DALL-E 3로 각 장면 이미지 생성
 */
export async function generateWebtoonImage(
  scene: DreamScene,
  style: string,
): Promise<string> {
  // 스타일별 프롬프트 접두사
  const stylePrompts: Record<string, string> = {
    romance:
      "Romantic webtoon style, soft colors, beautiful lighting, shoujo manga aesthetic",
    school: "School life webtoon, Korean manhwa style, vibrant and youthful",
    "dark-fantasy":
      "Dark fantasy webtoon, dramatic shadows, epic atmosphere, detailed background",
    healing:
      "Healing webtoon style, warm colors, peaceful and comforting mood, soft illustration",
    comedy:
      "Comedy webtoon style, exaggerated expressions, bright and cheerful, funny atmosphere",
    horror:
      "Horror webtoon, dark and eerie, creepy atmosphere, Korean horror manhwa style",
  };

  const stylePrefix = stylePrompts[style] || "Webtoon style illustration";

  const prompt = `${stylePrefix}. Scene: ${scene.description}. 
Characters: ${scene.characters.join(", ")}. 
Background: ${scene.backgroundKeywords.join(", ")}. 
Mood: ${scene.emotion}. 
High quality, detailed, professional webtoon art, vertical composition.`;

  try {
    const result = await callOpenAI("/images/generations", {
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return result.data[0].url;
  } catch (error) {
    console.error("이미지 생성 실패:", error);
    throw error;
  }
}

/**
 * 3. 모든 장면에 대해 이미지 생성 (순차적으로)
 */
export async function generateAllSceneImages(
  scenes: DreamScene[],
  style: string,
  onProgress?: (current: number, total: number) => void,
): Promise<DreamScene[]> {
  const updatedScenes: DreamScene[] = [];

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    onProgress?.(i + 1, scenes.length);

    try {
      const imageUrl = await generateWebtoonImage(scene, style);
      updatedScenes.push({ ...scene, imageUrl });
    } catch (error) {
      console.error(`장면 ${i + 1} 이미지 생성 실패:`, error);
      // 실패해도 계속 진행
      updatedScenes.push(scene);
    }

    // Rate limit 방지 (DALL-E 3는 분당 5개 제한)
    if (i < scenes.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 12000)); // 12초 대기
    }
  }

  return updatedScenes;
}

/**
 * 4. 음성 → 텍스트 변환 - Whisper API
 */
export async function transcribeAudio(audioFile: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", audioFile);
  formData.append("model", "whisper-1");
  formData.append("language", "ko"); // 한국어 지정

  try {
    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Whisper API Error: ${error.error?.message || response.statusText}`,
      );
    }

    const result = await response.json();
    return result.text;
  } catch (error) {
    console.error("음성 변환 실패:", error);
    throw error;
  }
}

/**
 * 5. 전체 프로세스: 꿈 입력 → 분석 → 이미지 생성
 */
export async function createDreamWithWebtoon(
  dreamInput: DreamInputForm,
  onProgress?: (step: string, progress: number) => void,
): Promise<Partial<DreamEntry>> {
  try {
    // Step 1: 꿈 분석
    onProgress?.("꿈 내용 분석 중...", 20);
    const analyzed = await analyzeDream(dreamInput);

    // Step 2: 이미지 생성
    onProgress?.("웹툰 이미지 생성 중...", 40);
    const scenesWithImages = await generateAllSceneImages(
      analyzed.scenes!,
      dreamInput.style,
      (current, total) => {
        const imageProgress = 40 + (current / total) * 50;
        onProgress?.(`이미지 생성 중 (${current}/${total})`, imageProgress);
      },
    );

    onProgress?.("완료!", 100);

    return {
      ...analyzed,
      scenes: scenesWithImages,
      webtoonUrl: `/webtoons/${Date.now()}`, // 임시 URL
    };
  } catch (error) {
    console.error("꿈 웹툰 생성 실패:", error);
    throw error;
  }
}

/**
 * 6. 건강 지수 분석 - 누적된 꿈 데이터 분석
 */
export async function analyzeDreamHealth(dreams: DreamEntry[]) {
  if (dreams.length === 0) {
    return null;
  }

  const systemPrompt = `당신은 심리 분석 전문가입니다. 사용자의 꿈 기록을 분석하여 정신 건강 지표를 계산하세요.
다음 지표를 0-100 사이의 숫자로 반환하세요:
- stressLevel: 스트레스 수준 (높을수록 스트레스 많음)
- anxietyLevel: 불안 수준
- emotionalResilience: 감정 회복탄력성 (높을수록 좋음)
- relationshipStress: 관계 스트레스
- sleepQuality: 수면 품질 (높을수록 좋음)
- nightmareRatio: 악몽 비율 (0-1)
- insights: 인사이트 배열

JSON 형식으로만 응답하세요.`;

  const dreamSummary = dreams.map((d) => ({
    title: d.title,
    emotions: d.analysis.emotions,
    isNightmare: d.analysis.isNightmare,
    tensionLevel: d.analysis.tensionLevel,
    symbols: d.analysis.repeatingSymbols,
  }));

  try {
    const result = await callOpenAI("/chat/completions", {
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(dreamSummary) },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(result.choices[0].message.content);
  } catch (error) {
    console.error("건강 지수 분석 실패:", error);
    throw error;
  }
}
