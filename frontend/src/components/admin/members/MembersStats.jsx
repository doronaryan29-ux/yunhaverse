import { memo } from 'react'

const MembersStats = ({ stats }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {stats.map((stat) => (
      <article
        key={stat.label}
        className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-lg shadow-rose-100"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          {stat.label}
        </p>
        <p className="mt-3 font-display text-3xl font-semibold text-slate-900">
          {stat.value}
        </p>
      </article>
    ))}
  </div>
)

export default memo(MembersStats)
