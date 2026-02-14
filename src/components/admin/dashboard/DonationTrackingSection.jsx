import { memo } from 'react'

const formatMoney = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(amount || 0))

const DonationTrackingSection = ({ donationSummary }) => (
  <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="font-display text-xl font-semibold text-slate-900">
        Donation Tracking
      </h3>
      <button
        type="button"
        className="rounded-2xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
        onClick={() => window.location.replace('/#/admin/funds')}
      >
        Open Funds
      </button>
    </div>
    <div className="mt-4 grid gap-4 md:grid-cols-3">
      <article className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Received Today
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {formatMoney(donationSummary?.totalToday)}
        </p>
      </article>
      <article className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Pending Payouts
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {donationSummary?.pendingCount ?? 0}
        </p>
      </article>
      <article className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Fund Goal Progress
        </p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">
          {donationSummary?.goalProgress ?? 0}%
        </p>
      </article>
    </div>
  </section>
)

export default memo(DonationTrackingSection)
