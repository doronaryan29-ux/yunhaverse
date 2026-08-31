import { memo } from 'react'

const CreativeHeader = ({ profileName, email, onLogout }) => (
  <header className="flex flex-wrap items-center justify-between gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
        Creative Staff Portal
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900">
        Welcome back, {profileName || email || 'Creative'}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Admin-aligned dashboard for assignments, submissions, and scope.
      </p>
    </div>
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
        onClick={onLogout}
      >
        Sign out
      </button>
    </div>
  </header>
)

export default memo(CreativeHeader)
