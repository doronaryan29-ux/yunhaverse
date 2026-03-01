import { useState } from 'react'

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            from { transform: translateX(100%) }
            to { transform: translateX(-100%) }
          }
        `}
      </style>
      <div
        className="relative h-10 overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #ff6eb4, #ff9ed2)',
          display: isVisible ? 'block' : 'none',
        }}
      >
        <div className="absolute inset-0 flex items-center overflow-hidden pr-12">
          <span
            className="inline-block whitespace-nowrap px-4 text-sm font-semibold text-white"
            style={{ animation: 'marquee 14s linear infinite' }}
          >
            YUNHAverse PH announcement: Welcome to YUNHAverse Philippines. Stay tuned for upcoming projects, events, and
            fan activities.
          </span>
        </div>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-xl leading-none text-white/90 transition hover:text-white"
        >
          ×
        </button>
      </div>
    </>
  )
}

export default AnnouncementBanner
