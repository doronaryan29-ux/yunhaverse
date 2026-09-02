import { memo, useMemo, useState } from 'react'
import { AppModal } from '../../common'
import { formatDateInManila } from '../../../utils/date'

const formatStageLabel = (value) => {
  const normalized = String(value || 'creative').replace(/[_-]+/g, ' ')
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const formatStatusLabel = (value) => {
  const normalized = String(value || 'open').replace(/[_-]+/g, ' ')
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const RequestsSection = ({
  requestItems,
  archivedItems = [],
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
  getNextStage,
  requestStatusFilter,
  setRequestStatusFilter,
  requestSubmissionFilter,
  setRequestSubmissionFilter,
  onOpenReview,
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [actionsRequestId, setActionsRequestId] = useState(null)
  const [selectedArchivedIds, setSelectedArchivedIds] = useState([])

  const allRequests = useMemo(
    () => [...requestItems, ...archivedItems],
    [archivedItems, requestItems],
  )
  const actionRequest = allRequests.find(
    (item) => String(item.id) === String(actionsRequestId),
  )
  const actionEdit = actionRequest ? getRequestEdit(actionRequest) : null
  const noteChanged =
    actionRequest && actionEdit
      ? String(actionEdit.reviewNote || '') !== String(actionRequest.review_note || '')
      : false
  const actionDirty =
    actionRequest && actionEdit
      ? isRequestDirty(actionRequest, actionEdit) || noteChanged
      : false

  const allArchivedSelected =
    archivedItems.length > 0 &&
    archivedItems.every((item) => selectedArchivedIds.includes(item.id))

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900">
          Open Requests
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
            {requestItems.length} active
          </span>
          <button
            type="button"
            onClick={() => setFiltersOpen((prev) => !prev)}
            className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition motion-safe:active:scale-[0.97] ${
              filtersOpen
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <i className="fas fa-filter text-[10px]" aria-hidden="true" />
              {filtersOpen ? 'Hide Filters' : 'Filters'}
            </span>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          filtersOpen ? 'mt-4 max-h-64 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Status
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'open', label: 'Open' },
                  { value: 'accepted', label: 'Accepted' },
                  { value: 'submitted', label: 'Submitted' },
                  { value: 'declined', label: 'Declined' },
                  { value: 'revision', label: 'Revise' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRequestStatusFilter(option.value)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition motion-safe:active:scale-[0.97] ${
                      requestStatusFilter === option.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Submission
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'with_submission', label: 'With Sub' },
                  { value: 'no_submission', label: 'No Sub' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRequestSubmissionFilter(option.value)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition motion-safe:active:scale-[0.97] ${
                      requestSubmissionFilter === option.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setRequestStatusFilter('all')
              setRequestSubmissionFilter('all')
            }}
            className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition motion-safe:active:scale-[0.97] hover:border-slate-300 hover:bg-white"
          >
            <span className="inline-flex items-center gap-1">
              <i className="fas fa-rotate-left" aria-hidden="true" />
              Clear All
            </span>
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {loadingRequests && (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Loading requests...
          </p>
        )}
        {!loadingRequests && requestItems.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            No requests yet.
          </p>
        )}
        {!loadingRequests &&
          requestItems.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.due_at ? `Due ${formatDateInManila(item.due_at)}` : 'No due date'}
                  </p>
                  {item.assigned_to_name || getMemberNameById(item.assigned_to) ? (
                    <p className="mt-1 text-xs text-slate-400">
                      Assigned to{' '}
                      {item.assigned_to_name || getMemberNameById(item.assigned_to)}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                    {String(item.priority || 'Medium')}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {formatStageLabel(item.stage)}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                    {formatStatusLabel(item.status)}
                  </span>
                </div>
              </div>

              {(item.submission_url || item.submission_notes || item.submission_title) && (
                <div className="mt-3 rounded-2xl border border-slate-200 bg-white/80 p-3 text-xs text-slate-600">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Latest Submission
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {item.submission_title || item.title}
                  </p>
                  {item.submission_url ? (
                    <a
                      href={item.submission_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      {item.submission_url}
                    </a>
                  ) : null}
                  {item.submission_notes ? (
                    <p className="mt-2 text-xs text-slate-500">
                      {item.submission_notes}
                    </p>
                  ) : null}
                  {item.submitted_by_name ? (
                    <p className="mt-2 text-[11px] text-slate-400">
                      Submitted by {item.submitted_by_name}
                      {item.submitted_at
                        ? ` • ${formatDateInManila(item.submitted_at)}`
                        : ''}
                    </p>
                  ) : null}
                  {item.review_note ? (
                    <p className="mt-2 text-[11px] text-slate-500">
                      Review note: {item.review_note}
                    </p>
                  ) : null}
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <div className="ml-auto flex items-center gap-2">
                  {String(item.status || '').toLowerCase() === 'submitted' ? (
                    <>
                      <button
                        type="button"
                        disabled={!canSubmit || submitting}
                        onClick={() => {
                          const nextStage = getNextStage(item.stage)
                          onOpenReview?.({ request: item, action: 'approve', nextStage })
                        }}
                        className="rounded-full border border-emerald-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-600 disabled:opacity-60"
                      >
                        <span className="inline-flex items-center gap-1">
                          <i className="fas fa-check" aria-hidden="true" />
                          Approve
                        </span>
                      </button>
                      <button
                        type="button"
                        disabled={!canSubmit || submitting}
                        onClick={() => onOpenReview?.({ request: item, action: 'revise' })}
                        className="rounded-full border border-amber-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-600 disabled:opacity-60"
                      >
                        <span className="inline-flex items-center gap-1">
                          <i className="fas fa-pen" aria-hidden="true" />
                          Revise
                        </span>
                      </button>
                      <button
                        type="button"
                        disabled={!canSubmit || submitting}
                        onClick={() => onOpenReview?.({ request: item, action: 'decline' })}
                        className="rounded-full border border-red-200 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-red-600 disabled:opacity-60"
                      >
                        <span className="inline-flex items-center gap-1">
                          <i className="fas fa-xmark" aria-hidden="true" />
                          Decline
                        </span>
                      </button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={() => setActionsRequestId(item.id)}
                    className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-60"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <i className="fas fa-sliders" aria-hidden="true" />
                      Actions
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={() => {
                      setHistoryModal(item)
                      fetchHistory(item.id)
                    }}
                    className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-60"
                  >
                    <span className="inline-flex items-center gap-1">
                      <i className="fas fa-clock-rotate-left" aria-hidden="true" />
                      History
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))}
      </div>

      {!loadingRequests && archivedItems.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">
              Declined Requests
            </h4>
            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              {archivedItems.length} declined
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-[11px] text-slate-600">
              <input
                type="checkbox"
                checked={allArchivedSelected}
                onChange={(event) =>
                  setSelectedArchivedIds(
                    event.target.checked ? archivedItems.map((item) => item.id) : [],
                  )
                }
                className="h-4 w-4 rounded border border-slate-300"
              />
              Select all
            </label>
            <button
              type="button"
              disabled={!canSubmit || selectedArchivedIds.length === 0}
              onClick={() =>
                setDeleteModal({
                  type: 'request',
                  ids: selectedArchivedIds,
                  title: `${selectedArchivedIds.length} selected declined request(s)`,
                })
              }
              className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 disabled:opacity-60"
            >
              <span className="inline-flex items-center gap-1">
                <i className="fas fa-trash" aria-hidden="true" />
                Delete Selected
              </span>
            </button>
            <button
              type="button"
              disabled={!canSubmit || archivedItems.length === 0}
              onClick={() =>
                setDeleteModal({
                  type: 'request',
                  ids: archivedItems.map((item) => item.id),
                  title: `all ${archivedItems.length} declined request(s)`,
                })
              }
              className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600 disabled:opacity-60"
            >
              <span className="inline-flex items-center gap-1">
                <i className="fas fa-trash-can" aria-hidden="true" />
                Delete All
              </span>
            </button>
          </div>
          <div className="mt-3 grid gap-2">
            {archivedItems.map((item) => (
              <article
                key={`archive-${item.id}`}
                className="rounded-xl border border-slate-200 bg-white p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedArchivedIds.includes(item.id)}
                      onChange={(event) =>
                        setSelectedArchivedIds((prev) => {
                          if (event.target.checked) {
                            return prev.includes(item.id) ? prev : [...prev, item.id]
                          }
                          return prev.filter((id) => id !== item.id)
                        })
                      }
                      className="mt-1 h-4 w-4 rounded border border-slate-300"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.review_note
                          ? `Review note: ${item.review_note}`
                          : 'No review note attached.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={!canSubmit}
                      onClick={() => setActionsRequestId(item.id)}
                      className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 disabled:opacity-60"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <i className="fas fa-sliders" aria-hidden="true" />
                        Actions
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={!canSubmit}
                      onClick={() => {
                        setHistoryModal(item)
                        fetchHistory(item.id)
                      }}
                      className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 disabled:opacity-60"
                    >
                      <span className="inline-flex items-center gap-1">
                        <i className="fas fa-clock-rotate-left" aria-hidden="true" />
                        History
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      <AppModal
        open={Boolean(actionsRequestId)}
        onClose={() => setActionsRequestId(null)}
        variant="drawer-right"
        eyebrow="Request Actions"
        title={actionRequest?.title || 'Request'}
      >
        {actionRequest && actionEdit ? (
          <div className="space-y-3 text-sm text-slate-600">
            <p className="text-xs text-slate-500">
              Manage this request with grouped actions.
            </p>
            <div className="grid gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Stage
                <select
                  value={actionEdit.stage}
                  onChange={(event) =>
                    setRequestEdits((prev) => ({
                      ...prev,
                      [actionRequest.id]: {
                        ...actionEdit,
                        stage: event.target.value,
                        assignedTo: '',
                      },
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-700"
                >
                  {stageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Assignee
                <select
                  value={actionEdit.assignedTo}
                  onChange={(event) =>
                    setRequestEdits((prev) => ({
                      ...prev,
                      [actionRequest.id]: {
                        ...actionEdit,
                        assignedTo: event.target.value,
                      },
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-700"
                >
                  <option value="">Unassigned</option>
                  {getMembersForStage(actionEdit.stage).map((member) => (
                    <option key={member.id} value={member.id}>
                      {resolveMemberLabel(member)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Status
                <select
                  value={actionEdit.status}
                  onChange={(event) =>
                    setRequestEdits((prev) => ({
                      ...prev,
                      [actionRequest.id]: { ...actionEdit, status: event.target.value },
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-700"
                >
                  {statusOptions
                    .filter((option) => String(option) !== 'blocked')
                    .map((option) => (
                      <option key={option} value={option}>
                        {option.replace('_', ' ')}
                      </option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Priority
                <select
                  value={actionEdit.priority}
                  onChange={(event) =>
                    setRequestEdits((prev) => ({
                      ...prev,
                      [actionRequest.id]: { ...actionEdit, priority: event.target.value },
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-700"
                >
                  {priorityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Admin Note
              <textarea
                rows={3}
                value={actionEdit.reviewNote || actionRequest.review_note || ''}
                onChange={(event) =>
                  setRequestEdits((prev) => ({
                    ...prev,
                    [actionRequest.id]: {
                      ...actionEdit,
                      reviewNote: event.target.value,
                    },
                  }))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                placeholder="Add admin note for this request..."
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!canSubmit || submitting || !actionDirty}
                onClick={() => {
                  updateRequest(actionRequest.id, {
                    assignedTo: actionEdit.assignedTo
                      ? Number(actionEdit.assignedTo)
                      : null,
                    stage: actionEdit.stage,
                    status: actionEdit.status,
                    priority: actionEdit.priority,
                    reviewNote: actionEdit.reviewNote || null,
                  })
                  setActionsRequestId(null)
                }}
                className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-600 disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-1">
                  <i className="fas fa-floppy-disk" aria-hidden="true" />
                  Save
                </span>
              </button>
              <button
                type="button"
                disabled={!canSubmit || submitting}
                onClick={() => {
                  setDeleteModal({
                    type: 'request',
                    id: actionRequest.id,
                    title: actionRequest.title,
                  })
                  setActionsRequestId(null)
                }}
                className="rounded-full border border-red-200 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-red-600 disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-1">
                  <i className="fas fa-trash" aria-hidden="true" />
                  Delete
                </span>
              </button>
            </div>
          </div>
        ) : null}
      </AppModal>
    </section>
  )
}

export default memo(RequestsSection)
