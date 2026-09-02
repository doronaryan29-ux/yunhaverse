import { useEffect, useMemo, useState } from 'react'
import { fetchEvents } from '../../services/eventsApi'
import {
  buildCalendarDays,
  formatDateInManila,
  toISODate,
} from '../../utils/date'
import { Skeleton, Tooltip } from '../common'

const CalendarSection = () => {
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
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

  const monthLabel = formatDateInManila(calendarMonth, {
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
      .finally(() => {
        if (isMounted) {
          setEventsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section
      id="events"
      className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 scroll-mt-28"
    >
      <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div>
          <span className="nb-pill inline-flex bg-rose-100 px-4 py-1.5 text-xs uppercase tracking-[0.4em] text-rose-600">
            Plan Ahead
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900">
            Upcoming Events
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen((prev) => !prev)}
          aria-expanded={filtersOpen}
          aria-controls="calendar-filters"
          className={`nb-pill inline-flex items-center gap-2 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ease-out active:scale-95 ${
            filtersOpen
              ? 'nb-tab-active bg-rose-500 text-white'
              : 'bg-white text-rose-500 hover:-translate-y-0.5'
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
        <div className="nb-surface flex flex-col gap-3 !rounded-[1.5rem] bg-white p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Event Type
              <select
                value={eventFilter}
                onChange={(event) => setEventFilter(event.target.value)}
                className="nb-pill mt-2 w-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-600"
              >
                <option value="all">All Events</option>
                <option value="cupsleeve">Cupsleeve</option>
                <option value="streaming">Streaming</option>
                <option value="projects">Projects</option>
              </select>
            </label>
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Date Scope
              <select
                value={eventScope}
                onChange={(event) => setEventScope(event.target.value)}
                className="nb-pill mt-2 w-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-600"
              >
                <option value="month">This Month</option>
                <option value="selected">Selected Date</option>
                <option value="all">All Dates</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                value={eventQuery}
                onChange={(event) => setEventQuery(event.target.value)}
                placeholder="Search events"
                className="nb-pill w-full bg-white px-4 py-2 text-sm text-slate-700 focus:outline-none"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                <i className="fas fa-search" />
              </span>
            </div>
            <select
              value={eventSort}
              onChange={(event) => setEventSort(event.target.value)}
              className="nb-pill bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-600"
            >
              <option value="date-asc">Date (Soonest)</option>
              <option value="date-desc">Date (Latest)</option>
              <option value="title-asc">Name (A-Z)</option>
              <option value="title-desc">Name (Z-A)</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setEventFilter('all')
                setEventScope('month')
                setEventSort('date-asc')
                setEventQuery('')
              }}
              className="nb-pill bg-white px-4 py-2 text-[11px] text-rose-500 transition hover:-translate-y-0.5"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="nb-surface p-4 sm:p-6">
          <div className="flex items-center justify-between border-b-[var(--nb-border-w)] border-[var(--nb-ink)] pb-4">
            <Tooltip label="Previous month">
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
                aria-label="Go to previous month"
                className="nb-pill flex h-10 w-10 items-center justify-center bg-white text-rose-500"
              >
                <i className="fas fa-chevron-left" />
              </button>
            </Tooltip>
            <div className="text-center">
              <h3 className="font-display text-xl font-bold text-slate-900">
                {monthLabel}
              </h3>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {formatDateInManila(selectedDate, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <Tooltip label="Next month">
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
                aria-label="Go to next month"
                className="nb-pill flex h-10 w-10 items-center justify-center bg-white text-rose-500"
              >
                <i className="fas fa-chevron-right" />
              </button>
            </Tooltip>
          </div>
          <div className="mt-6 overflow-x-auto pb-1">
            <div className="min-w-[420px]">
              <div className="grid grid-cols-7 gap-y-3 text-center text-xs font-bold uppercase text-slate-400">
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
                      className={`flex flex-col items-center justify-center gap-1 rounded-[1.25rem] px-2 py-2 transition ${
                        day.inMonth ? 'text-slate-700' : 'text-slate-300'
                      } ${
                        isSelected
                          ? 'nb-chip bg-rose-500 text-white'
                          : 'hover:bg-rose-50'
                      }`}
                    >
                      <span className={isToday ? 'font-bold' : ''}>
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
          </div>
        </div>

        <div className="nb-surface p-4 sm:p-6">
          <h4 className="font-display text-xl font-bold text-slate-900">
            {eventScope === 'selected'
              ? 'Events on Selected Date'
              : eventScope === 'all'
                ? 'All Events'
                : 'Events This Month'}
          </h4>
          <div className="mt-4 space-y-4">
            {eventsLoading &&
              [0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="nb-chip flex flex-col gap-3 bg-rose-50 p-4 sm:flex-row sm:gap-4"
                >
                  <Skeleton className="h-12 w-12 shrink-0 !rounded-[1.25rem]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-3.5 w-1/3" />
                  </div>
                </div>
              ))}

            {!eventsLoading &&
              displayedEvents.map((event) => (
                <div
                  key={event.id ?? event.title}
                  className="nb-chip flex flex-col gap-3 bg-rose-50 p-4 sm:flex-row sm:gap-4"
                >
                  <div className="nb-chip flex h-12 w-12 shrink-0 items-center justify-center bg-white text-sm font-bold text-rose-500">
                    {formatDateInManila(event.start_at, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h5 className="font-bold text-slate-900">{event.title}</h5>
                    <p className="text-sm text-slate-500">
                      {event.description || event.location || 'Details coming soon.'}
                    </p>
                    <a
                      href={event.link_url || '#'}
                      className="text-sm font-bold text-rose-500"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            {!eventsLoading && eventsError && (
              <p className="text-sm text-amber-600">{eventsError}</p>
            )}
            {!eventsLoading && !eventsError && displayedEvents.length === 0 && (
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
