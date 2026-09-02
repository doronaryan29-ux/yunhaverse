const LatestEvents = ({ events }) => (
  <section id="latest-events" className="flex flex-col gap-8 scroll-mt-28">
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 text-center sm:flex-row sm:text-left">
      <div>
        <span className="nb-pill inline-flex bg-rose-100 px-4 py-1.5 text-xs uppercase tracking-[0.4em] text-rose-600">
          Stay In The Loop
        </span>
        <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900">
          Latest Events
        </h2>
      </div>
      <a
        href="/#/calendar"
        className="nb-pill inline-flex items-center gap-2 bg-white px-4 py-2 text-xs uppercase tracking-[0.18em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
      >
        View Calendar
        <i className="fas fa-arrow-right text-[10px]" aria-hidden="true" />
      </a>
    </div>
    <div className="mx-auto w-full max-w-7xl px-6">
      <div className="grid gap-8 md:grid-cols-3">
        {events.map((event) => (
          <a
            key={event.id}
            href={`/#/events/${event.id}`}
            className="nb-surface nb-hover-lift group flex flex-col overflow-hidden"
          >
            <div className="relative h-48 overflow-hidden border-b-[var(--nb-border-w)] border-[var(--nb-ink)]">
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              {event.isPlaceholder && (
                <span className="nb-pill absolute right-3 top-3 bg-white px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-slate-500">
                  Placeholder
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="nb-pill inline-flex bg-rose-100 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-rose-600">
                  {event.date}
                </span>
                <span className="nb-pill inline-flex bg-white px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-slate-500">
                  <i className="fas fa-location-dot mr-1.5" aria-hidden="true" />
                  {event.location}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
              <p className="flex-1 text-sm text-slate-500">{event.summary}</p>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
                Read more →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
)

export default LatestEvents
