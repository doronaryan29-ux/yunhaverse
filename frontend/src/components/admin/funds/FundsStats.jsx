import { memo } from 'react'

const FundsStats = ({ stats }) => (
  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {stats.map((stat) => (
      <article
        key={stat.label}
        className="rounded-xl border border-slate-200 bg-white p-4"
      >
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
          {stat.label}
        </p>
        <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">
          {stat.value}
        </p>
      </article>
    ))}
  </section>
)

export default memo(FundsStats)
