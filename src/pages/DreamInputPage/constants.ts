import { EmotionType } from "@/types";

export const STANDARD_FILTERS = [
  {
    id: "custom",
    label: "맞춤형 필터",
    desc: "AI가 자동으로 선택",
    isPremium: false,
  },
];

export const PREMIUM_FILTERS = [
  { id: "ghibli", label: "지브리", desc: "몽글몽글한 감성", isPremium: true },
  {
    id: "marvel",
    label: "마블",
    desc: "히어로 코믹스 스타일",
    isPremium: true,
  },
  { id: "lego", label: "레고", desc: "귀여운 블록 세계", isPremium: true },
  {
    id: "animal-crossing",
    label: "모동숲",
    desc: "포근한 동물의 숲",
    isPremium: true,
  },
];

export const EMOTION_MAP: Record<string, EmotionType> = {
  기쁨: "joy",
  기뻐: "joy",
  좋아: "joy",
  즐거: "joy",
  불안: "anxiety",
  걱정: "anxiety",
  무서: "anxiety",
  분노: "anger",
  화: "anger",
  짜증: "anger",
  슬픔: "sadness",
  슬퍼: "sadness",
  우울: "sadness",
  놀람: "surprise",
  놀라: "surprise",
  깜짝: "surprise",
  평온: "peace",
  편안: "peace",
  차분: "peace",
  고요: "peace",
};

export const EMOTION_REACTIONS: Record<EmotionType, string> = {
  joy: "좋은 꿈을 꾸셨군요! 어떤 점이 가장 즐거우셨나요?",
  anxiety: "저런, 마음이 많이 쓰이셨겠어요. 무엇 때문에 불안하셨나요?",
  anger: "화가 나는 일이 있었군요. 꿈속에서 무슨 일이 있었는지 말씀해 주실래요?",
  sadness: "슬픈 꿈이었군요... 괜찮으시다면 이야기를 더 들려주시겠어요?",
  surprise: "깜짝 놀라셨군요! 어떤 장면이 가장 기억에 남으세요?",
  peace: "편안한 꿈이라 다행이에요. 어떤 풍경이 펼쳐졌나요?",
};
