import { motion } from 'framer-motion'
import { ARCHETYPES } from '../../data/profiles'
import { ProfileCard } from './ProfileCard'

const archetypeSectionStyles = {
  expert: {
    glow: 'rgba(59,130,246,0.08)',
    titleColor: '#93C5FD',
    dot: '#3B82F6',
  },
  'grande-gueule': {
    glow: 'rgba(239,68,68,0.08)',
    titleColor: '#FCA5A5',
    dot: '#EF4444',
  },
  leader: {
    glow: 'rgba(245,158,11,0.08)',
    titleColor: '#FCD34D',
    dot: '#F59E0B',
  },
  explorateur: {
    glow: 'rgba(16,185,129,0.08)',
    titleColor: '#6EE7B7',
    dot: '#10B981',
  },
}

export function ArchetypeGroup({ archetypeId, title, profilesList }) {
  const archetype = ARCHETYPES[archetypeId]
  const style = archetypeSectionStyles[archetypeId]
  if (!archetype || !style) return null

  return (
    <section className="relative mb-20 md:mb-28">
      {/* Section background glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl -mx-4"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${style.glow}, transparent)` }}
      />

      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-2 h-2 rounded-full" style={{ background: style.dot }} />
        <h2
          className="font-display font-bold text-2xl md:text-3xl"
          style={{ color: style.titleColor }}
        >
          {title}
        </h2>
        <div
          className="flex-1 h-px ml-2 opacity-30"
          style={{ background: `linear-gradient(90deg, ${style.dot}, transparent)` }}
        />
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative">
        {profilesList.map((profile, i) => (
          <ProfileCard key={profile.id} profile={profile} index={i} />
        ))}
      </div>
    </section>
  )
}
