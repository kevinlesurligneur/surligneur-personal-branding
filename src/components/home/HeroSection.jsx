import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logoText from '../../assets/logo-text.png'

export function HeroSection() {
  const navigate = useNavigate()

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-32 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #071e3d 0%, #0d1224 40%, #08080F 75%)' }}
    >

      {/* ── Orbes animés ── */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,212,245,0.09) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,77,109,0.06) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 25, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* ── Logo texte ── */}
      <div className="relative z-10 mb-8">
        <img
          src={logoText}
          alt="Le Surligneur"
          className="h-10 md:h-12 mx-auto object-contain"
        />
      </div>

      {/* ── Titre ── */}
      <h1 className="relative z-10 font-display font-bold text-3xl md:text-4xl lg:text-5xl max-w-2xl leading-[1.35] mb-6">
        <span className="inline-block mr-[0.25em]">Les</span>
        <span
          className="inline-block mr-[0.25em] bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, #00D4F5, #7DD3FC)' }}
        >
          12 Personnalités
        </span>
        <span className="inline-block mr-[0.25em]">du</span>
        <span className="inline-block">Personal Branding</span>
      </h1>

      {/* ── Sous-titre ── */}
      <div className="relative z-10 max-w-xl text-center mb-10">
        <p className="text-text-muted text-lg md:text-xl leading-relaxed">
          Découvrez toutes les combinaisons possibles et leurs caractéristiques uniques
        </p>
        <p className="text-text-faint text-sm md:text-base leading-relaxed mt-1">
          basées sur la méthodologie exclusive du Surligneur.
        </p>
      </div>

      {/* ── CTA ── */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,212,245,0.4)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/test')}
          className="btn-primary text-base md:text-lg px-8 py-4 rounded-2xl"
        >
          <span>🎯</span>
          Passer le test de personnalité
        </motion.button>

        <button
          onClick={() => document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-text-muted text-sm hover:text-brand-cyan transition-colors underline underline-offset-4"
        >
          Comprendre la méthodologie du test du Surligneur
        </button>
      </div>

      {/* ── Flèche scroll ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2], y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          >
            <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
              <path
                d="M2 2L12 11L22 2"
                stroke="#00D4F5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        ))}
      </div>

    </section>
  )
}
