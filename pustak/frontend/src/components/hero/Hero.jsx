import { useRef } from 'react'
import HeroBackground from './HeroBackground'
import HeroContent from './HeroContent'
import HeroBook from './HeroBook'
import HeroParticles from './HeroParticles'
import ScrollIndicator from './ScrollIndicator'

export default function Hero() {
  const heroRef = useRef(null)

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      <HeroBackground />

      {/* Particles */}
      <HeroParticles />

      {/* Content */}
      <div className="relative z-10 w-full section-padding">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-0 min-h-screen pt-28 pb-20">
          {/* Left: Text */}
          <div className="flex-1 flex items-center">
            <HeroContent />
          </div>

          {/* Right: Book */}
          <div className="flex-1 flex items-center justify-center lg:justify-end pr-0 lg:pr-16">
            <HeroBook />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <ScrollIndicator />
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent pointer-events-none z-10" />
    </section>
  )
}
