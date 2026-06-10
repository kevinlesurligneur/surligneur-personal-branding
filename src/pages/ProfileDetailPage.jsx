import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { ProfileIllustration } from '../components/home/ProfileIllustration'
import { ExamplesAvatars } from '../components/home/ExamplesAvatars'
import { getProfile, ARCHETYPES } from '../data/profiles'

const tagColors = {
  expert: '#93C5FD',
  'grande-gueule': '#FCA5A5',
  leader: '#FCD34D',
  explorateur: '#6EE7B7',
}

const tagBg = {
  expert: 'rgba(59,130,246,0.1)',
  'grande-gueule': 'rgba(239,68,68,0.1)',
  leader: 'rgba(245,158,11,0.1)',
  explorateur: 'rgba(16,185,129,0.1)',
}

export default function ProfileDetailPage() {
  const { id } = useParams()
  const profile = getProfile(id)

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center">
        <Header />
        <p className="text-text-muted">Profil introuvable.</p>
        <Link to="/" className="mt-4 text-brand-cyan hover:underline">← Retour à l'accueil</Link>
      </div>
    )
  }

  const major = ARCHETYPES[profile.major]
  const minor = ARCHETYPES[profile.minor]

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-brand-cyan transition-colors text-sm mb-10">
              ← Tous les profils
            </Link>
          </motion.div>

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-border-subtle bg-bg-card overflow-hidden mb-8"
            style={{ borderTopColor: major?.color }}
          >
            <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${major?.color}80, ${major?.color}20)` }} />
            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
              <ProfileIllustration majorId={profile.major} emoji={profile.emoji} size="lg" />
              <div className="flex-1 text-center md:text-left">
                <h1 className="font-display font-extrabold text-4xl text-text-primary mb-3">{profile.name}</h1>
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full mb-4"
                  style={{ color: tagColors[profile.major], border: `1px solid ${tagColors[profile.major]}40`, background: tagBg[profile.major] }}
                >
                  🎯 {major?.label} (majeur) – {minor?.labelShort || minor?.label} (mineur)
                </span>
                <blockquote
                  className="text-text-muted italic leading-relaxed text-base"
                  style={{ borderLeft: `3px solid ${major?.color}60`, paddingLeft: '1rem' }}
                >
                  "{profile.quote}"
                </blockquote>
              </div>
            </div>
          </motion.div>

          {/* Detail sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {[
              { icon: '⚡', label: 'Super-pouvoir', value: profile.superpower },
              { icon: '⚠️', label: 'Point de vigilance', value: profile.vigilance },
              { icon: '✍️', label: 'Style de contenu', value: profile.contentStyle },
            ].map(({ icon, label, value }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl border border-border-subtle bg-bg-card p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{icon}</span>
                  <h3 className="font-display font-semibold text-sm text-text-muted uppercase tracking-wider">{label}</h3>
                </div>
                <p className="text-text-primary text-sm leading-relaxed">{value}</p>
              </motion.div>
            ))}

            {/* Keywords */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-border-subtle bg-bg-card p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span>🏷️</span>
                <h3 className="font-display font-semibold text-sm text-text-muted uppercase tracking-wider">Mots-clés</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.keywords.map(kw => (
                  <span
                    key={kw}
                    className="text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ color: tagColors[profile.major], background: tagBg[profile.major], border: `1px solid ${tagColors[profile.major]}30` }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl border border-border-subtle bg-bg-card p-6 mb-8"
          >
            <ExamplesAvatars examples={profile.examples} />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-text-muted mb-5">Ce profil te ressemble ? Passe le test pour confirmer.</p>
            <Link
              to="/test"
              className="btn-primary inline-flex"
            >
              🎯 Passer le test de personnalité
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
