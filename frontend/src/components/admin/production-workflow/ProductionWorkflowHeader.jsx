import { memo } from 'react'

const ProductionWorkflowHeader = ({ total }) => (
  <header className="rounded-xl border border-slate-200 bg-white p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Creative Staff
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Requests & Submissions
        </h2>
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        {total} total
      </span>
    </div>
  </header>
)

export default memo(ProductionWorkflowHeader)
