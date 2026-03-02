import { motion } from "framer-motion";
import { Mic, Send, Square } from "lucide-react";
import { KeyboardEvent } from "react";

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onVoiceToggle?: () => void;
  placeholder?: string;
  isRecording?: boolean;
  disabled?: boolean;
  showVoiceButton?: boolean;
  maxLength?: number;
}

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  onVoiceToggle,
  placeholder = "메시지를 입력하세요...",
  isRecording = false,
  disabled = false,
  showVoiceButton = true,
  maxLength,
}: ChatInputProps) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Voice Button */}
      {showVoiceButton && onVoiceToggle && (
        <motion.button
          type="button"
          onClick={onVoiceToggle}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-shrink-0 p-3 rounded-full transition-all ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : "bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isRecording ? "Stop recording" : "Start voice input"}
        >
          {isRecording ? <Square size={20} /> : <Mic size={20} />}
        </motion.button>
      )}

      {/* Input Field */}
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className="w-full px-5 py-3 pr-12 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {/* Send Button */}
        <motion.button
          type="button"
          onClick={onSubmit}
          disabled={!value.trim() || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
          aria-label="Send message"
        >
          <Send size={18} />
        </motion.button>
      </div>

      {/* Character Count (optional) */}
      {maxLength && value.length > maxLength * 0.8 && (
        <div className="absolute -top-6 right-0 text-xs text-gray-400">
          {value.length} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default ChatInput;
