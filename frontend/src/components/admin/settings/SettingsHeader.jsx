import { memo } from 'react'

const SettingsHeader = () => (
  <header className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
    <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
    <p className="mt-2 text-sm text-slate-600">
      Site branding, who can do what, and how flags get reviewed. Admins only.
    </p>
  </header>
)

export default memo(SettingsHeader)
