import { useCallback, useEffect, useState } from 'react'
import { fetchJsonWithFallback } from '../utils/fetchJsonWithFallback'

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
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [donations, setDonations] = useState([])
  const [donationsLoading, setDonationsLoading] = useState(false)
  const [donationSummary, setDonationSummary] = useState({
    totalThisMonth: 0,
    totalToday: 0,
    pendingCount: 0,
    goalProgress: 0,
  })
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
      const { response, data } = await fetchJsonWithFallback(
        apiBase,
        `/notifications?${params.toString()}`,
      )
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
      const { response, data } = await fetchJsonWithFallback(
        apiBase,
        `/admin/stats?${params.toString()}`,
      )
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load stats.')
      }
      setStats({
        activeMembers: Number(data.activeMembers || 0),
        creativeStaff: Number(data.creativeStaff || 0),
        openAuditFlags: Number(data.openAuditFlags || 0),
      })
    } catch {
      try {
        const memberParams = new URLSearchParams({
          requesterRole: profileRoleNormalized,
          limit: '300',
        })
        const [{ response: membersResp, data: membersData }, { response: flagsResp, data: flagsData }] =
          await Promise.all([
            fetchJsonWithFallback(apiBase, `/admin/members-creative?${memberParams.toString()}`),
            fetchJsonWithFallback(
              apiBase,
              `/admin/audit-flags?${new URLSearchParams({
                requesterRole: profileRoleNormalized,
                status: 'open',
                limit: '300',
              }).toString()}`,
            ),
          ])

        if (!membersResp.ok) {
          throw new Error(membersData?.message || 'Failed to load members for stats.')
        }
        if (!flagsResp.ok) {
          throw new Error(flagsData?.message || 'Failed to load audit flags for stats.')
        }

        const members = Array.isArray(membersData?.items) ? membersData.items : []
        const activeMembers = members.filter((member) => {
          const role = String(member?.role || '').trim().toLowerCase()
          const status = String(member?.status || '').trim().toLowerCase()
          return role === 'member' && (status === '' || status === 'active')
        }).length
        const creativeStaff = members.filter((member) => {
          const role = String(member?.role || '').trim().toLowerCase()
          const status = String(member?.status || '').trim().toLowerCase()
          return (
            (role.includes('creative') || role.includes('copywriter') || role.includes('sns')) &&
            (status === '' || status === 'active')
          )
        }).length
        const openAuditFlags = Array.isArray(flagsData?.items) ? flagsData.items.length : 0

        setStats({
          activeMembers,
          creativeStaff,
          openAuditFlags,
        })
      } catch {
        setStats({
          activeMembers: 0,
          creativeStaff: 0,
          openAuditFlags: 0,
        })
      }
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
        const { response, data } = await fetchJsonWithFallback(
          apiBase,
          `/admin/audit-logs?${params.toString()}`,
        )
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
      const { response, data } = await fetchJsonWithFallback(
        apiBase,
        `/admin/members-creative?${params.toString()}`,
      )
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
      const { response, data } = await fetchJsonWithFallback(
        apiBase,
        `/admin/members-creative?${params.toString()}`,
      )
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
      const { response, data } = await fetchJsonWithFallback(
        apiBase,
        `/admin/creative-requests?${params.toString()}`,
      )
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


  const fetchDonations = useCallback(async () => {
    setDonationsLoading(true)
    try {
      const params = new URLSearchParams({
        requesterRole: profileRoleNormalized,
        limit: '100',
      })
      const { response, data } = await fetchJsonWithFallback(
        apiBase,
        `/admin/donations?${params.toString()}`,
      )
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load donations.')
      }
      const items = Array.isArray(data.items) ? data.items : []
      setDonations(items)

      const now = new Date()
      const toNumber = (value) => {
        const parsed = Number(value)
        return Number.isFinite(parsed) ? parsed : 0
      }
      const isSameDay = (input) => {
        const date = new Date(input)
        return (
          !Number.isNaN(date.getTime()) &&
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth() &&
          date.getDate() === now.getDate()
        )
      }
      const isSameMonth = (input) => {
        const date = new Date(input)
        return (
          !Number.isNaN(date.getTime()) &&
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth()
        )
      }

      const completedThisMonth = items.filter((item) => {
        const status = String(item?.status || '').trim().toLowerCase()
        return (status === '' || status === 'completed' || status === 'paid') && isSameMonth(item?.created_at)
      })
      const completedToday = items.filter((item) => {
        const status = String(item?.status || '').trim().toLowerCase()
        return (status === '' || status === 'completed' || status === 'paid') && isSameDay(item?.created_at)
      })
      const pendingCount = items.filter((item) => {
        const status = String(item?.status || '').trim().toLowerCase()
        return status === 'pending' || status === 'processing'
      }).length

      const totalThisMonth = completedThisMonth.reduce((sum, item) => sum + toNumber(item?.amount), 0)
      const totalToday = completedToday.reduce((sum, item) => sum + toNumber(item?.amount), 0)
      const monthlyGoal = 10000
      const goalProgress = Math.min(100, Math.round((totalThisMonth / monthlyGoal) * 100))

      setDonationSummary({
        totalThisMonth,
        totalToday,
        pendingCount,
        goalProgress: Number.isFinite(goalProgress) ? goalProgress : 0,
      })
    } catch {
      setDonations([])
      setDonationSummary({
        totalThisMonth: 0,
        totalToday: 0,
        pendingCount: 0,
        goalProgress: 0,
      })
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
      const { response, data } = await fetchJsonWithFallback(
        apiBase,
        `/admin/events?${params.toString()}`,
      )
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
      const { response, data } = await fetchJsonWithFallback(
        apiBase,
        `/admin/upcoming-events?${params.toString()}`,
      )
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
      const { response, data } = await fetchJsonWithFallback(
        apiBase,
        `/admin/audit-flags?${params.toString()}`,
      )
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
        await fetchJsonWithFallback(apiBase, `/notifications/${notificationId}/read`, {
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
        const { response, data } = await fetchJsonWithFallback(
          apiBase,
          `/admin/audit-flags/${flagId}/resolve`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requesterRole: profileRoleNormalized,
              resolvedBy: userId || null,
            }),
          },
        )
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
    fetchDonations()
    const intervalId = window.setInterval(fetchNotifications, 30000)
    return () => window.clearInterval(intervalId)
  }, [
    fetchNotifications,
    fetchAdminStats,
    fetchAuditLogs,
    fetchAuditFlags,
    fetchMembersCreative,
    fetchUpcomingEvents,
    fetchDonations,
  ])

  useEffect(() => {
    if (!isMembersRoute && !isCreativesRoute && !isFundsRoute) return
    fetchMembersFull()
  }, [fetchMembersFull, isMembersRoute, isCreativesRoute, isFundsRoute])

  useEffect(() => {
    if (!isCreativesRoute) return
    fetchCreativeRequests()
  }, [fetchCreativeRequests, isCreativesRoute])

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
    fetchCreativeRequests,
    events,
    eventsLoading,
    fetchEvents,
    donations,
    donationsLoading,
    donationSummary,
    fetchDonations,
    auditFlags,
    auditFlagsLoading,
    fetchAuditFlags,
    handleResolveFlag,
  }
}
