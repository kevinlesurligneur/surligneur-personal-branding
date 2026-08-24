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

const ICONS = {
  motive: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>,
  style: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"/></svg>,
  forces: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>,
  limites: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>,
  blocage: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/></svg>,
  conseils: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"/></svg>,
  exemples: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/></svg>,
}

function SectionHeading({ iconName, label, color }) {
  return (
    <h2 className="font-display font-bold text-xl text-text-primary flex items-center gap-2.5 mb-4">
      <span style={{ color: color || 'rgba(255,255,255,0.35)' }}>{ICONS[iconName]}</span>
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
              className="rounded-2xl px-6 py-5 border-l-4"
              style={{ borderLeftColor: major?.color, background: `${major?.colorBg}55` }}
            >
              <p className="text-text-primary text-base leading-relaxed italic">
                "{profile.quote}"
              </p>
            </div>
          </Section>

          {/* Motivation */}
          {analysis?.motivation && (
            <Section delay={0.13} className="mb-6">
              <Card>
                <SectionHeading iconName="motive" label="Ce qui te motive" color={major?.color} />
                <p className="text-text-muted text-sm leading-relaxed">{analysis.motivation}</p>
              </Card>
            </Section>
          )}

          {/* Style de contenu */}
          <Section delay={0.16} className="mb-6">
            <Card>
              <SectionHeading iconName="style" label="Ton style de contenu" color={major?.color} />
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
                    <SectionHeading iconName="forces" label="Tes forces" color="rgba(74,222,128,0.8)" />
                    <ul className="space-y-3">
                      {analysis.forces.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(74,222,128)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
                          <span className="text-text-muted text-sm leading-relaxed">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
                {analysis.limites?.length > 0 && (
                  <Card>
                    <SectionHeading iconName="limites" label="Tes limites" color="rgba(251,191,36,0.8)" />
                    <ul className="space-y-3">
                      {analysis.limites.map((l, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgb(251,191,36)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/></svg>
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
                <SectionHeading iconName="blocage" label="Ce qui te bloque" color={major?.color} />
                <p className="text-text-muted text-sm leading-relaxed">{analysis.blocage}</p>
              </Card>
            </Section>
          )}

          {/* Conseils */}
          {analysis?.conseils?.length > 0 && (
            <Section delay={0.25} className="mb-6">
              <Card>
                <SectionHeading iconName="conseils" label="Conseils pour passer au niveau supérieur" color={major?.color} />
                <ul className="space-y-3">
                  {analysis.conseils.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,245,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><path d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"/></svg>
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
              <SectionHeading iconName="exemples" label="Personnalités célèbres de ce type" />
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
