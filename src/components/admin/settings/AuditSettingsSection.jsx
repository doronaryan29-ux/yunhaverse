import { memo } from 'react'

const AuditSettingsSection = ({ auditSettings, onAuditChange }) => (
  <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-slate-900">Audit Settings</h3>
    <p className="mt-1 text-sm text-slate-600">Configure audit review requirements.</p>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={auditSettings.requireReason}
          onChange={(event) => onAuditChange('requireReason', event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        Require reason when resolving audit flags
      </label>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={auditSettings.notifyOnFlag}
          onChange={(event) => onAuditChange('notifyOnFlag', event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        Notify admins on new audit flags
      </label>
      <label className="space-y-1 text-sm">
        <span className="font-medium text-slate-700">Auto-archive flags (days)</span>
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
