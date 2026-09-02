import { memo } from 'react'

const WorkflowCreatePanel = ({
  onOpenRequest,
  requestModalOpen,
  formStatus,
}) => (
  <section className="rounded-xl border border-slate-200 bg-white p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
          New task
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Need something made? Send a request to the creative team.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenRequest}
          aria-pressed={requestModalOpen}
          className={`rounded-lg border px-3.5 py-2 text-xs font-medium transition motion-safe:active:scale-[0.97] ${
            requestModalOpen
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          New Request
        </button>
      </div>
    </div>
    {formStatus.message && (
      <div className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
        {formStatus.message}
      </div>
    )}
  </section>
)

export default memo(WorkflowCreatePanel)
