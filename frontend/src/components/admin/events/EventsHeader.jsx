import { memo } from 'react'

const EventsHeader = ({ onAdd }) => (
  <header className="rounded-xl border border-slate-200 bg-white p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Events
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Events Calendar
        </h2>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition motion-safe:active:scale-[0.97] hover:bg-indigo-700"
      >
        Add Event
      </button>
    </div>
  </header>
)

export default memo(EventsHeader)
