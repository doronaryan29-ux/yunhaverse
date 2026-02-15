import { memo } from 'react'
import { AppModal } from '../../common'

const SubmissionFormModal = ({
  open,
  onClose,
  submissionForm,
  setSubmissionForm,
  requestItems,
  memberOptions,
  resolveMemberLabel,
  stageOptions,
  submissionStatusOptions,
  submitting,
  canSubmit,
  onSubmit,
}) => (
  <AppModal
    open={open}
    onClose={onClose}
    variant="drawer-right"
    eyebrow="Creative Submission"
    title="New Submission"
  >
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Title
        <input
          type="text"
          required
          value={submissionForm.title}
          onChange={(event) =>
            setSubmissionForm((prev) => ({ ...prev, title: event.target.value }))
          }
          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          placeholder="Submission title"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Request
          <select
            value={submissionForm.requestId}
            onChange={(event) =>
              setSubmissionForm((prev) => ({
                ...prev,
                requestId: event.target.value,
              }))
            }
            className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          >
            <option value="">No linked request</option>
            {requestItems.map((request) => (
              <option key={request.id} value={request.id}>
                {request.title} (#{request.id})
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Submitted By
          <select
            value={submissionForm.submittedBy}
            onChange={(event) =>
              setSubmissionForm((prev) => ({
                ...prev,
                submittedBy: event.target.value,
              }))
            }
            className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          >
            <option value="">Select user</option>
            {memberOptions.map((member) => (
              <option key={member.id} value={member.id}>
                {resolveMemberLabel(member)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Stage
        <select
          value={submissionForm.stage}
          onChange={(event) =>
            setSubmissionForm((prev) => ({
              ...prev,
              stage: event.target.value,
            }))
          }
          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        >
          {stageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Submission URL
        <input
          type="text"
          value={submissionForm.submissionUrl}
          onChange={(event) =>
            setSubmissionForm((prev) => ({
              ...prev,
              submissionUrl: event.target.value,
            }))
          }
          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        />
      </label>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Notes
        <textarea
          value={submissionForm.notes}
          onChange={(event) =>
            setSubmissionForm((prev) => ({
              ...prev,
              notes: event.target.value,
            }))
          }
          className="mt-1 h-24 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        />
      </label>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Status
        <select
          value={submissionForm.status}
          onChange={(event) =>
            setSubmissionForm((prev) => ({
              ...prev,
              status: event.target.value,
            }))
          }
          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        >
          {submissionStatusOptions.map((option) => (
            <option key={option} value={option}>
              {option.replace('_', ' ')}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
        >
          {submitting ? 'Saving...' : 'Create Submission'}
        </button>
      </div>
    </form>
  </AppModal>
)

export default memo(SubmissionFormModal)
