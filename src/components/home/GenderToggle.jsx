import { motion } from 'framer-motion'

export function GenderToggle({ gender, onChange }) {
  return (
    <div className="flex items-center justify-center mb-14">
      <div className="relative flex items-center p-1 rounded-2xl border border-border-subtle bg-bg-card">
        {/* Sliding background */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-xl bg-brand-cyan"
          animate={{ left: gender === 'masculine' ? '4px' : '50%', right: gender === 'masculine' ? '50%' : '4px' }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />

        <button
          onClick={() => onChange('masculine')}
          className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 min-w-[160px] justify-center ${
            gender === 'masculine' ? 'text-bg-primary' : 'text-text-muted hover:text-text-primary'
          }`}
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          <span>🧑</span> Version masculine
        </button>

        <button
          onClick={() => onChange('feminine')}
          className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 min-w-[160px] justify-center ${
            gender === 'feminine' ? 'text-bg-primary' : 'text-text-muted hover:text-text-primary'
          }`}
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          <span>👩</span> Version féminine
        </button>
      </div>
    </div>
  )
}
