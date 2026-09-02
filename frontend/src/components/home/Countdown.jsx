import { useMemo, useState } from 'react'
import useCountdown from '../../hooks/useCountdown'
import { formatDateInManila } from '../../utils/date'
import { Tooltip } from '../common'

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
      className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 scroll-mt-28"
    >
      <div className="text-center">
        <span className="nb-pill inline-flex bg-rose-100 px-4 py-1.5 text-xs uppercase tracking-[0.4em] text-rose-600">
          Keep The Hype
        </span>
        <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900">
          Countdown to Important Dates
        </h2>
      </div>
      <div className="nb-surface p-5 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-rose-500">
              Next Up
            </p>
            <h3 className="text-2xl font-bold text-slate-900">{activeEvent.title}</h3>
            <p className="text-sm text-slate-500">{activeEventDateLabel}</p>
            <span
              className={`nb-pill inline-flex items-center px-3 py-1 text-xs ${
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
              <div key={item.label} className="nb-chip bg-rose-50 px-3 py-2.5">
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
            <Tooltip key={event.title} label={event.title}>
              <button
                type="button"
                onClick={() => setActiveCountdown(index)}
                aria-label={`Show countdown for ${event.title}`}
                className={`nb-pill flex h-12 w-12 items-center justify-center text-lg transition ${
                  activeCountdown === index
                    ? 'nb-tab-active bg-rose-500 text-white'
                    : 'bg-white text-rose-500 hover:-translate-y-0.5'
                }`}
              >
                <i className={`fas ${event.icon}`} />
              </button>
            </Tooltip>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Countdown
