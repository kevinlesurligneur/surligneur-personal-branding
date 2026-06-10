import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '../components/layout/Header'
import { getProfile, ARCHETYPES } from '../data/profiles'

const ADMIN_CODE = '1024'

const archetypeColors = {
  expert:         { color: '#93C5FD', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)'  },
  'grande-gueule':{ color: '#FCA5A5', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)'   },
  leader:         { color: '#FCD34D', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)'  },
  explorateur:    { color: '#6EE7B7', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)'  },
}

function getMajor(profileId) {
  return getProfile(profileId)?.major || null
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── PIN Screen ──────────────────────────────────────────────────────────────

function PinScreen({ onSuccess }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [shake, setShake] = useState(false)
  const inputsRef = useRef([])

  useEffect(() => { inputsRef.current[0]?.focus() }, [])

  function handleChange(i, val) {
    const v = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = v
    setDigits(next)
    if (v && i < 3) inputsRef.current[i + 1]?.focus()
    if (next.every(d => d !== '')) {
      if (next.join('') === ADMIN_CODE) {
        setTimeout(() => onSuccess(), 200)
      } else {
        setShake(true)
        setTimeout(() => {
          setShake(false)
          setDigits(['', '', '', ''])
          inputsRef.current[0]?.focus()
        }, 600)
      }
    }
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) inputsRef.current[i - 1]?.focus()
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm text-center"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(0,212,245,0.08)', border: '1px solid rgba(0,212,245,0.2)' }}
          >
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-text-primary mb-2">Espace Admin</h1>
          <p className="text-text-muted text-sm mb-8">Accès réservé à l'équipe Le Surligneur.</p>

          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => inputsRef.current[i] = el}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-14 h-16 text-center text-2xl font-bold rounded-2xl border outline-none transition-all duration-200 bg-bg-card text-text-primary"
                style={{
                  borderColor: d ? 'rgba(0,212,245,0.6)' : 'rgba(255,255,255,0.1)',
                  boxShadow: d ? '0 0 0 2px rgba(0,212,245,0.15)' : 'none',
                }}
              />
            ))}
          </motion.div>

          {shake && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-400">
              Code incorrect
            </motion.p>
          )}
        </motion.div>
      </main>
    </div>
  )
}

// ── Lead Row ────────────────────────────────────────────────────────────────

function LeadRow({ lead, index, onViewTest, onDelete }) {
  const major = getMajor(lead.profile)
  const arc = major ? archetypeColors[major] : null
  const profile = lead.profile ? getProfile(lead.profile) : null
  const [confirmDelete, setConfirmDelete] = useState(false)

  const total = lead.scores ? Object.values(lead.scores).reduce((a, b) => a + b, 0) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="rounded-2xl border border-border-subtle bg-bg-card overflow-hidden"
    >
      {/* Accent top line */}
      {arc && (
        <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${arc.color}90, transparent)` }} />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar initials */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={arc
                ? { background: arc.bg, border: `1px solid ${arc.border}`, color: arc.color }
                : { background: 'rgba(255,255,255,0.05)', color: '#aaa' }}
            >
              {(lead.firstName?.[0] || '') + (lead.lastName?.[0] || '')}
            </div>

            {/* Name + email */}
            <div>
              <p className="font-semibold text-text-primary text-sm">
                {lead.firstName} {lead.lastName}
              </p>
              <a href={`mailto:${lead.email}`} className="text-brand-cyan text-xs hover:underline">
                {lead.email}
              </a>
            </div>
          </div>

          {/* Date + delete */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-text-faint text-xs hidden sm:block">{formatDate(lead.date)}</span>

            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-faint">Confirmer ?</span>
                <button
                  onClick={() => onDelete(lead.id)}
                  className="text-xs font-semibold text-red-400 hover:text-red-300 px-2 py-1 rounded-lg border border-red-500/30 hover:border-red-400/50 transition-all"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs text-text-faint hover:text-text-muted transition-colors"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-text-faint hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                title="Supprimer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {profile && arc && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ color: arc.color, background: arc.bg, border: `1px solid ${arc.border}` }}>
              {profile.name}
            </span>
          )}
          {lead.gender && (
            <span className="text-xs px-2.5 py-1 rounded-full text-text-muted"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {lead.gender === 'homme' ? '👨 Homme' : lead.gender === 'femme' ? '👩 Femme' : '🧑 Autre'}
            </span>
          )}
          {lead.socialMedia && (
            <span className="text-xs px-2.5 py-1 rounded-full text-text-muted"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {lead.socialMedia === 'oui' ? '📱 Actif sur les réseaux' : '🌱 Pas encore sur les réseaux'}
            </span>
          )}
        </div>

        {/* Score bars */}
        {lead.scores && total > 0 && (
          <div className="space-y-1.5 mb-4">
            {[
              { key: 'E', id: 'expert', label: 'Expert' },
              { key: 'G', id: 'grande-gueule', label: 'Grande Gueule' },
              { key: 'L', id: 'leader', label: 'Leader' },
              { key: 'X', id: 'explorateur', label: 'Explorateur' },
            ].map(({ key, id, label }) => {
              const pct = Math.round((lead.scores[key] / total) * 100)
              const c = archetypeColors[id]
              return (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-[10px] text-text-faint w-20 shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                  </div>
                  <span className="text-[10px] text-text-faint w-7 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => onViewTest(lead)}
          className="w-full py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200"
          style={{ color: arc?.color || '#aaa', borderColor: arc?.border || 'rgba(255,255,255,0.1)', background: 'transparent' }}
          onMouseEnter={e => { if (arc) e.currentTarget.style.background = arc.bg }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          Voir son test →
        </button>
      </div>
    </motion.div>
  )
}

// ── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ onLogout }) {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      setLeads([...data].reverse())
    } catch (err) {
      console.error('Impossible de charger les leads', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  async function handleDelete(id) {
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' })
      setLeads(prev => prev.filter(l => l.id !== id))
    } catch (err) {
      console.error('Erreur suppression', err)
    }
  }

  function handleViewTest(lead) {
    navigate('/resultats', {
      state: {
        scores: lead.scores,
        profileId: lead.profile,
        fromAdmin: true,
        leadName: `${lead.firstName} ${lead.lastName}`,
        leadGender: lead.gender,
      },
    })
  }

  function exportCSV() {
    if (!leads.length) return
    const headers = ['Date', 'Prénom', 'Nom', 'Email', 'Sexe', 'Réseaux', 'Profil', 'E', 'G', 'L', 'X']
    const rows = leads.map(l => [
      formatDate(l.date), l.firstName, l.lastName, l.email,
      l.gender, l.socialMedia, l.profile,
      l.scores?.E || 0, l.scores?.G || 0, l.scores?.L || 0, l.scores?.X || 0,
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(';')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `surligneur-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  const filtered = leads.filter(l => {
    const q = search.toLowerCase()
    return (
      l.firstName?.toLowerCase().includes(q) ||
      l.lastName?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.profile?.toLowerCase().includes(q)
    )
  })

  const today = new Date().toDateString()
  const todayCount = leads.filter(l => new Date(l.date).toDateString() === today).length
  const withSocial = leads.filter(l => l.socialMedia === 'oui').length

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display font-bold text-3xl text-text-primary">Dashboard Admin</h1>
              <p className="text-text-muted text-sm mt-1">Le Surligneur — données centralisées</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={fetchLeads} className="text-sm text-text-faint hover:text-brand-cyan transition-colors px-3 py-2" title="Rafraîchir">
                ↻ Actualiser
              </button>
              <button onClick={exportCSV} disabled={!leads.length}
                className="text-sm font-medium px-4 py-2 rounded-xl border border-border-subtle text-text-muted hover:text-text-primary hover:border-brand-cyan/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                Exporter CSV
              </button>
              <button onClick={onLogout} className="text-sm text-text-faint hover:text-text-muted transition-colors px-3 py-2">
                Déconnexion
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total leads', value: leads.length, icon: '👥' },
              { label: "Aujourd'hui", value: todayCount, icon: '📅' },
              { label: 'Sur les réseaux', value: withSocial, icon: '📱' },
              { label: 'Taux réseaux', value: leads.length ? `${Math.round(withSocial / leads.length * 100)}%` : '—', icon: '📊' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-2xl border border-border-subtle bg-bg-card px-5 py-4">
                <p className="text-2xl mb-1">{icon}</p>
                <p className="font-display font-bold text-2xl text-text-primary">{value}</p>
                <p className="text-xs text-text-faint mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          {leads.length > 0 && (
            <div className="mb-6">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher (nom, email, profil…)"
                className="w-full max-w-sm bg-bg-card border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-brand-cyan/60 transition-colors"
              />
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="text-center py-24 text-text-faint">
              <p className="text-3xl mb-3">⏳</p>
              <p>Chargement des données…</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-24 text-text-faint">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-base">Aucun lead pour l'instant.</p>
              <p className="text-sm mt-1">Les données apparaîtront ici après les premiers tests.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-text-faint text-sm">Aucun résultat pour « {search} »</div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((lead, i) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    index={i}
                    onViewTest={handleViewTest}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}

        </div>
      </main>
    </div>
  )
}

// ── Export ──────────────────────────────────────────────────────────────────

export default function AdminPage() {
  // Persist auth across navigation (no PIN re-entry when coming back from a lead's result)
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('admin_auth') === 'true')

  function handleLogin() {
    sessionStorage.setItem('admin_auth', 'true')
    setAuthenticated(true)
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_auth')
    setAuthenticated(false)
  }

  return (
    <AnimatePresence mode="wait">
      {!authenticated ? (
        <motion.div key="pin" exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.2 }}>
          <PinScreen onSuccess={handleLogin} />
        </motion.div>
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <Dashboard onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
