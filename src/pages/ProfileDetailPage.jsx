import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { ProfileIllustration } from '../components/home/ProfileIllustration'
import { getProfile, ARCHETYPES } from '../data/profiles'
import { PROFILE_ANALYSIS } from '../data/profileAnalysis'
import { EXAMPLE_BIOS } from '../data/exampleBios'

function Section({ delay = 0, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHeading({ icon, label, color }) {
  return (
    <h2 className="font-display font-bold text-xl text-text-primary flex items-center gap-2 mb-4">
      <span>{icon}</span>
      <span style={color ? { color } : {}}>{label}</span>
    </h2>
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-bg-card border border-border-subtle rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  )
}

function ExampleCard({ ex, arcColor, arcTextColor }) {
  const [imgError, setImgError] = useState(false)
  const showImg = ex.avatar && !imgError
  const bio = EXAMPLE_BIOS[ex.name]

  return (
    <Card className="flex flex-col items-center text-center gap-3">
      {showImg ? (
        <img
          src={ex.avatar}
          alt={ex.name}
          onError={() => setImgError(true)}
          className="w-16 h-16 rounded-full object-cover object-top border-2 flex-shrink-0"
          style={{ borderColor: `${arcColor}44` }}
        />
      ) : (
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${arcColor}cc, ${arcColor}55)` }}
        >
          {ex.initials}
        </div>
      )}
      <div>
        <p className="font-semibold text-sm mb-1" style={{ color: arcTextColor }}>{ex.name}</p>
        {bio && (
          <p className="text-text-faint text-xs leading-relaxed">{bio}</p>
        )}
      </div>
    </Card>
  )
}

export default function ProfileDetailPage() {
  const { id } = useParams()
  const [gender, setGender] = useState('masculine')
  const profile = getProfile(id, gender)
  const analysis = PROFILE_ANALYSIS[id]

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-text-muted">Profil introuvable.</p>
          <Link to="/" className="text-brand-cyan hover:underline text-sm">← Retour à l'accueil</Link>
        </div>
      </div>
    )
  }

  const major = ARCHETYPES[profile.major]
  const minor = ARCHETYPES[profile.minor]

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Back + gender toggle */}
          <Section delay={0} className="flex items-center justify-between mb-10">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-text-muted hover:text-brand-cyan transition-colors text-sm"
            >
              ← Tous les profils
            </Link>
            <div className="inline-flex items-center gap-1 bg-bg-card border border-border-subtle rounded-full p-1">
              {[['masculine', '♂'], ['feminine', '♀']].map(([val, icon]) => (
                <button
                  key={val}
                  onClick={() => setGender(val)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
                    gender === val ? 'bg-brand-cyan text-bg-primary' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {icon} {val === 'masculine' ? 'Masculin' : 'Féminin'}
                </button>
              ))}
            </div>
          </Section>

          {/* Hero */}
          <Section delay={0.05} className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <ProfileIllustration majorId={profile.major} emoji={profile.emoji} size="lg" />
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary mb-4 leading-tight">
              {profile.name}
            </h1>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span
                className="text-sm font-semibold px-3 py-1.5 rounded-full border"
                style={{ color: major?.textColor, borderColor: major?.borderColor, background: major?.colorBg }}
              >
                {major?.icon} {major?.labelShort || major?.label} (majeur)
              </span>
              <span
                className="text-sm font-semibold px-3 py-1.5 rounded-full border"
                style={{ color: minor?.textColor, borderColor: minor?.borderColor, background: minor?.colorBg }}
              >
                {minor?.icon} {minor?.labelShort || minor?.label} (mineur)
              </span>
            </div>
            <p className="text-text-faint text-sm">{profile.tagline}</p>
          </Section>

          {/* Quote */}
          <Section delay={0.1} className="mb-6">
            <div
              className="rounded-2xl p-5 border"
              style={{ background: `${major?.colorBg}88`, borderColor: major?.borderColor }}
            >
              <p className="text-text-primary text-base leading-relaxed italic">
                <span className="text-lg mr-2">⏱️</span>
                "{profile.quote}"
              </p>
            </div>
          </Section>

          {/* Motivation */}
          {analysis?.motivation && (
            <Section delay={0.13} className="mb-6">
              <Card>
                <SectionHeading icon="📌" label="Ce qui te motive" color={major?.color} />
                <p className="text-text-muted text-sm leading-relaxed">{analysis.motivation}</p>
              </Card>
            </Section>
          )}

          {/* Style de contenu */}
          <Section delay={0.16} className="mb-6">
            <Card>
              <SectionHeading icon="✍️" label="Ton style de contenu" color={major?.color} />
              <p className="text-text-muted text-sm leading-relaxed mb-3">{profile.description}</p>
              <p className="text-text-muted text-sm leading-relaxed">{profile.contentStyle}</p>
              {profile.keywords?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border-subtle">
                  {profile.keywords.map(kw => (
                    <span
                      key={kw}
                      className="text-xs font-medium px-3 py-1 rounded-full border"
                      style={{ color: major?.textColor, borderColor: major?.borderColor, background: major?.colorBg }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </Section>

          {/* Forces + Limites */}
          {analysis && (analysis.forces?.length > 0 || analysis.limites?.length > 0) && (
            <Section delay={0.19} className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {analysis.forces?.length > 0 && (
                  <Card>
                    <SectionHeading icon="💡" label="Tes forces" />
                    <ul className="space-y-3">
                      {analysis.forces.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-green-400 text-xs mt-0.5 flex-shrink-0">✅</span>
                          <span className="text-text-muted text-sm leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
                {analysis.limites?.length > 0 && (
                  <Card>
                    <SectionHeading icon="⚡" label="Tes limites" />
                    <ul className="space-y-3">
                      {analysis.limites.map((l, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-yellow-400 text-xs mt-0.5 flex-shrink-0">⚡</span>
                          <span className="text-text-muted text-sm leading-relaxed">{l}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>
            </Section>
          )}

          {/* Blocage */}
          {analysis?.blocage && (
            <Section delay={0.22} className="mb-6">
              <Card>
                <SectionHeading icon="🚧" label="Ce qui te bloque" color={major?.color} />
                <p className="text-text-muted text-sm leading-relaxed">{analysis.blocage}</p>
              </Card>
            </Section>
          )}

          {/* Conseils */}
          {analysis?.conseils?.length > 0 && (
            <Section delay={0.25} className="mb-6">
              <Card>
                <SectionHeading icon="🚀" label="Conseils pour passer au niveau supérieur" color={major?.color} />
                <ul className="space-y-3">
                  {analysis.conseils.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-brand-cyan text-xs mt-0.5 flex-shrink-0">💡</span>
                      <span className="text-text-muted text-sm leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Section>
          )}

          {/* Personnalités célèbres */}
          {profile.examples?.length > 0 && (
            <Section delay={0.28} className="mb-10">
              <SectionHeading icon="⭐" label="Personnalités célèbres de ce type" />
              <div className="grid grid-cols-2 gap-4">
                {profile.examples.map((ex, i) => (
                  <ExampleCard
                    key={i}
                    ex={ex}
                    arcColor={major?.color}
                    arcTextColor={major?.textColor}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* CTAs */}
          <Section delay={0.3} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/test"
              className="btn-primary justify-center py-3.5 px-8"
            >
              🎯 Passer le test de personnalité
            </Link>
            <Link
              to="/"
              className="btn-ghost justify-center py-3.5 px-8"
            >
              Voir tous les profils
            </Link>
          </Section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
