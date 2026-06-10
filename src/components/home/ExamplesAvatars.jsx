import { useState } from 'react'

const avatarGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
]

function hashInitials(initials) {
  let h = 0
  for (let i = 0; i < initials.length; i++) h = (h * 31 + initials.charCodeAt(i)) % avatarGradients.length
  return Math.abs(h)
}

function Avatar({ name, initials, avatar }) {
  const [imgError, setImgError] = useState(false)
  const showImg = avatar && !imgError

  return (
    <div className="flex flex-col items-center gap-1.5 group">
      {showImg ? (
        <img
          src={avatar}
          alt={name}
          onError={() => setImgError(true)}
          title={name}
          className="w-11 h-11 rounded-full object-cover object-top ring-2 ring-border-subtle group-hover:ring-brand-cyan/40 transition-all duration-200 select-none"
        />
      ) : (
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-border-subtle group-hover:ring-brand-cyan/40 transition-all duration-200 select-none"
          style={{ background: avatarGradients[hashInitials(initials)] }}
          title={name}
        >
          {initials}
        </div>
      )}
      <span className="text-[10px] text-text-faint group-hover:text-text-muted transition-colors text-center max-w-[56px] leading-tight">
        {name}
      </span>
    </div>
  )
}

export function ExamplesAvatars({ examples }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-widest text-text-faint uppercase mb-3 text-center">
        Exemples inspirants
      </p>
      <div className="flex items-start justify-center gap-3 flex-wrap">
        {examples.map((ex) => (
          <Avatar key={ex.name} {...ex} />
        ))}
      </div>
    </div>
  )
}
