import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ARCHETYPES } from '../../data/profiles'
import { HighlightWord } from '../common/HighlightWord'

const archetypeItems = ['expert', 'grande-gueule', 'leader', 'explorateur']

const archetypeDescriptions = {
  expert:          "Partage ton savoir de façon rigoureuse et sourcée. Tu bâtis ta crédibilité sur la profondeur de ton expertise.",
  'grande-gueule': "Prends position avec force et conviction. Tu fais avancer le débat en osant nommer ce que les autres taisent.",
  leader:          "Rassemble et élève. Tu construis une communauté soudée autour d'une vision ou de valeurs communes.",
  explorateur:     "Explore, teste, questionne. Tu inspires par ta curiosité et ton refus de rester dans les sentiers balisés.",
}

const tagColors = {
  expert:          '#93C5FD',
  'grande-gueule': '#FCA5A5',
  leader:          '#FCD34D',
  explorateur:     '#6EE7B7',
}

const tagBg = {
  expert:          'rgba(59,130,246,0.1)',
  'grande-gueule': 'rgba(239,68,68,0.1)',
  leader:          'rgba(245,158,11,0.1)',
  explorateur:     'rgba(16,185,129,0.1)',
}

const whatYouLearn = [
  { icon: '🎙️', text: 'Comment tu es perçu quand tu t\'exprimes en public ou sur les réseaux.' },
  { icon: '🎯', text: 'Quelle tonalité naturelle t\'aide à fédérer une audience et à créer de l\'adhésion.' },
  { icon: '⚠️', text: 'Quels risques tu dois éviter pour rester crédible, impactant et authentique.' },
  { icon: '✨', text: 'Quelle posture adopter pour être la version la plus puissante de toi-même.' },
]

function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function MethodologySection() {
  const navigate = useNavigate()

  return (
    <section id="methodology" className="py-20 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ───────────────────────────────────────────────── */}
        <FadeIn className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-widest text-brand-cyan uppercase mb-4 px-3 py-1.5 rounded-full border border-brand-cyan/20 bg-brand-cyan/5">
            Méthodologie
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-5">
            Comment fonctionne le test ?
          </h2>
          <p className="text-text-muted text-lg leading-relaxed max-w-2xl mx-auto">
            Une approche inspirée des grandes typologies psychologiques (MBTI, Ennéagramme),
            repensée pour la communication digitale et le personal branding LinkedIn.
          </p>
        </FadeIn>

        {/* ── Social proof band ────────────────────────────────────── */}
        <FadeIn delay={0.1} className="mb-14">
          <div
            className="rounded-2xl p-5 md:p-6 border border-border-subtle"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,245,0.04) 0%, rgba(255,255,255,0.02) 100%)' }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'rgba(0,212,245,0.08)', border: '1px solid rgba(0,212,245,0.15)' }}
              >
                🏆
              </div>
              <div>
                <p className="text-text-primary text-sm font-semibold mb-1">
                  4 ans d'expérience terrain avec les plus grandes figures publiques du business
                </p>
                <p className="text-text-muted text-sm leading-relaxed">
                  <HighlightWord color="rgba(253,224,71,0.35)" delay={0.1}>Kelly Massol, Blaise Matuidi, Yasmine Douadi…</HighlightWord>{' '}
                  L'agence Le Surligneur a affûté cette méthode
                  au contact des meilleurs, pour la rendre accessible à tous les créateurs de contenu.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Les 4 archétypes ─────────────────────────────────────── */}
        <FadeIn delay={0.05} className="mb-3">
          <h3 className="font-display font-semibold text-text-primary text-xl mb-1">
            Les 4 archétypes fondamentaux
          </h3>
          <p className="text-text-muted text-sm mb-6">
            Nous avons identifié 4 grandes postures universelles que l'on retrouve chez les entrepreneurs,
            créateurs et figures publiques. Chacune exprime une force singulière — et des risques si elle est incarnée seule.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
          {archetypeItems.map((id, i) => {
            const archetype = ARCHETYPES[id]
            return (
              <FadeIn key={id} delay={0.1 + i * 0.08}>
                <div className="flex gap-4 p-5 rounded-2xl border border-border-subtle bg-bg-card h-full">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: tagBg[id] }}
                  >
                    {archetype.icon}
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-base mb-1" style={{ color: tagColors[id] }}>
                      {archetype.label}
                    </h4>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {archetypeDescriptions[id]}
                    </p>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>

        {/* ── Principe majeur / mineur ─────────────────────────────── */}
        <FadeIn delay={0.1} className="mb-14">
          <div className="rounded-2xl border border-border-subtle bg-bg-card p-6 md:p-8">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-xl flex-shrink-0">
                🧬
              </div>
              <div>
                <h3 className="font-display font-semibold text-text-primary text-lg mb-1">
                  Le principe majeur / mineur
                </h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  Le test ne cherche pas à t'enfermer dans une case, mais à révéler une <strong className="text-text-primary">combinaison hybride</strong> :
                  ton archétype majeur (ton mode d'expression dominant) et ton archétype mineur (la nuance qui colore ton style).
                </p>
              </div>
            </div>

            {/* Visual: 4 × 4 → 12 */}
            <div className="flex items-center justify-center gap-4 flex-wrap py-4 px-2 rounded-xl mb-4"
              style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-brand-cyan">4</div>
                <div className="text-xs text-text-faint mt-0.5">archétypes</div>
              </div>
              <div className="text-text-faint text-lg font-light">×</div>
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-brand-cyan">3</div>
                <div className="text-xs text-text-faint mt-0.5">combinaisons</div>
              </div>
              <div className="text-text-faint text-lg font-light">=</div>
              <div className="text-center">
                <div className="text-2xl font-display font-bold" style={{ color: '#FCD34D' }}>12</div>
                <div className="text-xs text-text-faint mt-0.5">personnalités uniques</div>
              </div>
            </div>

            <p className="text-text-muted text-sm leading-relaxed">
              À chaque question, tu peux sélectionner 1 ou 2 réponses. Chaque réponse alimente un archétype.
              À la fin, ton <strong className="text-text-primary">score le plus élevé</strong> = archétype majeur,
              le second = mineur. Leur combinaison te place parmi les 12 personnalités.
            </p>
          </div>
        </FadeIn>

        {/* ── Ce que tu vas découvrir ──────────────────────────────── */}
        <FadeIn delay={0.1} className="mb-14">
          <h3 className="font-display font-semibold text-text-primary text-xl mb-1">
            Ce que tu vas découvrir
          </h3>
          <p className="text-text-muted text-sm mb-6">
            Ce test ne se limite pas à une curiosité psychologique — c'est un outil stratégique
            pour les entrepreneurs, créateurs et leaders d'opinion.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whatYouLearn.map(({ icon, text }, i) => (
              <FadeIn key={i} delay={0.08 + i * 0.07}>
                <div className="flex items-start gap-3 p-4 rounded-2xl border border-border-subtle bg-bg-card">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: 'rgba(0,212,245,0.07)', border: '1px solid rgba(0,212,245,0.12)' }}>
                    {icon}
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed pt-1">{text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* ── Quote / Vision ───────────────────────────────────────── */}
        <FadeIn delay={0.1} className="mb-14">
          <div className="relative rounded-2xl overflow-hidden p-7 md:p-9 text-center"
            style={{
              background: 'linear-gradient(160deg, #071e3d 0%, #0d1224 60%, #08080F 100%)',
              border: '1px solid rgba(0,212,245,0.15)',
            }}>
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,212,245,0.12) 0%, transparent 70%)' }} />

            <div className="relative">
              <p className="text-xl md:text-2xl font-display font-semibold text-text-primary leading-snug mb-3">
                "Ce n'est pas une étiquette.
                <br />
                <span className="text-brand-cyan">
                  C'est <HighlightWord color="rgba(0,212,245,0.25)" delay={0.2}>une boussole.</HighlightWord>
                </span>"
              </p>
              <p className="text-text-muted text-sm max-w-xl mx-auto leading-relaxed">
                Dans un monde saturé de contenus, ceux qui marquent les esprits ne sont pas ceux qui parlent
                le plus fort — mais ceux qui parlent avec{' '}
                <HighlightWord color="rgba(253,224,71,0.35)" delay={0.3}>
                  justesse, authenticité et alignement
                </HighlightWord>.
                Connaître ton profil, c'est comprendre ta voix unique.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <FadeIn delay={0.1} className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,212,245,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/test')}
            className="btn-primary text-base px-8 py-4"
          >
            <span>🎯</span>
            Passer le test maintenant
          </motion.button>
        </FadeIn>

      </div>
    </section>
  )
}
