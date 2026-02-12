import { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { Mic, Type, Sparkles, Loader2 } from "lucide-react";
import { useDreamStore } from "@/store/useDreamStore";
import { DreamStyle, EmotionType } from "@/types";
import { useNavigate } from "react-router-dom";
import { createDreamWithWebtoon } from "@/services/openai";

const styleOptions: {
  value: DreamStyle;
  label: string;
  description: string;
}[] = [
  { value: "romance", label: "로맨스", description: "설레는 사랑 이야기" },
  { value: "school", label: "학원물", description: "청춘의 한 페이지" },
  {
    value: "dark-fantasy",
    label: "다크 판타지",
    description: "어두운 환상의 세계",
  },
  { value: "healing", label: "힐링", description: "따뜻하고 평온한 분위기" },
  { value: "comedy", label: "코미디", description: "유쾌하고 재미있는 이야기" },
  { value: "horror", label: "호러", description: "무서운 꿈도 예술로" },
];

const emotionOptions: { value: EmotionType; label: string; emoji: string }[] = [
  { value: "joy", label: "기쁨", emoji: "😊" },
  { value: "anxiety", label: "불안", emoji: "😰" },
  { value: "anger", label: "분노", emoji: "😠" },
  { value: "sadness", label: "슬픔", emoji: "😢" },
  { value: "surprise", label: "놀람", emoji: "😲" },
  { value: "peace", label: "평온", emoji: "😌" },
];

// Memoized 스타일 선택 카드
const StyleCard = memo(
  ({
    style,
    isSelected,
    onClick,
  }: {
    style: (typeof styleOptions)[0];
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all text-left ${
        isSelected
          ? "border-purple-500 bg-purple-50"
          : "border-gray-200 hover:border-purple-300"
      }`}
    >
      <div className="font-semibold mb-1">{style.label}</div>
      <div className="text-sm text-gray-600">{style.description}</div>
    </motion.button>
  ),
);

StyleCard.displayName = "StyleCard";

export default function DreamInputPage() {
  const navigate = useNavigate();
  const { addDream } = useDreamStore();
  const [inputMode, setInputMode] = useState<"text" | "voice">("text");
  const [isLoading, setIsLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    characters: "",
    location: "",
    mainEmotion: "peace" as EmotionType,
    lastScene: "",
    style: "healing" as DreamStyle,
  });

  // useCallback으로 함수 메모이제이션
  const handleInputChange = useCallback(
    (field: string, value: string | EmotionType | DreamStyle) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgressMessage("꿈 내용 분석 중...");

    try {
      // OpenAI API로 꿈 분석 + 웹툰 이미지 생성
      const dreamInput = {
        title: formData.title,
        content: formData.content,
        characters: formData.characters
          ? formData.characters.split(",").map((s) => s.trim())
          : undefined,
        location: formData.location
          ? formData.location.split(",").map((s) => s.trim())
          : undefined,
        mainEmotion: formData.mainEmotion,
        lastScene: formData.lastScene || undefined,
        style: formData.style,
      };

      const analyzed = await createDreamWithWebtoon(
        dreamInput,
        (step, progress) => {
          setProgressMessage(step);
          console.log(`${step} - ${progress}%`);
        },
      );

      // 생성된 꿈 데이터 저장
      const newDream = {
        id: Date.now().toString(),
        userId: "user-1",
        title: formData.title,
        content: formData.content,
        recordedAt: new Date(),
        createdAt: new Date(),
        inputMethod: inputMode,
        style: formData.style,
        scenes: analyzed.scenes || [],
        analysis: analyzed.analysis || {
          emotions: {
            joy: 0,
            anxiety: 0,
            anger: 0,
            sadness: 0,
            surprise: 0,
            peace: 0,
          },
          tensionLevel: 0,
          controlLevel: 0,
          isNightmare: false,
          repeatingSymbols: [],
          relationshipPatterns: [],
          hasResolution: true,
        },
        webtoonUrl: analyzed.webtoonUrl,
        tags: analyzed.tags || [],
        isFavorite: false,
      };

      addDream(newDream);
      setIsLoading(false);
      setProgressMessage("");
      navigate(`/webtoon/${newDream.id}`);
    } catch (error) {
      console.error("꿈 생성 실패:", error);
      alert(
        `웹툰 생성에 실패했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      );
      setIsLoading(false);
      setProgressMessage("");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            <span className="dream-text-gradient">꿈 기록하기</span>
          </h1>
          <p className="text-gray-600">
            당신의 꿈을 입력하면 AI가 멋진 웹툰으로 만들어드립니다
          </p>
        </motion.div>

        {/* Input Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect p-6 rounded-2xl mb-8"
        >
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setInputMode("text")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                inputMode === "text"
                  ? "dream-gradient text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Type className="w-5 h-5 inline mr-2" />
              텍스트로 입력
            </button>
            <button
              onClick={() => setInputMode("voice")}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                inputMode === "voice"
                  ? "dream-gradient text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Mic className="w-5 h-5 inline mr-2" />
              음성으로 입력
            </button>
          </div>

          {inputMode === "voice" && (
            <div className="text-center py-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-24 h-24 rounded-full dream-gradient flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <Mic className="w-10 h-10 text-white" />
              </motion.button>
              <p className="text-gray-600">녹음 버튼을 눌러 꿈을 말해주세요</p>
              <p className="text-sm text-gray-500 mt-2">
                (음성 입력 기능은 API 연동 후 사용 가능합니다)
              </p>
            </div>
          )}

          {inputMode === "text" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  꿈 제목
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="예: 하늘을 나는 꿈"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  꿈 내용
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="꿈에서 무슨 일이 있었나요? 자세히 적어주세요..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                  required
                />
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  웹툰 스타일
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {styleOptions.map((style) => (
                    <StyleCard
                      key={style.value}
                      style={style}
                      isSelected={formData.style === style.value}
                      onClick={() => handleInputChange("style", style.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Emotion */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  주요 감정
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {emotionOptions.map((emotion) => (
                    <button
                      key={emotion.value}
                      type="button"
                      onClick={() =>
                        handleInputChange("mainEmotion", emotion.value)
                      }
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.mainEmotion === emotion.value
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{emotion.emoji}</div>
                      <div className="text-xs">{emotion.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className="w-full py-4 rounded-lg dream-gradient text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                      웹툰 생성 중...
                    </div>
                    {progressMessage && (
                      <div className="text-sm mt-2 opacity-90">
                        {progressMessage}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 inline mr-2" />
                    웹툰으로 만들기
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
