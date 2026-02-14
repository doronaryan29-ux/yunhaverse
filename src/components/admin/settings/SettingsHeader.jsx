import { memo } from 'react'

const SettingsHeader = () => (
  <header className="rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-sm">
    <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
    <p className="mt-2 text-sm text-slate-600">
      Admin-only settings for branding, roles, and audit behavior.
    </p>
  </header>
)

export default memo(SettingsHeader)
