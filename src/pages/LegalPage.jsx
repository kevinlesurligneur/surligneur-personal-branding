import { Link } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-10">
          <Link
            to="/"
            className="text-sm text-text-faint hover:text-brand-cyan transition-colors flex items-center gap-2 mb-8"
          >
            ← Retour à l'accueil
          </Link>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-3">
            Mentions légales & Politique de confidentialité
          </h1>
          <p className="text-text-faint text-sm">Dernière mise à jour : juin 2025</p>
        </div>

        <div className="space-y-10 text-text-muted leading-relaxed">

          {/* Éditeur */}
          <section className="space-y-3">
            <h2 className="font-display font-semibold text-lg text-text-primary">Éditeur du site</h2>
            <p>
              Ce site est édité par <strong className="text-text-primary">Le Surligneur</strong>, marque du{' '}
              <strong className="text-text-primary">Groupe Le Crayon</strong>.
            </p>
            <p>
              Pour toute question, vous pouvez nous contacter à :{' '}
              <a
                href="mailto:kevinc@lecrayongroupe.fr"
                className="text-brand-cyan hover:underline"
              >
                kevinc@lecrayongroupe.fr
              </a>
            </p>
          </section>

          {/* Données collectées */}
          <section className="space-y-3">
            <h2 className="font-display font-semibold text-lg text-text-primary">Données collectées</h2>
            <p>
              Dans le cadre du test de personnalité Personal Branding, nous collectons les informations suivantes :
            </p>
            <ul className="list-none space-y-2 pl-0">
              {[
                'Votre prénom et nom',
                'Votre adresse e-mail',
                'Votre intitulé de poste ou activité professionnelle',
                'Vos réponses au questionnaire de personnalité',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand-cyan mt-1 shrink-0">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Utilisation des données */}
          <section className="space-y-3">
            <h2 className="font-display font-semibold text-lg text-text-primary">Utilisation de vos données</h2>
            <p>
              Vos données sont utilisées <strong className="text-text-primary">exclusivement</strong> aux fins suivantes :
            </p>
            <ul className="list-none space-y-2 pl-0">
              {[
                'Vous envoyer votre profil Personal Branding par e-mail',
                'Permettre à notre équipe de préparer votre accompagnement personnalisé',
                'Vous recontacter dans le cadre d\'une éventuelle collaboration',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand-cyan mt-1 shrink-0">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div
              className="rounded-2xl p-5 mt-4"
              style={{ background: 'rgba(0,212,245,0.05)', border: '1px solid rgba(0,212,245,0.15)' }}
            >
              <p className="text-sm">
                <strong className="text-brand-cyan">Nous ne vendons pas, ne louons pas et n'utilisons pas vos données</strong>{' '}
                à des fins publicitaires, promotionnelles ou de prospection commerciale à destination de tiers.
                Vos informations restent strictement confidentielles et ne sont jamais transmises à des partenaires externes.
              </p>
            </div>
          </section>

          {/* Conservation */}
          <section className="space-y-3">
            <h2 className="font-display font-semibold text-lg text-text-primary">Conservation des données</h2>
            <p>
              Vos données sont conservées pendant la durée nécessaire à la réalisation des finalités décrites ci-dessus,
              et au maximum <strong className="text-text-primary">3 ans</strong> à compter de votre dernière interaction avec nos services.
            </p>
          </section>

          {/* Droits */}
          <section className="space-y-3">
            <h2 className="font-display font-semibold text-lg text-text-primary">Vos droits</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
              vous disposez des droits suivants :
            </p>
            <ul className="list-none space-y-2 pl-0">
              {[
                'Droit d\'accès à vos données personnelles',
                'Droit de rectification des informations inexactes',
                'Droit à l\'effacement (droit à l\'oubli)',
                'Droit d\'opposition au traitement de vos données',
                'Droit à la portabilité de vos données',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand-cyan mt-1 shrink-0">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à{' '}
              <a href="mailto:kevinc@lecrayongroupe.fr" className="text-brand-cyan hover:underline">
                kevinc@lecrayongroupe.fr
              </a>
              . Nous répondrons dans un délai maximum de 30 jours.
            </p>
          </section>

          {/* Propriété intellectuelle */}
          <section className="space-y-3">
            <h2 className="font-display font-semibold text-lg text-text-primary">Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur ce site — textes, méthodologie, noms de profils, visuels, logo et marque
              «&nbsp;Le Surligneur&nbsp;» — sont la propriété exclusive du{' '}
              <strong className="text-text-primary">Groupe Le Crayon</strong>.
            </p>
            <p>
              Toute reproduction, diffusion ou exploitation, même partielle, sans autorisation écrite préalable est strictement interdite
              et constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
            </p>
            <p className="text-sm text-text-faint">
              © {new Date().getFullYear()} Le Surligneur — Groupe Le Crayon. Tous droits réservés.
            </p>
          </section>

          {/* Cookies */}
          <section className="space-y-3">
            <h2 className="font-display font-semibold text-lg text-text-primary">Cookies</h2>
            <p>
              Ce site n'utilise pas de cookies de tracking ou publicitaires. Les seules données de session stockées
              localement (localStorage) servent à mémoriser temporairement vos réponses au test, uniquement pour
              le bon fonctionnement de l'application.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
