import { useEffect, useState } from 'react'

const Carousel = ({ items }) => {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % items.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [items.length])

  return (
    <section className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-xl">
        <div
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {items.map((item) => (
            <div key={item.alt} className="min-w-full">
              <div className="relative h-64 w-full sm:h-80">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-lg font-semibold sm:text-2xl">{item.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        {items.map((_, index) => (
          <button
            key={`dot-${index}`}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActiveSlide(index)}
            className={`h-2.5 w-8 rounded-full transition ${
              activeSlide === index
                ? 'bg-rose-500'
                : 'bg-rose-200 hover:bg-rose-300'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

export default Carousel
