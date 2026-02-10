import { memo } from 'react'

const EventsTable = ({
  items,
  loading,
  canSubmit,
  submitting,
  getEditRow,
  isDirty,
  setRowEdits,
  updateEvent,
  setDeleteModal,
}) => (
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
        {loading && <p className="px-4 py-6 text-sm text-slate-500">Loading events...</p>}
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
)

export default memo(EventsTable)
