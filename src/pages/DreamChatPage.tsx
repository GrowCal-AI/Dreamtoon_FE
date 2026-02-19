import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Send, Mic, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { dreamAPI } from "@/services/api";

// ─── 타입 ───────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

// ─── 초기 AI 인사 메시지 ─────────────────────────────────────────────────

const getGreeting = (dreamTitle: string): ChatMessage => ({
  id: "init-0",
  role: "ai",
  content: `"${dreamTitle}"에 대해 더 깊이 이야기해 볼까요?\n\n꿈 속에서 가장 인상 깊었던 장면이나 감정이 있으셨나요? 편하게 말씀해 주세요. 무의식의 언어를 함께 해석해 드릴게요.`,
  timestamp: new Date(),
});

// ─── 컴포넌트 ──────────────────────────────────────────────────────────────

export default function DreamChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // location.state로 dreamId, dreamTitle, initialMessage 전달받음
  const dreamId: string | undefined = (location.state as any)?.dreamId;
  const dreamTitle: string = (location.state as any)?.dreamTitle || "나의 꿈";
  const initialMessage: string | undefined = (location.state as any)
    ?.initialMessage;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const greeting = getGreeting(dreamTitle);
    // 초기 메시지가 있으면 user 메시지로 추가
    if (initialMessage) {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: initialMessage,
        timestamp: new Date(),
      };
      return [greeting, userMsg];
    }
    return [greeting];
  });
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 채팅 히스토리 로드 (기존 대화 복원)
  useEffect(() => {
    if (!dreamId || historyLoaded) return;
    setHistoryLoaded(true);

    dreamAPI.getChatHistory(dreamId).then((res) => {
      const history = res?.chatHistory ?? res?.messages ?? [];
      if (history.length > 0) {
        const restored: ChatMessage[] = history.map((m: any, i: number) => ({
          id: `history-${i}`,
          role: m.role === "USER" || m.role === "user" ? "user" : "ai",
          content: m.message ?? m.content ?? "",
          timestamp: m.createdAt ? new Date(m.createdAt) : new Date(),
        }));
        setMessages([getGreeting(dreamTitle), ...restored]);
      } else if (initialMessage) {
        // 히스토리 없고 초기 메시지 있으면 첫 메시지 전송
        callChatAPI(initialMessage);
      }
    }).catch(() => {
      // 히스토리 로드 실패 시 초기 메시지가 있으면 전송
      if (initialMessage) callChatAPI(initialMessage);
    });
  }, [dreamId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // 언마운트 정리
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  // ── 실제 API 호출 ──────────────────────────────────────────────────────

  const callChatAPI = async (text: string) => {
    if (!dreamId) return;
    setIsLoading(true);
    try {
      const res = await dreamAPI.sendChatMessage(dreamId, text);
      const reply = res?.message ?? res?.reply ?? res?.content ?? "";
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "ai",
        content: "잠시 오류가 발생했어요. 다시 시도해 주세요.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── 메시지 전송 ──────────────────────────────────────────────────────────

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    await callChatAPI(trimmed);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    sendMessage(inputText);
  };

  // ── 음성 입력 (실시간 STT) ────────────────────────────────────────────────

  const handleMicToggle = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      return;
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition: any = new SpeechRecognitionAPI();
    recognition.lang = "ko-KR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    let finalText = "";

    const resetTimer = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => recognition.stop(), 3000);
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
      setInputText((finalText + interim).trim());
    };

    recognition.onend = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onerror = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setIsRecording(false);
    };

    recognition.start();
  };

  // ── 시간 포맷 ─────────────────────────────────────────────────────────────

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

  // ── 렌더 ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-[#0F0C29] text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 bg-[#0F0C29]/95 backdrop-blur-md fixed top-0 left-0 right-0 z-20">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
            <Sparkles size={14} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {dreamTitle}
            </p>
            <p className="text-xs text-purple-400">꿈 해석 AI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-20 pb-28 space-y-4 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}
            >
              {/* AI 아바타 */}
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles size={11} className="text-white" />
                </div>
              )}

              <div className="flex flex-col gap-1 max-w-[78%]">
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white rounded-tr-none"
                      : "bg-white/8 border border-white/10 text-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
                <span
                  className={`text-[10px] text-gray-500 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 로딩 (AI 타이핑 인디케이터) */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex justify-start gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles size={11} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white/8 border border-white/10 flex items-center gap-1.5">
                <Loader2 size={13} className="animate-spin text-purple-400" />
                <span className="text-xs text-gray-400">생각하는 중...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-8 pt-3 bg-[#0F0C29]/95 backdrop-blur-md border-t border-white/10">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 max-w-3xl mx-auto bg-white/5 rounded-full p-1.5 border border-white/10 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all"
        >
          <button
            type="button"
            onClick={handleMicToggle}
            className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${
              isRecording
                ? "bg-red-500/20 text-red-400 animate-pulse"
                : "text-gray-400 hover:bg-white/10"
            }`}
          >
            <Mic size={18} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputText);
              }
            }}
            placeholder="꿈에 대해 이야기해 주세요..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm px-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`p-2.5 rounded-full transition-all flex-shrink-0 ${
              inputText.trim() && !isLoading
                ? "bg-purple-600 text-white shadow-glow"
                : "bg-white/10 text-gray-500"
            }`}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
