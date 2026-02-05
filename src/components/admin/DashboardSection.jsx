import { memo } from 'react'
import AuditFlagsSection from './AuditFlagsSection'
import AuditLogSection from './AuditLogSection'
import DonationTrackingSection from './DonationTrackingSection'
import MembersCreativeSection from './MembersCreativeSection'
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
  memberItems,
  auditItems,
  auditFlags,
  auditFlagsLoading,
  onResolveFlag,
}) => (
  <>
    <header className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
            Dashboard
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
            Operations Overview
          </h2>
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

      <UpcomingCalendar upcomingEventItems={upcomingEventItems} />
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <MembersCreativeSection memberItems={memberItems} />
      <AuditLogSection auditItems={auditItems} />
    </div>

    <AuditFlagsSection
      flags={auditFlags}
      loading={auditFlagsLoading}
      onResolveFlag={onResolveFlag}
    />

    <DonationTrackingSection />
  </>
)

export default memo(DashboardSection)
