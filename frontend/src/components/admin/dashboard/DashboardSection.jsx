import { memo } from 'react'
import AuditLogSection from './AuditLogSection'
import QuickActionsSection from './QuickActionsSection'
import StatCards from './StatCards'
import UpcomingCalendar from './UpcomingCalendar'

const DashboardSection = ({
  statCards,
  notificationTypes,
  notificationForm,
  formFeedback,
  formLoading,
  onNotificationFormChange,
  onSubmitNotification,
  onQuickAction,
  onOpenFlagModal,
  upcomingEventItems,
  auditItems,
  auditFlags,
  auditFlagsLoading,
  onResolveFlag,
  donationSummary,
}) => (
  <>
    <header className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
            Dashboard
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
            Operations Command Center
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Focus on urgent items first. Detailed records stay in their dedicated pages.
          </p>
        </div>
      </div>
    </header>

    <StatCards statCards={statCards} />

    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <QuickActionsSection
        notificationTypes={notificationTypes}
        notificationForm={notificationForm}
        formFeedback={formFeedback}
        formLoading={formLoading}
        onNotificationFormChange={onNotificationFormChange}
        onSubmitNotification={onSubmitNotification}
        onQuickAction={onQuickAction}
        onOpenFlagModal={onOpenFlagModal}
      />

      <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-slate-900">
            Needs Attention
          </h3>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500">
            Priority Queue
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <article className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Pending Payouts
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {donationSummary?.pendingCount ?? 0}
            </p>
            <button
              type="button"
              onClick={() => window.location.replace('/#/admin/funds')}
              className="mt-3 rounded-xl border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              Open Funds
            </button>
          </article>

          <article className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Open Audit Flags
            </p>
            {auditFlagsLoading ? (
              <p className="mt-1 text-sm text-slate-500">Loading flags...</p>
            ) : (
              <>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {auditFlags?.length ?? 0}
                </p>
                {(auditFlags?.length ?? 0) > 0 && (
                  <button
                    type="button"
                    onClick={() => onResolveFlag?.(auditFlags[0]?.id)}
                    className="mt-3 rounded-xl border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
                  >
                    Resolve Oldest Flag
                  </button>
                )}
              </>
            )}
          </article>

          <article className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Upcoming Events
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {upcomingEventItems?.length ?? 0}
            </p>
            <button
              type="button"
              onClick={() => window.location.replace('/#/admin/events')}
              className="mt-3 rounded-xl border border-rose-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              Review Calendar
            </button>
          </article>
        </div>
      </section>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <UpcomingCalendar upcomingEventItems={upcomingEventItems} />
      <AuditLogSection auditItems={auditItems} />
    </div>

  </>
)

export default memo(DashboardSection)
