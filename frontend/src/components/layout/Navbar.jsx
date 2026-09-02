import { useEffect, useMemo, useState } from 'react'
import { useAppSettings } from '../../hooks/useAppSettings'

const navItems = [
  { label: 'Home', href: '#home', keywords: ['start', 'top'] },
  { label: 'Gallery', href: '#/gallery', keywords: ['fanart', 'art'] },
  { label: 'Countdown', href: '#countdown', keywords: ['dates', 'timer'] },
  { label: 'Events', href: '#/calendar', keywords: ['calendar', 'schedule'] },
  { label: 'Contact', href: '#footer-contact', keywords: ['email', 'footer'] },
]

const isNavItemActive = (item, route) => {
  if (item.href === '#home') {
    return route === '#home' || route === '#/' || route === '' || route === '#'
  }
  return route === item.href
}

const AUTH_MAX_AGE_MS = 12 * 60 * 60 * 1000
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

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [route, setRoute] = useState(() => window.location.hash || '#/')
  const { settings } = useAppSettings()

  useEffect(() => {
    const handleRouteChange = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', handleRouteChange)
    return () => window.removeEventListener('hashchange', handleRouteChange)
  }, [])

  const user = useMemo(() => getStoredUser(), [])

  const navigateTo = (href) => {
    if (!href) return
    setMenuOpen(false)
    window.location.replace(`/${href}`)
  }

  return (
    <>
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <nav className="sticky top-0 z-40 border-b-[var(--nb-border-w)] border-[var(--nb-ink)] bg-white">
        <div className="flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6 lg:px-10">
          <div className="flex items-center gap-3">
            <img
              src={settings.logoUrl}
              alt={`${settings.appName} Logo`}
              className="h-10 w-10 rounded-full border-2 border-[var(--nb-ink)] object-cover"
            />
            <span className="max-w-[180px] truncate font-display text-lg font-extrabold tracking-wide text-rose-600 sm:max-w-none">
              {settings.appName}
            </span>
          </div>

          <div className="hidden items-center justify-center gap-8 text-sm font-bold uppercase tracking-[0.12em] text-slate-600 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => navigateTo(item.href)}
                className={
                  isNavItemActive(item, route)
                    ? 'text-rose-500'
                    : 'transition hover:text-rose-500'
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden items-center justify-end lg:flex">
            {!user && (
              <a
                href="/#/login"
                className="nb-btn bg-rose-500 px-5 py-2 text-xs tracking-[0.16em] text-white hover:-translate-y-0.5"
              >
                Join Fanclub
              </a>
            )}
          </div>

          <button
            type="button"
            className="nb-pill flex flex-col gap-1.5 bg-white p-2.5 lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="h-0.5 w-6 rounded-full bg-slate-700" />
            <span className="h-0.5 w-6 rounded-full bg-slate-700" />
            <span className="h-0.5 w-6 rounded-full bg-slate-700" />
          </button>
        </div>
        {menuOpen && (
          <div className="border-t-[var(--nb-border-w)] border-[var(--nb-ink)] bg-white px-4 pb-6 pt-4 lg:hidden">
            <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-700">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={
                    isNavItemActive(item, route)
                      ? 'text-rose-500 text-left'
                      : 'text-left'
                  }
                  onClick={() => navigateTo(item.href)}
                >
                  {item.label}
                </button>
              ))}
              {!user && (
                <a
                  href="/#/login"
                  className="nb-btn bg-rose-500 px-4 py-2 text-center text-xs tracking-[0.2em] text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Join Fanclub
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar
