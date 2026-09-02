import { memo, useMemo } from 'react'
import { formatDateTimeInManila } from '../../../utils/date'
import { getAuditLogDisplay, toneClasses } from '../../../constants/auditLogActions'
import DashboardCard from './DashboardCard'

const iconToneClasses = {
  success: 'bg-emerald-50 text-emerald-600',
  danger: 'bg-red-50 text-red-500',
  warning: 'bg-amber-50 text-amber-600',
  info: 'bg-sky-50 text-sky-600',
  neutral: 'bg-slate-100 text-slate-500',
}

const AuditLogSection = ({ auditItems }) => {
  const previewItems = useMemo(() => auditItems.slice(0, 4), [auditItems])

  return (
    <DashboardCard
      title="Recent Activity"
      action={
        <button
          type="button"
          onClick={() => window.location.replace('/#/admin/audit-logs')}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition motion-safe:active:scale-[0.97] hover:border-slate-300 hover:bg-slate-50"
        >
          See All Activity
        </button>
      }
    >
      {previewItems.length === 0 ? (
        <p className="flex h-full items-center justify-center text-center text-sm text-slate-500">
          Nothing's happened yet.
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {previewItems.map((item) => {
            const display = getAuditLogDisplay(item.action)
            const who = item.actor_email || 'System'
            return (
              <div
                key={`${item.id}-${item.created_at}`}
                className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconToneClasses[display.tone]}`}
                >
                  <i className={`fas ${display.icon} text-xs`} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {who} {display.label}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${toneClasses[display.tone]}`}
                    >
                      {display.tag}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {item.created_at ? formatDateTimeInManila(item.created_at) : 'No timestamp'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardCard>
  )
}

export default memo(AuditLogSection)
