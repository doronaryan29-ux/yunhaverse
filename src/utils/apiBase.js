const DEV_API_FALLBACK = 'http://127.0.0.1:8000'

const normalizeBaseUrl = (value) => String(value || '').trim().replace(/\/+$/, '')

const configuredApiBase = normalizeBaseUrl(import.meta.env.VITE_API_BASE)

export const API_BASE = configuredApiBase || DEV_API_FALLBACK
