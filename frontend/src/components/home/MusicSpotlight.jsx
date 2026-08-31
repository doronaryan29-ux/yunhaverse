const MusicSpotlight = () => {
  const songTitle = 'Dopamine - UNIS'
  const thumbnailUrl = 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'

  return (
    <section
      id="music-spotlight"
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 scroll-mt-28"
    >
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-rose-500">
          Music Spotlight
        </p>
        <h2 className="font-display text-3xl font-semibold text-slate-900">
          Now Playing
        </h2>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1) }
            50% { transform: scale(1.1) }
          }
        `}
      </style>

      <article className="mx-auto w-full max-w-[600px] overflow-hidden rounded-[20px] border border-pink-100 shadow-xl">
        <div className="relative aspect-video w-full">
          <img
            src={thumbnailUrl}
            alt={`${songTitle} thumbnail`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <button
            type="button"
            aria-label="Play song"
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-lg"
            style={{ animation: 'pulse 1.8s ease-in-out infinite' }}
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
            <h3 className="text-lg font-bold text-white sm:text-xl">{songTitle}</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Open on Spotify"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M7.2 10.3c3.3-1.1 6.2-.9 9.1.6" strokeLinecap="round" />
                  <path d="M7.8 13c2.7-.8 5-.6 7.3.5" strokeLinecap="round" />
                  <path d="M8.5 15.4c2.1-.5 3.8-.4 5.5.4" strokeLinecap="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Open on Apple Music"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M15 4.5v9.1a3 3 0 1 1-1.6-2.7V7.2l5.6-1.4v7.3a3 3 0 1 1-1.6-2.7V4.5z" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Open on YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M21 12c0 1.9-.2 3.2-.4 3.9-.2.7-.8 1.3-1.6 1.5-1.7.5-7 .5-7 .5s-5.3 0-7-.5c-.8-.2-1.4-.8-1.6-1.5C3.2 15.2 3 13.9 3 12s.2-3.2.4-3.9c.2-.7.8-1.3 1.6-1.5C6.7 6.1 12 6.1 12 6.1s5.3 0 7 .5c.8.2 1.4.8 1.6 1.5.2.7.4 2 .4 3.9z" />
                  <path d="m10 9 5 3-5 3z" fill="#0f172a" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}

export default MusicSpotlight
