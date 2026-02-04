import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'

const getRoute = () => window.location.hash || '#/'
const isAdminRole = (role) => String(role || '').trim().toLowerCase() === 'admin'
const AUTH_MAX_AGE_MS = 12 * 60 * 60 * 1000
const redirectTo = (hashRoute) => window.location.replace(`/${hashRoute}`)
const decodeBase64Url = (value) => {
  const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4
  const padded = padding ? normalized + '='.repeat(4 - padding) : normalized
  return atob(padded)
}
const parseHashQuery = (hash) => {
  const queryIndex = hash.indexOf('?')
  if (queryIndex === -1) return {}
  const query = hash.slice(queryIndex + 1)
  return Object.fromEntries(new URLSearchParams(query))
}
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

function App() {
  const [route, setRoute] = useState(getRoute())

  useEffect(() => {
    const handleRouteChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', handleRouteChange)
    return () => window.removeEventListener('hashchange', handleRouteChange)
  }, [])

  useEffect(() => {
    if (!route.startsWith('#/oauth')) return
    const params = parseHashQuery(route)
    if (!params.payload) {
      redirectTo('#/login')
      return
    }

    try {
      const decoded = decodeBase64Url(params.payload)
      const data = JSON.parse(decoded)
      if (!data?.id || !data?.email) {
        redirectTo('#/login')
        return
      }

      sessionStorage.setItem(
        'user',
        JSON.stringify({
          id: data.id,
          email: data.email,
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      )
      sessionStorage.setItem('authAt', String(Date.now()))
      if (!data.profileComplete) {
        sessionStorage.setItem('profileIncomplete', 'true')
      } else {
        sessionStorage.removeItem('profileIncomplete')
      }

      redirectTo(isAdminRole(data.role) ? '#/admin' : '#/')
    } catch {
      redirectTo('#/login')
    }
  }, [route])

  if (route.startsWith('#/login')) {
    return <Login />
  }

  if (route.startsWith('#/oauth')) {
    return <div className="min-h-screen bg-white" />
  }

  if (route.startsWith('#/admin')) {
    const user = getStoredUser()
    if (!user || !isAdminRole(user.role)) {
      redirectTo('#/login')
      return <Login />
    }
    return <Admin />
  }

  return <Home />
}

export default App
