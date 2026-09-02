import { memo } from 'react'

const NotificationsMenu = ({
  notificationsLoading,
  notifications,
  onClose,
  onMarkRead,
}) => (
  <div className="absolute right-0 top-11 z-30 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
    <div className="mb-1 flex items-center justify-between px-2 py-1">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        Notifications
      </p>
      <button
        type="button"
        onClick={onClose}
        className="text-xs text-slate-500 hover:text-slate-600"
      >
        Close
      </button>
    </div>

    <div className="max-h-80 space-y-1 overflow-y-auto">
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
            className={`rounded-lg border px-3 py-2.5 ${
              item.isRead ? 'border-transparent bg-white' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.message}</p>
              </div>
              {!item.isRead && (
                <button
                  type="button"
                  onClick={() => onMarkRead(item.id)}
                  className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-600 ring-1 ring-inset ring-indigo-200 transition motion-safe:active:scale-[0.94]"
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
