import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ARCHETYPES } from '../../data/profiles'

const archetypeItems = ['expert', 'grande-gueule', 'leader', 'explorateur']

const archetypeDescriptions = {
  expert: "Partage ton savoir de façon rigoureuse et sourcée. Tu bâtis ta crédibilité sur la profondeur de ton expertise.",
  'grande-gueule': "Prends position avec force et conviction. Tu fais avancer le débat en osant nommer ce que les autres taisent.",
  leader: "Rassemble et élève. Tu construis une communauté soudée autour d'une vision ou de valeurs communes.",
  explorateur: "Explore, teste, questionne. Tu inspires par ta curiosité et ton refus de rester dans les sentiers balisés.",
}

const tagColors = {
  expert: '#93C5FD',
  'grande-gueule': '#FCA5A5',
  leader: '#FCD34D',
  explorateur: '#6EE7B7',
}

const tagBg = {
  expert: 'rgba(59,130,246,0.1)',
  'grande-gueule': 'rgba(239,68,68,0.1)',
  leader: 'rgba(245,158,11,0.1)',
  explorateur: 'rgba(16,185,129,0.1)',
}

export function MethodologySection() {
  const navigate = useNavigate()

  return (
    <section id="methodology" className="py-20 md:py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest text-brand-cyan uppercase mb-4 px-3 py-1.5 rounded-full border border-brand-cyan/20 bg-brand-cyan/5">
            Méthodologie
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-text-primary mb-5">
            Comment fonctionne le test ?
          </h2>
          <p className="text-text-muted text-lg leading-relaxed max-w-2xl mx-auto">
            Le test du Surligneur repose sur 4 grandes dimensions de la communication LinkedIn. Chaque réponse révèle ton rapport naturel à l'une d'elles.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,212,245,0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/test')}
            className="btn-primary text-base px-8 py-4"
          >
            <span>🎯</span>
            Passer le test de personnalité
          </motion.button>
        </motion.div>

        {/* 4 archetypes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
          {archetypeItems.map((id, i) => {
            const archetype = ARCHETYPES[id]
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4 p-5 rounded-2xl border border-border-subtle bg-bg-card"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: tagBg[id] }}
                >
                  {archetype.icon}
                </div>
                <div>
                  <h3
                    className="font-display font-semibold text-base mb-1"
                    style={{ color: tagColors[id] }}
                  >
                    {archetype.label}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {archetypeDescriptions[id]}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Scoring explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border-subtle bg-bg-card p-6 md:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-xl flex-shrink-0">
              🧮
            </div>
            <div>
              <h3 className="font-display font-semibold text-text-primary text-lg mb-2">
                Comment est calculé ton profil ?
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                À chaque question, tu peux sélectionner 1 ou 2 réponses. Chaque réponse correspond à un archétype (Expert, Grande Gueule, Leader ou Explorateur). À la fin du test, on calcule ton score dans chacun des 4 archétypes.{' '}
                <strong className="text-text-primary">Ton archétype majeur</strong> est celui avec le score le plus élevé,{' '}
                <strong className="text-text-primary">ton mineur</strong> le second — et leur combinaison détermine ton profil parmi les 12 personnalités.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
