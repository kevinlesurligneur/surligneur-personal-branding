import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import HomePage from './pages/HomePage'
import ProfileDetailPage from './pages/ProfileDetailPage'
import QuizPage from './pages/QuizPage'
import LeadFormPage from './pages/LeadFormPage'
import ResultsPage from './pages/ResultsPage'
import AdminPage from './pages/AdminPage'
import LegalPage from './pages/LegalPage'
import { ScrollToTop } from './components/common/ScrollToTop'

/** Wrapper appliqué à chaque page pour la transition d'entrée / sortie */
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

/** Routes animées — doit être dans BrowserRouter pour accéder à useLocation */
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"                element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/profil/:id"      element={<PageTransition><ProfileDetailPage /></PageTransition>} />
        <Route path="/test"            element={<PageTransition><QuizPage /></PageTransition>} />
        <Route path="/formulaire"      element={<PageTransition><LeadFormPage /></PageTransition>} />
        <Route path="/resultats"       element={<PageTransition><ResultsPage /></PageTransition>} />
        <Route path="/admin"           element={<PageTransition><AdminPage /></PageTransition>} />
        <Route path="/mentions-legales" element={<PageTransition><LegalPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
