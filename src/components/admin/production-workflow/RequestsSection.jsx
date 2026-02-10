import { memo } from 'react'
import { formatDateInManila } from '../../../utils/date'

const RequestsSection = ({
  requestItems,
  loadingRequests,
  getRequestEdit,
  isRequestDirty,
  setRequestEdits,
  stageOptions,
  statusOptions,
  priorityOptions,
  canSubmit,
  submitting,
  getMembersForStage,
  resolveMemberLabel,
  getMemberNameById,
  updateRequest,
  setDeleteModal,
  setHistoryModal,
  fetchHistory,
  openStatusModal,
  getNextStage,
}) => (
  <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="font-display text-xl font-semibold text-slate-900">
        Requests Queue
      </h3>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {requestItems.length} active
      </span>
    </div>

    <div className="mt-4 grid gap-3">
      {loadingRequests && (
        <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
          Loading requests...
        </p>
      )}
      {!loadingRequests && requestItems.length === 0 && (
        <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
          No requests yet.
        </p>
      )}
      {!loadingRequests &&
        requestItems.map((item) => {
          const edit = getRequestEdit(item)
          const isDirty = isRequestDirty(item, edit)
          return (
            <article
              key={item.id}
              className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Requested by {item.requested_by_name || '—'}
                    {item.due_at ? ` • Due ${formatDateInManila(item.due_at)}` : ''}
                  </p>
                  {item.assigned_to_name || getMemberNameById(item.assigned_to) ? (
                    <p className="mt-1 text-xs text-slate-400">
                      Assigned to{' '}
                      {item.assigned_to_name || getMemberNameById(item.assigned_to)}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500">
                    {item.priority || 'Medium'}
                  </span>
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-600">
                    {item.stage || 'creative'}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={edit.assignedTo}
                    onChange={(event) =>
                      setRequestEdits((prev) => ({
                        ...prev,
                        [item.id]: { ...edit, assignedTo: event.target.value },
                      }))
                    }
                    className="max-w-[220px] rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] text-slate-600"
                  >
                    <option value="">Unassigned</option>
                    {getMembersForStage(edit.stage).map((member) => (
                      <option key={member.id} value={member.id}>
                        {resolveMemberLabel(member)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={edit.stage}
                    onChange={(event) =>
                      setRequestEdits((prev) => ({
                        ...prev,
                        [item.id]: { ...edit, stage: event.target.value },
                      }))
                    }
                    className="rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] text-slate-600"
                  >
                    {stageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={edit.status}
                    onChange={(event) =>
                      setRequestEdits((prev) => ({
                        ...prev,
                        [item.id]: { ...edit, status: event.target.value },
                      }))
                    }
                    className="rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] text-slate-600"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                  <select
                    value={edit.priority}
                    onChange={(event) =>
                      setRequestEdits((prev) => ({
                        ...prev,
                        [item.id]: { ...edit, priority: event.target.value },
                      }))
                    }
                    className="rounded-full border border-rose-200 bg-white px-3 py-1 text-[11px] text-slate-600"
                  >
                    {priorityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!canSubmit || submitting}
                    onClick={() => {
                      const nextStage = getNextStage(edit.stage)
                      if (!nextStage) {
                        openStatusModal({
                          type: 'error',
                          title: 'No next stage',
                          message: 'This request is already at the final stage.',
                        })
                        return
                      }
                      if (!edit.assignedTo) {
                        openStatusModal({
                          type: 'error',
                          title: 'Assign required',
                          message: 'Select an assignee before handing off.',
                        })
                        return
                      }
                      updateRequest(item.id, {
                        assignedTo: Number(edit.assignedTo),
                        stage: nextStage,
                        status: 'Open',
                      })
                    }}
                    className="rounded-full border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 disabled:opacity-60"
                  >
                    Approve &amp; Handoff
                  </button>
                  <button
                    type="button"
                    disabled={!canSubmit || submitting || !isDirty}
                    onClick={() =>
                      updateRequest(item.id, {
                        assignedTo: edit.assignedTo ? Number(edit.assignedTo) : null,
                        stage: edit.stage,
                        status: edit.status,
                        priority: edit.priority,
                      })
                    }
                    className="rounded-full border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    disabled={!canSubmit || submitting}
                    onClick={() =>
                      setDeleteModal({
                        type: 'request',
                        id: item.id,
                        title: item.title,
                      })
                    }
                    className="rounded-full border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 disabled:opacity-60"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={() => {
                      setHistoryModal(item)
                      fetchHistory(item.id)
                    }}
                    className="rounded-full border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 disabled:opacity-60"
                  >
                    History
                  </button>
                </div>
              </div>
            </article>
          )
        })}
    </div>
  </section>
)

export default memo(RequestsSection)
