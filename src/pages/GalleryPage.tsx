import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function GalleryPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Sample webtoon data (static content for SEO)
  const sampleWebtoons = [
    {
      id: 1,
      title: t('gallery.samples.flying.title'),
      style: t('gallery.samples.flying.style'),
      description: t('gallery.samples.flying.description'),
      emotion: t('gallery.samples.flying.emotion'),
      gradient: "from-blue-500/20 to-purple-500/20",
    },
    {
      id: 2,
      title: t('gallery.samples.ocean.title'),
      style: t('gallery.samples.ocean.style'),
      description: t('gallery.samples.ocean.description'),
      emotion: t('gallery.samples.ocean.emotion'),
      gradient: "from-cyan-500/20 to-blue-500/20",
    },
    {
      id: 3,
      title: t('gallery.samples.castle.title'),
      style: t('gallery.samples.castle.style'),
      description: t('gallery.samples.castle.description'),
      emotion: t('gallery.samples.castle.emotion'),
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: 4,
      title: t('gallery.samples.forest.title'),
      style: t('gallery.samples.forest.style'),
      description: t('gallery.samples.forest.description'),
      emotion: t('gallery.samples.forest.emotion'),
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      id: 5,
      title: t('gallery.samples.city.title'),
      style: t('gallery.samples.city.style'),
      description: t('gallery.samples.city.description'),
      emotion: t('gallery.samples.city.emotion'),
      gradient: "from-orange-500/20 to-red-500/20",
    },
    {
      id: 6,
      title: t('gallery.samples.space.title'),
      style: t('gallery.samples.space.style'),
      description: t('gallery.samples.space.description'),
      emotion: t('gallery.samples.space.emotion'),
      gradient: "from-indigo-500/20 to-purple-500/20",
    },
  ];

  const styles = [
    { name: t('gallery.styles.pixar'), color: "bg-blue-500" },
    { name: t('gallery.styles.ghibli'), color: "bg-green-500" },
    { name: t('gallery.styles.marvel'), color: "bg-red-500" },
    { name: t('gallery.styles.manga'), color: "bg-purple-500" },
    { name: t('gallery.styles.watercolor'), color: "bg-cyan-500" },
    { name: t('gallery.styles.lego'), color: "bg-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
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
            <Sparkles className="text-purple-400" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">{t('gallery.title')}</h1>
          </div>
          <p className="text-lg text-gray-300">
            {t('gallery.subtitle')}
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
            {t('gallery.intro.title')}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            {t('gallery.intro.paragraph1')}
          </p>
          <p className="text-gray-300 leading-relaxed">
            {t('gallery.intro.paragraph2')}
          </p>
        </motion.div>

        {/* Available Styles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6 text-purple-400">
            {t('gallery.stylesSection.title')}
          </h2>
          <div className="flex flex-wrap gap-3">
            {styles.map((style, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={`${style.color} px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg`}
              >
                {style.name}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sample Webtoons Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-purple-400">
            {t('gallery.samplesSection.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleWebtoons.map((webtoon, index) => (
              <motion.div
                key={webtoon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:border-purple-400/30 transition-all group"
              >
                {/* Placeholder Image Area */}
                <div
                  className={`h-48 bg-gradient-to-br ${webtoon.gradient} flex items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <Sparkles className="text-white/50 group-hover:text-white/70 transition-colors" size={48} />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{webtoon.title}</h3>
                    <span className="text-xs px-2 py-1 bg-purple-500/20 rounded-full text-purple-300">
                      {webtoon.style}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                    {webtoon.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{t('gallery.emotion')}:</span>
                    <span className="text-xs px-2 py-1 bg-blue-500/20 rounded-full text-blue-300">
                      {webtoon.emotion}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-purple-400">
            {t('gallery.howItWorks.title')}
          </h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-bold text-xl">1.</span>
              <div>
                <h3 className="font-bold mb-1">{t('gallery.howItWorks.step1.title')}</h3>
                <p className="text-sm text-gray-400">{t('gallery.howItWorks.step1.description')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-bold text-xl">2.</span>
              <div>
                <h3 className="font-bold mb-1">{t('gallery.howItWorks.step2.title')}</h3>
                <p className="text-sm text-gray-400">{t('gallery.howItWorks.step2.description')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-bold text-xl">3.</span>
              <div>
                <h3 className="font-bold mb-1">{t('gallery.howItWorks.step3.title')}</h3>
                <p className="text-sm text-gray-400">{t('gallery.howItWorks.step3.description')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-400 font-bold text-xl">4.</span>
              <div>
                <h3 className="font-bold mb-1">{t('gallery.howItWorks.step4.title')}</h3>
                <p className="text-sm text-gray-400">{t('gallery.howItWorks.step4.description')}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-4">{t('gallery.cta.title')}</h3>
          <p className="text-gray-400 mb-6">{t('gallery.cta.description')}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            {t('gallery.cta.button')}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
