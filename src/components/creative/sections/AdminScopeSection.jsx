import { memo } from 'react'

const ROLE_PERMISSIONS = {
  members_view: 'Members: View',
  members_manage: 'Members: Manage',
  creative_view: 'Creative Staff: View',
  creative_manage: 'Creative Staff: Manage',
  copywriter_view: 'Copywriter: View',
  copywriter_manage: 'Copywriter: Manage',
  sns_view: 'SNS Updater: View',
  sns_manage: 'SNS Updater: Manage',
}

const AdminScopeSection = ({ settings, creativeRolePermissions }) => (
  <section
    id="scope"
    className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100"
  >
    <h2 className="font-display text-xl font-semibold text-slate-900">
      Admin Scope & Settings
    </h2>
    <p className="mt-2 text-sm text-slate-600">
      Aligned to {settings.appName} admin configuration.
    </p>
    <div className="mt-4 grid gap-3 text-sm text-slate-600">
      <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
          Creative Permissions
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {creativeRolePermissions.length === 0 ? (
            <span className="text-xs text-slate-500">Not set</span>
          ) : (
            creativeRolePermissions.map((permission) => (
              <span
                key={permission}
                className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600"
              >
                {ROLE_PERMISSIONS[permission] || permission}
              </span>
            ))
          )}
        </div>
      </div>
      <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
          Review Protocol
        </p>
        <p className="mt-2 text-xs text-slate-600">
          {settings.auditSettings?.notifyOnFlag
            ? 'Admin requires flag notifications on sensitive content.'
            : 'Flags are tracked silently unless escalated.'}
        </p>
        <p className="mt-1 text-xs text-slate-600">
          {settings.auditSettings?.autoArchiveDays
            ? `Auto-archive after ${settings.auditSettings.autoArchiveDays} days.`
            : 'No auto-archive rule configured.'}
        </p>
      </div>
    </div>
  </section>
)

export default memo(AdminScopeSection)
