import { useMemo, useState } from 'react'
import useCountdown from '../../hooks/useCountdown'
import { formatDateInManila } from '../../utils/date'

const Countdown = ({ events }) => {
  const [activeCountdown, setActiveCountdown] = useState(0)
  const activeEvent = useMemo(() => events[activeCountdown], [events, activeCountdown])
  const activeEventDateLabel = useMemo(
    () =>
      activeEvent?.label ||
      formatDateInManila(activeEvent?.date, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [activeEvent],
  )
  const timeLeft = useCountdown(activeEvent.date)

  return (
    <section
      id="countdown"
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 scroll-mt-28"
    >
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-rose-500">
          Keep The Hype
        </p>
        <h2 className="font-display text-3xl font-semibold text-slate-900">
          Countdown to Important Dates
        </h2>
      </div>
      <div className="rounded-3xl border border-pink-100 bg-white p-5 shadow-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
              Next Up
            </p>
            <h3 className="text-2xl font-semibold text-slate-900">{activeEvent.title}</h3>
            <p className="text-sm text-slate-500">{activeEventDateLabel}</p>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                timeLeft.isOver
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {timeLeft.isOver ? 'This event has passed' : 'Incoming'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.secs },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2.5"
              >
                <div className="font-display text-2xl font-bold leading-none tracking-tight text-slate-900 tabular-nums sm:text-3xl">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          {events.map((event, index) => (
            <button
              key={event.title}
              type="button"
              onClick={() => setActiveCountdown(index)}
              className={`flex h-12 w-12 items-center justify-center rounded-full border text-lg transition ${
                activeCountdown === index
                  ? 'border-rose-500 bg-rose-500 text-white'
                  : 'border-rose-200 bg-white text-rose-500 hover:-translate-y-0.5'
              }`}
            >
              <i className={`fas ${event.icon}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Countdown
