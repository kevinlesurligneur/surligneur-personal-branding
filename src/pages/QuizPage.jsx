import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '../components/layout/Header'
import { QUESTIONS, calculateScores, getProfileFromScores } from '../data/quiz'

function AnswerOption({ answer, selected, disabled, onToggle }) {
  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.99 } : {}}
      onClick={onToggle}
      disabled={disabled}
      className={`
        w-full text-left flex items-start gap-3 px-5 py-4 rounded-2xl border transition-all duration-150
        ${selected
          ? 'border-brand-cyan bg-brand-cyan/10 text-text-primary'
          : disabled
          ? 'border-border-subtle bg-bg-card/20 text-text-faint cursor-not-allowed opacity-40'
          : 'border-border-subtle bg-bg-card hover:border-brand-cyan/40 hover:bg-bg-card text-text-muted cursor-pointer'
        }
      `}
    >
      <span className={`
        w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold font-display mt-0.5
        ${selected ? 'bg-brand-cyan text-bg-primary' : 'bg-border-subtle/60 text-text-muted'}
        transition-all duration-150
      `}>
        {answer.letter}
      </span>
      <span className="text-sm leading-relaxed">{answer.text}</span>
    </motion.button>
  )
}

export default function QuizPage() {
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState(Array.from({ length: 25 }, () => []))
  const [direction, setDirection] = useState(1)

  const currentAnswers = answers[currentQ]
  const progress = Math.round(((currentQ + 1) / 25) * 100)

  function toggleAnswer(letter) {
    setAnswers(prev =>
      prev.map((a, i) => {
        if (i !== currentQ) return a
        if (a.includes(letter)) return a.filter(l => l !== letter)
        if (a.length >= 2) return a
        return [...a, letter]
      })
    )
  }

  function handlePrev() {
    if (currentQ === 0) return
    setDirection(-1)
    setCurrentQ(q => q - 1)
  }

  function handleNext() {
    if (currentAnswers.length === 0) return
    if (currentQ === 24) {
      const scores = calculateScores(answers)
      const { profileId } = getProfileFromScores(scores)
      navigate('/formulaire', { state: { scores, profileId } })
    } else {
      setDirection(1)
      setCurrentQ(q => q + 1)
    }
  }

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center px-6 pt-24 pb-16">
        <div className="w-full max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-text-muted mb-3">
              <span className="font-medium">Question {currentQ + 1} sur {QUESTIONS.length}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 bg-border-subtle rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-brand-cyan rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQ}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <div className="bg-bg-card border border-border-subtle rounded-3xl p-6 md:p-8">
                <h2 className="font-display font-bold text-xl md:text-2xl text-text-primary mb-1">
                  {QUESTIONS[currentQ].question}
                </h2>
                <p className="text-text-faint text-sm mb-6">
                  Tu peux choisir 1 ou 2 réponses par question.
                </p>
                <div className="space-y-3">
                  {QUESTIONS[currentQ].answers.map(answer => (
                    <AnswerOption
                      key={answer.letter}
                      answer={answer}
                      selected={currentAnswers.includes(answer.letter)}
                      disabled={currentAnswers.length >= 2 && !currentAnswers.includes(answer.letter)}
                      onToggle={() => toggleAnswer(answer.letter)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrev}
              disabled={currentQ === 0}
              className="btn-ghost text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Précédent
            </button>
            <motion.button
              whileHover={currentAnswers.length > 0 ? { scale: 1.03 } : {}}
              whileTap={currentAnswers.length > 0 ? { scale: 0.97 } : {}}
              onClick={handleNext}
              disabled={currentAnswers.length === 0}
              className="btn-primary text-sm px-6 py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              {currentQ === 24 ? 'Voir mes résultats →' : 'Suivant →'}
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  )
}
