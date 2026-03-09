import { motion } from "framer-motion";
import { ArrowLeft, Moon, Heart, Brain, Sparkles, Cloud, Stars } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DreamGuidePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const dreamSymbols = [
    {
      icon: Moon,
      title: t('dreamGuide.symbols.moon.title'),
      meaning: t('dreamGuide.symbols.moon.meaning'),
      color: "text-blue-400",
    },
    {
      icon: Heart,
      title: t('dreamGuide.symbols.heart.title'),
      meaning: t('dreamGuide.symbols.heart.meaning'),
      color: "text-red-400",
    },
    {
      icon: Brain,
      title: t('dreamGuide.symbols.brain.title'),
      meaning: t('dreamGuide.symbols.brain.meaning'),
      color: "text-purple-400",
    },
    {
      icon: Sparkles,
      title: t('dreamGuide.symbols.sparkles.title'),
      meaning: t('dreamGuide.symbols.sparkles.meaning'),
      color: "text-yellow-400",
    },
    {
      icon: Cloud,
      title: t('dreamGuide.symbols.cloud.title'),
      meaning: t('dreamGuide.symbols.cloud.meaning'),
      color: "text-gray-400",
    },
    {
      icon: Stars,
      title: t('dreamGuide.symbols.stars.title'),
      meaning: t('dreamGuide.symbols.stars.meaning'),
      color: "text-indigo-400",
    },
  ];

  const dreamTypes = [
    {
      title: t('dreamGuide.types.lucid.title'),
      description: t('dreamGuide.types.lucid.description'),
      tips: t('dreamGuide.types.lucid.tips'),
    },
    {
      title: t('dreamGuide.types.nightmare.title'),
      description: t('dreamGuide.types.nightmare.description'),
      tips: t('dreamGuide.types.nightmare.tips'),
    },
    {
      title: t('dreamGuide.types.recurring.title'),
      description: t('dreamGuide.types.recurring.description'),
      tips: t('dreamGuide.types.recurring.tips'),
    },
    {
      title: t('dreamGuide.types.prophetic.title'),
      description: t('dreamGuide.types.prophetic.description'),
      tips: t('dreamGuide.types.prophetic.tips'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>{t('common.back')}</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <Moon className="text-purple-400" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">{t('dreamGuide.title')}</h1>
          </div>
          <p className="text-lg text-gray-300">
            {t('dreamGuide.subtitle')}
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            {t('dreamGuide.intro.title')}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            {t('dreamGuide.intro.paragraph1')}
          </p>
          <p className="text-gray-300 leading-relaxed">
            {t('dreamGuide.intro.paragraph2')}
          </p>
        </motion.div>

        {/* Dream Symbols */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-purple-400">
            {t('dreamGuide.symbolsSection.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dreamSymbols.map((symbol, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:border-purple-400/30 transition-all"
              >
                <symbol.icon className={`${symbol.color} mb-4`} size={32} />
                <h3 className="text-xl font-bold mb-2">{symbol.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{symbol.meaning}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dream Types */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-purple-400">
            {t('dreamGuide.typesSection.title')}
          </h2>
          <div className="space-y-6">
            {dreamTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6"
              >
                <h3 className="text-2xl font-bold mb-3 text-yellow-400">{type.title}</h3>
                <p className="text-gray-300 leading-relaxed mb-3">{type.description}</p>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="text-sm text-purple-200">
                    <strong>{t('dreamGuide.tip')}:</strong> {type.tips}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How to Remember Dreams */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl border border-white/10 p-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-purple-400">
            {t('dreamGuide.remember.title')}
          </h2>
          <ul className="space-y-4 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">1.</span>
              <span>{t('dreamGuide.remember.tip1')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">2.</span>
              <span>{t('dreamGuide.remember.tip2')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">3.</span>
              <span>{t('dreamGuide.remember.tip3')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">4.</span>
              <span>{t('dreamGuide.remember.tip4')}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-400 font-bold">5.</span>
              <span>{t('dreamGuide.remember.tip5')}</span>
            </li>
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            {t('dreamGuide.cta')}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
