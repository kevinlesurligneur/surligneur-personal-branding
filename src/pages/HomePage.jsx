import { useState } from 'react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { HeroSection } from '../components/home/HeroSection'
import { GenderToggle } from '../components/home/GenderToggle'
import { ArchetypeGroup } from '../components/home/ArchetypeGroup'
import { MethodologySection } from '../components/home/MethodologySection'
import { profiles, archetypeGroups } from '../data/profiles'

export default function HomePage() {
  const [gender, setGender] = useState('masculine')

  const profilesByGroup = archetypeGroups.map(group => ({
    ...group,
    profilesList: group.profiles.map(id => profiles[gender].find(p => p.id === id)).filter(Boolean),
  }))

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main>
        <HeroSection />

        <section className="px-6 pb-4">
          <div className="max-w-6xl mx-auto">
            <GenderToggle gender={gender} onChange={setGender} />

            <div>
              {profilesByGroup.map(group => (
                <ArchetypeGroup
                  key={group.id}
                  archetypeId={group.id}
                  title={group.title}
                  profilesList={group.profilesList}
                />
              ))}
            </div>
          </div>
        </section>

        <MethodologySection />
      </main>

      <Footer />
    </div>
  )
}
