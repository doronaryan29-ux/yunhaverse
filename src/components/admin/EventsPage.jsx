import { memo, useState } from 'react'

const EventsPage = ({ events = [], loading = false, apiBase, requesterRole, onRefresh }) => {
  const items = Array.isArray(events) ? events : []
  const [formOpen, setFormOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startAt: '',
    endAt: '',
    location: '',
    timezone: 'Asia/Manila',
    imageUrl: '',
    linkUrl: '',
    type: 'streaming',
    status: 'published',
  })
  const [imagePreview, setImagePreview] = useState('')
  const [rowEdits, setRowEdits] = useState({})
  const canSubmit = Boolean(apiBase && requesterRole)

  const clearFormStatus = () => setFormStatus({ type: '', message: '' })
  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      startAt: '',
      endAt: '',
      location: '',
      timezone: 'Asia/Manila',
      imageUrl: '',
      linkUrl: '',
      type: 'streaming',
      status: 'published',
    })
    setImagePreview('')
  }

  const handleCreateEvent = async (event) => {
    event.preventDefault()
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${apiBase}/admin/events?requesterRole=${encodeURIComponent(requesterRole)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requesterRole,
            title: eventForm.title.trim(),
            description: eventForm.description.trim() || null,
            startAt: eventForm.startAt || null,
            endAt: eventForm.endAt || null,
            location: eventForm.location.trim() || null,
            timezone: eventForm.timezone.trim() || null,
            imageUrl: eventForm.imageUrl || null,
            linkUrl: eventForm.linkUrl.trim() || null,
            type: eventForm.type,
            status: eventForm.status,
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create event.')
      }
      resetEventForm()
      setFormStatus({ type: 'success', message: 'Event created.' })
      setFormOpen(false)
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const updateEvent = async (id, payload) => {
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${apiBase}/admin/events/${id}?requesterRole=${encodeURIComponent(requesterRole)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requesterRole, ...payload }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update event.')
      }
      setFormStatus({ type: 'success', message: 'Event updated.' })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const deleteEvent = async (id) => {
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${apiBase}/admin/events/${id}/delete?requesterRole=${encodeURIComponent(
          requesterRole,
        )}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to delete event.')
      }
      setFormStatus({ type: 'success', message: 'Event deleted.' })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const getEditRow = (item) =>
    rowEdits[item.id] || {
      title: item.title || '',
      startAt: item.start_at || item.date || '',
      location: item.location || item.channel || '',
      type: item.type || 'streaming',
      status: item.status || 'published',
    }

  const isDirty = (item, edit) =>
    String(edit.title || '') !== String(item.title || '') ||
    String(edit.startAt || '') !== String(item.start_at || item.date || '') ||
    String(edit.location || '') !== String(item.location || item.channel || '') ||
    String(edit.type || '') !== String(item.type || '') ||
    String(edit.status || '') !== String(item.status || '')

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
              Events
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
              Events Calendar
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="rounded-2xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
          >
            Add Event
          </button>
        </div>
      </header>

      {formStatus.message && (
        <div
          className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
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

      <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-slate-900">Event List</h3>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {items.length} records
          </span>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-rose-100">
          <div className="grid grid-cols-[1.6fr_1.1fr_1.1fr_0.8fr_auto] items-center gap-3 bg-rose-50/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>Event</span>
            <span>Date</span>
            <span>Location</span>
            <span>Type</span>
            <span>Actions</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <p className="px-4 py-6 text-sm text-slate-500">Loading events...</p>
            )}
            {!loading && items.length === 0 && (
              <p className="px-4 py-6 text-sm text-slate-500">No events yet.</p>
            )}
            {!loading &&
              items.map((item) => {
                const edit = getEditRow(item)
                const dirty = isDirty(item, edit)
                return (
                  <div
                    key={`${item.id}-${item.title}`}
                    className="grid grid-cols-[1.6fr_1.1fr_1.1fr_0.8fr_auto] items-center gap-3 border-t border-rose-100 px-4 py-2 text-sm text-slate-700"
                  >
                    <input
                      type="text"
                      value={edit.title}
                      onChange={(event) =>
                        setRowEdits((prev) => ({
                          ...prev,
                          [item.id]: { ...edit, title: event.target.value },
                        }))
                      }
                      className="h-9 rounded-xl border border-rose-200 bg-white px-3 text-sm text-slate-700"
                    />
                    <input
                      type="datetime-local"
                      value={edit.startAt ? String(edit.startAt).replace(' ', 'T') : ''}
                      onChange={(event) =>
                        setRowEdits((prev) => ({
                          ...prev,
                          [item.id]: { ...edit, startAt: event.target.value },
                        }))
                      }
                      className="h-9 w-full rounded-xl border border-rose-200 bg-white px-3 text-sm text-slate-700"
                    />
                    <input
                      type="text"
                      value={edit.location}
                      onChange={(event) =>
                        setRowEdits((prev) => ({
                          ...prev,
                          [item.id]: { ...edit, location: event.target.value },
                        }))
                      }
                      className="h-9 w-full rounded-xl border border-rose-200 bg-white px-3 text-sm text-slate-700"
                    />
                    <select
                      value={edit.type}
                      onChange={(event) =>
                        setRowEdits((prev) => ({
                          ...prev,
                          [item.id]: { ...edit, type: event.target.value },
                        }))
                      }
                      className="h-9 w-full rounded-xl border border-rose-200 bg-white px-3 text-sm text-slate-700"
                    >
                      <option value="streaming">streaming</option>
                      <option value="cupsleeve">cupsleeve</option>
                      <option value="projects">projects</option>
                    </select>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={!canSubmit || submitting || !dirty}
                        onClick={() =>
                          updateEvent(item.id, {
                            title: edit.title.trim(),
                            startAt: edit.startAt || null,
                            location: edit.location.trim() || null,
                            type: edit.type,
                            status: edit.status,
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
                            id: item.id,
                            title: item.title,
                          })
                        }
                        className="rounded-full border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </section>

      {formOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
                  Events
                </p>
                <h4 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                  Add Event
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetEventForm()
                  setFormOpen(false)
                }}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleCreateEvent}>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Title
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(event) =>
                    setEventForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Date & Time
                <input
                  type="datetime-local"
                  value={eventForm.startAt}
                  onChange={(event) =>
                    setEventForm((prev) => ({ ...prev, startAt: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                End Date
                <input
                  type="datetime-local"
                  value={eventForm.endAt}
                  onChange={(event) =>
                    setEventForm((prev) => ({ ...prev, endAt: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Location
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(event) =>
                    setEventForm((prev) => ({ ...prev, location: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Timezone
                <input
                  type="text"
                  value={eventForm.timezone}
                  onChange={(event) =>
                    setEventForm((prev) => ({ ...prev, timezone: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Image Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => {
                      const result = String(reader.result || '')
                      setEventForm((prev) => ({ ...prev, imageUrl: result }))
                      setImagePreview(result)
                    }
                    reader.readAsDataURL(file)
                  }}
                  className="mt-1 w-full text-sm text-slate-600"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Event preview"
                    className="mt-3 h-40 w-full rounded-2xl object-cover"
                  />
                )}
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Link URL
                <input
                  type="text"
                  value={eventForm.linkUrl}
                  onChange={(event) =>
                    setEventForm((prev) => ({ ...prev, linkUrl: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Type
                <select
                  value={eventForm.type}
                  onChange={(event) =>
                    setEventForm((prev) => ({ ...prev, type: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                >
                  <option value="streaming">streaming</option>
                  <option value="cupsleeve">cupsleeve</option>
                  <option value="projects">projects</option>
                </select>
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Description
                <textarea
                  value={eventForm.description}
                  onChange={(event) =>
                    setEventForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  className="mt-1 h-24 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Status
                <select
                  value={eventForm.status}
                  onChange={(event) =>
                    setEventForm((prev) => ({ ...prev, status: event.target.value }))
                  }
                  className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                >
                  <option value="published">published</option>
                  <option value="draft">draft</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </label>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetEventForm()
                    setFormOpen(false)
                  }}
                  className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {submitting ? 'Saving...' : 'Create Event'}
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
                  Delete Event
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
                {deleteModal.title || 'this event'}
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
                  deleteEvent(payload.id)
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

export default memo(EventsPage)
