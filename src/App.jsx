import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'

const getRoute = () => window.location.hash || '#/'
const getStoredUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem('user') || 'null')
  } catch {
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

  if (route.startsWith('#/login')) {
    return <Login />
  }

  if (route.startsWith('#/admin')) {
    const user = getStoredUser()
    if (!user || user.role !== 'admin') {
      window.location.hash = '#/login'
      return <Login />
    }
    return <Admin />
  }

  return <Home />
}

export default App
