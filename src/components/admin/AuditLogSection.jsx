import { memo, useMemo } from 'react'
import { formatDateTimeInManila } from '../../utils/date'

const AuditLogSection = ({ auditItems }) => {
  const previewItems = useMemo(() => auditItems.slice(0, 4), [auditItems])

  return (
    <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl font-semibold text-slate-900">
          Audit Log Snapshot
        </h3>
        <button
          type="button"
          onClick={() => window.location.replace('/#/admin/audit-logs')}
          className="rounded-2xl border border-rose-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
        >
          Open Full Logs
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {previewItems.length === 0 && (
          <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
            No audit activity yet.
          </p>
        )}
        {previewItems.map((item) => (
          <div
            key={`${item.id}-${item.created_at}`}
            className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{item.action}</p>
              {item.entity_type && (
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-500">
                  {item.entity_type}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {(item.actor_email || 'system')}
              {item.actor_role ? ` • ${item.actor_role}` : ''} •{' '}
              {item.created_at ? formatDateTimeInManila(item.created_at) : 'No timestamp'}
            </p>
            {(item.ip_address || item.entity_id) && (
              <p className="mt-1 text-[11px] text-slate-400">
                {item.ip_address ? `IP ${item.ip_address}` : 'IP unknown'}
                {item.entity_id ? ` • Entity ${item.entity_id}` : ''}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default memo(AuditLogSection)
