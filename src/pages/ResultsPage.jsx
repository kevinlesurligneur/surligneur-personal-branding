import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import confetti from 'canvas-confetti'
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

// ── Radar Chart ──────────────────────────────────────────────────────────────

function RadarChart({ scores, total }) {
  const S = 260, C = 130, R = 88, LR = 115

  const p = k => (total > 0 ? scores[k] / total : 0)

  const axes = [
    { key: 'E', id: 'expert',        angle: -90, anchor: 'middle', name: 'Expert' },
    { key: 'G', id: 'grande-gueule', angle:   0, anchor: 'start',  name: 'Gde Gueule' },
    { key: 'L', id: 'leader',        angle:  90, anchor: 'middle', name: 'Leader' },
    { key: 'X', id: 'explorateur',   angle: 180, anchor: 'end',    name: 'Explorateur' },
  ]

  const pt = (angle, r) => {
    const rad = (angle * Math.PI) / 180
    return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) }
  }

  const gridPoly = lvl =>
    axes.map(({ angle }) => { const { x, y } = pt(angle, R * lvl); return `${x},${y}` }).join(' ')

  const dataPts = axes.map(({ key, angle }) => pt(angle, Math.max(p(key) * R, 3)))
  const polygon = dataPts.map(({ x, y }) => `${x},${y}`).join(' ')

  return (
    <div className="flex justify-center py-4">
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ overflow: 'visible' }}>
        {/* Grid polygons */}
        {[0.25, 0.5, 0.75, 1].map(lvl => (
          <polygon key={lvl} points={gridPoly(lvl)}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        ))}
        {/* Axis lines */}
        {axes.map(({ key, angle }) => {
          const { x, y } = pt(angle, R)
          return <line key={key} x1={C} y1={C} x2={x} y2={y}
            stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
        })}
        {/* Data polygon */}
        <polygon points={polygon}
          fill="rgba(0,212,245,0.1)" stroke="rgba(0,212,245,0.65)"
          strokeWidth="2" strokeLinejoin="round" />
        {/* Data dots */}
        {dataPts.map(({ x, y }, i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="#00d4f5"
            style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,245,0.9))' }} />
        ))}
        {/* Labels */}
        {axes.map(({ key, id, angle, anchor, name }) => {
          const lp = pt(angle, LR)
          const arc = ARCHETYPES[id]
          const val = Math.round(p(key) * 100)
          const isTop    = angle === -90
          const isBottom = angle ===  90

          // dy: for top axis, name is above pct; for bottom, name is below pct; for sides, stack normally
          const nameY = lp.y + (isTop ? -10 : isBottom ? -6 : -8)
          const pctY  = lp.y + (isTop ?   6 : isBottom ?  10 :  8)

          return (
            <g key={key}>
              <text x={lp.x} y={nameY} textAnchor={anchor}
                fontSize="8.5" fill="rgba(255,255,255,0.4)"
                fontFamily="system-ui, -apple-system, sans-serif">
                {name}
              </text>
              <text x={lp.x} y={pctY} textAnchor={anchor}
                fontSize="13" fontWeight="700" fill={arc.textColor}
                fontFamily="system-ui, -apple-system, sans-serif">
                {val}%
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ── Score Bar ─────────────────────────────────────────────────────────────────

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
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const printRef = useRef(null)
  const shareCardRef = useRef(null)

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

  // ── Confetti à la révélation du profil (pas en mode admin) ───────────────
  useEffect(() => {
    if (!profile || state?.fromAdmin) return

    const arc = ARCHETYPES[profile.major]
    const colors = [arc.color, arc.textColor, '#00d4f5', '#ffffff', '#fbbf24']

    function fire(ratio, opts) {
      confetti({
        particleCount: Math.floor(90 * ratio),
        colors,
        origin: { x: 0.5, y: 0.45 },
        ...opts,
      })
    }

    const t = setTimeout(() => {
      fire(0.3,  { spread: 30,  startVelocity: 60 })
      fire(0.25, { spread: 70 })
      fire(0.35, { spread: 110, decay: 0.91, scalar: 0.8 })
      fire(0.1,  { spread: 130, startVelocity: 28, decay: 0.92, scalar: 1.2 })
    }, 650)

    return () => clearTimeout(t)
  }, [profileId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!state?.scores || !profile) return null

  const majorArc = ARCHETYPES[profile.major]
  const minorArc = ARCHETYPES[profile.minor]
  const staticAnalysis = PROFILE_ANALYSIS[profileId]

  const motivation = analysis?.motivation || staticAnalysis?.motivation || profile.description
  const forces = analysis?.forces || staticAnalysis?.forces || []
  const limites = analysis?.limites || staticAnalysis?.limites || []
  const blocage = analysis?.blocage || staticAnalysis?.blocage || null
  const conseils = analysis?.conseils || staticAnalysis?.conseils || []

  // ── Share helpers ──────────────────────────────────────────────────────────

  function pct(key) { return total > 0 ? Math.round(scores[key] / total * 100) : 0 }

  function handleCopyText() {
    const text = `${profile.emoji} Je viens de découvrir mon profil Personal Branding avec Le Surligneur !

Je suis ${profile.name}
${majorArc.label} (majeur) · ${minorArc.labelShort || minorArc.label} (mineur)

📊 Ma répartition :
${majorArc.icon} Expert          ${pct('E')}%
📢 Grande Gueule  ${pct('G')}%
🏴 Leader          ${pct('L')}%
🧭 Explorateur     ${pct('X')}%

Testez-vous parmi les 12 personnalités du Personal Branding 👇
https://surligneur-personal-branding.vercel.app

#PersonalBranding #LinkedIn #LeSurligneur`

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  async function handleDownloadCard() {
    if (!shareCardRef.current || downloading) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(shareCardRef.current, { pixelRatio: 2, cacheBust: true })
      const a = document.createElement('a')
      a.download = `profil-${profileId}-lesurligneur.png`
      a.href = dataUrl
      a.click()
    } catch (err) {
      console.error('Erreur génération carte:', err)
    } finally {
      setDownloading(false)
    }
  }

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
                  onClick={() => navigate('/admin', { state: { returnFromResult: true } })}
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

              {/* Radar chart — primary visual */}
              <RadarChart scores={scores} total={total} />

              {/* Score number boxes */}
              <div className="grid grid-cols-4 gap-3 mt-2">
                {ARCHETYPE_ORDER.map(({ letter, id }) => {
                  const arc = ARCHETYPES[id]
                  return (
                    <div key={id} className="text-center rounded-2xl border border-border-subtle p-3 print:border-gray-200"
                      style={{ background: `${arc.colorBg}55` }}>
                      <p className="text-2xl font-bold font-display" style={{ color: arc.textColor }}>
                        {pct(letter)}%
                      </p>
                      <p className="text-text-faint text-xs mt-1 print:text-gray-500">{arc.labelShort || arc.label}</p>
                    </div>
                  )
                })}
              </div>

              {/* Print: keep bars for PDF readability */}
              <div className="hidden print:block space-y-3 mt-4">
                {ARCHETYPE_ORDER.map(({ letter, id }, i) => (
                  <ScoreBar key={id} archetype={id} score={scores[letter] || 0} total={total} delay={i * 120} />
                ))}
              </div>
            </Card>
          </Section>

          {/* LinkedIn Share */}
          <Section delay={0.43} className="print:hidden">
            <Card>
              <SectionTitle icon="📤" label="Partager votre profil" />

              {/* Preview card (visible) */}
              <div className="rounded-2xl overflow-hidden mb-5 border border-border-subtle">
                <div style={{
                  background: 'linear-gradient(160deg, #071e3d 0%, #0d1224 50%, #08080F 100%)',
                  padding: '24px 28px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Glow */}
                  <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '160px', height: '160px',
                    background: `radial-gradient(circle, ${majorArc.color}30 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }} />
                  {/* Top row */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-4xl mb-2">{profile.emoji}</div>
                      <div className="font-display font-bold text-xl text-white leading-tight">{profile.name}</div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ color: majorArc.textColor, background: majorArc.colorBg, border: `1px solid ${majorArc.color}44` }}>
                          {majorArc.labelShort || majorArc.label} majeur
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ color: minorArc.textColor, background: minorArc.colorBg, border: `1px solid ${minorArc.color}44` }}>
                          {minorArc.labelShort || minorArc.label} mineur
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div style={{ color: '#00d4f5', fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em' }}>LE SURLIGNEUR</div>
                      <div className="text-text-faint text-[9px] mt-0.5">Test Personal Branding</div>
                    </div>
                  </div>
                  {/* Mini score bars */}
                  <div className="space-y-2">
                    {ARCHETYPE_ORDER.map(({ letter, id }) => {
                      const arc = ARCHETYPES[id]
                      const p = pct(letter)
                      return (
                        <div key={id} className="flex items-center gap-2">
                          <span className="text-[10px] text-text-faint w-20 shrink-0">{arc.labelShort || arc.label}</span>
                          <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full" style={{ width: `${p}%`, background: arc.color }} />
                          </div>
                          <span className="text-[10px] font-bold w-8 text-right shrink-0" style={{ color: arc.textColor }}>{p}%</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-white/5 text-text-faint text-[9px]">
                    Découvrez votre profil · lesurligneur.fr
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleCopyText}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all duration-200"
                  style={{
                    color: copied ? '#4ade80' : '#00d4f5',
                    borderColor: copied ? 'rgba(74,222,128,0.4)' : 'rgba(0,212,245,0.3)',
                    background: copied ? 'rgba(74,222,128,0.06)' : 'rgba(0,212,245,0.06)',
                  }}
                >
                  <span>{copied ? '✅' : '📋'}</span>
                  {copied ? 'Texte copié !' : 'Copier le texte'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleDownloadCard}
                  disabled={downloading}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-border-subtle text-text-muted hover:text-text-primary hover:border-brand-cyan/30 transition-all duration-200 disabled:opacity-60"
                >
                  <span>{downloading ? '⏳' : '⬇️'}</span>
                  {downloading ? 'Génération…' : "Télécharger l'image"}
                </motion.button>
              </div>
              <p className="text-text-faint text-xs text-center mt-3">
                Copiez le texte · collez-le sur LinkedIn · ajoutez l'image en pièce jointe 🎯
              </p>
            </Card>
          </Section>

          {/* Actions */}
          <Section delay={0.48} className="print:hidden">
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

      {/* Hidden share card — captured by html-to-image */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none', zIndex: -1 }}>
        <div ref={shareCardRef} style={{
          width: '600px',
          height: '315px',
          background: 'linear-gradient(160deg, #071e3d 0%, #0d1224 50%, #08080F 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
          padding: '32px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '200px', height: '200px',
            background: `radial-gradient(circle, ${majorArc.color}30 0%, transparent 70%)`,
          }} />
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '40px', marginBottom: '8px', lineHeight: 1 }}>{profile.emoji}</div>
              <div style={{ color: 'white', fontSize: '26px', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {profile.name}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', border: `1px solid ${majorArc.color}44`, color: majorArc.textColor, background: majorArc.colorBg }}>
                  {majorArc.labelShort || majorArc.label} majeur
                </span>
                <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', border: `1px solid ${minorArc.color}44`, color: minorArc.textColor, background: minorArc.colorBg }}>
                  {minorArc.labelShort || minorArc.label} mineur
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#00d4f5', fontSize: '13px', fontWeight: '800', letterSpacing: '0.08em' }}>LE SURLIGNEUR</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: '3px' }}>Test Personal Branding</div>
            </div>
          </div>
          {/* Score bars */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '18px 0 10px' }}>
            {ARCHETYPE_ORDER.map(({ letter, id }) => {
              const arc = ARCHETYPES[id]
              const p = pct(letter)
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', width: '90px', flexShrink: 0 }}>
                    {arc.labelShort || arc.label}
                  </span>
                  <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                    <div style={{ width: `${p}%`, height: '100%', background: arc.color, borderRadius: '3px' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: arc.textColor, width: '36px', textAlign: 'right', flexShrink: 0 }}>
                    {p}%
                  </span>
                </div>
              )
            })}
          </div>
          {/* Footer */}
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            Découvrez votre profil parmi les 12 personnalités du Personal Branding · lesurligneur.fr
          </div>
        </div>
      </div>

    </div>
  )
}
