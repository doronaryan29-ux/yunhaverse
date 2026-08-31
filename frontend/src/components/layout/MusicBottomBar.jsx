import { useMemo } from 'react'
import { usePlayer } from '../../context/PlayerContext'
import { PLAYLIST_ID } from '../../services/spotifyApi'

const COLLAPSED_HEIGHT = 80
const EXPANDED_HEIGHT = 352

const MusicBottomBar = () => {
  const { currentTrackId, isExpanded, setIsExpanded } = usePlayer()

  const iframeSrc = useMemo(() => {
    if (isExpanded && PLAYLIST_ID) {
      return `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator`
    }
    return `https://open.spotify.com/embed/track/${currentTrackId}?utm_source=generator&theme=0`
  }, [currentTrackId, isExpanded])

  const height = isExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT

  return (
    <div
      className="fixed bottom-0 left-0 right-0"
      style={{
        zIndex: 999,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 -2px 16px rgba(255,110,180,0.15)',
        transformOrigin: 'bottom',
      }}
    >
      <div
        style={{
          height: `${height}px`,
          transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <iframe
          src={iframeSrc}
          width="100%"
          height={height}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={isExpanded ? 'Spotify playlist' : 'Spotify track'}
        />
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-label={isExpanded ? 'Collapse playlist' : 'Expand playlist'}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-white/90 text-rose-500 shadow-sm transition hover:bg-rose-50"
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m6 14 6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export default MusicBottomBar
