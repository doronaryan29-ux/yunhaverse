import { memo } from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatDateInManila } from '../../../utils/date'
import { chartColors } from '../../../constants/chartColors'
import DashboardCard from './DashboardCard'

const formatWeekLabel = (period) => formatDateInManila(period, { month: 'short', day: 'numeric' })

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-slate-900">{formatWeekLabel(label)}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="mt-1" style={{ color: entry.color }}>
          {entry.name}: <span className="font-medium">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

const legend = (
  <div className="flex items-center gap-3 text-xs text-slate-500">
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartColors.primary }} />
      New members
    </span>
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartColors.secondary }} />
      Total members
    </span>
  </div>
)

const MemberGrowthChart = ({ data }) => {
  const hasActivity = data?.some((point) => point.totalMembers > 0)

  return (
    <DashboardCard
      title="Member Growth"
      subtitle="New signups by week, last 8 weeks"
      action={legend}
      bodyClassName="flex flex-col"
    >
      {!hasActivity ? (
        <p className="flex h-full min-h-64 items-center justify-center text-center text-sm text-slate-500">
          No members yet — signups will show up here as they come in.
        </p>
      ) : (
        <div className="min-h-64 flex-1">
          <ResponsiveContainer width="99%" height="100%">
            <ComposedChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="period"
                tickFormatter={formatWeekLabel}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <Bar
                dataKey="newMembers"
                name="New members"
                fill={chartColors.primary}
                radius={[4, 4, 0, 0]}
                barSize={22}
              />
              <Line
                type="monotone"
                dataKey="totalMembers"
                name="Total members"
                stroke={chartColors.secondary}
                strokeWidth={2}
                dot={{ r: 3, fill: chartColors.secondary }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </DashboardCard>
  )
}

export default memo(MemberGrowthChart)
