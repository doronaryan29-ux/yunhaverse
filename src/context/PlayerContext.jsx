import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const TRACK_STORAGE_KEY = 'yunhaverse_track'
const FEATURED_TRACK_ID = String(import.meta.env.VITE_FEATURED_TRACK_ID || '4NZZdFybgGq1Xwx4wq2BdB').trim()
const FEATURED_TRACK = {
  trackId: FEATURED_TRACK_ID,
  title: 'SUPERWOMAN',
  artist: 'UNIS',
  albumCover: 'https://i.scdn.co/image/ab67616d0000b273529261269a72cc14a9691471',
  spotifyUrl: `https://open.spotify.com/track/${FEATURED_TRACK_ID}`,
  embedUrl: `https://open.spotify.com/embed/track/${FEATURED_TRACK_ID}?utm_source=generator&theme=0&autoplay=1`,
}

const PlayerContext = createContext(null)

const readStoredTrack = () => {
  try {
    const raw = localStorage.getItem(TRACK_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && parsed.trackId ? parsed : null
  } catch {
    return null
  }
}

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(() => readStoredTrack() || FEATURED_TRACK)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!currentTrack) return
    localStorage.setItem(TRACK_STORAGE_KEY, JSON.stringify(currentTrack))
  }, [currentTrack])

  useEffect(() => {
    const stored = readStoredTrack()
    if (!stored) {
      setCurrentTrack(FEATURED_TRACK)
      return
    }

    if (
      stored.trackId === FEATURED_TRACK.trackId &&
      (stored.title !== FEATURED_TRACK.title || stored.artist !== FEATURED_TRACK.artist || !stored.albumCover)
    ) {
      setCurrentTrack(FEATURED_TRACK)
    }
  }, [])

  const setTrack = (trackObject) => {
    if (!trackObject?.trackId) return
    setCurrentTrack(trackObject)
    setIsPlaying(true)
    setIsMuted(false)
    setIsVisible(true)
  }

  const togglePlay = () => setIsPlaying((prev) => !prev)
  const toggleMute = () => setIsMuted((prev) => !prev)

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      isMuted,
      isVisible,
      setTrack,
      togglePlay,
      toggleMute,
      setIsVisible,
    }),
    [currentTrack, isPlaying, isMuted, isVisible],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider')
  }
  return context
}
