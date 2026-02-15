import { memo, useState } from 'react'
import EventFormModal from './EventFormModal'
import EventsHeader from './EventsHeader'
import EventsTable from './EventsTable'
import { confirmDeleteAlert, showStatusAlert } from '../../../utils/sweetAlert'

const EventsPage = ({ events = [], loading = false, apiBase, requesterRole, onRefresh }) => {
  const items = Array.isArray(events) ? events : []
  const [formOpen, setFormOpen] = useState(false)
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
      await showStatusAlert({
        type: 'success',
        title: 'Event Created',
        message: 'Event created.',
      })
      setFormOpen(false)
      onRefresh?.()
    } catch (error) {
      await showStatusAlert({
        type: 'error',
        title: 'Create Failed',
        message: error.message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const updateEvent = async (id, payload) => {
    if (!canSubmit) return
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
      await showStatusAlert({
        type: 'success',
        title: 'Event Updated',
        message: 'Event updated.',
      })
      onRefresh?.()
    } catch (error) {
      await showStatusAlert({
        type: 'error',
        title: 'Update Failed',
        message: error.message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const deleteEvent = async (id) => {
    if (!canSubmit) return
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
      await showStatusAlert({
        type: 'success',
        title: 'Event Deleted',
        message: 'Event deleted.',
      })
      onRefresh?.()
    } catch (error) {
      await showStatusAlert({
        type: 'error',
        title: 'Delete Failed',
        message: error.message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const requestDeleteEvent = async (item) => {
    if (!item?.id || !canSubmit || submitting) return
    const confirmed = await confirmDeleteAlert({
      title: 'Delete Event',
      message: `Delete "${item.title || 'this event'}"? This cannot be undone.`,
    })
    if (!confirmed) return
    await deleteEvent(item.id)
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
      <EventsHeader onAdd={() => setFormOpen(true)} />
      <EventsTable
        items={items}
        loading={loading}
        canSubmit={canSubmit}
        submitting={submitting}
        getEditRow={getEditRow}
        isDirty={isDirty}
        setRowEdits={setRowEdits}
        updateEvent={updateEvent}
        onRequestDelete={requestDeleteEvent}
      />
      <EventFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        eventForm={eventForm}
        setEventForm={setEventForm}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        submitting={submitting}
        canSubmit={canSubmit}
        onSubmit={handleCreateEvent}
        onReset={resetEventForm}
      />
    </section>
  )
}

export default memo(EventsPage)
