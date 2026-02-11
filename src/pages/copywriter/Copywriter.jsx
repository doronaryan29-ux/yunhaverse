import { useEffect, useMemo, useState } from 'react'
import {
  AssignmentCard,
  StatCard,
  StaffSidebar,
  SubmissionCard,
  SubmitWorkForm,
  TeamMemberRow,
} from '../../components/copywriter'
import { AppModal } from '../../components/common'
import { formatDateInManila } from '../../utils/date'

const AUTH_MAX_AGE_MS = 12 * 60 * 60 * 1000
const redirectTo = (hashRoute) => window.location.replace(`/${hashRoute}`)
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

const ROLE_PERMISSIONS = {
  members_view: 'Members: View',
  members_manage: 'Members: Manage',
  creative_view: 'Creative Staff: View',
  creative_manage: 'Creative Staff: Manage',
  copywriter_view: 'Copywriter: View',
  copywriter_manage: 'Copywriter: Manage',
  sns_view: 'SNS Updater: View',
  sns_manage: 'SNS Updater: Manage',
}

const normalizeRole = (role) => String(role || '').trim().toLowerCase()
const isCreativeRole = (role) => {
  const normalized = normalizeRole(role)
  if (!normalized) return false
  const compact = normalized.replace(/[_-]+/g, ' ')
  return compact.includes('copywriter')
}

const resolveId = (value) => {
  if (value == null) return null
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  if (typeof value === 'object') {
    return value.id ?? value.user_id ?? null
  }
  return null
}

const safeString = (value, fallback = '--') => {
  if (value == null) return fallback
  const trimmed = String(value).trim()
  return trimmed ? trimmed : fallback
}

const Copywriter = () => {
  const [user] = useState(() => getStoredUser())
  const profileName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  const profileRole = normalizeRole(user?.role)
  const requesterRole = isCreativeRole(user?.role) ? 'copywriter' : profileRole || 'copywriter'
  const stage = 'copywriter'
  const apiBase = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'

  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    appName: 'YunhaVerse',
    primaryColor: '#e11d48',
    roles: [],
    auditSettings: null,
  })
  const [requests, setRequests] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [error, setError] = useState('')
  const [notifications, setNotifications] = useState([])
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [submissionForm, setSubmissionForm] = useState({
    title: '',
    requestId: '',
    submissionUrl: '',
    notes: '',
  })
  const [activeRequestId, setActiveRequestId] = useState(null)
  const [activeSubmissionId, setActiveSubmissionId] = useState(null)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [submissionFeedback, setSubmissionFeedback] = useState({
    type: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchNotifications = async () => {
    if (!user?.id) return
    setNotificationsLoading(true)
    try {
      const params = new URLSearchParams({
        user_id: String(user.id),
        role: 'member',
        limit: '6',
      })
      const response = await fetch(`${apiBase}/notifications?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to load notifications.')
      }
      setNotifications(Array.isArray(data.items) ? data.items : [])
    } catch {
      setNotifications([])
    } finally {
      setNotificationsLoading(false)
    }
  }

  useEffect(() => {
    if (!user || !isCreativeRole(user.role)) return
    let isMounted = true
    const loadData = async () => {
      setLoading(true)
      setError('')
      try {
        const settingsParams = new URLSearchParams({
          requesterRole,
        })
        const requestsParams = new URLSearchParams({
          requesterRole,
          limit: '60',
          stage,
          assignedTo: user?.id ? String(user.id) : '',
        })
        const [settingsRes, requestsRes, membersRes] = await Promise.all([
          fetch(`${apiBase}/admin/settings?${settingsParams.toString()}`),
          fetch(`${apiBase}/admin/creative-requests?${requestsParams.toString()}`),
          fetch(`${apiBase}/admin/members-creative?${requestsParams.toString()}`),
        ])

        const settingsData = await settingsRes.json()
        const requestsData = await requestsRes.json()
        const membersData = await membersRes.json()

        if (!settingsRes.ok) {
          throw new Error(settingsData?.message || 'Failed to load settings.')
        }
        if (!requestsRes.ok) {
          throw new Error(requestsData?.message || 'Failed to load requests.')
        }
        if (!membersRes.ok) {
          throw new Error(membersData?.message || 'Failed to load team roster.')
        }

        if (!isMounted) return
        setSettings({
          appName: settingsData.app_name || 'YunhaVerse',
          primaryColor: settingsData.primary_color || '#e11d48',
          roles: Array.isArray(settingsData.roles) ? settingsData.roles : [],
          auditSettings:
            settingsData.audit_settings && typeof settingsData.audit_settings === 'object'
              ? settingsData.audit_settings
              : null,
        })
        setRequests(Array.isArray(requestsData.items) ? requestsData.items : [])
        setTeamMembers(
          Array.isArray(membersData.items) ? membersData.items : [],
        )
        if (isMounted) {
          fetchNotifications()
        }
      } catch (err) {
        if (!isMounted) return
        setError(err?.message || 'Unable to load staff dashboard.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [apiBase, profileRole, requesterRole, user])

  const baseRoute = '#/copywriter'
  const navItems = useMemo(
    () => [
      { id: 'overview', label: 'Overview' },
      { id: 'assignments', label: 'Assignments' },
      { id: 'scope', label: 'Admin Scope' },
      { id: 'team', label: 'Team Pulse' },
      { id: 'submissions', label: 'Submissions' },
    ],
    [],
  )

  const getActiveSection = () => {
    const hash = window.location.hash || ''
    const index = hash.indexOf(baseRoute)
    if (index === -1) return 'overview'
    const fragmentIndex = hash.indexOf('#', index + 1)
    if (fragmentIndex === -1) return 'overview'
    const section = hash.slice(fragmentIndex + 1)
    return section || 'overview'
  }

  const [activeSection, setActiveSection] = useState(getActiveSection())

  useEffect(() => {
    const handleHashChange = () => setActiveSection(getActiveSection())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleSubmissionChange = (field, value) => {
    setSubmissionForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitWork = async (event) => {
    event?.preventDefault?.()
    if (!user) return
    setSubmitting(true)
    setSubmissionFeedback({ type: '', message: '' })
    try {
      if (!submissionForm.requestId) {
        throw new Error('Select a linked request before submitting work.')
      }
      const response = await fetch(
        `${apiBase}/admin/creative-requests/${Number(
          submissionForm.requestId,
        )}?requesterRole=${encodeURIComponent(requesterRole)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requesterRole,
            submissionTitle: submissionForm.title.trim(),
            submissionUrl: submissionForm.submissionUrl.trim() || null,
            submissionNotes: submissionForm.notes.trim() || null,
            submittedBy: user.id ? Number(user.id) : null,
            status: 'submitted',
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to submit work.')
      }
      setSubmissionForm({
        title: '',
        requestId: '',
        submissionUrl: '',
        notes: '',
      })
      setRequests((prev) =>
        prev.map((item) =>
          String(item.id) === String(submissionForm.requestId)
            ? {
                ...item,
                submission_title: submissionForm.title.trim(),
                submission_url: submissionForm.submissionUrl.trim() || null,
                submission_notes: submissionForm.notes.trim() || null,
                submitted_by: user.id ? Number(user.id) : null,
                submitted_at: new Date().toISOString(),
                status: 'submitted',
              }
            : item,
        ),
      )
      setSubmissionFeedback({
        type: 'success',
        message: 'Submission sent for review.',
      })
    } catch (err) {
      setSubmissionFeedback({
        type: 'error',
        message: err?.message || 'Failed to submit work.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const roleKey = 'copywriter'
  const creativeRolePermissions = useMemo(() => {
    const role = settings.roles.find((item) => {
      if (!item) return false
      const idMatch = normalizeRole(item.id) === roleKey
      const labelMatch = String(item.label || '')
        .toLowerCase()
        .includes(roleKey)
      return idMatch || labelMatch
    })
    if (!role || !Array.isArray(role.permissions)) return []
    return role.permissions
  }, [roleKey, settings.roles])

  const assignedRequests = useMemo(() => {
    const userId = resolveId(user?.id)
    if (!userId) return []
    return requests.filter((request) => {
      const assignedId = resolveId(
        request?.assignedTo ?? request?.assigned_to ?? request?.assigned_user,
      )
      return assignedId === userId
    })
  }, [requests, user])

  const mySubmissions = useMemo(() => {
    const userId = resolveId(user?.id)
    if (!userId) return []
    return requests.filter((request) => {
      const submittedId = resolveId(
        request?.submitted_by ?? request?.submittedBy,
      )
      return submittedId === userId
    })
  }, [requests, user])

  const openTasks = assignedRequests.filter((request) =>
    ['open', 'in_progress', 'blocked'].includes(
      String(request?.status || '').toLowerCase(),
    ),
  )

  const dueSoonCount = assignedRequests.filter((request) => {
    if (!request?.dueAt && !request?.due_at) return false
    const dueAt = request?.dueAt || request?.due_at
    const date = new Date(dueAt)
    if (Number.isNaN(date.getTime())) return false
    const diffDays = (date - new Date()) / (1000 * 60 * 60 * 24)
    return diffDays >= 0 && diffDays <= 7
  }).length

  const pendingReviewCount = mySubmissions.filter(
    (submission) => String(submission?.status || '').toLowerCase() === 'submitted',
  ).length

  if (!user) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute right-0 top-72 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 lg:flex-row lg:gap-6">
        <StaffSidebar
          navItems={navItems}
          activeItem={activeSection}
          notifications={notifications}
          loading={notificationsLoading}
          baseRoute="/#/copywriter"
        />

        <section className="mt-8 flex-1 space-y-8 lg:mt-0">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
              Copywriter Portal
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900">
              Welcome back, {profileName || user?.email || 'Copywriter'}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
              Capture captions from approved creative assets.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
                onClick={() => setLogoutConfirmOpen(true)}
              >
                Sign out
              </button>
            </div>
          </header>

          <section id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: 'Assigned Tasks',
                value: assignedRequests.length,
                hint: `${openTasks.length} active`,
              },
              {
                label: 'Due This Week',
                value: dueSoonCount,
                hint: 'Next 7 days',
              },
              {
                label: 'Pending Reviews',
                value: pendingReviewCount,
                hint: 'Awaiting admin review',
              },
              {
                label: 'Team Signals',
                value: teamMembers.length || '--',
                hint: 'Creative staff visible',
              },
            ].map((card) => (
              <StatCard
                key={card.label}
                label={card.label}
                value={card.value}
                hint={card.hint}
              />
            ))}
          </section>

        {error ? (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
            {error}
          </div>
        ) : null}

        <section
          id="assignments"
          className="mt-2 grid gap-6 lg:grid-cols-[1.4fr_1fr]"
        >
          <div className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold text-slate-900">
                  My Assignments
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Tasks assigned by admin with scope, priority, and due dates.
                </p>
              </div>
              <span className="rounded-full bg-rose-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                {loading ? 'Loading' : `${assignedRequests.length} tasks`}
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              {assignedRequests.length === 0 ? (
                <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-sm text-slate-600">
                  No assignments yet. Stay ready for new caption briefs.
                </div>
              ) : (
                  assignedRequests.map((request) => (
                      <AssignmentCard
                        key={request?.id || request?.title}
                        title={safeString(request?.title, 'Untitled request')}
                        priority={safeString(request?.priority, 'Medium')}
                        description={safeString(request?.description, 'No brief added yet.')}
                        status={safeString(request?.status, 'Open')}
                        referenceLabel={
                          request?.submission_url || request?.submission_notes
                            ? safeString(
                                request?.submission_url || request?.submission_notes,
                              )
                            : ''
                        }
                        referenceUrl={
                          request?.submission_url || ''
                        }
                        active={activeRequestId === request?.id}
                        onClick={() => setActiveRequestId(request?.id ?? null)}
                        dueLabel={
                      request?.dueAt || request?.due_at
                        ? formatDateInManila(
                            request?.dueAt || request?.due_at,
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            },
                          )
                        : 'TBD'
                    }
                        requestedBy={safeString(
                          request?.requestedByName ||
                            request?.requested_by_name ||
                            request?.requestedBy,
                          'Admin',
                        )}
                      />
                  ))
                )}
            </div>
          </div>

          <div className="space-y-6">
            <section
              id="scope"
              className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100"
            >
              <h2 className="font-display text-xl font-semibold text-slate-900">
                Admin Scope & Settings
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Aligned to {settings.appName} admin configuration.
              </p>
              <div className="mt-4 grid gap-3 text-sm text-slate-600">
                <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                    Creative Permissions
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {creativeRolePermissions.length === 0 ? (
                      <span className="text-xs text-slate-500">Not set</span>
                    ) : (
                      creativeRolePermissions.map((permission) => (
                        <span
                          key={permission}
                          className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600"
                        >
                          {ROLE_PERMISSIONS[permission] || permission}
                        </span>
                      ))
                    )}
                  </div>
                </div>
                <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                    Review Protocol
                  </p>
                  <p className="mt-2 text-xs text-slate-600">
                    {settings.auditSettings?.notifyOnFlag
                      ? 'Admin requires flag notifications on sensitive content.'
                      : 'Flags are tracked silently unless escalated.'}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {settings.auditSettings?.autoArchiveDays
                      ? `Auto-archive after ${settings.auditSettings.autoArchiveDays} days.`
                      : 'No auto-archive rule configured.'}
                  </p>
                </div>
              </div>
            </section>

            <section
              id="team"
              className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100"
            >
              <h3 className="font-display text-xl font-semibold text-slate-900">
                Team Pulse
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Who is active across creative staff today.
              </p>
              <div className="mt-4 grid gap-3">
                {teamMembers.length === 0 ? (
                  <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-3 text-sm text-slate-600">
                    Team roster will appear once admin grants access.
                  </div>
                ) : (
                  teamMembers.slice(0, 5).map((member) => (
                    <TeamMemberRow
                      key={member?.id || member?.email}
                      name={safeString(
                        [member?.first_name, member?.last_name]
                          .filter(Boolean)
                          .join(' ') || member?.name,
                        'Creative Staff',
                      )}
                      email={safeString(member?.email, 'No email')}
                      role={safeString(member?.role, 'Creative')}
                    />
                  ))
                )}
              </div>
            </section>
          </div>
        </section>

        <section
          id="submissions"
          className="mt-2 rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold text-slate-900">
                Submission Queue
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Track deliverables submitted to admin for review.
              </p>
            </div>
            <span className="rounded-full bg-rose-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
              {loading ? 'Loading' : `${mySubmissions.length} submissions`}
            </span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <SubmitWorkForm
              assignedRequests={assignedRequests}
              submissionForm={submissionForm}
              submissionFeedback={submissionFeedback}
              submitting={submitting}
              onChange={handleSubmissionChange}
              onSubmit={handleSubmitWork}
            />

            {mySubmissions.length === 0 ? (
              <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-sm text-slate-600">
                No submissions logged yet. Send your first draft when ready.
              </div>
            ) : (
                mySubmissions.map((submission) => (
                  <SubmissionCard
                    key={submission?.id || submission?.title}
                    title={safeString(
                      submission?.submission_title || submission?.title,
                      'Untitled submission',
                    )}
                    status={safeString(submission?.status, 'Submitted').replace(/_/g, ' ')}
                    notes={safeString(
                      submission?.submission_notes || submission?.review_note,
                      'Awaiting admin feedback.',
                    )}
                    active={activeSubmissionId === submission?.id}
                    onClick={() => setActiveSubmissionId(submission?.id ?? null)}
                    linkLabel={safeString(submission?.submission_url || '')}
                    requestLabel={safeString(submission?.id)}
                  />
                ))
              )}
          </div>
        </section>

        <AppModal
          open={logoutConfirmOpen}
          onClose={() => setLogoutConfirmOpen(false)}
          eyebrow="Confirm Logout"
          title="Sign out of staff portal?"
        >
          <p className="text-sm text-slate-600">
            You will be returned to the login screen.
          </p>
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setLogoutConfirmOpen(false)}
              className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem('user')
                sessionStorage.removeItem('authAt')
                redirectTo('#/login?force=1')
              }}
              className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>
        </AppModal>
        </section>
      </div>
    </main>
  )
}

export default Copywriter
