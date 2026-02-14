import { memo } from 'react'

const FundsHeader = ({ onAdd }) => (
  <header className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
          Funds & Donations
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
          Funding Overview
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAdd}
          className="rounded-2xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
        >
          Add Donation
        </button>
        <button
          type="button"
          className="rounded-2xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
        >
          Export Report
        </button>
      </div>
    </div>
  </header>
)

export default memo(FundsHeader)
