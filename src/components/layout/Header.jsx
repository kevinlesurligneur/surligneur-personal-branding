import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import logoSymbol from '../../assets/logo-symbol.png'

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogoClick() {
    if (location.pathname === '/') {
      // Déjà sur la home → remonte en haut
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Autre page → retour home (ScrollToTop s'occupe du scroll)
      navigate('/')
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
      style={{ background: 'linear-gradient(to bottom, rgba(8,8,15,0.98) 0%, rgba(8,8,15,0) 100%)', backdropFilter: 'blur(12px)' }}
    >
      <button onClick={handleLogoClick} className="flex items-center">
        <img
          src={logoSymbol}
          alt="Le Surligneur — accueil"
          className="h-9 w-9 rounded-lg object-contain"
        />
      </button>

      <nav className="flex items-center gap-2 md:gap-4">
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
