import { memo } from 'react'
import { SubmissionCard } from '../../workflow-shared/StaffCards'
import SubmitWorkForm from '../../workflow-shared/SubmitWorkForm'

const SubmissionsSection = ({
  loading,
  assignedRequests,
  submissionForm,
  submissionFeedback,
  submitting,
  onChange,
  onSubmit,
  mySubmissions,
  activeSubmissionId,
  onSelectSubmission,
  safeString,
}) => (
  <section
    id="submissions"
    className="mt-2 rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100"
  >
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          Submission Queue
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Track deliverables submitted to admin for review.
        </p>
      </div>
      <span className="rounded-full bg-rose-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
        {loading ? 'Loading' : `${mySubmissions.length} submissions`}
      </span>
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <SubmitWorkForm
        assignedRequests={assignedRequests}
        submissionForm={submissionForm}
        submissionFeedback={submissionFeedback}
        submitting={submitting}
        onChange={onChange}
        onSubmit={onSubmit}
      />

      {mySubmissions.length === 0 ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 text-sm text-slate-600">
          No submissions logged yet. Send your first draft when ready.
        </div>
      ) : (
        mySubmissions.map((submission) => (
          <SubmissionCard
            key={submission?.id || submission?.title}
            title={safeString(submission?.title, 'Untitled submission')}
            status={safeString(submission?.status, 'Pending review')}
            notes={safeString(submission?.notes, 'Awaiting admin feedback.')}
            active={activeSubmissionId === submission?.id}
            onClick={() => onSelectSubmission(submission?.id ?? null)}
            linkLabel={safeString(
              submission?.submissionUrl || submission?.submission_url,
            )}
            requestLabel={safeString(submission?.requestId || submission?.request_id)}
          />
        ))
      )}
    </div>
  </section>
)

export default memo(SubmissionsSection)
