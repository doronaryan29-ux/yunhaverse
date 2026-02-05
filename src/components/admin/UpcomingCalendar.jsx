import { memo, useMemo } from 'react'
import { formatDateInManila } from '../../utils/date'

const UpcomingCalendar = ({ upcomingEventItems }) => {
  const previewEvents = useMemo(() => upcomingEventItems.slice(0, 4), [upcomingEventItems])

  return (
    <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-slate-900">
            Upcoming Calendar
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Events that will show on the public home calendar.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.location.replace('/#/admin/events')}
          className="rounded-2xl border border-rose-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
        >
          View All Events
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {previewEvents.length === 0 && (
          <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
            No upcoming events found.
          </p>
        )}
        {previewEvents.map((event) => (
          <article
            key={`${event.id ?? event.title}-${event.date ?? ''}`}
            className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4"
          >
            <p className="text-sm font-semibold text-slate-900">{event.title}</p>
            <p className="mt-1 text-xs text-slate-500">
              {event.date ? formatDateInManila(event.date) : 'TBA'} •{' '}
              {event.channel || 'General'}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default memo(UpcomingCalendar)
