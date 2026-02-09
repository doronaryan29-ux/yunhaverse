import { useCallback, useEffect, useState } from 'react'

export const useAdminData = ({
  apiBase,
  profileRoleNormalized,
  userId,
  isMembersRoute,
  isCreativesRoute,
  isFundsRoute,
  isEventsRoute,
  isAuditLogsRoute,
}) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [notificationsLoading, setNotificationsLoading] = useState(false)
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

  const fetchNotifications = useCallback(async () => {
    if (!userId) return
    setNotificationsLoading(true)
    try {
      const params = new URLSearchParams({
        user_id: String(userId),
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
  }, [apiBase, profileRoleNormalized, userId])

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

  const fetchAuditLogs = useCallback(
    async (limit = 6) => {
      setAuditLogsLoading(true)
      try {
        const params = new URLSearchParams({
          requesterRole: profileRoleNormalized,
          limit: String(limit),
        })
        const response = await fetch(
          `${apiBase}/admin/audit-logs?${params.toString()}`,
        )
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
    },
    [apiBase, profileRoleNormalized],
  )

  const fetchMembersCreative = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        requesterRole: profileRoleNormalized,
        limit: '6',
      })
      const response = await fetch(
        `${apiBase}/admin/members-creative?${params.toString()}`,
      )
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
      const response = await fetch(
        `${apiBase}/admin/members-creative?${params.toString()}`,
      )
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
      const response = await fetch(
        `${apiBase}/admin/upcoming-events?${params.toString()}`,
      )
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

  const markNotificationRead = useCallback(
    async (notificationId) => {
      if (!userId) return
      try {
        await fetch(`${apiBase}/notifications/${notificationId}/read`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
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
    [apiBase, userId],
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
            resolvedBy: userId || null,
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
    [apiBase, fetchAdminStats, fetchAuditFlags, profileRoleNormalized, userId],
  )

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

  return {
    notifications,
    unreadCount,
    notificationsLoading,
    fetchNotifications,
    markNotificationRead,
    stats,
    fetchAdminStats,
    auditItems,
    auditLogsLoading,
    fetchAuditLogs,
    memberItems,
    upcomingEventItems,
    membersFull,
    membersLoading,
    fetchMembersFull,
    creativeRequests,
    creativeRequestsLoading,
    creativeSubmissions,
    creativeSubmissionsLoading,
    fetchCreativeRequests,
    fetchCreativeSubmissions,
    events,
    eventsLoading,
    fetchEvents,
    donations,
    donationsLoading,
    fetchDonations,
    auditFlags,
    auditFlagsLoading,
    fetchAuditFlags,
    handleResolveFlag,
  }
}
