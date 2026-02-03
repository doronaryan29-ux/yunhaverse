import { useEffect, useMemo, useState } from 'react'
import { fetchEvents } from '../../services/eventsApi'
import { buildCalendarDays, toISODate } from '../../utils/date'

const CalendarSection = () => {
  const [events, setEvents] = useState([])
  const [eventsError, setEventsError] = useState(null)
  const [eventFilter, setEventFilter] = useState('all')
  const [eventScope, setEventScope] = useState('month')
  const [eventSort, setEventSort] = useState('date-asc')
  const [eventQuery, setEventQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const today = useMemo(() => new Date(), [])
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  )
  const [selectedDate, setSelectedDate] = useState(() => today)

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarMonth),
    [calendarMonth],
  )

  const filteredEvents = useMemo(() => {
    if (eventFilter === 'all') {
      return events
    }
    return events.filter((event) => event.type === eventFilter)
  }, [events, eventFilter])

  const eventsByDate = useMemo(() => {
    return filteredEvents.reduce((acc, event) => {
      if (!event.start_at) {
        return acc
      }
      const eventDate = toISODate(new Date(event.start_at))
      acc[eventDate] = acc[eventDate] ? [...acc[eventDate], event] : [event]
      return acc
    }, {})
  }, [filteredEvents])

  const selectedISO = toISODate(selectedDate)
  const eventsForSelectedDate = eventsByDate[selectedISO] ?? []
  const eventsThisMonth = filteredEvents.filter((event) => {
    if (!event.start_at) {
      return false
    }
    const eventDate = new Date(event.start_at)
    return (
      eventDate.getFullYear() === calendarMonth.getFullYear() &&
      eventDate.getMonth() === calendarMonth.getMonth()
    )
  })

  const baseEvents =
    eventScope === 'selected'
      ? eventsForSelectedDate
      : eventScope === 'all'
        ? filteredEvents
        : eventsThisMonth

  const normalizedQuery = eventQuery.trim().toLowerCase()
  const searchedEvents = baseEvents.filter((event) => {
    if (!normalizedQuery) {
      return true
    }
    const haystack = [event.title, event.description, event.location, event.type]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalizedQuery)
  })

  const displayedEvents = [...searchedEvents].sort((a, b) => {
    if (eventSort === 'title-asc') {
      return String(a.title).localeCompare(String(b.title))
    }
    if (eventSort === 'title-desc') {
      return String(b.title).localeCompare(String(a.title))
    }
    const aDate = new Date(a.start_at || 0).getTime()
    const bDate = new Date(b.start_at || 0).getTime()
    if (eventSort === 'date-desc') {
      return bDate - aDate
    }
    return aDate - bDate
  })

  const monthLabel = calendarMonth.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  useEffect(() => {
    let isMounted = true
    fetchEvents()
      .then((data) => {
        if (!isMounted) {
          return
        }
        setEvents(data)
        setEventsError(null)
      })
      .catch((err) => {
        console.error(err)
        if (isMounted) {
          setEvents([])
          setEventsError('Unable to load events right now.')
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-rose-500">
            Plan Ahead
          </p>
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Upcoming Events
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen((prev) => !prev)}
          aria-expanded={filtersOpen}
          aria-controls="calendar-filters"
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-sm transition-all duration-300 ease-out active:scale-95 ${
            filtersOpen
              ? 'border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-200'
              : 'border-rose-200 bg-white text-rose-500 hover:-translate-y-0.5'
          }`}
        >
          <i className="fas fa-filter text-[12px]" aria-hidden="true" />
          {filtersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      <div
        id="calendar-filters"
        className={`overflow-hidden transition-all duration-300 ease-out ${
          filtersOpen
            ? 'max-h-[420px] opacity-100 translate-y-0'
            : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-3 rounded-3xl border border-rose-100 bg-white/80 p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { id: 'all', label: 'All Events' },
              { id: 'cupsleeve', label: 'Cupsleeve' },
              { id: 'streaming', label: 'Streaming' },
              { id: 'projects', label: 'Projects' },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setEventFilter(filter.id)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                  eventFilter === filter.id
                    ? 'border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-200'
                    : 'border-rose-200 bg-white text-rose-500 hover:-translate-y-0.5'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { id: 'month', label: 'This Month' },
              { id: 'all', label: 'All Dates' },
            ].map((scope) => (
              <button
                key={scope.id}
                type="button"
                onClick={() => setEventScope(scope.id)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                  eventScope === scope.id
                    ? 'border-slate-700 bg-slate-800 text-white shadow-lg shadow-slate-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5'
                }`}
              >
                {scope.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={eventQuery}
                onChange={(event) => setEventQuery(event.target.value)}
                placeholder="Search events"
                className="w-full rounded-full border border-rose-100 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-rose-300 focus:outline-none"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                <i className="fas fa-search" />
              </span>
            </div>
            <select
              value={eventSort}
              onChange={(event) => setEventSort(event.target.value)}
              className="rounded-full border border-rose-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
            >
              <option value="date-asc">Date (Soonest)</option>
              <option value="date-desc">Date (Latest)</option>
              <option value="title-asc">Name (A-Z)</option>
              <option value="title-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-pink-100 pb-4">
            <button
              type="button"
              onClick={() => {
                const nextMonth = new Date(
                  calendarMonth.getFullYear(),
                  calendarMonth.getMonth() - 1,
                  1,
                )
                setCalendarMonth(nextMonth)
                setSelectedDate(nextMonth)
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 text-rose-500"
            >
              <i className="fas fa-chevron-left" />
            </button>
            <div className="text-center">
              <h3 className="font-display text-xl font-semibold text-slate-900">
                {monthLabel}
              </h3>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {selectedDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const nextMonth = new Date(
                  calendarMonth.getFullYear(),
                  calendarMonth.getMonth() + 1,
                  1,
                )
                setCalendarMonth(nextMonth)
                setSelectedDate(nextMonth)
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 text-rose-500"
            >
              <i className="fas fa-chevron-right" />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-y-3 text-center text-xs font-semibold uppercase text-slate-400">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-sm">
            {calendarDays.map((day) => {
              const iso = toISODate(day.date)
              const hasEvent = Boolean(eventsByDate[iso])
              const isToday = iso === toISODate(today)
              const isSelected = iso === selectedISO
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => {
                    setSelectedDate(day.date)
                    setEventScope('selected')
                  }}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition ${
                    day.inMonth ? 'text-slate-700' : 'text-slate-300'
                  } ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                      : 'hover:bg-rose-50'
                  }`}
                >
                  <span className={isToday ? 'font-semibold' : ''}>
                    {day.date.getDate()}
                  </span>
                  {hasEvent && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-rose-400'
                      }`}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-xl">
          <h4 className="font-display text-xl font-semibold text-slate-900">
            {eventScope === 'selected'
              ? 'Events on Selected Date'
              : eventScope === 'all'
                ? 'All Events'
                : 'Events This Month'}
          </h4>
          <div className="mt-4 space-y-4">
            {displayedEvents.map((event) => (
              <div
                key={event.id ?? event.title}
                className="flex gap-4 rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-rose-500">
                  {new Date(event.start_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className="flex-1 space-y-1">
                  <h5 className="font-semibold text-slate-900">{event.title}</h5>
                  <p className="text-sm text-slate-500">
                    {event.description || event.location || 'Details coming soon.'}
                  </p>
                  <a
                    href={event.link_url || '#'}
                    className="text-sm font-semibold text-rose-500"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
            {eventsError && (
              <p className="text-sm text-amber-600">{eventsError}</p>
            )}
            {!eventsError && displayedEvents.length === 0 && (
              <p className="text-sm text-slate-500">
                No events match this filter yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CalendarSection
