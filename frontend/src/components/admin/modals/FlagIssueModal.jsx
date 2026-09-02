import { memo } from 'react'
import { AppModal } from '../../common'

const FlagIssueModal = ({
  open,
  form,
  feedback,
  loading,
  onChange,
  onClose,
  onSubmit,
}) => {
  return (
    <AppModal
      open={open}
      onClose={onClose}
      variant="drawer-right"
      eyebrow="Audit Flags"
      title="Flag an Issue"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Title
            <input
              type="text"
              value={form.title}
              onChange={(event) => onChange({ title: event.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
              placeholder="Short summary"
              required
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Severity
            <select
              value={form.severity}
              onChange={(event) => onChange({ severity: event.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
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
              className="mt-1 h-28 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
              placeholder="Describe the issue"
            />
          </label>

          {feedback?.message && (
            <p
              className={`text-xs ${
                feedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {feedback.message}
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 transition motion-safe:active:scale-[0.97] hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition motion-safe:active:scale-[0.97] hover:bg-indigo-700 disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Create Flag'}
            </button>
          </div>
      </form>
    </AppModal>
  )
}

export default memo(FlagIssueModal)
