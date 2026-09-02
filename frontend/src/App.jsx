import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPasswordVerify from './pages/ResetPasswordVerify'
import ResetPasswordNew from './pages/ResetPasswordNew'
import Gallery from './pages/Gallery'
import CalendarPage from './pages/CalendarPage'
import EventDetail from './pages/EventDetail'
import Admin from './pages/admin/Admin'
import Member from './pages/member/Member'
import CreativeStaff from './pages/creative/CreativeStaff'
import Copywriter from './pages/copywriter/Copywriter'
import SnsUpdater from './pages/sns-updater/SnsUpdater'

const getRoute = () => window.location.hash || '#/'
const normalizeRole = (role) => String(role || '').trim().toLowerCase()
const isAdminRole = (role) => normalizeRole(role) === 'admin'
const isCreativeRole = (role) => {
  const normalized = normalizeRole(role)
  if (!normalized) return false
  return normalized.replace(/[_-]+/g, ' ').includes('creative')
}
const isCopywriterRole = (role) => {
  const normalized = normalizeRole(role)
  if (!normalized) return false
  return normalized.replace(/[_-]+/g, ' ').includes('copywriter')
}
const isSnsRole = (role) => {
  const normalized = normalizeRole(role)
  if (!normalized) return false
  return normalized.replace(/[_-]+/g, ' ').includes('sns')
}
const AUTH_MAX_AGE_MS = 12 * 60 * 60 * 1000
const redirectTo = (hashRoute) => window.location.replace(`/${hashRoute}`)
const resolveRoleRoute = (role) => {
  if (isAdminRole(role)) return '#/admin'
  if (isCopywriterRole(role)) return '#/copywriter'
  if (isSnsRole(role)) return '#/sns'
  if (isCreativeRole(role)) return '#/staff'
  return '#/member'
}
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

      if (isAdminRole(data.role)) {
        redirectTo('#/admin')
      } else if (isCopywriterRole(data.role)) {
        redirectTo('#/copywriter')
      } else if (isSnsRole(data.role)) {
        redirectTo('#/sns')
      } else if (isCreativeRole(data.role)) {
        redirectTo('#/staff')
      } else {
        redirectTo('#/')
      }
    } catch {
      redirectTo('#/login')
    }
  }, [route])

  if (route.startsWith('#/forgot-password/verify')) {
    return <ResetPasswordVerify />
  }

  if (route.startsWith('#/forgot-password/new')) {
    return <ResetPasswordNew />
  }

  if (route.startsWith('#/forgot-password')) {
    return <ForgotPassword />
  }

  if (route.startsWith('#/login')) {
    return <Login />
  }

  if (route.startsWith('#/oauth')) {
    return <div className="min-h-screen bg-white" />
  }

  if (route.startsWith('#/gallery')) {
    return <Gallery />
  }

  if (route.startsWith('#/calendar')) {
    return <CalendarPage />
  }

  if (route.startsWith('#/events/')) {
    const eventId = route.slice('#/events/'.length).split('?')[0]
    return <EventDetail eventId={eventId} />
  }

  if (route.startsWith('#/admin')) {
    const user = getStoredUser()
    if (!user || !isAdminRole(user.role)) {
      redirectTo('#/login')
      return <Login />
    }
    return <Admin />
  }

  if (route.startsWith('#/member')) {
    const user = getStoredUser()
    if (!user || isAdminRole(user.role)) {
      redirectTo('#/login?force=1')
      return <Login />
    }
    return <Member />
  }

  if (route.startsWith('#/staff')) {
    const user = getStoredUser()
    if (!user || !isCreativeRole(user.role)) {
      redirectTo('#/login?force=1')
      return <Login />
    }
    return <CreativeStaff />
  }

  if (route.startsWith('#/copywriter')) {
    const user = getStoredUser()
    if (!user || !isCopywriterRole(user.role)) {
      redirectTo('#/login?force=1')
      return <Login />
    }
    return <Copywriter />
  }

  if (route.startsWith('#/sns')) {
    const user = getStoredUser()
    if (!user || !isSnsRole(user.role)) {
      redirectTo('#/login?force=1')
      return <Login />
    }
    return <SnsUpdater />
  }

  const user = getStoredUser()
  if (user) {
    redirectTo(resolveRoleRoute(user.role))
    return <div className="min-h-screen bg-white" />
  }

  return <Home />
}

export default App
