import { memo } from 'react'
import { AppModal } from '../../common'

const RequestFormModal = ({
  open,
  onClose,
  requestForm,
  setRequestForm,
  memberOptions,
  getMembersForStage,
  resolveMemberLabel,
  stageOptions,
  priorityOptions,
  statusOptions,
  submitting,
  canSubmit,
  onSubmit,
}) => (
  <AppModal open={open} onClose={onClose} eyebrow="Creative Request" title="New Request">
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Title
        <input
          type="text"
          required
          value={requestForm.title}
          onChange={(event) =>
            setRequestForm((prev) => ({ ...prev, title: event.target.value }))
          }
          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          placeholder="Request title"
        />
      </label>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Description
        <textarea
          value={requestForm.description}
          onChange={(event) =>
            setRequestForm((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
          className="mt-1 h-24 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          placeholder="Describe the request"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Requested By
          <select
            value={requestForm.requestedBy}
            onChange={(event) =>
              setRequestForm((prev) => ({
                ...prev,
                requestedBy: event.target.value,
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
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Assign To
          <select
            value={requestForm.assignedTo}
            onChange={(event) =>
              setRequestForm((prev) => ({
                ...prev,
                assignedTo: event.target.value,
              }))
            }
            className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          >
            <option value="">Unassigned</option>
            {getMembersForStage(requestForm.stage).map((member) => (
              <option key={member.id} value={member.id}>
                {resolveMemberLabel(member)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Stage
          <select
            value={requestForm.stage}
            onChange={(event) =>
              setRequestForm((prev) => ({
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
          Priority
          <select
            value={requestForm.priority}
            onChange={(event) =>
              setRequestForm((prev) => ({
                ...prev,
                priority: event.target.value,
              }))
            }
            className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          >
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Status
          <select
            value={requestForm.status}
            onChange={(event) =>
              setRequestForm((prev) => ({
                ...prev,
                status: event.target.value,
              }))
            }
            className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Due Date
          <input
            type="date"
            value={requestForm.dueAt}
            onChange={(event) =>
              setRequestForm((prev) => ({
                ...prev,
                dueAt: event.target.value,
              }))
            }
            className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          />
        </label>
      </div>
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
          disabled={!canSubmit || submitting}
          className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
        >
          {submitting ? 'Saving...' : 'Create Request'}
        </button>
      </div>
    </form>
  </AppModal>
)

export default memo(RequestFormModal)
