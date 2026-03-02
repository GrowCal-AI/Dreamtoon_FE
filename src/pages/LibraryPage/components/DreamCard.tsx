import { memo } from "react";
import { motion } from "framer-motion";
import { Heart, Calendar } from "lucide-react";
import { DreamEntry, formatDateShort } from "@/types";
import { STYLE_LABELS } from "../constants";

interface DreamCardProps {
  dream: DreamEntry;
  onClick: () => void;
}

export const DreamCard = memo(({ dream, onClick }: DreamCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="glass-card overflow-hidden cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-[#2D2A4A] to-[#1A1638] relative overflow-hidden">
        {dream.webtoonUrl ||
        (dream.scenes &&
          dream.scenes.length > 0 &&
          dream.scenes[0].imageUrl) ? (
          <img
            src={dream.webtoonUrl || dream.scenes[0].imageUrl}
            alt={dream.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : null}

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

        <div className="absolute inset-0 flex items-center justify-center text-white p-4">
          <div className="text-center">
            <div className="text-lg font-semibold drop-shadow-md">
              {dream.title}
            </div>
          </div>
        </div>
        {dream.isFavorite && (
          <div className="absolute top-3 right-3 z-10">
            <Heart className="w-6 h-6 fill-red-500 text-red-500 drop-shadow-md" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDateShort(dream.recordedAt)}
          </span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
            {dream.genreName ?? STYLE_LABELS[dream.style] ?? dream.style}
          </span>
        </div>
        <p className="text-sm text-gray-300 line-clamp-2">
          {dream.content || "꿈 기록"}
        </p>
        {(dream.tags?.length ?? 0) > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {dream.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 bg-white/10 text-gray-400 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
});

DreamCard.displayName = "DreamCard";

export default DreamCard;
