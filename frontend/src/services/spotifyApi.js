import { API_BASE } from '../utils/apiBase'

const normalizeSpotifyId = (raw, type) => {
  const value = String(raw || '').trim()
  if (!value) return ''

  const withoutQuery = value.split('?')[0]
  const trimmed = withoutQuery.replace(/\/+$/, '')
  const segments = trimmed.split('/')
  const typeIndex = segments.lastIndexOf(type)

  if (typeIndex !== -1 && segments[typeIndex + 1]) {
    return segments[typeIndex + 1]
  }

  if (!trimmed.includes('/')) {
    return trimmed
  }

  return ''
}

export const PLAYLIST_ID = normalizeSpotifyId(import.meta.env.VITE_UNIS_PLAYLIST_ID, 'playlist')

export const fetchSpotifyTracks = async () => {
  const response = await fetch(`${API_BASE}/spotify/tracks`)
  if (!response.ok) {
    throw new Error('Failed to load Spotify tracks')
  }
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export const fetchFeaturedTrackId = async () => {
  const response = await fetch(`${API_BASE}/spotify/featured`)
  if (!response.ok) {
    throw new Error('Failed to load featured track')
  }
  const data = await response.json()
  return normalizeSpotifyId(data?.trackId, 'track')
}
