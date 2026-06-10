import { ARCHETYPES } from '../../data/profiles'

export function ArchetypeBadge({ majorId, minorId, className = '' }) {
  const major = ARCHETYPES[majorId]
  const minor = ARCHETYPES[minorId]
  if (!major || !minor) return null

  const tagClass = {
    expert: 'tag-expert',
    'grande-gueule': 'tag-gueule',
    leader: 'tag-leader',
    explorateur: 'tag-explorateur',
  }[majorId]

  return (
    <span className={`${tagClass} ${className}`}>
      🎯 {major.label} (majeur) – {minor.labelShort || minor.label} (mineur)
    </span>
  )
}
