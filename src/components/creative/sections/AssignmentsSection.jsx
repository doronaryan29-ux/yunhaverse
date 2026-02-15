import { memo } from 'react'
import { AssignmentCard } from '../../workflow-shared/StaffCards'
import { formatDateInManila } from '../../../utils/date'

const AssignmentsSection = ({
  loading,
  assignedRequests,
  activeRequestId,
  contextByRequestId,
  onSelectRequest,
  safeString,
}) => (
  <div className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          My Assignments
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Tasks assigned by admin with scope, priority, and due dates.
        </p>
      </div>
      <span className="rounded-full bg-rose-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
        {loading ? 'Loading' : `${assignedRequests.length} tasks`}
      </span>
    </div>

    <div className="mt-6 grid gap-4">
      {assignedRequests.length === 0 ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-sm text-slate-600">
          No assignments yet. Stay ready for new creative briefs.
        </div>
      ) : (
        assignedRequests.map((request) => {
          const contextSubmission = contextByRequestId.get(request?.id)
          return (
            <AssignmentCard
              key={request?.id || request?.title}
              title={safeString(request?.title, 'Untitled request')}
              priority={safeString(request?.priority, 'Medium')}
              description={safeString(request?.description, 'No brief added yet.')}
              status={safeString(request?.status, 'Open')}
              referenceLabel={
                contextSubmission
                  ? safeString(
                      contextSubmission?.submission_url ||
                        contextSubmission?.submissionUrl ||
                        contextSubmission?.notes,
                    )
                  : ''
              }
              referenceUrl={
                contextSubmission?.submission_url || contextSubmission?.submissionUrl || ''
              }
              active={activeRequestId === request?.id}
              onClick={() => onSelectRequest(request?.id ?? null)}
              dueLabel={
                request?.dueAt || request?.due_at
                  ? formatDateInManila(request?.dueAt || request?.due_at, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'TBD'
              }
            />
          )
        })
      )}
    </div>
  </div>
)

export default memo(AssignmentsSection)
