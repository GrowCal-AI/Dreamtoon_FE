import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function FAQPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: t('faq.questions.q1.question'),
      answer: t('faq.questions.q1.answer'),
    },
    {
      question: t('faq.questions.q2.question'),
      answer: t('faq.questions.q2.answer'),
    },
    {
      question: t('faq.questions.q3.question'),
      answer: t('faq.questions.q3.answer'),
    },
    {
      question: t('faq.questions.q4.question'),
      answer: t('faq.questions.q4.answer'),
    },
    {
      question: t('faq.questions.q5.question'),
      answer: t('faq.questions.q5.answer'),
    },
    {
      question: t('faq.questions.q6.question'),
      answer: t('faq.questions.q6.answer'),
    },
    {
      question: t('faq.questions.q7.question'),
      answer: t('faq.questions.q7.answer'),
    },
    {
      question: t('faq.questions.q8.question'),
      answer: t('faq.questions.q8.answer'),
    },
    {
      question: t('faq.questions.q9.question'),
      answer: t('faq.questions.q9.answer'),
    },
    {
      question: t('faq.questions.q10.question'),
      answer: t('faq.questions.q10.answer'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#302B63] to-[#24243E] text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
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
            <HelpCircle className="text-purple-400" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">{t('faq.title')}</h1>
          </div>
          <p className="text-lg text-gray-300">
            {t('faq.subtitle')}
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
              >
                <h3 className="text-lg font-bold pr-4">{faq.question}</h3>
                <ChevronDown
                  className={`flex-shrink-0 text-purple-400 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  size={24}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            {t('faq.contact.title')}
          </h2>
          <p className="text-gray-300 mb-6">
            {t('faq.contact.description')}
          </p>
          <a
            href="mailto:vaga0330@gmail.com"
            className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            {t('faq.contact.button')}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
