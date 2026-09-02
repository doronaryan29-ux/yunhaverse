import { memo } from 'react'
import AuditActivityChart from './AuditActivityChart'
import AuditLogSection from './AuditLogSection'
import DashboardCard from './DashboardCard'
import MemberBreakdownBars from './MemberBreakdownBars'
import MemberGrowthChart from './MemberGrowthChart'
import QuickActionsSection from './QuickActionsSection'
import StatCards from './StatCards'
import UpcomingCalendar from './UpcomingCalendar'

const AttentionRow = ({
  label,
  count,
  actionLabel,
  onAction,
  requireItemsForAction = false,
  loading,
  error,
}) => {
  const hasItems = (count ?? 0) > 0
  const showAction = onAction && !loading && (!requireItemsForAction || hasItems)

  return (
    <div className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
          {label}
        </p>
        {loading ? (
          <p className="mt-1 text-sm text-slate-500">Loading...</p>
        ) : (
          <p
            className={`mt-0.5 text-xl font-semibold tabular-nums ${
              hasItems ? 'text-amber-700' : 'text-slate-500'
            }`}
          >
            {count ?? 0}
          </p>
        )}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      {showAction && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition motion-safe:active:scale-[0.96] hover:border-slate-400 hover:text-slate-900"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

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
  resolvingFlagId,
  auditFlagsActionError,
  donationSummary,
  memberBreakdown,
  memberGrowth,
  auditActivityTrend,
}) => (
  <>
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">
        Here's what's happening
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        A quick look at what needs your attention. Everything else lives on its own page.
      </p>
    </div>

    <StatCards statCards={statCards} />

    <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <MemberGrowthChart data={memberGrowth} />
      <MemberBreakdownBars breakdown={memberBreakdown} />
    </div>

    <AuditActivityChart data={auditActivityTrend} />

    <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
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

      <DashboardCard title="Needs Attention" bodyClassName="flex flex-col justify-center">
        <div className="divide-y divide-slate-100">
          <AttentionRow
            label="Pending Payouts"
            count={donationSummary?.pendingCount ?? 0}
            actionLabel="Open Funds"
            onAction={() => window.location.replace('/#/admin/funds')}
          />

          <AttentionRow
            label="Open Audit Flags"
            count={auditFlags?.length ?? 0}
            loading={auditFlagsLoading}
            requireItemsForAction
            actionLabel={
              resolvingFlagId === auditFlags?.[0]?.id
                ? 'Resolving...'
                : 'Resolve Oldest Flag'
            }
            onAction={() => onResolveFlag?.(auditFlags[0]?.id)}
            error={auditFlagsActionError}
          />

          <AttentionRow
            label="Upcoming Events"
            count={upcomingEventItems?.length ?? 0}
            actionLabel="Review Calendar"
            onAction={() => window.location.replace('/#/admin/events')}
          />
        </div>
      </DashboardCard>
    </div>

    <div className="grid items-stretch gap-4 lg:grid-cols-2">
      <UpcomingCalendar upcomingEventItems={upcomingEventItems} />
      <AuditLogSection auditItems={auditItems} />
    </div>
  </>
)

export default memo(DashboardSection)
