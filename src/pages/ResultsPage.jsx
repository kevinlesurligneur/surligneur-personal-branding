import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from '../components/layout/Header'
import { getProfile, ARCHETYPES } from '../data/profiles'
import { getProfileFromScores } from '../data/quiz'
import { PROFILE_ANALYSIS } from '../data/profileAnalysis'

const ARCHETYPE_ORDER = [
  { letter: 'E', id: 'expert' },
  { letter: 'G', id: 'grande-gueule' },
  { letter: 'L', id: 'leader' },
  { letter: 'X', id: 'explorateur' },
]

const ARC_LETTER = { expert: 'E', 'grande-gueule': 'G', leader: 'L', explorateur: 'X' }

async function fetchClaudeAnalysis(profile, scores, total) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) return null

  const pct = (id) => {
    const l = ARC_LETTER[id]
    return total > 0 ? Math.round((scores[l] / total) * 100) : 0
  }

  const prompt = `Tu es expert en personal branding LinkedIn pour Le Surligneur.
Profil obtenu : ${profile.name} — ${ARCHETYPES[profile.major]?.label} (majeur, ${pct(profile.major)}%) + ${ARCHETYPES[profile.minor]?.label} (mineur, ${pct(profile.minor)}%)
Scores : Expert ${pct('expert')}%, Grande Gueule ${pct('grande-gueule')}%, Leader ${pct('leader')}%, Explorateur ${pct('explorateur')}%

Génère en JSON strict (sans markdown) :
{
  "motivation": "2-3 phrases sur ce qui motive cette personnalité dans la communication LinkedIn, en tutoyant la personne",
  "forces": ["Force 1 (phrase courte)", "Force 2", "Force 3", "Force 4"],
  "limites": ["Limite 1 (phrase courte)", "Limite 2", "Limite 3"],
  "blocage": "Un paragraphe (3-4 phrases) sur ce qui peut bloquer cette personnalité dans son personal branding, en tutoyant",
  "conseils": ["Conseil concret et actionnable 1", "Conseil 2", "Conseil 3", "Conseil 4"]
}`

  try {
    const res = await fetch('/api/anthropic/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return JSON.parse(data.content?.[0]?.text || 'null')
  } catch {
    return null
  }
}

function ScoreBar({ archetype, score, total, delay }) {
  const [width, setWidth] = useState(0)
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const arc = ARCHETYPES[archetype]

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300 + delay)
    return () => clearTimeout(t)
  }, [pct, delay])

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-base">{arc.icon}</span>
          <span className="text-sm font-medium text-text-primary print:text-black">{arc.labelShort || arc.label}</span>
        </div>
        <span className="text-sm font-bold" style={{ color: arc.textColor }}>{pct}%</span>
      </div>
      <div className="h-2 bg-border-subtle rounded-full overflow-hidden print:bg-gray-200">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, backgroundColor: arc.color }}
        />
      </div>
    </div>
  )
}

function Section({ delay = 0, className = '', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Card({ className = '', children }) {
  return (
    <div className={`bg-bg-card border border-border-subtle rounded-3xl p-6 md:p-7 print:bg-white print:border-gray-200 print:rounded-xl print:shadow-none ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({ icon, label }) {
  return (
    <h3 className="font-display font-bold text-text-primary text-lg mb-4 flex items-center gap-2 print:text-black">
      <span>{icon}</span> {label}
    </h3>
  )
}

function ExampleAvatar({ ex, arc }) {
  const [imgError, setImgError] = useState(false)
  const showImg = ex.avatar && !imgError

  return (
    <div className="flex flex-col items-center text-center gap-2">
      {showImg ? (
        <img
          src={ex.avatar}
          alt={ex.name}
          onError={() => setImgError(true)}
          className="w-14 h-14 rounded-full object-cover object-top border-2 print:border-gray-200"
          style={{ borderColor: arc?.borderColor || 'rgba(255,255,255,0.1)' }}
        />
      ) : (
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${arc?.color}cc, ${arc?.color}55)` }}
        >
          {ex.initials}
        </div>
      )}
      <div>
        <p className="text-text-primary text-xs font-medium leading-tight print:text-black">{ex.name}</p>
        <p className="text-text-faint text-xs print:text-gray-400">{ex.type === 'fiction' ? 'Personnage' : 'Créateur·ice'}</p>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  // Auto-select client gender when coming from admin
  const [gender, setGender] = useState(() => {
    if (state?.leadGender === 'femme') return 'feminine'
    return 'masculine'
  })
  const [analysis, setAnalysis] = useState(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(true)
  const printRef = useRef(null)

  useEffect(() => {
    if (!state?.scores || !state?.profileId) {
      navigate('/test', { replace: true })
    }
  }, [state, navigate])

  const scores = state?.scores || { E: 0, G: 0, L: 0, X: 0 }
  const profileId = state?.profileId || 'sniper'
  const total = Object.values(scores).reduce((a, b) => a + b, 0)
  const profile = getProfile(profileId, gender)

  useEffect(() => {
    if (!profile) return
    setLoadingAnalysis(true)
    fetchClaudeAnalysis(profile, scores, total).then(result => {
      setAnalysis(result)
      setLoadingAnalysis(false)
    })
  }, [profileId])

  if (!state?.scores || !profile) return null

  const majorArc = ARCHETYPES[profile.major]
  const minorArc = ARCHETYPES[profile.minor]
  const staticAnalysis = PROFILE_ANALYSIS[profileId]

  const motivation = analysis?.motivation || staticAnalysis?.motivation || profile.description
  const forces = analysis?.forces || staticAnalysis?.forces || []
  const limites = analysis?.limites || staticAnalysis?.limites || []
  const blocage = analysis?.blocage || staticAnalysis?.blocage || null
  const conseils = analysis?.conseils || staticAnalysis?.conseils || []

  return (
    <div className="min-h-screen bg-bg-primary print:bg-white">
      <div className="print:hidden">
        <Header />
      </div>

      {/* Print header */}
      <div className="hidden print:block pt-6 pb-4 px-8 border-b border-gray-200">
        <p className="text-sm text-gray-500">Le Surligneur — Test des 12 Personnalités du Personal Branding</p>
      </div>

      <main ref={printRef} className="pt-24 pb-20 px-6 print:pt-8 print:pb-8">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Top action bar */}
          <Section delay={0} className="print:hidden">
            <div className="flex items-center justify-between">
              {state?.fromAdmin ? (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-sm text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
                >
                  ← Retour au dashboard
                </button>
              ) : (
                <Link to="/" className="text-sm text-text-muted hover:text-text-primary transition-colors">
                  ← Les 12 profils
                </Link>
              )}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.print()}
                className="flex items-center gap-2 text-sm font-semibold bg-bg-card border border-border-subtle px-4 py-2 rounded-xl text-text-primary hover:border-brand-cyan/40 hover:text-brand-cyan transition-all"
              >
                <span>📄</span>
                Télécharger en PDF
              </motion.button>
            </div>
          </Section>

          {/* Admin context banner */}
          {state?.fromAdmin && state?.leadName && (
            <Section delay={0.02} className="print:hidden">
              <div
                className="rounded-2xl px-4 py-3 flex items-center gap-3"
                style={{ background: 'rgba(0,212,245,0.06)', border: '1px solid rgba(0,212,245,0.2)' }}
              >
                <span className="text-lg">👤</span>
                <div>
                  <p className="text-sm font-semibold text-brand-cyan">
                    {state.leadName}
                  </p>
                  <p className="text-xs text-text-faint">Vue admin — résultats du test</p>
                </div>
              </div>
            </Section>
          )}

          {/* Profile hero */}
          <Section delay={0.05}>
            <Card>
              <div className="text-center">
                <div className="text-6xl mb-4">{profile.emoji}</div>
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  {majorArc && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full border"
                      style={{ color: majorArc.textColor, borderColor: majorArc.borderColor, background: majorArc.colorBg }}>
                      {majorArc.labelShort || majorArc.label} (majeur)
                    </span>
                  )}
                  {minorArc && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full border"
                      style={{ color: minorArc.textColor, borderColor: minorArc.borderColor, background: minorArc.colorBg }}>
                      {minorArc.labelShort || minorArc.label} (mineur)
                    </span>
                  )}
                </div>
                <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-3 print:text-black">
                  {profile.name}
                </h1>
                <div className="bg-bg-primary/60 border border-border-subtle rounded-2xl p-4 mb-5 print:bg-gray-50 print:border-gray-200">
                  <p className="text-text-muted text-sm leading-relaxed italic print:text-gray-600">
                    "{profile.quote}"
                  </p>
                </div>

                {/* Gender toggle */}
                <div className="print:hidden inline-flex items-center gap-1 bg-bg-primary border border-border-subtle rounded-full p-1">
                  {[['masculine', 'Version masculine'], ['feminine', 'Version féminine']].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setGender(val)}
                      className={`text-xs font-medium px-4 py-1.5 rounded-full transition-all duration-200 ${
                        gender === val ? 'bg-brand-cyan text-bg-primary' : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </Section>

          {/* Motivation */}
          <Section delay={0.1}>
            <Card>
              <SectionTitle icon="🎯" label="Ce qui te motive" />
              <p className="text-text-muted text-sm leading-relaxed print:text-gray-700">{motivation}</p>
            </Card>
          </Section>

          {/* Content style */}
          <Section delay={0.15}>
            <Card>
              <SectionTitle icon="✍️" label="Ton style de contenu" />
              <p className="text-text-muted text-sm leading-relaxed print:text-gray-700">{profile.contentStyle}</p>
              {profile.keywords?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {profile.keywords.map((kw, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 text-brand-cyan print:border-blue-300 print:bg-blue-50 print:text-blue-700">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </Section>

          {/* Forces + Limites */}
          {(forces.length > 0 || limites.length > 0) && (
            <Section delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {forces.length > 0 && (
                  <Card>
                    <SectionTitle icon="💪" label="Tes forces" />
                    <ul className="space-y-2.5">
                      {forces.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-green-400 text-xs mt-0.5 flex-shrink-0 print:text-green-600">✅</span>
                          <span className="text-text-muted text-sm leading-relaxed print:text-gray-700">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
                {limites.length > 0 && (
                  <Card>
                    <SectionTitle icon="⚡" label="Tes limites" />
                    <ul className="space-y-2.5">
                      {limites.map((l, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="text-yellow-400 text-xs mt-0.5 flex-shrink-0 print:text-yellow-600">⚡</span>
                          <span className="text-text-muted text-sm leading-relaxed print:text-gray-700">{l}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </div>
            </Section>
          )}

          {/* Blocage */}
          {blocage && (
            <Section delay={0.25}>
              <Card>
                <SectionTitle icon="🚧" label="Ce qui te bloque" />
                <p className="text-text-muted text-sm leading-relaxed print:text-gray-700">{blocage}</p>
              </Card>
            </Section>
          )}

          {/* Conseils */}
          {conseils.length > 0 && (
            <Section delay={0.3}>
              <Card>
                <SectionTitle icon="🚀" label="Conseils pour passer au niveau supérieur" />
                <ul className="space-y-3">
                  {conseils.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-brand-cyan text-xs mt-1 flex-shrink-0 print:text-blue-500">💡</span>
                      <span className="text-text-muted text-sm leading-relaxed print:text-gray-700">{c}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Section>
          )}

          {/* Loading placeholder for Claude analysis */}
          {loadingAnalysis && (
            <Section delay={0.2}>
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 flex items-center justify-center animate-pulse">✨</div>
                  <span className="text-text-muted text-sm">Analyse personnalisée en cours…</span>
                </div>
                <div className="space-y-2">
                  {[90, 75, 85, 60].map((w, i) => (
                    <div key={i} className="h-3 bg-border-subtle/60 rounded-full animate-pulse" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </Card>
            </Section>
          )}

          {/* Exemples inspirants */}
          {profile.examples?.length > 0 && (
            <Section delay={0.35}>
              <Card>
                <SectionTitle icon="⭐" label="Personnalités de ce type" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {profile.examples.map((ex, i) => {
                    const arc = ARCHETYPES[profile.major]
                    return (
                      <ExampleAvatar key={i} ex={ex} arc={arc} />
                    )
                  })}
                </div>
              </Card>
            </Section>
          )}

          {/* Scores */}
          <Section delay={0.4}>
            <Card>
              <SectionTitle icon="📊" label="Répartition de tes points" />
              <div className="space-y-4 mb-6">
                {ARCHETYPE_ORDER.map(({ letter, id }, i) => (
                  <ScoreBar
                    key={id}
                    archetype={id}
                    score={scores[letter] || 0}
                    total={total}
                    delay={i * 120}
                  />
                ))}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {ARCHETYPE_ORDER.map(({ letter, id }) => {
                  const arc = ARCHETYPES[id]
                  return (
                    <div key={id} className="text-center rounded-2xl border border-border-subtle p-3 print:border-gray-200">
                      <p className="text-xl font-bold font-display" style={{ color: arc.textColor }}>
                        {scores[letter] || 0}
                      </p>
                      <p className="text-text-faint text-xs mt-1 print:text-gray-500">{arc.labelShort || arc.label}</p>
                    </div>
                  )
                })}
              </div>
            </Card>
          </Section>

          {/* Actions */}
          <Section delay={0.45} className="print:hidden">
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,212,245,0.25)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.print()}
                className="btn-primary w-full justify-center py-4 text-base"
              >
                <span>📄</span>
                Télécharger en PDF
              </motion.button>
              <Link to={`/profil/${profileId}`}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="btn-ghost w-full justify-center py-3 cursor-pointer"
                >
                  <span>📖</span>
                  Voir le profil complet
                </motion.div>
              </Link>
              <button
                onClick={() => navigate('/test')}
                className="text-center text-sm text-text-faint hover:text-text-muted transition-colors py-2"
              >
                Recommencer le test →
              </button>
            </div>
          </Section>

          {/* Print footer */}
          <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">Méthodologie exclusive du Groupe Le Crayon · lesurligneur.fr</p>
          </div>

        </div>
      </main>
    </div>
  )
}
