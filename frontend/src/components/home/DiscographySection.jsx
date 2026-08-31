import { useEffect, useState } from 'react'
import { usePlayer } from '../../context/PlayerContext'
import { fetchSpotifyTracks } from '../../services/spotifyApi'

const DiscographySection = () => {
  const { setCurrentTrackId } = usePlayer()
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    fetchSpotifyTracks()
      .then((items) => {
        if (!active) return
        setTracks(items)
      })
      .catch(() => {
        if (!active) return
        setError('Could not load UNIS discography right now.')
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <section id="discography" className="mx-auto w-full max-w-6xl px-6 scroll-mt-28">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-rose-500">Discography</p>
        <h2 className="font-display text-3xl font-semibold text-slate-900">UNIS Tracks</h2>
      </div>

      {loading && <p className="text-center text-sm text-slate-500">Loading tracks...</p>}
      {!loading && error && <p className="text-center text-sm text-rose-500">{error}</p>}

      {!loading && !error && (
        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}
        >
          {tracks.map((track) => (
            <article
              key={track.trackId}
              className="group rounded-2xl border border-rose-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => setCurrentTrackId(track.trackId)}
                className="w-full text-left"
                aria-label={`Play ${track.title}`}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={track.albumCover}
                    alt={`${track.title} cover`}
                    className="w-full rounded-xl object-cover"
                    style={{ aspectRatio: '1 / 1' }}
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ background: 'rgba(255,110,180,0.3)' }}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-rose-500">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-800">{track.title}</p>
              </button>

              <div className="mt-2 flex items-center justify-between">
                <p className="truncate text-xs text-slate-500">{track.albumName}</p>
                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-rose-500 transition hover:text-rose-600"
                  aria-label={`Open ${track.title} in Spotify`}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M7.2 10.3c3.3-1.1 6.2-.9 9.1.6" strokeLinecap="round" />
                    <path d="M7.8 13c2.7-.8 5-.6 7.3.5" strokeLinecap="round" />
                    <path d="M8.5 15.4c2.1-.5 3.8-.4 5.5.4" strokeLinecap="round" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default DiscographySection

