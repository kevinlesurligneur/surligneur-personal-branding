import { Link } from 'react-router-dom'
import logoHorizontal from '../../assets/logo-horizontal.png'

export function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-24 py-10 px-6 md:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img
            src={logoHorizontal}
            alt="Le Surligneur"
            className="h-6 object-contain opacity-70"
          />
        </div>

        <p className="text-text-faint text-sm text-center">
          Méthodologie exclusive du Groupe Le Crayon · Tous droits réservés
        </p>

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
    </footer>
  )
}
