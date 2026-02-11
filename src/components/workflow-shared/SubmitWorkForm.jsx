import { memo } from 'react'

const SubmitWorkForm = memo(
  ({
    assignedRequests,
    submissionForm,
    submissionFeedback,
    submitting,
    onChange,
    onSubmit,
    formId,
    requestLocked = false,
    selectedRequestLabel = '',
    submitLabel = 'Submit Work',
  }) => (
    <section
      id={formId}
      className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4"
    >
      <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-500">
        Submit Work
      </h3>
      <p className="mt-2 text-xs text-slate-600">
        Send a draft or final asset to admin for review.
      </p>
      <div className="mt-4 grid gap-3 text-sm">
        <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Title
          <input
            type="text"
            value={submissionForm.title}
            onChange={(event) => onChange('title', event.target.value)}
            placeholder="Campaign teaser banner"
            required
            className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700"
          />
        </label>
        <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Linked Request
          <select
            value={submissionForm.requestId}
            onChange={(event) => onChange('requestId', event.target.value)}
            required
            disabled={requestLocked}
            className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="">Select request</option>
            {assignedRequests.map((request) => (
              <option key={request?.id} value={request?.id || ''}>
                {request?.title || 'Untitled request'}
              </option>
            ))}
          </select>
          {requestLocked ? (
            <span className="mt-1 block text-[11px] normal-case tracking-normal text-slate-500">
              Locked to: {selectedRequestLabel || 'Selected assignment'}
            </span>
          ) : null}
        </label>
        <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Submission Link
          <input
            type="url"
            value={submissionForm.submissionUrl}
            onChange={(event) => onChange('submissionUrl', event.target.value)}
            placeholder="https://"
            className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700"
          />
        </label>
        <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Notes
          <textarea
            rows={3}
            value={submissionForm.notes}
            onChange={(event) => onChange('notes', event.target.value)}
            placeholder="Notes for admin review"
            className="mt-1 w-full rounded-2xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700"
          />
        </label>
        {submissionFeedback.message ? (
          <div
            className={`rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
              submissionFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-100 text-rose-600'
            }`}
          >
            {submissionFeedback.message}
          </div>
        ) : null}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onSubmit?.(event)
          }}
          disabled={submitting}
          className="rounded-2xl bg-rose-500 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Submitting...' : submitLabel}
        </button>
      </div>
    </section>
  ),
)

export default SubmitWorkForm
