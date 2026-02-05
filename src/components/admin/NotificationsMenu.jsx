import { memo } from 'react'

const NotificationsMenu = ({
  notificationsLoading,
  notifications,
  onClose,
  onMarkRead,
}) => (
  <div className="absolute right-0 top-12 z-30 w-80 rounded-2xl border border-rose-100 bg-white p-3 shadow-xl">
    <div className="mb-2 flex items-center justify-between px-2">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
        Notifications
      </p>
      <button
        type="button"
        onClick={onClose}
        className="text-xs text-slate-400 hover:text-slate-600"
      >
        Close
      </button>
    </div>

    <div className="max-h-80 space-y-2 overflow-y-auto">
      {notificationsLoading && (
        <p className="px-2 py-4 text-sm text-slate-500">Loading...</p>
      )}
      {!notificationsLoading && notifications.length === 0 && (
        <p className="px-2 py-4 text-sm text-slate-500">No notifications yet.</p>
      )}
      {!notificationsLoading &&
        notifications.map((item) => (
          <article
            key={item.id}
            className={`rounded-xl border px-3 py-3 ${
              item.isRead ? 'border-rose-100 bg-white' : 'border-rose-200 bg-rose-50/70'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-600">{item.message}</p>
              </div>
              {!item.isRead && (
                <button
                  type="button"
                  onClick={() => onMarkRead(item.id)}
                  className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-500"
                >
                  Read
                </button>
              )}
            </div>
          </article>
        ))}
    </div>
  </div>
)

export default memo(NotificationsMenu)
