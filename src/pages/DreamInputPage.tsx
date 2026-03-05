import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Mic, Send, Loader2, Sparkles } from "lucide-react";
import PricingPage from "@/pages/PricingPage";
import GenerationResult from "@/components/common/GenerationResult";
import { EmotionChip, AnalysisDashboard, StyleCard } from "@/components/features/dream";
import { SubscriptionPrompt } from "@/pages/DreamInputPage/components/SubscriptionPrompt";
import { STANDARD_FILTERS, PREMIUM_FILTERS, EMOTION_MAP, EMOTION_REACTIONS } from "@/pages/DreamInputPage/constants";

import { useChatStore } from "@/store/useChatStore";
import { useDreamStore } from "@/store/useDreamStore";
import { useAuthStore } from "@/store/useAuthStore";
import LoginModal from "@/components/common/LoginModal";
import { EmotionType, DreamStyle } from "@/types";
import { dreamAPI } from "@/services/api";
import { trialTracker } from "@/utils/trialTracker";

// --- Main Page ---

export default function DreamInputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // initialMessage(홈페이지 입력)를 저장 - 입력칸에는 표시하지 않음
  const initialDreamRef = useRef<string>("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"style" | "deep_chat">("style");
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // State for pending save actions
  const [pendingSave, setPendingSave] = useState(false);
  const [createdDreamId, setCreatedDreamId] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [, setVoiceFlowStep] = useState(0); // voice-flow 내부 단계 (읽기는 미사용, 향후 UI 표시용)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVoiceModeRef = useRef(false); // state와 별개로 콜백 체인에서 즉시 읽을 수 있는 ref
  const initializedRef = useRef(false);

  const { addDream, updateDream } = useDreamStore();
  const { isLoggedIn, user, login, checkSaveLimit } = useAuthStore();

  const {
    step,
    messages,
    addMessage,
    setStep,
    selectEmotion,
    setDreamContent,
    dreamContent,
    realLifeContext,
    setRealLifeContext,
    isAnalyzing,
    setIsAnalyzing,
    selectStyle,
    selectedStyle,
    selectFormat,
    isGenerating,
    setIsGenerating,
    isSaved,
    setIsSaved,
    showPremiumModal,
    setShowPremiumModal,
    reset,
  } = useChatStore();

  // Auto-scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step, isAnalyzing, isGenerating]);

  // Unmount cleanup: 페이지를 벗어날 때 음성/TTS 완전 종료
  useEffect(() => {
    return () => {
      isVoiceModeRef.current = false;
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // TTS: AI 메시지를 음성으로 읽어줌
  const speakText = (text: string, onEnd?: () => void) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ko-KR";
    utter.rate = 1.0;
    if (onEnd) utter.onend = onEnd;
    window.speechSynthesis.speak(utter);
  };

  // stale closure 방지: 항상 최신 함수를 가리키는 ref
  const startVoiceStepRef = useRef<(vStep: number) => void>(() => {});
  const startVoiceListeningRef = useRef<(vStep: number) => void>(() => {});
  const handleVoiceFlowResultRef = useRef<
    (vStep: number, spoken: string) => void
  >(() => {});

  // Voice-flow: 음성 인식 시작 (2초 침묵 → 자동 다음 단계)
  const startVoiceListening = (vStep: number) => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: any = new SpeechRecognitionAPI();
    recognition.lang = "ko-KR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    let finalText = "";
    let hadError = false;

    const resetTimer = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
      }, 5000);
    };

    recognition.onstart = () => {
      setIsRecording(true);
      resetTimer();
    };

    recognition.onresult = (event: any) => {
      resetTimer();
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t;
        else interim += t;
      }
      const preview = (finalText + interim).trim();
      if (vStep === 3) setRealLifeContext(preview);
      else setDreamContent(preview);
    };

    recognition.onend = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setIsRecording(false);
      recognitionRef.current = null;

      if (!isVoiceModeRef.current || hadError) return;

      const spoken = finalText.trim();
      // ref를 통해 항상 최신 handleVoiceFlowResult 호출
      handleVoiceFlowResultRef.current(vStep, spoken);
    };

    recognition.onerror = (event: any) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      hadError = true;
      setIsRecording(false);
      if (event.error === "no-speech") {
        // 음성 없음 → voice-flow 종료 (onend에서도 hadError로 막힘)
        isVoiceModeRef.current = false;
        setIsVoiceMode(false);
        setVoiceFlowStep(0);
        window.speechSynthesis.cancel();
      } else if (event.error !== "aborted") {
        addMessage({
          role: "ai",
          content: "음성 인식에 실패했어요. 다시 시도해 주세요.",
          type: "text",
        });
      }
    };

    recognition.start();
  };
  startVoiceListeningRef.current = startVoiceListening;

  // Voice-flow: 단계별 AI 질문 + 음성 입력 받기
  // vStep: 0=꿈내용, 1=감정, 2=꿈상세, 3=현실고민
  const startVoiceStep = (vStep: number) => {
    setVoiceFlowStep(vStep);

    const questions = [
      "꿈을 말씀해 주세요.",
      "감정을 말씀해 주세요. 기쁨, 불안, 분노, 슬픔, 놀람, 평온 중 하나요.",
      "더 자세히 이야기해 주세요.",
      "현실 고민이 있으신가요? 없으면 없다고 해주세요.",
    ];

    addMessage({ role: "ai", content: questions[vStep], type: "text" });

    speakText(questions[vStep], () => {
      // ref를 통해 항상 최신 startVoiceListening 호출
      startVoiceListeningRef.current(vStep);
    });
  };
  startVoiceStepRef.current = startVoiceStep;

  // Voice-flow: 각 단계 결과 처리 → 다음 단계 진행
  const handleVoiceFlowResult = (vStep: number, spoken: string) => {
    if (!spoken) {
      // 5초간 음성 입력 없음 → 음성 대화 완전 종료
      isVoiceModeRef.current = false;
      setIsVoiceMode(false);
      setVoiceFlowStep(0);
      setIsRecording(false);
      window.speechSynthesis.cancel();
      return;
    }

    if (vStep === 0) {
      addMessage({ role: "user", content: spoken, type: "text" });
      setDreamContent(spoken);
      setTimeout(() => startVoiceStepRef.current(1), 300);
    } else if (vStep === 1) {
      const matched = Object.entries(EMOTION_MAP).find(([k]) =>
        spoken.includes(k),
      );
      const emotion: EmotionType = matched ? matched[1] : "peace";

      addMessage({ role: "user", content: spoken, type: "text" });
      selectEmotion(emotion);
      setDreamContent("");

      const reaction = getEmotionReaction(emotion);
      setTimeout(() => {
        addMessage({ role: "ai", content: reaction, type: "text" });
        setStep(2);
        setTimeout(() => startVoiceStepRef.current(2), 600);
      }, 300);
    } else if (vStep === 2) {
      addMessage({ role: "user", content: spoken, type: "text" });
      setTimeout(() => startVoiceStepRef.current(3), 300);
    } else if (vStep === 3) {
      const skipped =
        spoken.includes("없") ||
        spoken.includes("괜찮") ||
        spoken.includes("건너");
      const context = skipped ? "" : spoken;
      addMessage({
        role: "user",
        content: skipped ? "건너뛸게요" : spoken,
        type: "text",
      });
      setRealLifeContext(context);
      isVoiceModeRef.current = false;
      setIsVoiceMode(false);
      setVoiceFlowStep(0);
      setTimeout(() => handleRealLifeSubmit(), 300);
    }
  };
  handleVoiceFlowResultRef.current = handleVoiceFlowResult;

  // 페이지 접근 권한 체크
  useEffect(() => {
    const isTrial = (location.state as any)?.isTrial || false;

    const checkAccess = async () => {
      // 로그인 사용자는 항상 허용
      if (isLoggedIn) return;

      // 비로그인 + 체험 모드 허용
      if (isTrial) return;

      // 비로그인 + 체험 모드 아님 → 체험 가능 횟수 체크
      const canTrial = await trialTracker.canTrial();
      if (!canTrial) {
        // 체험 불가능하면 홈으로 리다이렉트
        navigate('/', { replace: true });
      }
    };

    checkAccess();
  }, [isLoggedIn, location.state, navigate]);

  // Initial Greeting and handle initial message from HomePage
  useEffect(() => {
    const initialMessage = (location.state as any)?.initialMessage;
    const voiceMode = (location.state as any)?.voiceMode;

    if (!initializedRef.current) {
      initializedRef.current = true;
      reset();
      setTimeout(() => {
        if (voiceMode) {
          // 홈 마이크 진입: voice-flow 모드
          isVoiceModeRef.current = true;
          setIsVoiceMode(true);
          setStep(1);
          startVoiceStep(0);
        } else if (initialMessage) {
          initialDreamRef.current = initialMessage; // 분석용으로 저장, 입력칸에는 표시 안 함
          addMessage({ role: "user", content: initialMessage, type: "text" });
          addMessage({
            role: "ai",
            content: `"${initialMessage}" 꿈에서 느낀 감정을 선택해주세요.`,
            type: "text",
          });
          setStep(1);
        } else {
          addMessage({
            role: "ai",
            content:
              "안녕하세요! 어젯밤 꾸셨던 꿈은 어떠셨나요? 가장 먼저 떠오르는 감정을 알려주세요.",
            type: "text",
          });
          setStep(1);
        }
      }, 500);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEmotionClick = (emotion: EmotionType) => {
    selectEmotion(emotion);
    addMessage({
      role: "user",
      content: getEmotionLabel(emotion),
      type: "text",
    });

    setTimeout(() => {
      const reaction = getEmotionReaction(emotion);
      addMessage({ role: "ai", content: reaction, type: "text" });
      setStep(2); // 꿈 상세 설명 입력 단계
    }, 600);
  };

  // 자동 로그인: 토큰이 없거나 무효하면 새로 발급
  const ensureLoggedIn = async () => {
    if (useAuthStore.getState().isLoggedIn) return;
    await useAuthStore.getState().testLogin(1);
  };

  // step 2: 꿈 상세 설명 제출 → step 3(현실 고민)으로 이동
  const handleDreamDetailSubmit = () => {
    // 입력칸이 비어있으면 initialDreamRef(홈 입력값) fallback 사용
    const content = dreamContent.trim() || initialDreamRef.current;
    if (!content) return;
    addMessage({ role: "user", content, type: "text" });
    initialDreamRef.current = ""; // 사용 후 clear
    setDreamContent("");
    setTimeout(() => {
      addMessage({
        role: "ai",
        content:
          "꿈 이야기를 들려주셔서 감사해요 🌙\n혹시 요즘 현실에서 고민하고 있는 일이 있나요? (선택사항이에요, 입력하지 않아도 됩니다)",
        type: "text",
      });
      setStep(3); // 현실 고민 입력 단계
    }, 400);
  };

  // step 3: 현실 고민 제출 → AI 분석 시작
  const handleRealLifeSubmit = async () => {
    const context = realLifeContext.trim();
    // 입력 없이 건너뛰기도 허용
    if (context) {
      addMessage({ role: "user", content: context, type: "text" });
    } else {
      addMessage({ role: "user", content: "건너뛸게요", type: "text" });
    }
    setRealLifeContext("");
    setIsAnalyzing(true);
    setStep(4); // 분석 중 단계 (기존 step 3 역할)

    // dreamContent는 handleDreamDetailSubmit에서 이미 clear됐으므로
    // 마지막 user 메시지(꿈 상세)에서 내용 복원 ("건너뛸게요" 제외)
    const msgs = useChatStore.getState().messages;
    const dreamDetail =
      [...msgs]
        .reverse()
        .find(
          (m) =>
            m.role === "user" &&
            m.type === "text" &&
            m.content !== "건너뛸게요",
        )?.content || "나의 꿈";

    // 현실 고민은 BE에 별도 필드가 없으므로 content에 합산하여 전달
    const combinedContent = context
      ? `${dreamDetail}\n\n[현실 고민] ${context}`
      : dreamDetail;

    const emotion = useChatStore.getState().selectedEmotion;

    try {
      await ensureLoggedIn();

      // [방법 A] 한 번에 전송: title + content + emotion + selectedGenre
      const initResult = await dreamAPI.createDream({
        title: dreamDetail.slice(0, 50) || "나의 꿈",
        content: combinedContent,
        mainEmotion: emotion ?? "peace",
        style: "custom",
      });
      console.log("[handleRealLifeSubmit] initResult 전체:", initResult);
      const dreamId =
        initResult?.dreamId ??
        (initResult as any)?.id ??
        (initResult as any)?.dream_id;
      if (!dreamId) throw new Error("dreamId를 받지 못했습니다.");
      setCreatedDreamId(String(dreamId));

      // 분석 폴링
      const pollAnalysis = () =>
        new Promise<void>((resolve) => {
          const interval = setInterval(async () => {
            try {
              const analysis = await dreamAPI.getAnalysis(String(dreamId));
              if (
                analysis.status === "ANALYSIS_COMPLETED" ||
                analysis.status === "COMPLETED" ||
                analysis.status === "FAILED"
              ) {
                clearInterval(interval);
                if (analysis.status !== "FAILED") setAnalysisData(analysis);
                resolve();
              }
            } catch {
              clearInterval(interval);
              resolve();
            }
          }, 2000);
          setTimeout(() => {
            clearInterval(interval);
            resolve();
          }, 60000);
        });

      await pollAnalysis();

      setIsAnalyzing(false);
      addMessage({ role: "ai", content: "", type: "analysis" });

      setTimeout(() => {
        addMessage({
          role: "ai",
          content:
            "분석이 완료되었습니다! 어떤 필터로 4컷 웹툰을 그려드릴까요?",
          type: "text",
        });
        selectFormat("webtoon");
        setStep(5); // 필터 선택 (기존 step 4)
      }, 500);
    } catch (error: any) {
      console.error("Dream analysis failed:", error);
      setIsAnalyzing(false);

      const errCode = error?.response?.data?.code;
      const errStatus = error?.response?.status;

      if (errCode === "GENERATION_LIMIT_EXCEEDED" || errStatus === 429) {
        addMessage({
          role: "ai",
          content:
            "이번 달 꿈 생성 횟수를 모두 사용했어요. 더 많은 꿈을 기록하려면 구독 플랜을 업그레이드해 보세요!",
          type: "text",
        });
        setShowPremiumModal(true);
        setModalType("style");
      } else {
        addMessage({
          role: "ai",
          content: "분석 중 오류가 발생했습니다. 다시 시도해주세요.",
          type: "text",
        });
      }
      setStep(3);
    }
  };

  // 통합 submit 핸들러 (하단 input form에서 호출)
  const handleContentSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (step === 2) {
      handleDreamDetailSubmit();
    } else if (step === 3) {
      await handleRealLifeSubmit();
    }
  };

  // 스타일 선택 → BE 웹툰 생성 API 호출
  const handleStyleClick = async (style: {
    id: string;
    label: string;
    isPremium: boolean;
  }) => {
    if (style.isPremium && (!user || user.subscriptionTier === "free")) {
      setModalType("style");
      setShowPremiumModal(true);
      return;
    }

    setShowPremiumModal(false);
    selectStyle(style.id as DreamStyle);
    setIsGenerating(true);
    setStep(6);

    try {
      if (!createdDreamId) {
        throw new Error("dreamId가 없습니다. 꿈 내용을 먼저 입력해주세요.");
      }

      // Step 5: 웹툰 생성 요청 (비동기)
      await dreamAPI.generateWebtoon(createdDreamId, style.id);

      // 폴링: COMPLETED 될 때까지
      const pollInterval = setInterval(async () => {
        try {
          const dream = await dreamAPI.getDream(createdDreamId!);
          if (
            dream.processingStatus === "COMPLETED" ||
            dream.processingStatus === "FAILED"
          ) {
            clearInterval(pollInterval);
            // 중복 방지: 이미 존재하면 업데이트, 없으면 추가
            const existing = useDreamStore
              .getState()
              .dreams.find((d) => d.id === dream.id);
            if (existing) {
              updateDream(dream.id, dream);
            } else {
              addDream(dream);
            }
            setIsGenerating(false);
          }
        } catch {
          clearInterval(pollInterval);
          setIsGenerating(false);
        }
      }, 3000);

      setTimeout(() => {
        clearInterval(pollInterval);
        setIsGenerating(false);
      }, 120000);
    } catch (error: any) {
      console.error("Webtoon generation failed:", error);
      setIsGenerating(false);

      const errCode = error?.response?.data?.code;
      if (errCode === "PREMIUM_STYLE_NOT_ALLOWED") {
        addMessage({
          role: "ai",
          content:
            "프리미엄 스타일은 유료 구독자만 사용할 수 있어요. 구독 플랜을 확인해 보세요!",
          type: "text",
        });
        setShowPremiumModal(true);
        setModalType("style");
      } else {
        addMessage({
          role: "ai",
          content: "웹툰 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
          type: "text",
        });
      }
      setStep(5);
    }
  };

  const executeSave = async () => {
    if (isSaved) return;

    try {
      const canSave = checkSaveLimit();
      if (!canSave) {
        setModalType("style");
        setShowPremiumModal(true);
        return;
      }

      if (!createdDreamId) {
        alert("저장할 꿈 정보가 없습니다. 다시 시도해주세요.");
        return;
      }

      await dreamAPI.addToLibrary(createdDreamId);
      setIsSaved(true);
      setPendingSave(false);
    } catch (error: unknown) {
      console.error("Failed to save dream:", error);
      const message =
        (error as { response?: { status?: number } })?.response?.status === 401
          ? "로그인이 필요합니다. 로그인 후 다시 시도해주세요."
          : "라이브러리 저장에 실패했습니다. 다시 시도해주세요.";
      alert(message);
    }
  };

  const handleSaveDream = () => {
    if (!isLoggedIn) {
      setPendingSave(true);
      setIsLoginModalOpen(true);
      return;
    }
    executeSave();
  };

  // 마이크 버튼 → voice-flow 진입 (홈 마이크와 동일 동작)
  const handleMicToggle = () => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      addMessage({
        role: "ai",
        content:
          "이 브라우저는 음성 인식을 지원하지 않아요. Chrome을 사용해주세요.",
        type: "text",
      });
      return;
    }

    // voice-flow 모드 진입 (홈 마이크 진입과 동일)
    isVoiceModeRef.current = true;
    setIsVoiceMode(true);
    // 현재 step 위치에서 적절한 voice step으로 시작
    // step 1(감정) → vStep 0(꿈내용부터), step 2 이상 → vStep 2(상세)부터
    const currentStep = useChatStore.getState().step;
    const startVStep = currentStep <= 1 ? 0 : currentStep === 2 ? 2 : 3;
    startVoiceStepRef.current(startVStep);
  };

  const handleReset = () => {
    reset();
    navigate("/");
  };

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    // SubscriptionModal의 버튼 → PricingPage 모달 오픈
    setShowPremiumModal(false);
    setIsPricingModalOpen(true);
  };

  const handleLoginSuccess = () => {
    login();
    setIsLoginModalOpen(false);

    // Resume pending save
    if (pendingSave) {
      // Slight delay to ensure state update
      setTimeout(() => {
        executeSave();
      }, 100);
    }
  };

  // Render Generation View Full Screen or inside Chat?
  // User Prompt: "Loading State... 몽환적인 로딩 애니메이션... Result Display... 결과 카드 노출"
  // It implies replacing the chat view or overlaying.
  // Given "Step 6" logic, let's render it within the main container, perhaps replacing chat or scrolling to bottom.
  // The Prompt says: "Loading State: ... 즉시 홈으로 리다이렉트되는 대신... 로딩 애니메이션... 결과 카드... Card List below?"
  // Let's render Step 6 as a full view replacement or focused view.
  // Since it leads to "generation", let's make it fill the content area.

  if (step === 6) {
    return (
      <div className="h-screen bg-transparent relative overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center justify-center text-center min-h-screen ">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 animate-spin" />
                  <div className="absolute inset-4 rounded-full bg-purple-500/10 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    무의식을 그리는 중...
                  </h2>
                  <p className="text-gray-400">
                    당신의 꿈을 4컷 웹툰으로 변환하고 있어요
                  </p>
                </div>
              </motion.div>
            ) : (
              <GenerationResult
                key="result"
                title={
                  createdDreamId
                    ? useDreamStore
                        .getState()
                        .dreams.find((d) => d.id === createdDreamId)?.title ||
                      "나의 꿈"
                    : "나의 꿈"
                }
                date={new Date().toLocaleDateString()}
                mediaUrl={
                  createdDreamId
                    ? useDreamStore
                        .getState()
                        .dreams.find((d) => d.id === createdDreamId)
                        ?.webtoonUrl || ""
                    : ""
                }
                scenes={
                  createdDreamId
                    ? useDreamStore
                        .getState()
                        .dreams.find((d) => d.id === createdDreamId)?.scenes
                    : undefined
                }
                type="webtoon"
                dreamId={createdDreamId ?? undefined}
                onSave={handleSaveDream}
                onReset={handleReset}
                onTalkMore={() => {
                  const dreamTitle = createdDreamId
                    ? useDreamStore
                        .getState()
                        .dreams.find((d) => d.id === createdDreamId)?.title ||
                      "나의 꿈"
                    : "나의 꿈";
                  navigate("/dream-chat", {
                    state: { dreamId: createdDreamId, dreamTitle },
                  });
                }}
                isSaved={isSaved}
              />
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showPremiumModal && (
            <SubscriptionPrompt
              onClose={() => setShowPremiumModal(false)}
              onSubscribe={handleSubscribe}
              title={
                modalType === "style" ? (
                  <>
                    프리미엄 스타일로
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
                      꿈을 더 생생하게
                    </span>{" "}
                    그려보세요
                  </>
                ) : (
                  <>
                    당신의 무의식,
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
                      더 깊이 들여다볼까요?
                    </span>
                  </>
                )
              }
              description={
                modalType === "style" ? (
                  <>
                    지브리, 픽사, 시네마틱 실사 등<br />
                    고퀄리티 프리미엄 화풍은 구독 서비스를 통해
                    <br />
                    무제한으로 이용하실 수 있습니다.
                    <br />
                    <span className="font-semibold text-gray-800">
                      지금 바로 당신의 꿈을 영화처럼 만들어보세요!
                    </span>
                  </>
                ) : (
                  <>
                    AI 심리 전문가와 함께하는 1:1 심층 코칭은
                    <br />
                    프리미엄 전용 서비스입니다. 무의식의 진짜 의미를 분석하고
                    <br />
                    현실의 고민을 해결하는 맞춤형 가이드를 받아보세요.
                  </>
                )
              }
              benefits={
                modalType === "style"
                  ? [
                      "✨ 고해상도 렌더링",
                      "🎨 프리미엄 전용 화풍 10종",
                      "🚫 워터마크 제거",
                    ]
                  : [
                      "🧠 현실 기반 심층 분석",
                      "📝 개인 맞춤형 액션 플랜",
                      "💬 무제한 대화 기능",
                    ]
              }
              buttonText={
                modalType === "style"
                  ? "구독하고 프리미엄 스타일로 시작하기"
                  : "구독하고 심층 대화 시작하기"
              }
            />
          )}
        </AnimatePresence>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        <AnimatePresence>
          {isPricingModalOpen && (
            <PricingPage isModal onClose={() => setIsPricingModalOpen(false)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- Normal Chat View ---

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide space-y-6 pt-24 pb-32">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} ${messages.indexOf(msg) === 0 ? "mt-4" : ""}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                msg.role === "user"
                  ? "bg-[#2D2A4A] border border-white/5 text-white rounded-tr-none"
                  : msg.type === "analysis"
                    ? "w-full max-w-md bg-transparent shadow-none p-0"
                    : "glass-card text-white rounded-tl-none text-sm"
              }`}
            >
              {msg.type === "analysis" ? (
                <AnalysisDashboard analysis={analysisData} />
              ) : (
                <p className="leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="glass-card rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span className="text-xs text-gray-300">
                열심히 분석하고 있어요...
              </span>
            </div>
          </motion.div>
        )}

        {/* Step 1: Emotion Selection */}
        {step === 1 && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3 max-w-sm mx-auto mt-4"
          >
            <EmotionChip
              emotion="joy"
              label="기쁨"
              emoji="😊"
              onClick={() => handleEmotionClick("joy")}
            />
            <EmotionChip
              emotion="anxiety"
              label="불안"
              emoji="😰"
              onClick={() => handleEmotionClick("anxiety")}
            />
            <EmotionChip
              emotion="anger"
              label="분노"
              emoji="😠"
              onClick={() => handleEmotionClick("anger")}
            />
            <EmotionChip
              emotion="sadness"
              label="슬픔"
              emoji="😢"
              onClick={() => handleEmotionClick("sadness")}
            />
            <EmotionChip
              emotion="surprise"
              label="놀람"
              emoji="😲"
              onClick={() => handleEmotionClick("surprise")}
            />
            <EmotionChip
              emotion="peace"
              label="평온"
              emoji="😌"
              onClick={() => handleEmotionClick("peace")}
            />
          </motion.div>
        )}

        {/* Step 3: 현실 고민 건너뛰기 버튼 */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-2"
          >
            <button
              onClick={() => handleRealLifeSubmit()}
              className="px-5 py-2 rounded-full text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all"
            >
              건너뛰기
            </button>
          </motion.div>
        )}

        {/* Step 5: 필터 선택 (스탠다드/프리미엄) */}
        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mt-4 space-y-6 pb-20"
          >
            <div>
              <h3 className="text-sm font-bold text-gray-400 mb-3 ml-1">
                스탠다드 필터
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {STANDARD_FILTERS.map((s: { id: string; label: string; desc: string; isPremium: boolean }) => (
                  <StyleCard
                    key={s.id}
                    style={s.id}
                    label={s.label}
                    desc={s.desc}
                    isPremium={s.isPremium}
                    selected={selectedStyle === s.id}
                    onClick={() => handleStyleClick(s)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-amber-500 mb-3 ml-1 flex items-center gap-1">
                <Sparkles size={14} />
                프리미엄 필터
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {PREMIUM_FILTERS.map((s: { id: string; label: string; desc: string; isPremium: boolean }) => (
                  <StyleCard
                    key={s.id}
                    style={s.id}
                    label={s.label}
                    desc={s.desc}
                    isPremium={s.isPremium}
                    selected={selectedStyle === s.id}
                    onClick={() => handleStyleClick(s)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ... (end of chat messages) */}

      {/* Global Modals */}
      <AnimatePresence>
        {showPremiumModal && (
          <SubscriptionPrompt
            onClose={() => setShowPremiumModal(false)}
            onSubscribe={handleSubscribe}
            title={
              modalType === "style" ? (
                <>
                  프리미엄 스타일로
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">
                    꿈을 더 생생하게
                  </span>{" "}
                  그려보세요
                </>
              ) : (
                <>
                  당신의 무의식,
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
                    더 깊이 들여다볼까요?
                  </span>
                </>
              )
            }
            description={
              modalType === "style" ? (
                <>
                  지브리, 픽사, 시네마틱 실사 등<br />
                  고퀄리티 프리미엄 화풍은 구독 서비스를 통해
                  <br />
                  무제한으로 이용하실 수 있습니다.
                  <br />
                  <span className="font-semibold text-gray-800">
                    지금 바로 당신의 꿈을 영화처럼 만들어보세요!
                  </span>
                </>
              ) : (
                <>
                  AI 심리 전문가와 함께하는 1:1 심층 코칭은
                  <br />
                  프리미엄 전용 서비스입니다. 무의식의 진짜 의미를 분석하고
                  <br />
                  현실의 고민을 해결하는 맞춤형 가이드를 받아보세요.
                </>
              )
            }
            benefits={
              modalType === "style"
                ? [
                    "✨ 고해상도 렌더링",
                    "🎨 프리미엄 전용 화풍 10종",
                    "🚫 워터마크 제거",
                  ]
                : [
                    "🧠 현실 기반 심층 분석",
                    "📝 개인 맞춤형 액션 플랜",
                    "💬 무제한 대화 기능",
                  ]
            }
            buttonText={
              modalType === "style"
                ? "구독하고 프리미엄 스타일로 시작하기"
                : "구독하고 심층 대화 시작하기"
            }
          />
        )}
      </AnimatePresence>

      {/* Input Area (Bottom) */}
      <div className="p-4 bg-[#0F0C29]/90 backdrop-blur-md border-t border-white/10 fixed bottom-0 left-0 right-0 z-20 pb-8 max-w-[1200px] mx-auto">
        {isVoiceMode ? (
          /* Voice-flow 모드: 마이크 웨이브 인디케이터 */
          <div className="flex items-center justify-center gap-4 max-w-3xl mx-auto py-1">
            <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10">
              <div
                className={`flex items-end gap-[3px] h-5 ${isRecording ? "" : "opacity-40"}`}
              >
                {[3, 5, 7, 5, 3, 7, 4].map((h, i) => (
                  <div
                    key={i}
                    className={`w-[3px] bg-purple-400 rounded-full transition-all ${isRecording ? "animate-bounce" : ""}`}
                    style={{
                      height: `${h * 2}px`,
                      animationDelay: `${i * 0.08}s`,
                      animationDuration: `${0.5 + i * 0.07}s`,
                    }}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-300">
                {isRecording
                  ? "듣고 있어요..."
                  : "잠시 후 마이크가 켜집니다..."}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                // ref를 먼저 false로 → onend 콜백이 체인 진행 안 함
                isVoiceModeRef.current = false;
                recognitionRef.current?.stop();
                window.speechSynthesis.cancel();
                if (silenceTimerRef.current)
                  clearTimeout(silenceTimerRef.current);
                setIsVoiceMode(false);
                setIsRecording(false);
              }}
              className="px-4 py-2 rounded-full text-xs text-gray-400 border border-white/10 hover:border-white/30 hover:text-white transition-all"
            >
              음성 종료
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleContentSubmit}
            className="flex items-center gap-2 max-w-3xl mx-auto bg-white/5 rounded-full p-1.5 border border-white/10 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all"
          >
            <button
              type="button"
              onClick={handleMicToggle}
              className={`p-2.5 rounded-full transition-colors ${
                isRecording
                  ? "bg-red-500/20 text-red-400 animate-pulse"
                  : "text-gray-400 hover:bg-white/10"
              }`}
            >
              <Mic size={20} />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={step === 3 ? realLifeContext : dreamContent}
              onChange={(e) =>
                step === 3
                  ? setRealLifeContext(e.target.value)
                  : setDreamContent(e.target.value)
              }
              placeholder={
                step === 3
                  ? "요즘 고민이 있으신가요? (선택사항)"
                  : "이야기를 들려주세요..."
              }
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm px-2"
            />
            <button
              type="submit"
              disabled={step === 3 ? false : !dreamContent.trim()}
              className={`p-2.5 rounded-full transition-all ${
                (step === 3 ? true : dreamContent.trim())
                  ? "bg-purple-600 text-white shadow-glow"
                  : "bg-white/10 text-gray-500"
              }`}
            >
              <Send size={18} />
            </button>
          </form>
        )}
      </div>

      {/* PricingPage 모달 */}
      <AnimatePresence>
        {isPricingModalOpen && (
          <PricingPage isModal onClose={() => setIsPricingModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Helpers
const getEmotionLabel = (e: EmotionType) => {
  const labels: Record<EmotionType, string> = {
    joy: "기뻤어",
    anxiety: "불안했어",
    anger: "화났어",
    sadness: "슬펐어",
    surprise: "놀랐어",
    peace: "평온했어",
  };
  return labels[e] || e;
};

const getEmotionReaction = (e: EmotionType) => {
  return EMOTION_REACTIONS[e] || "그렇군요. 더 자세히 이야기해 주실래요?";
};
