import { memo } from 'react'
import { AppModal } from '../../common'

const EventFormModal = ({
  open,
  onClose,
  eventForm,
  setEventForm,
  imagePreview,
  setImagePreview,
  submitting,
  canSubmit,
  onSubmit,
  onReset,
}) => (
  <AppModal
    open={open}
    onClose={() => {
      onReset()
      onClose()
    }}
    variant="drawer-right"
    eyebrow="Events"
    title="Add Event"
  >
    <form className="space-y-4" onSubmit={onSubmit}>
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
            onReset()
            onClose()
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
  </AppModal>
)

export default memo(EventFormModal)
