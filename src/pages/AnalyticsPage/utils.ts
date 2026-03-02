export const getInsight = (stress: number, emotions: any) => {
  const dominantEmotion = Object.keys(emotions).reduce((a, b) =>
    emotions[a] > emotions[b] ? a : b,
  ) as string;
  const stressLevel = stress >= 70 ? "High" : stress >= 40 ? "Mid" : "Low";

  // Logic Mapping Table
  if (stressLevel === "High" && dominantEmotion === "anxiety") {
    return {
      message:
        "현재 마음속에 막연한 **불안감**이 가득 차 있어요. 통제하기 힘든 상황에 대한 압박감이 꿈으로 나타나고 있습니다.",
      action: "자기 전 10분, 걱정 기록하기 (Worry Time)",
      tone: "공감, 위로",
    };
  }
  if (stressLevel === "High" && dominantEmotion === "anger") {
    return {
      message:
        "억눌린 **감정의 폭발**이 감지됩니다. 현실에서 표현하지 못한 답답함이 꿈속에서 표출되고 있어요.",
      action: "안전하게 감정 배출하기 (글쓰기, 운동)",
      tone: "직관, 해소",
    };
  }
  if (stressLevel === "Mid" && dominantEmotion === "sadness") {
    return {
      message:
        "**마음의 감기**가 지나가는 중이에요. 상실감이나 아쉬움이 꿈에 묻어납니다. 스스로를 토닥여줄 시간이 필요해요.",
      action: "따뜻한 카모마일 차 마시기",
      tone: "부드러움, 치유",
    };
  }
  if (stressLevel === "Low" && dominantEmotion === "peace") {
    return {
      message:
        "무의식이 매우 **안정된 상태**입니다. 정서 회복력이 훌륭해요! 지금의 평화로운 리듬을 유지하세요.",
      action: "현재의 감정 상태 일기로 남기기",
      tone: "칭찬, 긍정",
    };
  }
  if (stressLevel === "Low" && dominantEmotion === "joy") {
    return {
      message:
        "**긍정 에너지**가 넘치시네요! 꿈속에서도 활력이 느껴집니다. 이 좋은 기운을 현실에서도 마음껏 펼쳐보세요.",
      action: "새로운 취미나 도전 시작하기",
      tone: "활기, 격려",
    };
  }
  if (dominantEmotion === "surprise") {
    return {
      message:
        "변화에 대한 **긴장감**이 감지됩니다. 낯선 환경이나 새로운 도전을 앞두고 있진 않으신가요?",
      action: "예상되는 상황 미리 시뮬레이션 해보기",
      tone: "호기심",
    };
  }

  // Default (Balanced)
  return {
    message:
      "감정의 **균형이 잘 잡혀** 있습니다. 특별히 치우침 없이 건강한 무의식 흐름을 보이고 있어요.",
    action: "가벼운 산책으로 리프레시하기",
    tone: "차분함",
  };
};
