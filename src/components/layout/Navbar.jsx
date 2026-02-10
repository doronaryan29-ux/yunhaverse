import { useMemo, useState } from 'react'
import { useAppSettings } from '../../hooks/useAppSettings'

const navItems = [
  'Home',
  'Events',
  'Members Profile',
  'Gallery',
  'Blog',
  'About',
]

const AUTH_MAX_AGE_MS = 12 * 60 * 60 * 1000
const normalizeRole = (role) => String(role || '').trim().toLowerCase()
const isAdminRole = (role) => normalizeRole(role) === 'admin'
const isCreativeRole = (role) => {
  const normalized = normalizeRole(role)
  if (!normalized) return false
  const compact = normalized.replace(/[_-]+/g, ' ')
  return (
    compact.includes('creative') ||
    compact.includes('copywriter') ||
    compact.includes('sns')
  )
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

const getUserInitials = (user) => {
  const first = String(user?.firstName || '').trim()
  const last = String(user?.lastName || '').trim()
  const initials = `${first[0] || ''}${last[0] || ''}`.trim()
  if (initials) return initials.toUpperCase()
  const email = String(user?.email || '').trim()
  return email ? email[0].toUpperCase() : 'U'
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { settings } = useAppSettings()
  const { user, authLink } = useMemo(() => {
    const storedUser = getStoredUser()
    if (!storedUser) {
      return { user: null, authLink: { href: '/#/login', label: 'Login' } }
    }
    const isAdmin = isAdminRole(storedUser.role)
    const isCopywriter = isCopywriterRole(storedUser.role)
    const isSns = isSnsRole(storedUser.role)
    const isCreative = isCreativeRole(storedUser.role)
    const target = isAdmin
      ? '/#/admin'
      : isCopywriter
        ? '/#/copywriter'
        : isSns
          ? '/#/sns'
          : isCreative
            ? '/#/staff'
            : '/#/member'
    return {
      user: storedUser,
      authLink: {
        href: target,
        label: isAdmin
          ? 'Dashboard'
          : isCopywriter
            ? 'Copywriter'
            : isSns
              ? 'SNS Updater'
              : isCreative
                ? 'Staff Portal'
                : 'My Page',
      },
    }
  }, [])
  const initials = useMemo(() => getUserInitials(user), [user])

  const handleSignOut = () => {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('authAt')
    window.location.replace('/#/')
  }

  const handleProfileToggle = () => {
    setProfileOpen((prev) => !prev)
  }

  const handleCloseProfile = () => {
    setProfileOpen(false)
  }

  const handleGoProfile = () => {
    setProfileOpen(false)
    window.location.replace(authLink.href)
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
      <nav className="sticky top-0 z-40 border-b border-pink-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src={settings.logoUrl}
              alt={`${settings.appName} Logo`}
              className="h-10 w-10 rounded-full object-cover shadow"
            />
            <span className="font-display text-lg font-semibold tracking-wide text-rose-600">
              {settings.appName}
            </span>
          </div>
          <div className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 md:flex">
            {navItems.map((item, index) => (
              <a
                key={item}
                href={
                  item === 'Home'
                    ? '#home'
                    : `${item.toLowerCase().replace(/\s+/g, '')}.php`
                }
                className={
                  index === 0
                    ? 'text-rose-500'
                    : 'transition hover:text-rose-500'
                }
              >
                {item}
              </a>
            ))}
            {!user ? (
              <a
                href={authLink.href}
                className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
              >
                {authLink.label}
              </a>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={handleProfileToggle}
                  className="flex items-center gap-3 rounded-full border border-rose-100 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 shadow-lg shadow-rose-100 transition hover:-translate-y-0.5"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-500">
                    {initials}
                  </span>
                  Profile
                </button>
                {profileOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close profile menu"
                      className="fixed inset-0 z-10 cursor-default"
                      onClick={handleCloseProfile}
                    />
                    <div className="absolute right-0 z-20 mt-3 w-56 rounded-2xl border border-rose-100 bg-white p-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-xl shadow-rose-100">
                      <div className="flex items-center gap-3 rounded-xl bg-rose-50 px-3 py-2 text-left text-[10px] font-semibold tracking-[0.18em] text-rose-500">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-rose-500 shadow">
                          {initials}
                        </span>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px]">Signed in as</span>
                          <span className="max-w-[160px] truncate text-[11px] font-semibold text-slate-700">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleGoProfile}
                        className="mt-3 w-full rounded-xl border border-rose-100 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 transition hover:bg-rose-50"
                      >
                        {authLink.label}
                      </button>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="mt-2 w-full rounded-xl border border-rose-100 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-500 transition hover:bg-rose-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            className="flex flex-col gap-1.5 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="h-0.5 w-8 rounded-full bg-slate-700" />
            <span className="h-0.5 w-8 rounded-full bg-slate-700" />
            <span className="h-0.5 w-8 rounded-full bg-slate-700" />
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-pink-100 bg-white px-4 pb-6 pt-4 md:hidden">
            <div className="flex flex-col gap-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
              {navItems.map((item, index) => (
                <a
                  key={item}
                  href={
                    item === 'Home'
                      ? '#home'
                      : `${item.toLowerCase().replace(/\s+/g, '')}.php`
                  }
                  className={index === 0 ? 'text-rose-500' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              {!user ? (
                <a
                  href={authLink.href}
                  className="rounded-full bg-rose-500 px-4 py-2 text-center text-xs font-semibold tracking-[0.2em] text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  {authLink.label}
                </a>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      window.location.replace(authLink.href)
                    }}
                    className="rounded-full border border-rose-100 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-rose-500"
                  >
                    {authLink.label}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      handleSignOut()
                    }}
                    className="rounded-full border border-rose-100 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-rose-500"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar
