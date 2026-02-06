import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  DashboardSection,
  FlagIssueModal,
  CreativeStaffPage,
  EventsPage,
  FundsDonationsPage,
  AuditLogsPage,
  MembersPage,
  ProfileSection,
  SidebarNav,
  TopHeader,
} from '../components/admin'

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

const getSessionUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

const Admin = () => {
  const user = getSessionUser()
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  const profileName = fullName || 'Admin User'
  const profileRole = String(user?.role || 'admin').trim()
  const apiBase = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'
  const [route, setRoute] = useState(window.location.hash || '#/admin')
  const isProfileRoute = route.startsWith('#/admin/profile')
  const isMembersRoute = route.startsWith('#/admin/members')
  const isCreativesRoute = route.startsWith('#/admin/creatives')
  const isFundsRoute = route.startsWith('#/admin/funds')
  const isEventsRoute = route.startsWith('#/admin/events')
  const isAuditLogsRoute = route.startsWith('#/admin/audit-logs')
  const activeNavItem = isMembersRoute
    ? 'Members'
    : isCreativesRoute
      ? 'Creative Staff'
      : isFundsRoute
        ? 'Funds & Donations'
        : isEventsRoute
          ? 'Events'
          : isAuditLogsRoute
            ? 'Audit Logs'
          : 'Dashboard'
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const profileMenuRef = useRef(null)
  const [auditItems, setAuditItems] = useState([])
  const [auditLogsLoading, setAuditLogsLoading] = useState(false)
  const [memberItems, setMemberItems] = useState([])
  const [upcomingEventItems, setUpcomingEventItems] = useState([])
  const [membersFull, setMembersFull] = useState([])
  const [membersLoading, setMembersLoading] = useState(false)
  const [creativeRequests, setCreativeRequests] = useState([])
  const [creativeRequestsLoading, setCreativeRequestsLoading] = useState(false)
  const [creativeSubmissions, setCreativeSubmissions] = useState([])
  const [creativeSubmissionsLoading, setCreativeSubmissionsLoading] = useState(false)
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [donations, setDonations] = useState([])
  const [donationsLoading, setDonationsLoading] = useState(false)
  const [auditFlags, setAuditFlags] = useState([])
  const [auditFlagsLoading, setAuditFlagsLoading] = useState(false)
  const [stats, setStats] = useState({
    activeMembers: null,
    creativeStaff: null,
    openAuditFlags: null,
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formFeedback, setFormFeedback] = useState({ type: '', message: '' })
  const [flagModalOpen, setFlagModalOpen] = useState(false)
  const [flagForm, setFlagForm] = useState({
    title: '',
    details: '',
    severity: 'medium',
  })
  const [flagSubmitLoading, setFlagSubmitLoading] = useState(false)
  const [flagSubmitFeedback, setFlagSubmitFeedback] = useState({
    type: '',
    message: '',
  })
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

  const fetchNotifications = useCallback(async () => {
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
  }, [apiBase, profileRoleNormalized, user?.id])

  const fetchAdminStats = useCallback(async () => {
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
  }, [apiBase, profileRoleNormalized])

  const fetchAuditLogs = useCallback(async (limit = 6) => {
    setAuditLogsLoading(true)
    try {
      const params = new URLSearchParams({
        requesterRole: profileRoleNormalized,
        limit: String(limit),
      })
      const response = await fetch(`${apiBase}/admin/audit-logs?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load audit logs.')
      }
      setAuditItems(Array.isArray(data.items) ? data.items : [])
    } catch {
      setAuditItems([])
    } finally {
      setAuditLogsLoading(false)
    }
  }, [apiBase, profileRoleNormalized])

  const fetchMembersCreative = useCallback(async () => {
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
  }, [apiBase, profileRoleNormalized])

  const fetchMembersFull = useCallback(async () => {
    setMembersLoading(true)
    try {
      const params = new URLSearchParams({
        requesterRole: profileRoleNormalized,
        limit: '200',
      })
      const response = await fetch(`${apiBase}/admin/members-creative?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load members.')
      }
      setMembersFull(Array.isArray(data.items) ? data.items : [])
    } catch {
      setMembersFull([])
    } finally {
      setMembersLoading(false)
    }
  }, [apiBase, profileRoleNormalized])

  const fetchCreativeRequests = useCallback(async () => {
    setCreativeRequestsLoading(true)
    try {
      const params = new URLSearchParams({
        requesterRole: profileRoleNormalized,
        limit: '50',
      })
      const response = await fetch(
        `${apiBase}/admin/creative-requests?${params.toString()}`,
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load creative requests.')
      }
      setCreativeRequests(Array.isArray(data.items) ? data.items : [])
    } catch {
      setCreativeRequests([])
    } finally {
      setCreativeRequestsLoading(false)
    }
  }, [apiBase, profileRoleNormalized])

  const fetchCreativeSubmissions = useCallback(async () => {
    setCreativeSubmissionsLoading(true)
    try {
      const params = new URLSearchParams({
        requesterRole: profileRoleNormalized,
        limit: '50',
      })
      const response = await fetch(
        `${apiBase}/admin/creative-submissions?${params.toString()}`,
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load creative submissions.')
      }
      setCreativeSubmissions(Array.isArray(data.items) ? data.items : [])
    } catch {
      setCreativeSubmissions([])
    } finally {
      setCreativeSubmissionsLoading(false)
    }
  }, [apiBase, profileRoleNormalized])

  const fetchDonations = useCallback(async () => {
    setDonationsLoading(true)
    try {
      const params = new URLSearchParams({
        requesterRole: profileRoleNormalized,
        limit: '100',
      })
      const response = await fetch(`${apiBase}/admin/donations?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load donations.')
      }
      setDonations(Array.isArray(data.items) ? data.items : [])
    } catch {
      setDonations([])
    } finally {
      setDonationsLoading(false)
    }
  }, [apiBase, profileRoleNormalized])

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true)
    try {
      const params = new URLSearchParams({
        requesterRole: profileRoleNormalized,
        limit: '100',
      })
      const response = await fetch(`${apiBase}/admin/events?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load events.')
      }
      setEvents(Array.isArray(data.items) ? data.items : [])
    } catch {
      setEvents([])
    } finally {
      setEventsLoading(false)
    }
  }, [apiBase, profileRoleNormalized])

  const fetchUpcomingEvents = useCallback(async () => {
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
  }, [apiBase, profileRoleNormalized])

  const fetchAuditFlags = useCallback(async () => {
    setAuditFlagsLoading(true)
    try {
      const params = new URLSearchParams({
        requesterRole: profileRoleNormalized,
        status: 'open',
        limit: '12',
      })
      const response = await fetch(`${apiBase}/admin/audit-flags?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load audit flags.')
      }
      setAuditFlags(Array.isArray(data.items) ? data.items : [])
    } catch {
      setAuditFlags([])
    } finally {
      setAuditFlagsLoading(false)
    }
  }, [apiBase, profileRoleNormalized])

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
    fetchAuditFlags()
    fetchMembersCreative()
    fetchUpcomingEvents()
    const intervalId = window.setInterval(fetchNotifications, 30000)
    return () => window.clearInterval(intervalId)
  }, [
    fetchNotifications,
    fetchAdminStats,
    fetchAuditLogs,
    fetchAuditFlags,
    fetchMembersCreative,
    fetchUpcomingEvents,
  ])

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

  useEffect(() => {
    if (!isMembersRoute && !isCreativesRoute && !isFundsRoute) return
    fetchMembersFull()
  }, [fetchMembersFull, isMembersRoute, isCreativesRoute, isFundsRoute])

  useEffect(() => {
    if (!isCreativesRoute) return
    fetchCreativeRequests()
    fetchCreativeSubmissions()
  }, [fetchCreativeRequests, fetchCreativeSubmissions, isCreativesRoute])

  useEffect(() => {
    if (!isFundsRoute) return
    fetchDonations()
  }, [fetchDonations, isFundsRoute])

  useEffect(() => {
    if (!isEventsRoute) return
    fetchEvents()
  }, [fetchEvents, isEventsRoute])

  useEffect(() => {
    if (!isAuditLogsRoute) return
    fetchAuditLogs(200)
  }, [fetchAuditLogs, isAuditLogsRoute])

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

  const markNotificationRead = useCallback(
    async (notificationId) => {
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
    },
    [apiBase, user?.id],
  )

  const submitNotification = useCallback(
    async (event) => {
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
    },
    [
      apiBase,
      fetchAuditLogs,
      fetchNotifications,
      notificationForm,
      profileRoleNormalized,
      user?.id,
    ],
  )

  const saveProfile = useCallback(
    async (event) => {
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
    },
    [apiBase, fetchAuditLogs, profileForm, profileRoleNormalized, user],
  )

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('authAt')
    sessionStorage.removeItem('pendingOtp')
    sessionStorage.removeItem('profileIncomplete')
    window.location.replace('/#/login')
  }, [])

  const handleToggleNotifications = useCallback(() => {
    setNotificationsOpen((prev) => !prev)
    setProfileMenuOpen(false)
  }, [])

  const handleToggleProfile = useCallback(() => {
    setProfileMenuOpen((prev) => !prev)
    setNotificationsOpen(false)
  }, [])

  const handleCloseNotifications = useCallback(() => {
    setNotificationsOpen(false)
  }, [])

  const handleGoProfile = useCallback(() => {
    setProfileMenuOpen(false)
    window.location.replace('/#/admin/profile')
  }, [])

  const handleQuickAction = useCallback((next) => {
    setNotificationForm((prev) => ({
      ...prev,
      ...next,
    }))
  }, [])

  const handleOpenFlagModal = useCallback(() => {
    setFlagSubmitFeedback({ type: '', message: '' })
    setFlagModalOpen(true)
  }, [])

  const handleCloseFlagModal = useCallback(() => {
    setFlagModalOpen(false)
  }, [])

  const handleFlagFormChange = useCallback((next) => {
    setFlagForm((prev) => ({ ...prev, ...next }))
  }, [])

  const handleSubmitFlag = useCallback(
    async (event) => {
      event.preventDefault()
      if (!flagForm.title.trim()) {
        setFlagSubmitFeedback({ type: 'error', message: 'Title is required.' })
        return
      }
      setFlagSubmitFeedback({ type: '', message: '' })
      setFlagSubmitLoading(true)
      try {
        const response = await fetch(`${apiBase}/admin/audit-flags`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requesterRole: profileRoleNormalized,
            title: flagForm.title.trim(),
            details: flagForm.details.trim() || null,
            severity: flagForm.severity,
            createdBy: user?.id || null,
          }),
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to create audit flag.')
        }
        setFlagSubmitFeedback({ type: 'success', message: 'Issue flagged.' })
        setFlagForm({ title: '', details: '', severity: 'medium' })
        setFlagModalOpen(false)
        fetchAdminStats()
        fetchAuditLogs()
        fetchAuditFlags()
      } catch (error) {
        setFlagSubmitFeedback({
          type: 'error',
          message: error.message || 'Failed to create audit flag.',
        })
      } finally {
        setFlagSubmitLoading(false)
      }
    },
    [
      apiBase,
      fetchAdminStats,
      fetchAuditFlags,
      fetchAuditLogs,
      flagForm,
      profileRoleNormalized,
      user?.id,
    ],
  )

  const handleResolveFlag = useCallback(
    async (flagId) => {
      if (!flagId) return
      try {
        const response = await fetch(`${apiBase}/admin/audit-flags/${flagId}/resolve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requesterRole: profileRoleNormalized,
            resolvedBy: user?.id || null,
          }),
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to resolve audit flag.')
        }
        fetchAdminStats()
        fetchAuditFlags()
      } catch {
        // no-op for now
      }
    },
    [apiBase, fetchAdminStats, fetchAuditFlags, profileRoleNormalized, user?.id],
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute right-0 top-72 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 lg:flex-row lg:gap-6">
        <SidebarNav navItems={navItems} activeItem={activeNavItem} />

        <section className="mt-8 flex-1 space-y-6 lg:mt-0">
          <TopHeader
            profileName={profileName}
            profileRole={profileRole}
            isProfileRoute={isProfileRoute}
            notificationsOpen={notificationsOpen}
            profileMenuOpen={profileMenuOpen}
            notificationsLoading={notificationsLoading}
            notifications={notifications}
            unreadCount={unreadCount}
            profileMenuRef={profileMenuRef}
            onToggleNotifications={handleToggleNotifications}
            onToggleProfile={handleToggleProfile}
            onCloseNotifications={handleCloseNotifications}
            onGoProfile={handleGoProfile}
            onLogout={handleLogout}
            onMarkNotificationRead={markNotificationRead}
          />

          {isProfileRoute ? (
            <ProfileSection
              profileForm={profileForm}
              profileFeedback={profileFeedback}
              profileLoading={profileLoading}
              profileSaving={profileSaving}
              onChangeProfile={setProfileForm}
              onSaveProfile={saveProfile}
            />
          ) : isMembersRoute ? (
            <MembersPage
              members={membersFull}
              loading={membersLoading}
              currentRole={profileRoleNormalized}
            />
          ) : isCreativesRoute ? (
            <CreativeStaffPage
              apiBase={apiBase}
              requesterRole={profileRoleNormalized}
              members={membersFull}
              requests={creativeRequests}
              submissions={creativeSubmissions}
              loadingRequests={creativeRequestsLoading}
              loadingSubmissions={creativeSubmissionsLoading}
              onRefresh={() => {
                fetchCreativeRequests()
                fetchCreativeSubmissions()
              }}
            />
          ) : isFundsRoute ? (
            <FundsDonationsPage
              donations={donations}
              loading={donationsLoading}
              apiBase={apiBase}
              requesterRole={profileRoleNormalized}
              members={membersFull}
              onRefresh={fetchDonations}
            />
          ) : isEventsRoute ? (
            <EventsPage
              events={events}
              loading={eventsLoading}
              apiBase={apiBase}
              requesterRole={profileRoleNormalized}
              onRefresh={fetchEvents}
            />
          ) : isAuditLogsRoute ? (
            <AuditLogsPage auditItems={auditItems} loading={auditLogsLoading} />
          ) : (
            <DashboardSection
              statCards={statCards}
              notificationTypes={notificationTypes}
              notificationForm={notificationForm}
              formFeedback={formFeedback}
              formLoading={formLoading}
              onNotificationFormChange={setNotificationForm}
              onSubmitNotification={submitNotification}
              onQuickAction={handleQuickAction}
              onOpenFlagModal={handleOpenFlagModal}
              upcomingEventItems={upcomingEventItems}
              memberItems={memberItems}
              auditItems={auditItems}
              auditFlags={auditFlags}
              auditFlagsLoading={auditFlagsLoading}
              onResolveFlag={handleResolveFlag}
            />
          )}
        </section>
      </div>

      <FlagIssueModal
        open={flagModalOpen}
        form={flagForm}
        feedback={flagSubmitFeedback}
        loading={flagSubmitLoading}
        onChange={handleFlagFormChange}
        onClose={handleCloseFlagModal}
        onSubmit={handleSubmitFlag}
      />
    </main>
  )
}

export default Admin
