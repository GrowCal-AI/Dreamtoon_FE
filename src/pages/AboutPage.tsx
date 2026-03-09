import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Brain, Heart, Zap, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: t('about.features.ai.title'),
      description: t('about.features.ai.description'),
      color: "text-purple-400",
    },
    {
      icon: Sparkles,
      title: t('about.features.webtoon.title'),
      description: t('about.features.webtoon.description'),
      color: "text-yellow-400",
    },
    {
      icon: Heart,
      title: t('about.features.emotion.title'),
      description: t('about.features.emotion.description'),
      color: "text-red-400",
    },
    {
      icon: Zap,
      title: t('about.features.story.title'),
      description: t('about.features.story.description'),
      color: "text-blue-400",
    },
    {
      icon: Users,
      title: t('about.features.library.title'),
      description: t('about.features.library.description'),
      color: "text-green-400",
    },
    {
      icon: Shield,
      title: t('about.features.privacy.title'),
      description: t('about.features.privacy.description'),
      color: "text-cyan-400",
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
            <Sparkles className="text-purple-400" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">{t('about.title')}</h1>
          </div>
          <p className="text-lg text-gray-300">
            {t('about.subtitle')}
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-purple-400">
            {t('about.mission.title')}
          </h2>
          <p className="text-gray-300 leading-relaxed text-lg mb-4">
            {t('about.mission.paragraph1')}
          </p>
          <p className="text-gray-300 leading-relaxed text-lg">
            {t('about.mission.paragraph2')}
          </p>
        </motion.div>

        {/* What is Dreamics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-purple-400">
            {t('about.what.title')}
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>{t('about.what.paragraph1')}</p>
            <p>{t('about.what.paragraph2')}</p>
            <p>{t('about.what.paragraph3')}</p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-purple-400 text-center">
            {t('about.featuresSection.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:border-purple-400/30 transition-all"
              >
                <feature.icon className={`${feature.color} mb-4`} size={36} />
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-purple-400">
            {t('about.technology.title')}
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>{t('about.technology.paragraph1')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t('about.technology.feature1')}</li>
              <li>{t('about.technology.feature2')}</li>
              <li>{t('about.technology.feature3')}</li>
              <li>{t('about.technology.feature4')}</li>
            </ul>
          </div>
        </motion.div>

        {/* Why Dreamics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-purple-400">
            {t('about.why.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-3 text-yellow-400">
                {t('about.why.reason1.title')}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('about.why.reason1.description')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-yellow-400">
                {t('about.why.reason2.title')}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('about.why.reason2.description')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-yellow-400">
                {t('about.why.reason3.title')}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('about.why.reason3.description')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-yellow-400">
                {t('about.why.reason4.title')}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {t('about.why.reason4.description')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team & Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-purple-400">
            {t('about.contact.title')}
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            {t('about.contact.description')}
          </p>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong className="text-purple-400">{t('about.contact.email')}:</strong>{" "}
              <a
                href="mailto:vaga0330@gmail.com"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                vaga0330@gmail.com
              </a>
            </p>
            <p>
              <strong className="text-purple-400">{t('about.contact.website')}:</strong>{" "}
              <a
                href="https://dreamics.ai"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                dreamics.ai
              </a>
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-4">{t('about.cta.title')}</h3>
          <p className="text-gray-400 mb-6">{t('about.cta.description')}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            {t('about.cta.button')}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
