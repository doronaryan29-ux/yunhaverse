import { memo } from 'react'
import { formatDateTimeInManila } from '../../../utils/date'

const AuditLogsTable = ({ items, loading }) => (
  <div className="mt-5 overflow-hidden rounded-2xl border border-rose-100">
    <div className="grid grid-cols-[1.2fr_0.9fr_1fr_1fr] gap-3 bg-rose-50/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
      <span>Action</span>
      <span>Actor</span>
      <span>Entity</span>
      <span>Timestamp</span>
    </div>
    <div className="max-h-[520px] overflow-y-auto">
      {loading && (
        <p className="px-4 py-6 text-sm text-slate-500">Loading audit logs...</p>
      )}
      {!loading && items.length === 0 && (
        <p className="px-4 py-6 text-sm text-slate-500">No audit logs found.</p>
      )}
      {!loading &&
        items.map((item) => (
          <div
            key={`${item.id}-${item.created_at}`}
            className="grid grid-cols-[1.2fr_0.9fr_1fr_1fr] gap-3 border-t border-rose-100 px-4 py-3 text-sm text-slate-700"
          >
            <div>
              <p className="font-semibold text-slate-900">{item.action}</p>
              {item.ip_address && (
                <p className="mt-1 text-[11px] text-slate-400">
                  IP {item.ip_address}
                </p>
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-900">
                {item.actor_email || 'system'}
              </p>
              {item.actor_role && (
                <p className="mt-1 text-[11px] text-slate-400">{item.actor_role}</p>
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{item.entity_type || '—'}</p>
              {item.entity_id && (
                <p className="mt-1 text-[11px] text-slate-400">
                  ID {item.entity_id}
                </p>
              )}
            </div>
            <div className="text-sm text-slate-600">
              {item.created_at
                ? formatDateTimeInManila(item.created_at)
                : 'No timestamp'}
            </div>
          </div>
        ))}
    </div>
  </div>
)

export default memo(AuditLogsTable)
