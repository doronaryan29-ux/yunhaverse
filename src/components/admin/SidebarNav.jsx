import { memo } from 'react'

const SidebarNav = ({ navItems, activeItem }) => (
  <aside className="w-full shrink-0 lg:w-72">
    <div className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100 lg:sticky lg:top-8">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-rose-500">
        Admin Console
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900">
        YUNHAverse Ops
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Members, creatives, funds, events, and safety checks in one place.
      </p>

      <nav className="mt-6 flex flex-col gap-2">
        {navItems.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              if (index === 0) {
                window.location.replace('/#/admin')
              } else if (item === 'Members') {
                window.location.replace('/#/admin/members')
              }
            }}
            className={`rounded-2xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] transition ${
              item === activeItem
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                : 'border border-rose-100 text-slate-600 hover:-translate-y-0.5 hover:bg-rose-50'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  </aside>
)

export default memo(SidebarNav)
