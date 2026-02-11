import { API_BASE } from '../utils/apiBase'

export const API_URL =
  String(import.meta.env.VITE_EVENTS_API_URL || '').trim() ||
  `${API_BASE}/events/api_events.php`

export const fetchEvents = async () => {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Failed to load events')
  }
  const data = await response.json()
  return Array.isArray(data) ? data : []
}
