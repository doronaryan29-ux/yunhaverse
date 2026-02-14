import { memo } from 'react'

const StatCards = ({ statCards }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {statCards.map((card) => (
      <article
        key={card.label}
        className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-lg shadow-rose-100"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          {card.label}
        </p>
        <p className="mt-3 font-display text-3xl font-semibold text-slate-900">
          {card.value}
        </p>
        <p className="mt-2 text-xs text-rose-500">{card.trend}</p>
      </article>
    ))}
  </div>
)

export default memo(StatCards)
