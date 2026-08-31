import { useCallback, useState } from 'react'

export const useAdminActions = ({
  apiBase,
  profileRoleNormalized,
  userId,
  fetchNotifications,
  fetchAuditLogs,
  fetchAdminStats,
  fetchAuditFlags,
}) => {
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
  const [notificationForm, setNotificationForm] = useState({
    type: 'announcement',
    title: '',
    message: '',
    audience: 'all',
    priority: 'normal',
  })

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
            createdBy: userId || null,
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
      userId,
    ],
  )

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
            createdBy: userId || null,
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
      userId,
    ],
  )

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('authAt')
    sessionStorage.removeItem('pendingOtp')
    sessionStorage.removeItem('profileIncomplete')
    window.location.replace('/#/login')
  }, [])

  return {
    notificationForm,
    setNotificationForm,
    formFeedback,
    formLoading,
    submitNotification,
    handleQuickAction,
    flagModalOpen,
    flagForm,
    flagSubmitFeedback,
    flagSubmitLoading,
    handleOpenFlagModal,
    handleCloseFlagModal,
    handleFlagFormChange,
    handleSubmitFlag,
    handleLogout,
  }
}
