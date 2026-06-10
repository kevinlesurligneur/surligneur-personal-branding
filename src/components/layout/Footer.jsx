import { Link } from 'react-router-dom'
import logoHorizontal from '../../assets/logo-horizontal.png'

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-24 py-10 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">

        {/* Logo — cliquable pour remonter en haut */}
        <div className="flex-1 flex justify-center md:justify-start">
          <button onClick={scrollToTop} className="opacity-70 hover:opacity-100 transition-opacity">
            <img
              src={logoHorizontal}
              alt="Le Surligneur — retour en haut"
              className="h-6 object-contain"
            />
          </button>
        </div>

        {/* Texte centré */}
        <div className="flex-1 flex justify-center">
          <p className="text-text-faint text-sm text-center">
            Méthodologie exclusive du Groupe Le Crayon · Tous droits réservés
          </p>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex justify-center md:justify-end">
          <nav className="flex items-center gap-6">
            <Link to="/test" className="text-sm text-text-muted hover:text-brand-cyan transition-colors">
              Passer le test
            </Link>
            <Link to="/mentions-legales" className="text-sm text-text-muted hover:text-brand-cyan transition-colors">
              Mentions légales
            </Link>
            <Link to="/admin" className="text-sm text-text-faint hover:text-text-muted transition-colors">
              Admin
            </Link>
          </nav>
        </div>

      </div>
    </footer>
  )
}
