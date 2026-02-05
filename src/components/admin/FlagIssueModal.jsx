import { memo } from 'react'

const FlagIssueModal = ({
  open,
  form,
  feedback,
  loading,
  onChange,
  onClose,
  onSubmit,
}) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
              Audit Flags
            </p>
            <h4 className="mt-2 font-display text-2xl font-semibold text-slate-900">
              Flag an Issue
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600"
          >
            Close
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Title
            <input
              type="text"
              value={form.title}
              onChange={(event) => onChange({ title: event.target.value })}
              className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
              placeholder="Short summary"
              required
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Severity
            <select
              value={form.severity}
              onChange={(event) => onChange({ severity: event.target.value })}
              className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Details
            <textarea
              value={form.details}
              onChange={(event) => onChange({ details: event.target.value })}
              className="mt-1 h-28 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
              placeholder="Describe the issue"
            />
          </label>

          {feedback?.message && (
            <p
              className={`text-xs ${
                feedback.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {feedback.message}
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Create Flag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default memo(FlagIssueModal)
