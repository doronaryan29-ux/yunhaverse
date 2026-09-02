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

const SidebarNav = ({ navItems, activeItem }) => (
  <div className="relative w-full shrink-0 lg:w-72">
    <aside className="w-full lg:h-full lg:w-72">
      <div className="flex h-full flex-col bg-slate-900 p-4">
        <p className="mb-4 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Admin Panel
        </p>

        <nav className="flex flex-col gap-0.5">
          {navItems.map((item, index) => {
            const isActive = item === activeItem
            return (
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
                className={`flex items-center gap-3 rounded-lg border-l-[3px] px-3 py-2.5 text-left text-sm font-medium transition motion-safe:active:scale-[0.98] ${
                  isActive
                    ? 'border-l-indigo-500 bg-slate-800 text-white'
                    : 'border-l-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                }`}
              >
                <i className={`fas ${navIconMap[item] || 'fa-circle'} w-4 text-center text-[13px]`} />
                {item}
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  </div>
)

export default memo(SidebarNav)
