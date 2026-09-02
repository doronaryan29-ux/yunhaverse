import { memo } from 'react'
import { chartColors } from '../../../constants/chartColors'
import DashboardCard from './DashboardCard'

const rows = [
  { key: 'activeMembers', label: 'Active Members', color: chartColors.primary },
  { key: 'creativeStaff', label: 'Creative Staff', color: chartColors.secondary },
  { key: 'pendingVerification', label: 'Pending Verification', color: chartColors.warning },
  { key: 'inactive', label: 'Inactive', color: chartColors.neutral },
]

const MemberBreakdownBars = ({ breakdown }) => {
  const total = breakdown?.totalMembers || 0

  return (
    <DashboardCard title="Member Breakdown" subtitle={`${total} members total`}>
      <div className="flex h-full flex-col justify-center space-y-3">
        {rows.map((row) => {
          const value = breakdown?.[row.key] || 0
          const pct = total > 0 ? Math.round((value / total) * 100) : 0
          return (
            <div key={row.key}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{row.label}</span>
                <span className="text-slate-500">{value}</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full w-full origin-left rounded-full transition-transform duration-500 ease-out"
                  style={{ transform: `scaleX(${pct / 100})`, backgroundColor: row.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </DashboardCard>
  )
}

export default memo(MemberBreakdownBars)
