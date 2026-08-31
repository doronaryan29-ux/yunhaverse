import { API_BASE } from '../utils/apiBase'

export const API_URL =
  String(import.meta.env.VITE_EVENTS_API_URL || '').trim() ||
  `${API_BASE}/events`

export const fetchEvents = async () => {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Failed to load events')
  }
  const data = await response.json()
  if (Array.isArray(data?.items)) {
    return data.items
  }
  return Array.isArray(data) ? data : []
}
