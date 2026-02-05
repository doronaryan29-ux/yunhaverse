import { memo, useMemo } from 'react'
import { formatDateTimeInManila } from '../../utils/date'

const AuditFlagsSection = ({ flags, loading, onResolveFlag }) => {
  const previewFlags = useMemo(() => flags.slice(0, 3), [flags])

  return (
    <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl font-semibold text-slate-900">
          Audit Flags
        </h3>
        <button
          type="button"
          onClick={() => window.location.replace('/#/admin/audit-flags')}
          className="rounded-2xl border border-rose-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
        >
          View All Flags
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {loading && (
          <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
            Loading flags...
          </p>
        )}
        {!loading && previewFlags.length === 0 && (
          <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
            No open audit flags.
          </p>
        )}
        {!loading &&
          previewFlags.map((flag) => (
            <div
              key={flag.id}
              className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {flag.title}
                </p>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-500">
                  {flag.severity || 'medium'}
                </span>
              </div>
              {flag.details && (
                <p className="mt-1 text-xs text-slate-600">{flag.details}</p>
              )}
              <p className="mt-2 text-[11px] text-slate-400">
                {flag.created_at
                  ? formatDateTimeInManila(flag.created_at)
                  : 'No timestamp'}
              </p>
              <button
                type="button"
                onClick={() => onResolveFlag(flag.id)}
                className="mt-3 rounded-xl border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
              >
                Resolve
              </button>
            </div>
          ))}
      </div>
    </section>
  )
}

export default memo(AuditFlagsSection)
