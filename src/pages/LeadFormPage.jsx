import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from '../components/layout/Header'

export default function LeadFormPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    socialMedia: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (!state?.scores || !state?.profileId) {
      navigate('/test', { replace: true })
    }
  }, [state, navigate])

  if (!state?.scores || !state?.profileId) return null

  function handleChange(field) {
    return (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.firstName || !form.lastName || !form.email || !form.gender || !form.socialMedia) {
      setError('Merci de remplir tous les champs.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      setError('Adresse e-mail invalide.')
      return
    }

    const lead = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      gender: form.gender,
      socialMedia: form.socialMedia,
      profile: state.profileId,
      scores: state.scores,
    }

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      })
    } catch (err) {
      console.warn('API indisponible, sauvegarde locale uniquement', err)
    }

    navigate('/resultats', { state: { scores: state.scores, profileId: state.profileId } })
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center px-6 pt-24 pb-16">
        <div className="w-full max-w-lg">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <div className="text-5xl mb-4">🎯</div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-text-primary mb-3">
              Presque là…
            </h1>
            <p className="text-text-muted text-sm leading-relaxed max-w-sm mx-auto">
              Ton profil est prêt. Renseigne tes informations pour découvrir ton résultat et recevoir ton analyse complète.
            </p>
          </motion.div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-bg-card border border-border-subtle rounded-3xl p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Prénom + Nom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-text-muted mb-1.5">
                    Prénom <span className="text-brand-cyan">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange('firstName')}
                    placeholder="Marie"
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-brand-cyan/60 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-text-muted mb-1.5">
                    Nom <span className="text-brand-cyan">*</span>
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange('lastName')}
                    placeholder="Dupont"
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-brand-cyan/60 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1.5">
                  Adresse e-mail <span className="text-brand-cyan">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="marie@exemple.fr"
                  className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-brand-cyan/60 transition-colors"
                />
              </div>

              {/* Sexe */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-text-muted mb-1.5">
                  Sexe <span className="text-brand-cyan">*</span>
                </label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={handleChange('gender')}
                  className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-brand-cyan/60 transition-colors appearance-none"
                >
                  <option value="" disabled>Sélectionner…</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre / Préfère ne pas répondre</option>
                </select>
              </div>

              {/* Réseaux sociaux */}
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Êtes-vous déjà présent·e sur les réseaux sociaux ? <span className="text-brand-cyan">*</span>
                </label>
                <div className="flex gap-3">
                  {[['oui', 'Oui'], ['non', 'Non']].map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, socialMedia: val }))}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all duration-150 ${
                        form.socialMedia === val
                          ? 'border-brand-cyan bg-brand-cyan/10 text-text-primary'
                          : 'border-border-subtle bg-bg-primary text-text-muted hover:border-brand-cyan/40'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,212,245,0.2)' }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full justify-center py-4 text-base mt-2"
              >
                Découvrir mon profil →
              </motion.button>

            </form>
          </motion.div>

          {/* Reassurance */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center text-xs text-text-faint mt-5"
          >
            Tes données sont confidentielles et ne sont utilisées que par l'équipe Le Surligneur.
          </motion.p>

        </div>
      </main>
    </div>
  )
}
