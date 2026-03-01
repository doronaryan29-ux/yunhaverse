import { memo } from 'react'

const navIconMap = {
  Dashboard: 'fa-gauge-high',
  Members: 'fa-users',
  'Production Workflow': 'fa-diagram-project',
  'Funds & Donations': 'fa-hand-holding-dollar',
  Events: 'fa-calendar-days',
  'Audit Logs': 'fa-clipboard-list',
  Settings: 'fa-gear',
}

const SidebarNav = ({
  navItems,
  activeItem,
  collapsed,
  onToggleSidebar,
  profileName,
  profileRole,
  profileMenuOpen,
  profileMenuRef,
  onToggleProfile,
  onGoProfile,
  onLogout,
}) => (
  <>
    {collapsed && (
      <div className="group fixed left-0 top-0 z-40 hidden h-screen w-14 lg:block">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-rose-200/70 via-rose-300/60 to-rose-200/70 opacity-70 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100" />
        <button
          type="button"
          onClick={onToggleSidebar}
          className="pointer-events-none absolute left-3 top-24 flex h-10 w-10 -translate-x-2 items-center justify-center rounded-full border border-rose-100 bg-white text-rose-500 opacity-0 shadow-sm transition duration-200 hover:bg-rose-50 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100"
          aria-label="Show sidebar"
          title="Show sidebar"
        >
          <i className="fas fa-chevron-right text-xs" />
        </button>
      </div>
    )}

    <div
      className={`relative shrink-0 overflow-hidden transition-all duration-300 ease-out ${
        collapsed ? 'w-0 opacity-0 lg:w-0 lg:opacity-0' : 'w-full opacity-100 lg:w-80'
      }`}
    >
      <aside className="w-full lg:w-80">
        <div className="rounded-3xl border border-rose-100 p-6 lg:sticky lg:top-8 lg:flex lg:h-[calc(100vh-4rem)] lg:flex-col">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500 sm:text-base">
              Admin Dashboard
            </p>
            <button
              type="button"
              onClick={onToggleSidebar}
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-rose-100 text-rose-500 transition hover:bg-rose-50 lg:flex"
              aria-label="Hide sidebar"
              title="Hide sidebar"
            >
              <i className="fas fa-chevron-left text-xs" />
            </button>
          </div>

          <nav className="mt-2 flex flex-col gap-2">
            {navItems.map((item, index) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (index === 0) {
                    window.location.replace('/#/admin')
                  } else if (item === 'Members') {
                    window.location.replace('/#/admin/members')
                  } else if (item === 'Production Workflow') {
                    window.location.replace('/#/admin/workflow')
                  } else if (item === 'Funds & Donations') {
                    window.location.replace('/#/admin/funds')
                  } else if (item === 'Events') {
                    window.location.replace('/#/admin/events')
                  } else if (item === 'Audit Logs') {
                    window.location.replace('/#/admin/audit-logs')
                  } else if (item === 'Settings') {
                    window.location.replace('/#/admin/settings')
                  }
                }}
                className={`rounded-2xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  item === activeItem
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                    : 'border border-rose-100 text-slate-600 hover:-translate-y-0.5 hover:bg-rose-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <i className={`fas ${navIconMap[item] || 'fa-circle'} text-[11px]`} />
                  {item}
                </span>
              </button>
            ))}
          </nav>

          <div className="relative mt-6 border-t border-rose-100 pt-4 lg:mt-auto" ref={profileMenuRef}>
            <button
              type="button"
              onClick={onToggleProfile}
              className="w-full rounded-2xl border border-rose-100 bg-white px-3 py-3 text-left transition hover:bg-rose-50"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                  <i className="fas fa-user text-xs" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Profile
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-800">{profileName}</p>
                  <p className="truncate text-[11px] uppercase tracking-[0.18em] text-rose-500">
                    {profileRole}
                  </p>
                </div>
              </div>
            </button>

            {profileMenuOpen && (
              <div className="absolute bottom-[calc(100%+8px)] left-0 z-30 w-full rounded-2xl border border-rose-100 bg-white p-2 shadow-xl">
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
        </div>
      </aside>
    </div>
  </>
)

export default memo(SidebarNav)
