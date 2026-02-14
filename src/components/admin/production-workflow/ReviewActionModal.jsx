import { AppModal } from '../../common'

const ReviewActionModal = ({
  reviewModal,
  onClose,
  reviewNote,
  setReviewNote,
  reviewAssignee,
  setReviewAssignee,
  getMembersForStage,
  resolveMemberLabel,
  submitting,
  onConfirm,
}) => {
  if (!reviewModal) return null

  const { request, action, nextStage } = reviewModal
  const titleMap = {
    approve: 'Approve Submission',
    revise: 'Request Revision',
    decline: 'Decline Submission',
  }
  const descriptionMap = {
    approve: 'Move this request to the next stage and assign the next owner.',
    revise: 'Send feedback and keep the request in the current stage.',
    decline: 'Decline this submission and close the current work item.',
  }

  const isApprove = action === 'approve'
  const availableMembers = isApprove
    ? getMembersForStage?.(nextStage) || []
    : []

  return (
    <AppModal
      open
      onClose={onClose}
      eyebrow="Admin Review"
      title={titleMap[action] || 'Review Submission'}
    >
      <p className="text-sm text-slate-600">
        {descriptionMap[action] || 'Review the latest submission.'}
      </p>
      <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-xs text-slate-600">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500">
          Request
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-900">
          {request?.title || 'Untitled request'}
        </p>
        {request?.submission_url ? (
          <a
            href={request.submission_url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex text-xs font-semibold text-rose-500 hover:underline"
          >
            {request.submission_url}
          </a>
        ) : null}
      </div>

      {isApprove && (
        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Assign Next Stage ({nextStage || 'N/A'})
          </label>
          <select
            value={reviewAssignee}
            onChange={(event) => setReviewAssignee(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="">Select assignee</option>
            {availableMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {resolveMemberLabel?.(member) || `User #${member.id}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Admin Note
        </label>
        <textarea
          rows={3}
          value={reviewNote}
          onChange={(event) => setReviewNote(event.target.value)}
          placeholder="Add context for this review"
          className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700"
        />
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={onConfirm}
          className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200"
        >
          {submitting ? 'Saving...' : 'Confirm'}
        </button>
      </div>
    </AppModal>
  )
}

export default ReviewActionModal
