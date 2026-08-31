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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
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
      value: adminData.stats.activeMembers ?? '--',
      trend: 'Live from database',
    },
    {
      label: 'Creative Staff',
      value: adminData.stats.creativeStaff ?? '--',
      trend: 'Live from database',
    },
    {
      label: 'Donations (Monthly)',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 0,
      }).format(Number(adminData.donationSummary.totalThisMonth || 0)),
      trend: 'Live from database',
    },
    {
      label: 'Open Audit Flags',
      value: adminData.stats.openAuditFlags ?? '--',
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
  const handleGoHome = () => {
    setProfileMenuOpen(false)
    setNotificationsOpen(false)
    window.location.replace('/#/')
  }

  return (
    <main className="min-h-screen text-slate-800">
      <div className="mx-auto flex min-h-screen w-full max-w-none flex-col px-3 py-5 sm:px-4 sm:py-8 lg:flex-row lg:gap-4 lg:px-6">
        <SidebarNav
          navItems={navItems}
          activeItem={activeNavItem}
          collapsed={sidebarCollapsed}
          profileName={profileName}
          profileRole={profileRole}
          profileMenuOpen={profileMenuOpen}
          profileMenuRef={profileMenuRef}
          onToggleProfile={handleToggleProfile}
          onGoProfile={handleGoProfile}
          onLogout={handleLogoutConfirm}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        />

        <section className="mt-6 flex-1 space-y-6 lg:mt-0">
          <TopHeader
            isProfileRoute={isProfileRoute}
            notificationsOpen={notificationsOpen}
            notificationsLoading={adminData.notificationsLoading}
            notifications={adminData.notifications}
            unreadCount={adminData.unreadCount}
            onGoHome={handleGoHome}
            onToggleNotifications={handleToggleNotifications}
            onCloseNotifications={handleCloseNotifications}
            onMarkNotificationRead={adminData.markNotificationRead}
          />

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
              donationSummary={adminData.donationSummary}
            />
          )}
        </section>
      </div>

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

