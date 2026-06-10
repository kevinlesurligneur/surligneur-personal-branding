import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function Button({ children, to, href, onClick, variant = 'primary', className = '', ...props }) {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-ghost'
  const combined = `${baseClass} ${className}`

  const inner = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={combined}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
    >
      {children}
    </motion.span>
  )

  if (to) return <Link to={to} className="inline-block">{inner}</Link>
  if (href) return <a href={href} className="inline-block">{inner}</a>
  return <button onClick={onClick} className="inline-block" {...props}>{inner}</button>
}
