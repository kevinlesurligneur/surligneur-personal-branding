import { ARCHETYPES } from '../../data/profiles'

const archetypeCharacters = {
  expert: {
    gradient: 'linear-gradient(145deg, #0D1B35 0%, #1E3A6E 60%, #2D5BE3 100%)',
    orb: 'rgba(59, 130, 246, 0.35)',
    ring: 'rgba(59, 130, 246, 0.15)',
  },
  'grande-gueule': {
    gradient: 'linear-gradient(145deg, #200808 0%, #7F1D1D 60%, #DC2626 100%)',
    orb: 'rgba(239, 68, 68, 0.35)',
    ring: 'rgba(239, 68, 68, 0.15)',
  },
  leader: {
    gradient: 'linear-gradient(145deg, #1C1000 0%, #78350F 60%, #D97706 100%)',
    orb: 'rgba(245, 158, 11, 0.35)',
    ring: 'rgba(245, 158, 11, 0.15)',
  },
  explorateur: {
    gradient: 'linear-gradient(145deg, #021B14 0%, #064E3B 60%, #059669 100%)',
    orb: 'rgba(16, 185, 129, 0.35)',
    ring: 'rgba(16, 185, 129, 0.15)',
  },
}

export function ProfileIllustration({ majorId, emoji, size = 'md' }) {
  const theme = archetypeCharacters[majorId] || archetypeCharacters.expert
  const sizeClass = size === 'lg' ? 'w-48 h-48' : 'w-40 h-40'
  const emojiSize = size === 'lg' ? '72px' : '60px'

  return (
    <div
      className={`relative ${sizeClass} rounded-2xl flex items-center justify-center overflow-hidden mx-auto`}
      style={{ background: theme.gradient }}
    >
      {/* Decorative ring */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-48 h-48 rounded-full"
        style={{ background: `radial-gradient(circle, ${theme.ring} 0%, transparent 70%)` }}
      />
      {/* Orb glow */}
      <div
        className="absolute w-24 h-24 rounded-full blur-xl"
        style={{ background: theme.orb }}
      />
      {/* Emoji character */}
      <span
        className="relative z-10 select-none"
        style={{
          fontSize: emojiSize,
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
          lineHeight: 1,
        }}
        role="img"
        aria-hidden="true"
      >
        {emoji}
      </span>
    </div>
  )
}
