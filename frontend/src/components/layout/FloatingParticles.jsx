const PARTICLES = [
  { id: 'p1', char: '✦', top: '8%', left: '6%', fontSize: '16px', duration: '6s', delay: '0s' },
  { id: 'p2', char: '♡', top: '14%', right: '8%', fontSize: '14px', duration: '7s', delay: '1.2s' },
  { id: 'p3', char: '★', top: '85%', left: '10%', fontSize: '12px', duration: '5.5s', delay: '0.6s' },
]

const FloatingParticles = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
    {PARTICLES.map(({ id, char, duration, delay, ...position }) => (
      <span
        key={id}
        className="absolute select-none text-rose-200/60"
        style={{
          ...position,
          animation: `float ${duration} ease-in-out ${delay} infinite`,
        }}
      >
        {char}
      </span>
    ))}
  </div>
)

export default FloatingParticles
