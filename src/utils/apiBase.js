const DEV_API_FALLBACK = 'http://127.0.0.1:8000'

const normalizeBaseUrl = (value) => String(value || '').trim().replace(/\/+$/, '')

const configuredApiBase = normalizeBaseUrl(import.meta.env.VITE_API_BASE)

if (!configuredApiBase && !import.meta.env.DEV) {
  throw new Error(
    'Missing VITE_API_BASE for production build. Set it in your Vercel project environment variables.',
  )
}

if (configuredApiBase && !import.meta.env.DEV) {
  let parsedUrl
  try {
    parsedUrl = new URL(configuredApiBase)
  } catch {
    throw new Error('VITE_API_BASE must be a valid absolute URL.')
  }

  const host = String(parsedUrl.hostname || '').toLowerCase()
  if (host === 'localhost' || host === '127.0.0.1') {
    throw new Error('VITE_API_BASE cannot point to localhost in production.')
  }
  if (parsedUrl.protocol !== 'https:') {
    throw new Error('VITE_API_BASE must use https in production.')
  }
}

export const API_BASE = configuredApiBase || DEV_API_FALLBACK
