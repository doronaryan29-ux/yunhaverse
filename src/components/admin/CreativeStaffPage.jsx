import { memo, useMemo, useState } from 'react'
import { formatDateInManila } from '../../utils/date'

const CreativeStaffPage = ({
  apiBase,
  requesterRole,
  members = [],
  requests = [],
  submissions = [],
  loadingRequests = false,
  loadingSubmissions = false,
  onRefresh,
}) => {
  const requestItems = Array.isArray(requests) ? requests : []
  const submissionItems = Array.isArray(submissions) ? submissions : []
  const memberOptions = Array.isArray(members) ? members : []
  const [requestForm, setRequestForm] = useState({
    title: '',
    description: '',
    requestedBy: '',
    assignedTo: '',
    priority: 'Medium',
    status: 'Open',
    dueAt: '',
  })
  const [submissionForm, setSubmissionForm] = useState({
    title: '',
    requestId: '',
    submittedBy: '',
    submissionUrl: '',
    notes: '',
    status: 'Pending_review',
  })
  const [requestEdits, setRequestEdits] = useState({})
  const [submissionEdits, setSubmissionEdits] = useState({})
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const normalizedApiBase = apiBase || ''
  const canSubmit = Boolean(normalizedApiBase && requesterRole)
  const requestCount = requestItems.length
  const submissionCount = submissionItems.length

  const clearFormStatus = () => setFormStatus({ type: '', message: '' })

  const handleCreateRequest = async (event) => {
    event.preventDefault()
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${normalizedApiBase}/admin/creative-requests?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requesterRole,
            title: requestForm.title.trim(),
            description: requestForm.description.trim() || null,
            requestedBy: requestForm.requestedBy
              ? Number(requestForm.requestedBy)
              : null,
            assignedTo: requestForm.assignedTo ? Number(requestForm.assignedTo) : null,
            priority: requestForm.priority,
            status: requestForm.status,
            dueAt: requestForm.dueAt || null,
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create request.')
      }
      setRequestForm({
        title: '',
        description: '',
        requestedBy: '',
        assignedTo: '',
        priority: 'Medium',
        status: 'Open',
        dueAt: '',
      })
      setFormStatus({ type: 'success', message: 'Request created.' })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateSubmission = async (event) => {
    event.preventDefault()
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${normalizedApiBase}/admin/creative-submissions?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requesterRole,
            title: submissionForm.title.trim(),
            requestId: submissionForm.requestId ? Number(submissionForm.requestId) : null,
            submittedBy: submissionForm.submittedBy
              ? Number(submissionForm.submittedBy)
              : null,
            submissionUrl: submissionForm.submissionUrl.trim() || null,
            notes: submissionForm.notes.trim() || null,
            status: submissionForm.status,
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create submission.')
      }
      setSubmissionForm({
        title: '',
        requestId: '',
        submittedBy: '',
        submissionUrl: '',
        notes: '',
        status: 'Pending_Review',
      })
      setFormStatus({ type: 'success', message: 'Submission created.' })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const updateRequest = async (id, payload) => {
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${normalizedApiBase}/admin/creative-requests/${id}?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requesterRole, ...payload }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update request.')
      }
      setFormStatus({ type: 'success', message: 'Request updated.' })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const deleteRequest = async (id) => {
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${normalizedApiBase}/admin/creative-requests/${id}/delete?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to delete request.')
      }
      setFormStatus({ type: 'success', message: 'Request deleted.' })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const updateSubmission = async (id, payload) => {
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${normalizedApiBase}/admin/creative-submissions/${id}?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requesterRole, ...payload }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update submission.')
      }
      setFormStatus({ type: 'success', message: 'Submission updated.' })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const deleteSubmission = async (id) => {
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${normalizedApiBase}/admin/creative-submissions/${id}/delete?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to delete submission.')
      }
      setFormStatus({ type: 'success', message: 'Submission deleted.' })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const statusOptions = useMemo(
    () => ['Open', 'In_Progress', 'Blocked', 'Complete'],
    [],
  )
  const submissionStatusOptions = useMemo(
    () => ['Pending_Review', 'Approved', 'Needs_Revisions', 'Rejected'],
    [],
  )
  const priorityOptions = useMemo(() => ['Low', 'Medium', 'High'], [])

  const resolveMemberName = (member) =>
    (
      member?.full_name ||
      [member?.first_name, member?.last_name].filter(Boolean).join(' ') ||
      [member?.firstName, member?.lastName].filter(Boolean).join(' ') ||
      member?.email ||
      ''
    ).trim()

  const resolveMemberLabel = (member) => {
    const name = resolveMemberName(member)
    return name ? `${name} (#${member.id})` : `User #${member.id}`
  }

  const getMemberNameById = (id) => {
    if (!id) return ''
    const match = memberOptions.find((member) => String(member.id) === String(id))
    return match ? resolveMemberName(match) : ''
  }

  const getRequestEdit = (item) => {
    const current = requestEdits[item.id]
    return (
      current || {
        assignedTo: item.assigned_to || '',
        status: item.status || 'Open',
        priority: item.priority || 'Medium',
      }
    )
  }

  const getSubmissionEdit = (item) => {
    const current = submissionEdits[item.id]
    return current || { status: item.status || 'Pending_Review' }
  }

  const isRequestDirty = (item, edit) =>
    String(edit.assignedTo || '') !== String(item.assigned_to || '') ||
    String(edit.status || '') !== String(item.status || '') ||
    String(edit.priority || '') !== String(item.priority || '')

  const isSubmissionDirty = (item, edit) =>
    String(edit.status || '') !== String(item.status || '')

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
              Creative Staff
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
              Requests & Submissions
            </h2>
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            {requestCount + submissionCount} total
          </span>
        </div>
      </header>

      <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
              Create
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Add new requests or submissions with a focused form.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRequestModalOpen(true)}
              className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
            >
              New Request
            </button>
            <button
              type="button"
              onClick={() => setSubmissionModalOpen(true)}
              className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              New Submission
            </button>
          </div>
        </div>
        {formStatus.message && (
          <div
            className={`mt-4 flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
              formStatus.type === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            <span>{formStatus.message}</span>
            <button
              type="button"
              onClick={clearFormStatus}
              className="text-xs font-semibold uppercase tracking-[0.2em]"
            >
              Dismiss
            </button>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-slate-900">
            Requests Queue
          </h3>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {requestItems.length} active
          </span>
        </div>

        <div className="mt-4 grid gap-3">
          {loadingRequests && (
            <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
              Loading requests...
            </p>
          )}
          {!loadingRequests && requestItems.length === 0 && (
            <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
              No requests yet.
            </p>
          )}
          {!loadingRequests &&
            requestItems.map((item) => {
              const edit = getRequestEdit(item)
              const isDirty = isRequestDirty(item, edit)
              return (
            <article
              key={item.id}
              className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Requested by {item.requested_by_name || '—'}
                    {item.due_at ? ` • Due ${formatDateInManila(item.due_at)}` : ''}
                  </p>
                  {item.assigned_to_name || getMemberNameById(item.assigned_to) ? (
                    <p className="mt-1 text-xs text-slate-400">
                      Assigned to {item.assigned_to_name || getMemberNameById(item.assigned_to)}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500">
                  {item.priority || 'Medium'}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={edit.assignedTo}
                    onChange={(event) =>
                      setRequestEdits((prev) => ({
                        ...prev,
                        [item.id]: { ...edit, assignedTo: event.target.value },
                      }))
                    }
                    className="max-w-[220px] rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] text-slate-600"
                  >
                    <option value="">Unassigned</option>
                    {memberOptions.map((member) => (
                      <option key={member.id} value={member.id}>
                        {resolveMemberLabel(member)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={edit.status}
                    onChange={(event) =>
                      setRequestEdits((prev) => ({
                        ...prev,
                        [item.id]: { ...edit, status: event.target.value },
                      }))
                    }
                    className="rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] text-slate-600"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                  <select
                    value={edit.priority}
                    onChange={(event) =>
                      setRequestEdits((prev) => ({
                        ...prev,
                        [item.id]: { ...edit, priority: event.target.value },
                      }))
                    }
                    className="rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] text-slate-600"
                  >
                    {priorityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  disabled={!canSubmit || submitting || !isDirty}
                  onClick={() =>
                    updateRequest(item.id, {
                      assignedTo: edit.assignedTo ? Number(edit.assignedTo) : null,
                      status: edit.status,
                      priority: edit.priority,
                    })
                  }
                  className="rounded-full border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 disabled:opacity-60"
                >
                  Save
                </button>
                <button
                  type="button"
                  disabled={!canSubmit || submitting}
                  onClick={() =>
                    setDeleteModal({
                      type: 'request',
                      id: item.id,
                      title: item.title,
                    })
                  }
                  className="rounded-full border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </article>
              )
            })}
        </div>
      </section>

      <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-slate-900">
            Submissions Review
          </h3>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {submissionItems.length} items
          </span>
        </div>

        <div className="mt-4 grid gap-3">
          {loadingSubmissions && (
            <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
              Loading submissions...
            </p>
          )}
          {!loadingSubmissions && submissionItems.length === 0 && (
            <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
              No submissions yet.
            </p>
          )}
          {!loadingSubmissions &&
            submissionItems.map((item) => {
              const edit = getSubmissionEdit(item)
              const isDirty = isSubmissionDirty(item, edit)
              return (
            <article
              key={item.id}
              className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Submitted by {item.submitted_by_name || '—'}
                    {item.created_at ? ` • ${formatDateInManila(item.created_at)}` : ''}
                  </p>
                  {item.request_title && (
                    <p className="mt-1 text-xs text-slate-400">
                      Request: {item.request_title}
                    </p>
                  )}
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500">
                  {item.status || 'Pending_Review'}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={edit.status}
                    onChange={(event) =>
                      setSubmissionEdits((prev) => ({
                        ...prev,
                        [item.id]: { status: event.target.value },
                      }))
                    }
                    className="rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] text-slate-600"
                  >
                    {submissionStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  disabled={!canSubmit || submitting || !isDirty}
                  onClick={() => updateSubmission(item.id, { status: edit.status })}
                  className="rounded-full border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 disabled:opacity-60"
                >
                  Save
                </button>
                <button
                  type="button"
                  disabled={!canSubmit || submitting}
                  onClick={() =>
                    setDeleteModal({
                      type: 'submission',
                      id: item.id,
                      title: item.title,
                    })
                  }
                  className="rounded-full border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </article>
              )
            })}
        </div>
      </section>

      {requestModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
                  Creative Request
                </p>
                <h4 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                  New Request
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleCreateRequest}>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Title
                <input
                  type="text"
                  required
                  value={requestForm.title}
                  onChange={(event) =>
                    setRequestForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                  placeholder="Request title"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Description
                <textarea
                  value={requestForm.description}
                  onChange={(event) =>
                    setRequestForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  className="mt-1 h-24 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                  placeholder="Describe the request"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Requested By
                  <select
                    value={requestForm.requestedBy}
                    onChange={(event) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        requestedBy: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                  >
                    <option value="">Select user</option>
                    {memberOptions.map((member) => (
                      <option key={member.id} value={member.id}>
                        {resolveMemberLabel(member)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Assign To
                  <select
                    value={requestForm.assignedTo}
                    onChange={(event) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        assignedTo: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {memberOptions.map((member) => (
                      <option key={member.id} value={member.id}>
                        {resolveMemberLabel(member)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Priority
                  <select
                    value={requestForm.priority}
                    onChange={(event) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        priority: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                  >
                    {priorityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Status
                  <select
                    value={requestForm.status}
                    onChange={(event) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        status: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Due Date
                  <input
                    type="date"
                    value={requestForm.dueAt}
                    onChange={(event) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        dueAt: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                  />
                </label>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {submitting ? 'Saving...' : 'Create Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {submissionModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
                  Creative Submission
                </p>
                <h4 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                  New Submission
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSubmissionModalOpen(false)}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleCreateSubmission}>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Title
                <input
                  type="text"
                  required
                  value={submissionForm.title}
                  onChange={(event) =>
                    setSubmissionForm((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                  placeholder="Submission title"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Request
                  <select
                    value={submissionForm.requestId}
                    onChange={(event) =>
                      setSubmissionForm((prev) => ({
                        ...prev,
                        requestId: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                  >
                    <option value="">No linked request</option>
                    {requestItems.map((request) => (
                      <option key={request.id} value={request.id}>
                        {request.title} (#{request.id})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Submitted By
                  <select
                    value={submissionForm.submittedBy}
                    onChange={(event) =>
                      setSubmissionForm((prev) => ({
                        ...prev,
                        submittedBy: event.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                  >
                    <option value="">Select user</option>
                    {memberOptions.map((member) => (
                      <option key={member.id} value={member.id}>
                        {resolveMemberLabel(member)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Submission URL
                <input
                  type="text"
                  value={submissionForm.submissionUrl}
                  onChange={(event) =>
                    setSubmissionForm((prev) => ({
                      ...prev,
                      submissionUrl: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Notes
                <textarea
                  value={submissionForm.notes}
                  onChange={(event) =>
                    setSubmissionForm((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                  className="mt-1 h-24 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Status
                <select
                  value={submissionForm.status}
                  onChange={(event) =>
                    setSubmissionForm((prev) => ({
                      ...prev,
                      status: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                >
                  {submissionStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSubmissionModalOpen(false)}
                  className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {submitting ? 'Saving...' : 'Create Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
                  Confirm Delete
                </p>
                <h4 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                  Delete {deleteModal.type === 'request' ? 'Request' : 'Submission'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              This will permanently remove{' '}
              <span className="font-semibold text-slate-900">
                {deleteModal.title || 'this item'}
              </span>
              . Continue?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  const payload = deleteModal
                  setDeleteModal(null)
                  if (payload.type === 'request') {
                    deleteRequest(payload.id)
                  } else {
                    deleteSubmission(payload.id)
                  }
                }}
                className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
              >
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default memo(CreativeStaffPage)
