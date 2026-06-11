import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import logoSymbol from '../../assets/logo-symbol.png'
import { useTheme } from '../../contexts/ThemeContext'

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

export function Header() {
  const navigate    = useNavigate()
  const location    = useLocation()
  const { theme, toggle } = useTheme()

  function handleLogoClick() {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
      style={{ background: 'var(--header-bg)', backdropFilter: 'blur(12px)' }}
    >
      <button onClick={handleLogoClick} className="flex items-center">
        <img
          src={logoSymbol}
          alt="Le Surligneur — accueil"
          className="h-9 w-9 rounded-lg object-contain"
        />
      </button>

      <nav className="flex items-center gap-2 md:gap-3">

        {/* Toggle lumière / sombre */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggle}
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
          style={{
            background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,100,160,0.08)',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,150,200,0.2)',
            color: theme === 'dark' ? '#FCD34D' : '#0077AA',
          }}
        >
          <motion.span
            key={theme}
            initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </motion.span>
        </motion.button>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/test')}
          className="text-sm font-semibold bg-brand-cyan text-bg-primary px-4 py-2 rounded-xl hover:shadow-cyan-glow-sm transition-all duration-200"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Passer le test
        </motion.button>
      </nav>
    </motion.header>
  )
}
