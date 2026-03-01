import { memo } from 'react'
import NotificationsMenu from './NotificationsMenu'

const TopHeader = ({
  isProfileRoute,
  notificationsOpen,
  notificationsLoading,
  notifications,
  unreadCount,
  onToggleNotifications,
  onCloseNotifications,
  onGoHome,
  onMarkNotificationRead,
}) => (
  <header
    className={`sticky top-0 z-20 rounded-3xl border px-4 py-4 shadow-sm backdrop-blur sm:px-6 ${
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

      <div className="relative flex w-full items-center justify-end gap-3 sm:w-auto">
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-2 rounded-xl border border-rose-100 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 transition hover:-translate-y-0.5 hover:bg-rose-50 sm:text-xs sm:tracking-[0.22em]"
        >
          <i className="fas fa-house text-[11px] text-rose-500" />
          Home
        </button>
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
