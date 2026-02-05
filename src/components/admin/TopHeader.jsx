import { memo } from 'react'
import NotificationsMenu from './NotificationsMenu'

const TopHeader = ({
  profileName,
  profileRole,
  isProfileRoute,
  notificationsOpen,
  profileMenuOpen,
  notificationsLoading,
  notifications,
  unreadCount,
  profileMenuRef,
  onToggleNotifications,
  onToggleProfile,
  onCloseNotifications,
  onGoProfile,
  onLogout,
  onMarkNotificationRead,
}) => (
  <header
    className={`sticky top-0 z-20 rounded-3xl border px-6 py-4 shadow-sm backdrop-blur ${
      isProfileRoute
        ? 'border-rose-200 bg-rose-50/70 ring-1 ring-rose-200'
        : 'border-rose-100 bg-white/95'
    }`}
  >
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
          {isProfileRoute ? 'Profile Overview' : 'Admin Overview'}
        </p>
        <h2 className="mt-1 font-display text-xl font-semibold text-slate-900">
          {isProfileRoute ? 'Profile Settings' : 'Operations Hub'}
        </h2>
      </div>

      <div className="relative flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleNotifications}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition hover:bg-rose-100"
          aria-label="Notifications"
        >
          <i className="fas fa-bell" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={onToggleProfile}
            className="rounded-xl border border-rose-100 bg-white px-3 py-2 text-left transition hover:bg-rose-50"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                <i className="fas fa-user text-xs" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Profile
                </p>
                <p className="text-sm font-semibold text-slate-800">{profileName}</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-rose-500">
                  {profileRole}
                </p>
              </div>
            </div>
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 top-14 z-30 w-44 rounded-2xl border border-rose-100 bg-white p-2 shadow-xl">
              <button
                type="button"
                onClick={onGoProfile}
                className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-rose-50"
              >
                My Profile
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-500 transition hover:bg-rose-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {notificationsOpen && (
          <NotificationsMenu
            notificationsLoading={notificationsLoading}
            notifications={notifications}
            onClose={onCloseNotifications}
            onMarkRead={onMarkNotificationRead}
          />
        )}
      </div>
    </div>
  </header>
)

export default memo(TopHeader)
