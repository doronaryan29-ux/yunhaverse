const AUTH_MAX_AGE_MS = 12 * 60 * 60 * 1000

const redirectTo = (hashRoute) => window.location.replace(`/${hashRoute}`)

const getStoredUser = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user') || 'null')
    const authAt = Number(sessionStorage.getItem('authAt') || 0)
    if (!user || !authAt || Date.now() - authAt > AUTH_MAX_AGE_MS) {
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('authAt')
      return null
    }
    return user
  } catch {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('authAt')
    return null
  }
}

const normalizeRole = (role) => String(role || '').trim().toLowerCase()

const isCreativeRole = (role) => {
  const normalized = normalizeRole(role)
  if (!normalized) return false
  const compact = normalized.replace(/[_-]+/g, ' ')
  return compact.includes('creative')
}

const resolveId = (value) => {
  if (value == null) return null
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  if (typeof value === 'object') {
    return value.id ?? value.user_id ?? null
  }
  return null
}

const safeString = (value, fallback = '--') => {
  if (value == null) return fallback
  const trimmed = String(value).trim()
  return trimmed ? trimmed : fallback
}

export {
  AUTH_MAX_AGE_MS,
  getStoredUser,
  isCreativeRole,
  normalizeRole,
  redirectTo,
  resolveId,
  safeString,
}
