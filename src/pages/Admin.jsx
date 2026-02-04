import { useEffect, useMemo, useRef, useState } from 'react'

const navItems = [
  'Dashboard',
  'Members',
  'Creative Staff',
  'Funds & Donations',
  'Events',
  'Audit Logs',
  'Settings',
]

const notificationTypes = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'discord_meetup', label: 'Discord Meetup' },
  { value: 'funds_alert', label: 'Funds Alert' },
  { value: 'audit_alert', label: 'Audit Alert' },
]

const Admin = () => {
  const user = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  })()
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  const profileName = fullName || 'Admin User'
  const profileRole = String(user?.role || 'admin').trim()
  const apiBase = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'
  const [route, setRoute] = useState(window.location.hash || '#/admin')
  const isProfileRoute = route.startsWith('#/admin/profile')
  const isDashboardRoute = !isProfileRoute
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const profileMenuRef = useRef(null)
  const [auditItems, setAuditItems] = useState([])
  const [memberItems, setMemberItems] = useState([])
  const [upcomingEventItems, setUpcomingEventItems] = useState([])
  const [stats, setStats] = useState({
    activeMembers: null,
    creativeStaff: null,
    openAuditFlags: null,
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formFeedback, setFormFeedback] = useState({ type: '', message: '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileFeedback, setProfileFeedback] = useState({ type: '', message: '' })
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    email: '',
    role: '',
    status: '',
  })
  const [notificationForm, setNotificationForm] = useState({
    type: 'announcement',
    title: '',
    message: '',
    audience: 'all',
    priority: 'normal',
  })
  const profileRoleNormalized = useMemo(
    () => String(profileRole || '').trim().toLowerCase(),
    [profileRole],
  )

  const fetchNotifications = async () => {
    if (!user?.id) return
    setNotificationsLoading(true)
    try {
      const params = new URLSearchParams({
        user_id: String(user.id),
        role: profileRoleNormalized || 'member',
        limit: '8',
      })
      const response = await fetch(`${apiBase}/notifications?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load notifications.')
      }
      setNotifications(data.items || [])
      setUnreadCount(Number(data.unreadCount || 0))
    } catch {
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setNotificationsLoading(false)
    }
  }

  const fetchAdminStats = async () => {
    try {
      const params = new URLSearchParams({
        requesterRole: profileRoleNormalized,
      })
      const response = await fetch(`${apiBase}/admin/stats?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load stats.')
      }
      setStats({
        activeMembers: Number(data.activeMembers || 0),
        creativeStaff: Number(data.creativeStaff || 0),
        openAuditFlags: Number(data.openAuditFlags || 0),
      })
    } catch {
      setStats({
        activeMembers: null,
        creativeStaff: null,
        openAuditFlags: null,
      })
    }
  }

  const fetchAuditLogs = async () => {
    try {
      const params = new URLSearchParams({
        requesterRole: profileRoleNormalized,
        limit: '6',
      })
      const response = await fetch(`${apiBase}/admin/audit-logs?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load audit logs.')
      }
      setAuditItems(Array.isArray(data.items) ? data.items : [])
    } catch {
      setAuditItems([])
    }
  }

  const fetchMembersCreative = async () => {
    try {
      const params = new URLSearchParams({
        requesterRole: profileRoleNormalized,
        limit: '6',
      })
      const response = await fetch(`${apiBase}/admin/members-creative?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load members.')
      }
      setMemberItems(Array.isArray(data.items) ? data.items : [])
    } catch {
      setMemberItems([])
    }
  }

  const fetchUpcomingEvents = async () => {
    try {
      const params = new URLSearchParams({
        requesterRole: profileRoleNormalized,
        limit: '6',
      })
      const response = await fetch(`${apiBase}/admin/upcoming-events?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load events.')
      }
      setUpcomingEventItems(Array.isArray(data.items) ? data.items : [])
    } catch {
      setUpcomingEventItems([])
    }
  }

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || '#/admin')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }
    window.addEventListener('mousedown', onPointerDown)
    return () => window.removeEventListener('mousedown', onPointerDown)
  }, [])

  useEffect(() => {
    fetchNotifications()
    fetchAdminStats()
    fetchAuditLogs()
    fetchMembersCreative()
    fetchUpcomingEvents()
    const intervalId = window.setInterval(fetchNotifications, 30000)
    return () => window.clearInterval(intervalId)
  }, [apiBase, user?.id, profileRoleNormalized])

  useEffect(() => {
    if (!isProfileRoute || !user?.id) return
    let isMounted = true
    const loadProfile = async () => {
      setProfileLoading(true)
      setProfileFeedback({ type: '', message: '' })
      try {
        const params = new URLSearchParams({
          requesterRole: profileRoleNormalized,
          requesterId: String(user.id),
        })
        const response = await fetch(
          `${apiBase}/users/${user.id}/profile?${params.toString()}`,
        )
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load profile.')
        }
        if (!isMounted) return
        setProfileForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          birthdate: data.birthdate || '',
          email: data.email || '',
          role: data.role || '',
          status: data.status || '',
        })
      } catch (error) {
        if (!isMounted) return
        setProfileFeedback({
          type: 'error',
          message: error.message || 'Failed to load profile.',
        })
      } finally {
        if (isMounted) setProfileLoading(false)
      }
    }
    loadProfile()
    return () => {
      isMounted = false
    }
  }, [isProfileRoute, apiBase, user?.id, profileRoleNormalized])

  const statCards = [
    {
      label: 'Active Members',
      value: stats.activeMembers ?? '--',
      trend: 'Live from database',
    },
    {
      label: 'Creative Staff',
      value: stats.creativeStaff ?? '--',
      trend: 'Live from database',
    },
    { label: 'Donations (Monthly)', value: '$4,920', trend: '+12.4%' },
    {
      label: 'Open Audit Flags',
      value: stats.openAuditFlags ?? '--',
      trend:
        typeof stats.openAuditFlags === 'number' && stats.openAuditFlags > 0
          ? 'Needs review today'
          : 'No active flags',
    },
  ]

  const markNotificationRead = async (notificationId) => {
    if (!user?.id) return
    try {
      await fetch(`${apiBase}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
    } finally {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId ? { ...item, isRead: true } : item,
        ),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  const submitNotification = async (event) => {
    event.preventDefault()
    if (!notificationForm.title.trim() || !notificationForm.message.trim()) {
      setFormFeedback({ type: 'error', message: 'Title and message are required.' })
      return
    }

    setFormFeedback({ type: '', message: '' })
    setFormLoading(true)
    try {
      const response = await fetch(`${apiBase}/admin/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...notificationForm,
          title: notificationForm.title.trim(),
          message: notificationForm.message.trim(),
          requesterRole: profileRoleNormalized,
          createdBy: user?.id || null,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to publish notification.')
      }
      setFormFeedback({ type: 'success', message: 'Notification published.' })
      setNotificationForm((prev) => ({
        ...prev,
        title: '',
        message: '',
      }))
      fetchNotifications()
      fetchAuditLogs()
    } catch (error) {
      setFormFeedback({
        type: 'error',
        message: error.message || 'Failed to publish notification.',
      })
    } finally {
      setFormLoading(false)
    }
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    if (!user?.id) return
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      setProfileFeedback({ type: 'error', message: 'First and last name are required.' })
      return
    }
    setProfileSaving(true)
    setProfileFeedback({ type: '', message: '' })
    try {
      const response = await fetch(`${apiBase}/users/${user.id}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterRole: profileRoleNormalized,
          requesterId: user.id,
          firstName: profileForm.firstName.trim(),
          lastName: profileForm.lastName.trim(),
          birthdate: profileForm.birthdate || null,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to save profile.')
      }
      const nextUser = {
        ...user,
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
      }
      sessionStorage.setItem('user', JSON.stringify(nextUser))
      setProfileFeedback({ type: 'success', message: 'Profile saved.' })
      fetchAuditLogs()
    } catch (error) {
      setProfileFeedback({
        type: 'error',
        message: error.message || 'Failed to save profile.',
      })
    } finally {
      setProfileSaving(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('authAt')
    sessionStorage.removeItem('pendingOtp')
    sessionStorage.removeItem('profileIncomplete')
    window.location.replace('/#/login')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute right-0 top-72 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 lg:flex-row lg:gap-6">
        <aside className="w-full shrink-0 lg:w-72">
          <div className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100 lg:sticky lg:top-8">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-rose-500">
              Admin Console
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900">
              YUNHAverse Ops
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Members, creatives, funds, events, and safety checks in one place.
            </p>

            <nav className="mt-6 flex flex-col gap-2">
              {navItems.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (index === 0) {
                      window.location.replace('/#/admin')
                    }
                  }}
                  className={`rounded-2xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    index === 0 && isDashboardRoute
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                      : 'border border-rose-100 text-slate-600 hover:-translate-y-0.5 hover:bg-rose-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>

          </div>
        </aside>

        <section className="mt-8 flex-1 space-y-6 lg:mt-0">
          <header className="sticky top-0 z-20 rounded-3xl border border-rose-100 bg-white/95 px-6 py-4 shadow-sm backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
                  Admin Overview
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-slate-900">
                  Operations Hub
                </h2>
              </div>

              <div className="relative flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen((prev) => !prev)
                    setProfileMenuOpen(false)
                  }}
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                  aria-label="Notifications"
                >
                  <i className="fas fa-bell" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen((prev) => !prev)
                      setNotificationsOpen(false)
                    }}
                    className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-left transition hover:bg-rose-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                        <i className="fas fa-user text-xs" />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Profile
                        </p>
                        <p className="text-sm font-semibold text-slate-800">{profileName}</p>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-rose-500">
                          {profileRole}
                        </p>
                      </div>
                    </div>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 top-14 z-30 w-44 rounded-2xl border border-rose-100 bg-white p-2 shadow-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false)
                          window.location.replace('/#/admin/profile')
                        }}
                        className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-rose-50"
                      >
                        My Profile
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-500 transition hover:bg-rose-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {notificationsOpen && (
                  <div className="absolute right-0 top-12 z-30 w-80 rounded-2xl border border-rose-100 bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between px-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
                        Notifications
                      </p>
                      <button
                        type="button"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs text-slate-400 hover:text-slate-600"
                      >
                        Close
                      </button>
                    </div>

                    <div className="max-h-80 space-y-2 overflow-y-auto">
                      {notificationsLoading && (
                        <p className="px-2 py-4 text-sm text-slate-500">Loading...</p>
                      )}
                      {!notificationsLoading && notifications.length === 0 && (
                        <p className="px-2 py-4 text-sm text-slate-500">
                          No notifications yet.
                        </p>
                      )}
                      {!notificationsLoading &&
                        notifications.map((item) => (
                          <article
                            key={item.id}
                            className={`rounded-xl border px-3 py-3 ${
                              item.isRead
                                ? 'border-rose-100 bg-white'
                                : 'border-rose-200 bg-rose-50/70'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {item.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-600">
                                  {item.message}
                                </p>
                              </div>
                              {!item.isRead && (
                                <button
                                  type="button"
                                  onClick={() => markNotificationRead(item.id)}
                                  className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-500"
                                >
                                  Read
                                </button>
                              )}
                            </div>
                          </article>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {isProfileRoute ? (
            <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-rose-500">
                  Admin Profile
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                  Edit account details
                </h3>
              </div>

              <form className="mt-6 space-y-4" onSubmit={saveProfile}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    First name
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))
                      }
                      className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                    />
                  </label>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Last name
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))
                      }
                      className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Birthdate
                    <input
                      type="date"
                      value={profileForm.birthdate || ''}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, birthdate: event.target.value }))
                      }
                      className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                    />
                  </label>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Email
                    <input
                      type="text"
                      value={profileForm.email}
                      disabled
                      className="mt-1 w-full rounded-xl border border-rose-100 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                    />
                  </label>
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Role / Status
                    <input
                      type="text"
                      value={`${profileForm.role || '-'} / ${profileForm.status || '-'}`}
                      disabled
                      className="mt-1 w-full rounded-xl border border-rose-100 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                    />
                  </label>
                </div>

                {profileFeedback.message && (
                  <p
                    className={`text-xs ${
                      profileFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {profileFeedback.message}
                  </p>
                )}

                {profileLoading ? (
                  <p className="text-sm text-slate-500">Loading profile...</p>
                ) : (
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
                  >
                    {profileSaving ? 'Saving...' : 'Save changes'}
                  </button>
                )}
              </form>
            </section>
          ) : (
            <>
              <header className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
                      Dashboard
                    </p>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
                      Operations Overview
                    </h2>
                  </div>
                </div>
              </header>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => (
                  <article
                    key={card.label}
                    className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-lg shadow-rose-100"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      {card.label}
                    </p>
                    <p className="mt-3 font-display text-3xl font-semibold text-slate-900">
                      {card.value}
                    </p>
                    <p className="mt-2 text-xs text-rose-500">{card.trend}</p>
                  </article>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-2xl font-semibold text-slate-900">
                      Quick Admin Actions
                    </h3>
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      High priority
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      className="rounded-2xl bg-rose-500 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
                      onClick={() =>
                        setNotificationForm((prev) => ({
                          ...prev,
                          type: 'announcement',
                          audience: 'all',
                        }))
                      }
                    >
                      Broadcast Email
                    </button>
                    <button
                      type="button"
                      className="rounded-2xl border border-rose-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
                      onClick={() =>
                        setNotificationForm((prev) => ({
                          ...prev,
                          type: 'discord_meetup',
                          audience: 'members',
                        }))
                      }
                    >
                      Post Discord Notice
                    </button>
                    <button
                      type="button"
                      className="rounded-2xl border border-rose-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
                    >
                      Review Audit Logs
                    </button>
                    <button
                      type="button"
                      className="rounded-2xl border border-rose-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
                    >
                      Add Donation Record
                    </button>
                  </div>

                  <form
                    className="mt-6 space-y-3 rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
                    onSubmit={submitNotification}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
                      Publish Notification
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Type
                        <select
                          value={notificationForm.type}
                          onChange={(event) =>
                            setNotificationForm((prev) => ({
                              ...prev,
                              type: event.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                        >
                          {notificationTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Audience
                        <select
                          value={notificationForm.audience}
                          onChange={(event) =>
                            setNotificationForm((prev) => ({
                              ...prev,
                              audience: event.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                        >
                          <option value="all">All</option>
                          <option value="members">Members</option>
                          <option value="admins">Admins</option>
                        </select>
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Priority
                        <select
                          value={notificationForm.priority}
                          onChange={(event) =>
                            setNotificationForm((prev) => ({
                              ...prev,
                              priority: event.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                        >
                          <option value="low">Low</option>
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                        </select>
                      </label>
                    </div>
                    <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Title
                      <input
                        type="text"
                        value={notificationForm.title}
                        onChange={(event) =>
                          setNotificationForm((prev) => ({
                            ...prev,
                            title: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                        placeholder="Short alert title"
                      />
                    </label>
                    <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Message
                      <textarea
                        value={notificationForm.message}
                        onChange={(event) =>
                          setNotificationForm((prev) => ({
                            ...prev,
                            message: event.target.value,
                          }))
                        }
                        className="mt-1 h-24 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                        placeholder="Write the notice details"
                      />
                    </label>
                    {formFeedback.message && (
                      <p
                        className={`text-xs ${
                          formFeedback.type === 'success'
                            ? 'text-emerald-600'
                            : 'text-rose-500'
                        }`}
                      >
                        {formFeedback.message}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
                    >
                      {formLoading ? 'Publishing...' : 'Publish Notice'}
                    </button>
                  </form>
                </section>

                <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    Upcoming Calendar
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Events that will show on the public home calendar.
                  </p>

                  <div className="mt-4 space-y-3">
                    {upcomingEventItems.length === 0 && (
                      <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
                        No upcoming events found.
                      </p>
                    )}
                    {upcomingEventItems.map((event) => (
                      <article
                        key={`${event.id ?? event.title}-${event.date ?? ''}`}
                        className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4"
                      >
                        <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'} •{' '}
                          {event.channel || 'General'}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    Members & Creative Staff
                  </h3>
                  <div className="mt-4 space-y-3">
                    {memberItems.length === 0 && (
                      <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
                        No members found.
                      </p>
                    )}
                    {memberItems.map((member) => (
                      <div
                        key={`${member.id}-${member.name}`}
                        className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                          <p className="text-xs text-slate-500">
                            {member.role} • Joined{' '}
                            {member.joinedAt
                              ? new Date(member.joinedAt).toLocaleDateString()
                              : 'Unknown'}
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500">
                          {member.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    Audit Log Snapshot
                  </h3>
                  <div className="mt-4 space-y-3">
                    {auditItems.length === 0 && (
                      <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
                        No audit activity yet.
                      </p>
                    )}
                    {auditItems.map((item) => (
                      <div
                        key={`${item.id}-${item.created_at}`}
                        className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {item.action}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {(item.actor_email || 'system')} •{' '}
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : 'No timestamp'}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-slate-900">
                    Donation Tracking
                  </h3>
                  <button
                    type="button"
                    className="rounded-2xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
                  >
                    Export Report
                  </button>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <article className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Received Today
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">$410</p>
                  </article>
                  <article className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Pending Payouts
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">$780</p>
                  </article>
                  <article className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Fund Goal Progress
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">64%</p>
                  </article>
                </div>
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default Admin
