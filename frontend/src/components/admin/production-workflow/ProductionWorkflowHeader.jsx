import { memo } from 'react'

const ProductionWorkflowHeader = ({ total }) => (
  <header className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
          Creative Staff
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
          Requests & Submissions
        </h2>
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        {total} total
      </span>
    </div>
  </header>
)

export default memo(ProductionWorkflowHeader)
