import { memo } from 'react'

const StaffSidebar = ({ navItems, activeItem, notifications, loading, baseRoute }) => (
  <aside className="w-full shrink-0 lg:w-72">
    <div className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100 lg:sticky lg:top-8">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-rose-500">
        Creative Desk
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900">
        Staff Portal
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Assignments, submissions, and updates in one place.
      </p>

      <nav className="mt-6 flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              window.location.replace(`${baseRoute}#${item.id}`)
            }}
            className={`rounded-2xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] transition ${
              item.id === activeItem
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                : 'border border-rose-100 text-slate-600 hover:-translate-y-0.5 hover:bg-rose-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-6 border-t border-rose-100 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
          Inbox
        </p>
        <div className="mt-3 grid gap-2 text-xs text-slate-600">
          {loading ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-3">
              Loading updates...
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-3">
              No new admin updates.
            </div>
          ) : (
            notifications.slice(0, 4).map((note) => (
              <div
                key={note.id}
                className="rounded-2xl border border-rose-100 bg-white px-3 py-2"
              >
                <p className="font-semibold text-slate-800">{note.title}</p>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                  {note.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </aside>
)

export default memo(StaffSidebar)
