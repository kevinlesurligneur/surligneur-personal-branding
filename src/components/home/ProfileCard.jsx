import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ARCHETYPES } from '../../data/profiles'
import { ProfileIllustration } from './ProfileIllustration'
import { ExamplesAvatars } from './ExamplesAvatars'

const archetypeTagStyles = {
  expert: { color: '#93C5FD', border: 'rgba(59,130,246,0.25)', bg: 'rgba(59,130,246,0.08)' },
  'grande-gueule': { color: '#FCA5A5', border: 'rgba(239,68,68,0.25)', bg: 'rgba(239,68,68,0.08)' },
  leader: { color: '#FCD34D', border: 'rgba(245,158,11,0.25)', bg: 'rgba(245,158,11,0.08)' },
  explorateur: { color: '#6EE7B7', border: 'rgba(16,185,129,0.25)', bg: 'rgba(16,185,129,0.08)' },
}

const archetypeBorderHover = {
  expert: 'rgba(59,130,246,0.6)',
  'grande-gueule': 'rgba(239,68,68,0.6)',
  leader: 'rgba(245,158,11,0.6)',
  explorateur: 'rgba(16,185,129,0.6)',
}

const archetypeGlowHover = {
  expert: '0 16px 56px rgba(59,130,246,0.22), 0 0 0 1px rgba(59,130,246,0.6)',
  'grande-gueule': '0 16px 56px rgba(239,68,68,0.22), 0 0 0 1px rgba(239,68,68,0.6)',
  leader: '0 16px 56px rgba(245,158,11,0.22), 0 0 0 1px rgba(245,158,11,0.6)',
  explorateur: '0 16px 56px rgba(16,185,129,0.22), 0 0 0 1px rgba(16,185,129,0.6)',
}

export function ProfileCard({ profile, index = 0 }) {
  const major = ARCHETYPES[profile.major]
  const minor = ARCHETYPES[profile.minor]
  if (!major || !minor) return null

  const tagStyle = archetypeTagStyles[profile.major]

  /* ── 3D tilt ─────────────────────────────────────────────── */
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springCfg = { stiffness: 200, damping: 22, mass: 0.5 }
  const springX   = useSpring(mouseX, springCfg)
  const springY   = useSpring(mouseY, springCfg)
  const rotateY   = useTransform(springX, [-0.5, 0.5], [12, -12])
  const rotateX   = useTransform(springY, [-0.5, 0.5], [-8,   8])

  /* ── Glare overlay ───────────────────────────────────────── */
  const glareOpacity = useMotionValue(0)
  const springGlare  = useSpring(glareOpacity, { stiffness: 300, damping: 25 })
  const glareBg      = useTransform([springX, springY], ([x, y]) => {
    const gx = Math.round((x + 0.5) * 100)
    const gy = Math.round((y + 0.5) * 100)
    return `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.11) 0%, transparent 65%)`
  })

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width  - 0.5)
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5)
  }

  function handleMouseEnter(e) {
    glareOpacity.set(1)
    e.currentTarget.style.borderColor = archetypeBorderHover[profile.major]
    e.currentTarget.style.boxShadow   = archetypeGlowHover[profile.major]
  }

  function handleMouseLeave(e) {
    mouseX.set(0)
    mouseY.set(0)
    glareOpacity.set(0)
    e.currentTarget.style.borderColor = 'var(--border-subtle)'
    e.currentTarget.style.boxShadow   = 'none'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative flex flex-col rounded-3xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
        willChange: 'transform',
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glare */}
      <motion.div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          borderRadius: 'inherit',
          background: glareBg,
          opacity: springGlare,
          zIndex: 2,
        }}
      />

      {/* Top accent line */}
      <div
        className="h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, ${major.color}80, ${major.color}20)` }}
      />

      <div className="flex flex-col flex-1 p-6 gap-5">
        {/* Illustration */}
        <ProfileIllustration majorId={profile.major} emoji={profile.emoji} />

        {/* Name */}
        <div className="text-center">
          <h3 className="font-display font-bold text-xl text-text-primary mb-3">
            {profile.name}
          </h3>

          {/* Archetype badge */}
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ color: tagStyle.color, border: `1px solid ${tagStyle.border}`, background: tagStyle.bg }}
          >
            🎯 {major.label} (majeur) – {minor.labelShort || minor.label} (mineur)
          </span>
        </div>

        {/* Quote */}
        <div
          className="rounded-xl p-4 text-sm text-text-muted leading-relaxed text-center italic"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-text-faint mr-1">🎯</span>
          "{profile.quote}"
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Inspiring examples */}
        <ExamplesAvatars examples={profile.examples} />

        {/* CTA */}
        <Link
          to={`/profil/${profile.id}`}
          className="block w-full text-center py-3 rounded-xl text-sm font-semibold border transition-all duration-200 mt-1"
          style={{
            color: major.textColor,
            borderColor: tagStyle.border,
            background: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background    = tagStyle.bg
            e.currentTarget.style.borderColor   = major.color
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background    = 'transparent'
            e.currentTarget.style.borderColor   = tagStyle.border
          }}
        >
          Voir le profil complet →
        </Link>
      </div>
    </motion.div>
  )
}
