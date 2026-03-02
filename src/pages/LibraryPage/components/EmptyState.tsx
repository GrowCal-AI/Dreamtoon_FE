import { memo } from "react";
import { motion } from "framer-motion";

export const EmptyState = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-12 text-center min-h-[200px] flex flex-col items-center justify-center"
  >
    <p className="text-lg font-medium text-gray-300">기록된 꿈이 없습니다</p>
    <p className="text-sm text-gray-500 mt-2">
      웹툰 결과에서 &#39;라이브러리에 저장&#39;을 누르면 여기에 쌓여요.
    </p>
  </motion.div>
));

EmptyState.displayName = "EmptyState";

export default EmptyState;
