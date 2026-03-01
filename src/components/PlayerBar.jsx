import { useState } from 'react'
import { ChevronDown, Music } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'

const PLAYLIST_ID = String(import.meta.env.VITE_UNIS_PLAYLIST_ID || '').trim()

const PlayerBar = () => {
  const { currentTrack, isPlaying, isMuted, toggleMute, setTrack, isVisible, setIsVisible } = usePlayer()
  const [playlistOpen, setPlaylistOpen] = useState(false)

  if (!currentTrack) return null

  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsVisible(true)
          setTrack(currentTrack)
        }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          background: '#ff6eb4',
          borderRadius: '50%',
          boxShadow: '0 4px 16px rgba(255,110,180,0.5)',
          zIndex: 9999,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          transform: 'scale(1)',
          overflow: 'visible',
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = 'scale(1)'
        }}
        aria-label="Show player"
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: '#ff6eb4',
            animation: 'ping 1.5s ease-out infinite',
            zIndex: -1,
          }}
        />
        <Music size={20} color="white" strokeWidth={2} />
      </button>
    )
  }

  const iframeSrc = (() => {
    if (isMuted) return 'about:blank'
    const url = String(currentTrack.embedUrl || '')
    if (!url) return 'about:blank'
    return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`
  })()

  return (
    <>
      <style>
        {`
          @keyframes eq1 { 0%,100%{height:8px} 50%{height:20px} }
          @keyframes eq2 { 0%,100%{height:16px} 50%{height:6px} }
          @keyframes eq3 { 0%,100%{height:10px} 50%{height:22px} }
          @keyframes ping {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        `}
      </style>

      {PLAYLIST_ID && (
        <div
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '64px',
            width: '380px',
            height: '352px',
            zIndex: 9998,
            transform: playlistOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: playlistOpen ? 'auto' : 'none',
            borderRadius: '16px 16px 0 0',
            boxShadow: '0 -8px 32px rgba(255,110,180,0.2)',
            overflow: 'hidden',
            background: '#ffe8f3',
          }}
        >
          <iframe
            src={`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0`}
            width="380"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify playlist panel"
          />
        </div>
      )}

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: 'rgba(255,240,245,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,110,180,0.2)',
          boxShadow: '0 -4px 24px rgba(255,110,180,0.1)',
          zIndex: 9999,
          padding: '0 24px',
        }}
      >
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          style={{
            position: 'absolute',
            top: '-16px',
            left: '24px',
            width: '28px',
            height: '28px',
            background: 'rgba(255,240,245,0.97)',
            border: '1px solid rgba(255,110,180,0.25)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 -2px 8px rgba(255,110,180,0.1)',
            transition: 'all 0.2s ease',
            transform: 'scale(1)',
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.background = 'rgba(255,110,180,0.15)'
            event.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background = 'rgba(255,240,245,0.97)'
            event.currentTarget.style.transform = 'scale(1)'
          }}
          aria-label="Hide player"
        >
          <ChevronDown size={14} color="#ffb3d1" strokeWidth={2.5} />
        </button>

        <iframe
          src={iframeSrc}
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            opacity: 0,
            pointerEvents: 'none',
          }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          title="Spotify hidden player"
        />

        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <img
              src={currentTrack.albumCover}
              alt={currentTrack.title}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                objectFit: 'cover',
                boxShadow: '0 2px 8px rgba(255,110,180,0.3)',
              }}
            />
            <div className="min-w-0">
              <p className="truncate" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a1a2e' }}>
                {currentTrack.title}
              </p>
              <p className="truncate" style={{ fontSize: '0.75rem', color: '#ff6eb4' }}>
                {currentTrack.artist}
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-0.5">
            <div className="flex items-end gap-1">
              <span style={{ width: '3px', borderRadius: '2px', background: '#ff6eb4', animation: 'eq1 0.9s ease-in-out infinite', animationPlayState: isPlaying && !isMuted ? 'running' : 'paused' }} />
              <span style={{ width: '3px', borderRadius: '2px', background: '#ff6eb4', animation: 'eq2 0.9s ease-in-out infinite', animationPlayState: isPlaying && !isMuted ? 'running' : 'paused' }} />
              <span style={{ width: '3px', borderRadius: '2px', background: '#ff6eb4', animation: 'eq3 0.9s ease-in-out infinite', animationPlayState: isPlaying && !isMuted ? 'running' : 'paused' }} />
            </div>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#ffb3d1', textTransform: 'uppercase' }}>
              {isPlaying && !isMuted ? 'NOW PLAYING' : 'READY TO PLAY'}
            </p>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              style={{
                width: '32px',
                height: '32px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,110,180,0.25)',
                color: '#ff6eb4',
                borderRadius: '999px',
              }}
            >
              {isMuted ? (
                <svg viewBox="0 0 24 24" style={{ width: '15px', height: '15px' }} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
                  <path d="m16 9 5 6M21 9l-5 6" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" style={{ width: '15px', height: '15px' }} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" strokeLinecap="round" />
                  <path d="M18.5 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" />
                </svg>
              )}
            </button>
            {PLAYLIST_ID && (
              <button
                type="button"
                onClick={() => setPlaylistOpen((prev) => !prev)}
                style={{
                  background: 'transparent',
                  border: '1.5px solid #ff6eb4',
                  color: '#ff6eb4',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                Show Playlist
              </button>
            )}
            <a
              href={currentTrack.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setTrack(currentTrack)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#1DB954',
                color: '#fff',
                borderRadius: '20px',
                padding: '6px 16px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', fill: '#fff' }} aria-hidden="true">
                <path d="M12 2.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6zm4.4 14.2a.6.6 0 0 1-.8.2c-2.2-1.3-5-1.6-8.2-.8a.6.6 0 1 1-.3-1.2c3.5-.8 6.6-.5 9 .9.2.2.3.6.1.9zm1.2-2.5a.8.8 0 0 1-1 .3c-2.6-1.6-6.5-2-9.6-1a.8.8 0 1 1-.5-1.6c3.6-1 7.9-.6 10.9 1.2.4.2.5.7.2 1.1zm.1-2.6C14.6 9.4 9.5 9.2 6.5 10a1 1 0 1 1-.5-1.9c3.4-1 9.1-.8 12.8 1.4a1 1 0 0 1-1.1 1.8z" />
              </svg>
              <span>Stream on Spotify</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlayerBar
