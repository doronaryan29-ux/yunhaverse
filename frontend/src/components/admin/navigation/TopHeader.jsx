import { memo } from 'react'
import NotificationsMenu from './NotificationsMenu'

const TopHeader = ({
  notificationsOpen,
  notificationsLoading,
  notifications,
  unreadCount,
  onToggleNotifications,
  onCloseNotifications,
  onMarkNotificationRead,
  profileName,
  profileRole,
  profileMenuOpen,
  profileMenuRef,
  onToggleProfile,
  onGoProfile,
  onLogout,
}) => (
  // `sticky` depends on its nearest scrolling ancestor's containing block,
  // and this shell has a layered scroll setup (main constrains height at
  // lg:, this section scrolls internally). That dependency proved fragile
  // in practice. `fixed` has no such dependency — anchored to the viewport
  // by spec, unaffected by any ancestor's scroll/overflow state — so at
  // the lg: breakpoint (where the content pane scrolls internally) it
  // replaces sticky outright. Below lg:, the whole page scrolls normally
  // and plain `sticky` against the document is reliable, so it stays.
  <header className="sticky top-0 z-30 bg-slate-50 py-1 lg:fixed lg:left-72 lg:right-0 lg:top-6 lg:px-6 lg:py-3">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="relative w-full max-w-xs">
        <i className="fas fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
        />
      </div>

      <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
        <div className="relative">
          <button
            type="button"
            onClick={onToggleNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition motion-safe:active:scale-[0.94] hover:bg-slate-50 hover:text-slate-900"
            aria-label="Notifications"
          >
            <i className="fas fa-bell text-sm" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-semibold text-white">
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

        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={onToggleProfile}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 transition motion-safe:active:scale-[0.97] hover:bg-slate-50"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-200">
              <i className="fas fa-user text-xs" />
            </span>
            <span className="hidden text-left sm:block">
              <span className="block truncate text-sm font-medium leading-tight text-slate-900">
                {profileName}
              </span>
              <span className="block truncate text-xs capitalize leading-tight text-slate-500">
                {profileRole}
              </span>
            </span>
            <i className="fas fa-chevron-down text-[10px] text-slate-400" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-48 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg">
              <button
                type="button"
                onClick={onGoProfile}
                className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                My Profile
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="mt-0.5 flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
)

export default memo(TopHeader)
