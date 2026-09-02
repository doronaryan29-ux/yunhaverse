import { memo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatDateInManila } from '../../../utils/date'
import { chartColors } from '../../../constants/chartColors'
import DashboardCard from './DashboardCard'

const formatWeekLabel = (period) => formatDateInManila(period, { month: 'short', day: 'numeric' })

// Recharts' own "nice tick" generator (triggered whenever no explicit
// `ticks` array is supplied) produces out-of-order, non-monotonic integer
// ticks for this kind of low-cardinality count data — confirmed directly
// against this chart's real data (0, 4, 0, 0, 0, 0, 0, 16). Computing a
// small, always-ascending, evenly-spaced tick ladder ourselves and passing
// it via `ticks` bypasses that generator entirely, for any value range —
// not just small ones, which was the bug in the previous attempt (that
// version only supplied explicit ticks when the max was <= 8; real data
// here maxes out at 16, so it silently fell through to the same broken
// default generator every time).
const computeAscendingTicks = (maxValue, targetTickCount = 5) => {
  const max = Math.max(1, maxValue)
  const rawStep = max / targetTickCount
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const normalizedStep = rawStep / magnitude
  // Clamp to a minimum step of 1: this axis only ever shows whole counts,
  // and an unclamped step below 1 (e.g. max=1 gives a raw step of 0.2)
  // produces fractional ticks that collapse into duplicates once rounded.
  const niceStep = Math.max(
    1,
    (normalizedStep <= 1 ? 1 : normalizedStep <= 2 ? 2 : normalizedStep <= 5 ? 5 : 10) * magnitude,
  )

  const ticks = [0]
  while (ticks[ticks.length - 1] < max) {
    ticks.push(ticks[ticks.length - 1] + niceStep)
  }
  return ticks.map((value) => Math.round(value))
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-slate-900">{formatWeekLabel(label)}</p>
      <p className="mt-1 text-slate-600">
        {payload[0].value} event{payload[0].value === 1 ? '' : 's'} logged
      </p>
    </div>
  )
}

const AuditActivityChart = ({ data }) => {
  const hasActivity = data?.some((point) => point.count > 0)
  const maxCount = Math.max(1, ...(data || []).map((point) => point.count || 0))
  const yAxisTicks = computeAscendingTicks(maxCount)
  const yAxisMax = yAxisTicks[yAxisTicks.length - 1]

  return (
    <DashboardCard
      title="Moderation Activity"
      subtitle="Logged events by week, last 8 weeks"
      fillHeight={false}
    >
      {!hasActivity ? (
        <p className="flex h-full min-h-56 items-center justify-center text-center text-sm text-slate-500">
          Nothing logged in this stretch.
        </p>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="99%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="period"
                tickFormatter={formatWeekLabel}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                type="number"
                domain={[0, yAxisMax]}
                ticks={yAxisTicks}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="count" name="Events" fill={chartColors.secondary} radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardCard>
  )
}

export default memo(AuditActivityChart)
