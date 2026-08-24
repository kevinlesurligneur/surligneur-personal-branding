import { motion } from 'framer-motion'
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
  expert: 'rgba(59,130,246,0.5)',
  'grande-gueule': 'rgba(239,68,68,0.5)',
  leader: 'rgba(245,158,11,0.5)',
  explorateur: 'rgba(16,185,129,0.5)',
}

export function ProfileCard({ profile, index = 0 }) {
  const major = ARCHETYPES[profile.major]
  const minor = ARCHETYPES[profile.minor]
  if (!major || !minor) return null

  const tagStyle = archetypeTagStyles[profile.major]

  function handleMouseEnter(e) {
    e.currentTarget.style.borderColor = archetypeBorderHover[profile.major]
  }

  function handleMouseLeave(e) {
    e.currentTarget.style.borderColor = 'var(--border-subtle)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-3xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
