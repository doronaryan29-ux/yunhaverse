import { useMemo } from 'react'

const PARTICLES_COUNT = 18
const PARTICLE_CHARS = ['✦', '✿', '♡', '★']

const randomFrom = (min, max) => Math.random() * (max - min) + min

const FloatingParticles = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLES_COUNT }, (_, index) => ({
        id: `particle-${index}`,
        char: PARTICLE_CHARS[Math.floor(Math.random() * PARTICLE_CHARS.length)],
        top: `${randomFrom(4, 96).toFixed(2)}%`,
        left: `${randomFrom(2, 98).toFixed(2)}%`,
        fontSize: `${randomFrom(10, 20).toFixed(1)}px`,
        duration: `${randomFrom(4, 8).toFixed(2)}s`,
        delay: `${randomFrom(0, 4).toFixed(2)}s`,
      })),
    [],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute select-none"
          style={{
            top: particle.top,
            left: particle.left,
            fontSize: particle.fontSize,
            color: 'rgba(255,110,180,0.3)',
            animation: `float ${particle.duration} ease-in-out ${particle.delay} infinite`,
          }}
        >
          {particle.char}
        </span>
      ))}
    </div>
  )
}

export default FloatingParticles
