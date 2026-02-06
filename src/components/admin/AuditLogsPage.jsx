import { memo, useMemo, useState } from 'react'
import { formatDateTimeInManila } from '../../utils/date'

const AuditLogsPage = ({ auditItems = [], loading = false }) => {
  const [search, setSearch] = useState('')
  const items = Array.isArray(auditItems) ? auditItems : []
  const filteredItems = useMemo(() => {
    const needle = search.trim().toLowerCase()
    if (!needle) return items
    return items.filter((item) => {
      const haystack = [
        item.action,
        item.entity_type,
        item.actor_email,
        item.actor_role,
        item.ip_address,
        item.user_agent,
        item.entity_id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [items, search])

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
              Audit Logs
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
              Activity Timeline
            </h2>
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            {filteredItems.length} records
          </span>
        </div>
      </header>

      <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Search
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Action, user, role, ip..."
            className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          />
        </label>

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
            {!loading && filteredItems.length === 0 && (
              <p className="px-4 py-6 text-sm text-slate-500">No audit logs found.</p>
            )}
            {!loading &&
              filteredItems.map((item) => (
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
                      <p className="mt-1 text-[11px] text-slate-400">
                        {item.actor_role}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.entity_type || '—'}
                    </p>
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
      </section>
    </section>
  )
}

export default memo(AuditLogsPage)
