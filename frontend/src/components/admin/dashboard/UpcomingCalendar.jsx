import { memo, useMemo } from 'react'
import { formatDateInManila } from '../../../utils/date'
import DashboardCard from './DashboardCard'

const UpcomingCalendar = ({ upcomingEventItems }) => {
  const previewEvents = useMemo(() => upcomingEventItems.slice(0, 4), [upcomingEventItems])

  return (
    <DashboardCard
      title="Upcoming Calendar"
      subtitle="Events that will show on the public home calendar."
      action={
        <button
          type="button"
          onClick={() => window.location.replace('/#/admin/events')}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition motion-safe:active:scale-[0.97] hover:border-slate-300 hover:bg-slate-50"
        >
          View All Events
        </button>
      }
    >
      {previewEvents.length === 0 ? (
        <p className="flex h-full items-center justify-center text-center text-sm text-slate-500">
          No upcoming events found.
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {previewEvents.map((event) => (
            <article
              key={`${event.id ?? event.title}-${event.date ?? ''}`}
              className="py-3 first:pt-0 last:pb-0"
            >
              <p className="text-sm font-medium text-slate-900">{event.title}</p>
              <p className="mt-1 text-xs text-slate-500">
                {event.date ? formatDateInManila(event.date) : 'TBA'} •{' '}
                {event.channel || 'General'}
              </p>
            </article>
          ))}
        </div>
      )}
    </DashboardCard>
  )
}

export default memo(UpcomingCalendar)
