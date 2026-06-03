import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to top"
          className="fixed bottom-8 right-6 z-50 flex flex-col items-center gap-2 cursor-pointer"
        >
          {/* Circle with arrow */}
          <div className="w-11 h-11 rounded-full bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <ArrowUp size={18} className="text-slate-900" strokeWidth={2.5} />
          </div>

          {/* Pill with vertical text */}
          <div className="bg-brand-500 rounded-full px-3.5 py-5 shadow-lg shadow-brand-500/30 flex items-center justify-center">
            <span
              className="text-slate-900 text-[10px] font-black tracking-[0.22em] uppercase leading-none"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Back to Top
            </span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
