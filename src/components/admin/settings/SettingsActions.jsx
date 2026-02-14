import { memo } from 'react'

const SettingsActions = ({ saving, loading, feedback }) => (
  <div className="flex flex-wrap items-center gap-3">
    <button
      type="submit"
      disabled={saving || loading}
      className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
    >
      {saving ? 'Saving...' : loading ? 'Loading...' : 'Save settings'}
    </button>
    {feedback.message ? (
      <p className={`text-sm ${feedback.type === 'error' ? 'text-rose-500' : 'text-emerald-600'}`}>
        {feedback.message}
      </p>
    ) : null}
  </div>
)

export default memo(SettingsActions)
