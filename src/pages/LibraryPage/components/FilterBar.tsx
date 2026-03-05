import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DreamStyle } from "@/types";
import { STYLE_LABELS, STYLE_FILTER_OPTIONS } from "../constants";

interface FilterBarProps {
  filterStyle: DreamStyle | "all";
  showFavorites: boolean;
  onFilterStyleChange: (style: DreamStyle | "all") => void;
  onShowFavoritesChange: (show: boolean) => void;
}

export const FilterBar = memo(
  ({
    filterStyle,
    showFavorites,
    onFilterStyleChange,
    onShowFavoritesChange,
  }: FilterBarProps) => {
    const { t } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (isDropdownOpen && !target.closest(".relative")) {
          setIsDropdownOpen(false);
        }
      };
      if (isDropdownOpen) {
        document.addEventListener("click", handleClickOutside);
      }
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }, [isDropdownOpen]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center justify-end gap-3 mb-8 px-1"
      >
        <button
          onClick={() => onShowFavoritesChange(!showFavorites)}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            showFavorites
              ? "bg-red-500/20 text-red-400 border border-red-500/50"
              : "glass-card text-gray-400 hover:bg-white/10"
          }`}
        >
          <Heart className={`w-4 h-4 ${showFavorites ? "fill-current" : ""}`} />
          {t('library.favorites')}
        </button>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-40 pl-4 pr-4 py-2 rounded-lg font-medium transition-all cursor-pointer outline-none flex items-center justify-between ${
              filterStyle !== "all"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/50"
                : "glass-card text-gray-400 hover:bg-white/10"
            }`}
          >
            <span>
              {filterStyle === "all"
                ? t('library.allStyles')
                : (STYLE_LABELS[filterStyle] ?? filterStyle)}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              } ${filterStyle !== "all" ? "text-purple-300" : "text-white/60"}`}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 w-40 glass-card rounded-lg overflow-hidden z-20 shadow-xl"
              >
                {STYLE_FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onFilterStyleChange(option.value as DreamStyle | "all");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left transition-colors ${
                      filterStyle === option.value
                        ? "bg-purple-500/20 text-purple-300"
                        : "text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  },
);

FilterBar.displayName = "FilterBar";

export default FilterBar;
