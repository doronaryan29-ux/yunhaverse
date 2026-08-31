import { usePlayer } from '../context/PlayerContext'

const PLAYLIST_ID = String(import.meta.env.VITE_UNIS_PLAYLIST_ID || '').trim()

const TrackCard = () => {
  const { currentTrack, setTrack } = usePlayer()
  if (!currentTrack) return null

  return (
    <section className="mx-auto w-full max-w-6xl px-6">
      <article className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">Featured Track</p>
        <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentTrack.albumCover}
              alt={currentTrack.title}
              className="h-14 w-14 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-slate-800">{currentTrack.title}</p>
              <p className="text-xs text-rose-500">{currentTrack.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTrack(currentTrack)}
              className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white"
            >
              Play Featured
            </button>
            <a
              href={currentTrack.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#1DB954] px-4 py-2 text-xs font-semibold text-white"
            >
              Open Track
            </a>
            {PLAYLIST_ID && (
              <a
                href={`https://open.spotify.com/playlist/${PLAYLIST_ID}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-500"
              >
                Open Playlist
              </a>
            )}
          </div>
        </div>
      </article>
    </section>
  )
}

export default TrackCard

