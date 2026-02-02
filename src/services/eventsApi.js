export const API_URL = 'http://localhost/events/api_events.php'

export const fetchEvents = async () => {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Failed to load events')
  }
  const data = await response.json()
  return Array.isArray(data) ? data : []
}
