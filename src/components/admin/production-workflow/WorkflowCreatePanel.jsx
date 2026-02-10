import { memo } from 'react'

const WorkflowCreatePanel = ({
  onOpenRequest,
  onOpenSubmission,
  requestModalOpen,
  submissionModalOpen,
  formStatus,
}) => (
  <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
          Create
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Add new requests or submissions with a focused form.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenRequest}
          aria-pressed={requestModalOpen}
          className={`rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition hover:-translate-y-0.5 ${
            requestModalOpen
              ? 'border-rose-400 bg-rose-500 text-white shadow-lg shadow-rose-200 ring-2 ring-rose-300'
              : 'border-rose-200 bg-white text-rose-500 hover:bg-rose-50'
          }`}
        >
          New Request
        </button>
        <button
          type="button"
          onClick={onOpenSubmission}
          aria-pressed={submissionModalOpen}
          className={`rounded-xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition hover:-translate-y-0.5 ${
            submissionModalOpen
              ? 'border-rose-400 bg-rose-500 text-white shadow-lg shadow-rose-200 ring-2 ring-rose-300'
              : 'border-rose-200 bg-white text-rose-500 hover:bg-rose-50'
          }`}
        >
          New Submission
        </button>
      </div>
    </div>
    {formStatus.message && (
      <div className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {formStatus.message}
      </div>
    )}
  </section>
)

export default memo(WorkflowCreatePanel)
