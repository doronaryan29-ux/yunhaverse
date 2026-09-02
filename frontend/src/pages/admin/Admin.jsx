import { useEffect, useMemo, useRef, useState } from 'react'

import {
  DashboardSection,
  FlagIssueModal,
  ProductionWorkflowPage,
  EventsPage,
  FundsDonationsPage,
  AuditLogsPage,
  SettingsPage,
  MembersPage,
  ProfileSection,
  SidebarNav,
  TopHeader,
} from '../../components/admin'

import { navItems } from '../../constants/adminNav'
import { notificationTypes } from '../../constants/adminNotifications'
import { useAdminActions } from '../../hooks/useAdminActions'
import { useAdminData } from '../../hooks/useAdminData'
import { useAdminProfile } from '../../hooks/useAdminProfile'
import { useAdminRoute } from '../../hooks/useAdminRoute'
import { API_BASE } from '../../utils/apiBase'
import { getSessionUser } from '../../utils/sessionUser'
import { confirmActionAlert } from '../../utils/sweetAlert'

const Admin = () => {
  const user = getSessionUser()
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ')
  const profileName = fullName || 'Admin User'
  const profileRole = String(user?.role || 'admin').trim()
  const apiBase = API_BASE

  const {
    isProfileRoute,
    isMembersRoute,
    isCreativesRoute,
    isFundsRoute,
    isEventsRoute,
    isAuditLogsRoute,
    isSettingsRoute,
    activeNavItem,
  } = useAdminRoute()

  const profileRoleNormalized = useMemo(
    () => String(profileRole || '').trim().toLowerCase(),
    [profileRole],
  )

  const adminData = useAdminData({
    apiBase,
    profileRoleNormalized,
    userId: user?.id,
    isMembersRoute,
    isCreativesRoute,
    isFundsRoute,
    isEventsRoute,
    isAuditLogsRoute,
  })

  const profileState = useAdminProfile({
    apiBase,
    profileRoleNormalized,
    user,
    isProfileRoute,
    onSaved: adminData.fetchAuditLogs,
  })

  const actions = useAdminActions({
    apiBase,
    profileRoleNormalized,
    userId: user?.id,
    fetchNotifications: adminData.fetchNotifications,
    fetchAuditLogs: adminData.fetchAuditLogs,
    fetchAdminStats: adminData.fetchAdminStats,
    fetchAuditFlags: adminData.fetchAuditFlags,
  })

  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }
    window.addEventListener('mousedown', onPointerDown)
    return () => window.removeEventListener('mousedown', onPointerDown)
  }, [])

  const handleLogoutConfirm = async () => {
    const confirmed = await confirmActionAlert({
      title: 'Sign out of admin?',
      message: 'You will be returned to the login screen.',
      confirmText: 'Logout',
      intent: 'danger',
    })
    if (confirmed) {
      actions.handleLogout()
    }
  }

  const statCards = [
    {
      label: 'Active Members',
      value: adminData.stats.activeMembers,
      loading: adminData.statsLoading,
      format: 'number',
      trend: 'Live from database',
    },
    {
      label: 'Creative Staff',
      value: adminData.stats.creativeStaff,
      loading: adminData.statsLoading,
      format: 'number',
      trend: 'Live from database',
    },
    {
      label: 'Donations (Monthly)',
      value: adminData.donationSummary.totalThisMonth,
      loading: adminData.donationsLoading,
      format: 'currency',
      trend: 'Live from database',
    },
    {
      label: 'Open Audit Flags',
      value: adminData.stats.openAuditFlags,
      loading: adminData.statsLoading,
      format: 'number',
      attention:
        typeof adminData.stats.openAuditFlags === 'number' &&
        adminData.stats.openAuditFlags > 0,
      trend:
        typeof adminData.stats.openAuditFlags === 'number' &&
        adminData.stats.openAuditFlags > 0
          ? 'Needs review today'
          : 'No active flags',
    },
  ]

  const handleToggleNotifications = () => {
    setNotificationsOpen((prev) => !prev)
    setProfileMenuOpen(false)
  }

  const handleToggleProfile = () => {
    setProfileMenuOpen((prev) => !prev)
    setNotificationsOpen(false)
  }

  const handleCloseNotifications = () => {
    setNotificationsOpen(false)
  }

  const handleGoProfile = () => {
    setProfileMenuOpen(false)
    window.location.replace('/#/admin/profile')
  }
  return (
    <main className="flex min-h-screen w-full flex-col bg-slate-50 text-slate-800 lg:h-screen lg:flex-row lg:overflow-hidden">
      <SidebarNav navItems={navItems} activeItem={activeNavItem} />

      {/* Rendered as a sibling of the scrolling content section, not a
          descendant of it. It was previously nested inside that section
          (which has its own overflow/space-y context), which is exactly
          the "interlinked" coupling that made sticky positioning unreliable.
          As a sibling, it has no relationship to that section's scroll
          state at all — `fixed` (at lg:) anchors it to the viewport only. */}
      <TopHeader
        notificationsOpen={notificationsOpen}
        notificationsLoading={adminData.notificationsLoading}
        notifications={adminData.notifications}
        unreadCount={adminData.unreadCount}
        onToggleNotifications={handleToggleNotifications}
        onCloseNotifications={handleCloseNotifications}
        onMarkNotificationRead={adminData.markNotificationRead}
        profileName={profileName}
        profileRole={profileRole}
        profileMenuOpen={profileMenuOpen}
        profileMenuRef={profileMenuRef}
        onToggleProfile={handleToggleProfile}
        onGoProfile={handleGoProfile}
        onLogout={handleLogoutConfirm}
      />

      <section className="min-w-0 flex-1 space-y-4 p-3 sm:p-4 lg:overflow-y-auto lg:p-6">
        {/* TopHeader is `fixed` (not in flow) at lg:, so this spacer reserves
            the space it would otherwise occupy, preventing content from
            rendering underneath it. Not needed below lg: where the header
            stays `sticky` and in-flow (it renders right above this section
            in the stacked mobile layout, so no spacer is needed there). */}
        <div className="hidden lg:block lg:h-24" aria-hidden="true" />

        {isProfileRoute ? (
          <ProfileSection
            profileForm={profileState.profileForm}
            profileFeedback={profileState.profileFeedback}
            profileLoading={profileState.profileLoading}
            profileSaving={profileState.profileSaving}
            onChangeProfile={profileState.setProfileForm}
            onSaveProfile={profileState.saveProfile}
          />
        ) : isMembersRoute ? (
          <MembersPage
            members={adminData.membersFull}
            loading={adminData.membersLoading}
            currentRole={profileRoleNormalized}
          />
        ) : isCreativesRoute ? (
          <ProductionWorkflowPage
            apiBase={apiBase}
            requesterRole={profileRoleNormalized}
            userId={user?.id}
            members={adminData.membersFull}
            requests={adminData.creativeRequests}
            loadingRequests={adminData.creativeRequestsLoading}
            onRefresh={() => {
              adminData.fetchCreativeRequests()
            }}
          />
        ) : isFundsRoute ? (
          <FundsDonationsPage
            donations={adminData.donations}
            loading={adminData.donationsLoading}
            apiBase={apiBase}
            requesterRole={profileRoleNormalized}
            members={adminData.membersFull}
            onRefresh={adminData.fetchDonations}
          />
        ) : isEventsRoute ? (
          <EventsPage
            events={adminData.events}
            loading={adminData.eventsLoading}
            apiBase={apiBase}
            requesterRole={profileRoleNormalized}
            onRefresh={adminData.fetchEvents}
          />
        ) : isAuditLogsRoute ? (
          <AuditLogsPage
            auditItems={adminData.auditItems}
            loading={adminData.auditLogsLoading}
          />
        ) : isSettingsRoute ? (
          <SettingsPage
            apiBase={apiBase}
            requesterRole={profileRoleNormalized}
            userId={user?.id}
          />
        ) : (
          <DashboardSection
            statCards={statCards}
            notificationTypes={notificationTypes}
            notificationForm={actions.notificationForm}
            formFeedback={actions.formFeedback}
            formLoading={actions.formLoading}
            onNotificationFormChange={actions.setNotificationForm}
            onSubmitNotification={actions.submitNotification}
            onQuickAction={actions.handleQuickAction}
            onOpenFlagModal={actions.handleOpenFlagModal}
            upcomingEventItems={adminData.upcomingEventItems}
            auditItems={adminData.auditItems}
            auditFlags={adminData.auditFlags}
            auditFlagsLoading={adminData.auditFlagsLoading}
            onResolveFlag={adminData.handleResolveFlag}
            resolvingFlagId={adminData.resolvingFlagId}
            auditFlagsActionError={adminData.auditFlagsActionError}
            donationSummary={adminData.donationSummary}
            memberBreakdown={adminData.stats.memberBreakdown}
            memberGrowth={adminData.stats.memberGrowth}
            auditActivityTrend={adminData.stats.auditActivityTrend}
          />
        )}
      </section>

      <FlagIssueModal
        open={actions.flagModalOpen}
        form={actions.flagForm}
        feedback={actions.flagSubmitFeedback}
        loading={actions.flagSubmitLoading}
        onChange={actions.handleFlagFormChange}
        onClose={actions.handleCloseFlagModal}
        onSubmit={actions.handleSubmitFlag}
      />
    </main>
  )
}

export default Admin

