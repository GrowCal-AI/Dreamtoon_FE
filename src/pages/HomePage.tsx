import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mic, Send } from 'lucide-react'

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export default function HomePage() {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [isExiting, setIsExiting] = useState(false)

  const handleMicClick = () => {
    console.log('Voice input triggered')
    // Future STT logic here
  }

  const handleSubmit = () => {
    if (!inputText.trim()) return

    console.log('Submitting dream...')
    setIsExiting(true)

    // Allow exit animation to play before navigating
    setTimeout(() => {
      navigate('/chat')
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <AnimatePresence mode='wait'>
      {!isExiting && (
        <motion.div
          className="relative flex-1 w-full flex flex-col items-center justify-center bg-transparent text-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Ambient Background Animation */}
          <motion.div
            className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none z-[-1]"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none z-[-1]"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Hero Section */}
          <motion.div className="z-10 text-center mb-16 px-4" variants={itemVariants}>
            <h1 className="text-h1 mb-4 tracking-tight text-white drop-shadow-lg">
              당신의 꿈을 들려주세요
            </h1>
            <p className="text-body text-gray-300 font-light">
              무의식이 만든 이야기를 AI가 멋진 웹툰으로 만들어드립니다
            </p>
          </motion.div>

          {/* Dream Input Bar */}
          <motion.div className="z-10 w-full max-w-2xl px-6" variants={itemVariants}>
            <div className="glass-card p-2 flex items-center gap-2">
              {/* Mic Icon */}
              <motion.button
                onClick={handleMicClick}
                className="p-3 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Mic size={24} />
              </motion.button>

              {/* Input Field */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="어젯밤 꿈 이야기를 해보세요..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-gray-500 px-2"
              />

              {/* Send Icon */}
              <motion.button
                onClick={handleSubmit}
                disabled={!inputText.trim()}
                className={`p-3 rounded-full transition-all duration-300 ${inputText.trim()
                  ? 'bg-purple-600/80 text-white shadow-glow hover:bg-purple-500'
                  : 'bg-white/10 text-gray-600 cursor-not-allowed'
                  }`}
                whileHover={inputText.trim() ? { scale: 1.05 } : {}}
                whileTap={inputText.trim() ? { scale: 0.95 } : {}}
              >
                <Send size={24} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
