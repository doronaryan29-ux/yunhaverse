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
import { AppModal } from '../../components/common'

import { navItems } from '../../constants/adminNav'
import { notificationTypes } from '../../constants/adminNotifications'
import { useAdminActions } from '../../hooks/useAdminActions'
import { useAdminData } from '../../hooks/useAdminData'
import { useAdminProfile } from '../../hooks/useAdminProfile'
import { useAdminRoute } from '../../hooks/useAdminRoute'
import { API_BASE } from '../../utils/apiBase'
import { getSessionUser } from '../../utils/sessionUser'

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
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
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
    { label: 'Donations (Monthly)', value: '$4,920', trend: '+12.4%' },
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
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-slate-800">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute right-0 top-72 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 lg:flex-row lg:gap-6">
        <SidebarNav navItems={navItems} activeItem={activeNavItem} />

        <section className="mt-8 flex-1 space-y-6 lg:mt-0">
          <TopHeader
            profileName={profileName}
            profileRole={profileRole}
            isProfileRoute={isProfileRoute}
            notificationsOpen={notificationsOpen}
            profileMenuOpen={profileMenuOpen}
            notificationsLoading={adminData.notificationsLoading}
            notifications={adminData.notifications}
            unreadCount={adminData.unreadCount}
            profileMenuRef={profileMenuRef}
            onGoHome={handleGoHome}
            onToggleNotifications={handleToggleNotifications}
            onToggleProfile={handleToggleProfile}
            onCloseNotifications={handleCloseNotifications}
            onGoProfile={handleGoProfile}
            onLogout={() => setLogoutConfirmOpen(true)}
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
              memberItems={adminData.memberItems}
              auditItems={adminData.auditItems}
              auditFlags={adminData.auditFlags}
              auditFlagsLoading={adminData.auditFlagsLoading}
              onResolveFlag={adminData.handleResolveFlag}
            />
          )}
        </section>
      </div>

      <AppModal
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        eyebrow="Confirm Logout"
        title="Sign out of admin?"
      >
        <p className="text-sm text-slate-600">
          You will be returned to the login screen.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setLogoutConfirmOpen(false)}
            className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => actions.handleLogout()}
            className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>
      </AppModal>

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
