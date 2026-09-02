import { memo } from 'react'

const AuditSettingsSection = ({ auditSettings, onAuditChange }) => (
  <section className="rounded-xl border border-slate-200 bg-white/90 p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">Flag Review Rules</h3>
    <p className="mt-1 text-sm text-slate-600">Choose how flagged issues get handled.</p>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={auditSettings.requireReason}
          onChange={(event) => onAuditChange('requireReason', event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        Require a reason when closing a flag
      </label>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={auditSettings.notifyOnFlag}
          onChange={(event) => onAuditChange('notifyOnFlag', event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        Notify admins when a new flag comes in
      </label>
      <label className="space-y-1 text-sm">
        <span className="font-medium text-slate-700">Auto-close flags after (days)</span>
        <input
          type="number"
          min={0}
          value={auditSettings.autoArchiveDays}
          onChange={(event) =>
            onAuditChange('autoArchiveDays', Number(event.target.value))
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
        />
      </label>
    </div>
  </section>
)

export default memo(AuditSettingsSection)
