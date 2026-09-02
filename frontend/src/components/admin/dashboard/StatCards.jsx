import { memo } from 'react'
import { Skeleton } from '../../common'

const formatValue = (value, format) => {
  if (format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(Number(value || 0))
  }
  return new Intl.NumberFormat('en-US').format(Number(value || 0))
}

const StatCards = ({ statCards }) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {statCards.map((card) => (
      <article
        key={card.label}
        className="rounded-xl border border-slate-200 bg-white p-4"
      >
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
          {card.label}
        </p>

        {card.loading ? (
          <Skeleton tone="neutral" className="mt-3 h-8 w-20" />
        ) : (
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">
            {formatValue(card.value, card.format)}
          </p>
        )}

        {!card.loading && (
          <p
            className={`mt-1.5 text-xs ${
              card.attention ? 'font-medium text-amber-600' : 'text-slate-500'
            }`}
          >
            {card.trend}
          </p>
        )}
      </article>
    ))}
  </div>
)

export default memo(StatCards)
