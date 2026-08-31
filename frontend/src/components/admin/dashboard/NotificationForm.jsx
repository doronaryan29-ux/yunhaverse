import { memo } from 'react'

const NotificationForm = ({
  notificationTypes,
  notificationForm,
  formFeedback,
  formLoading,
  onNotificationFormChange,
  onSubmitNotification,
}) => (
  <form
    className="mt-6 space-y-3 rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
    onSubmit={onSubmitNotification}
  >
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
      Publish Notification
    </p>
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Type
        <select
          value={notificationForm.type}
          onChange={(event) =>
            onNotificationFormChange((prev) => ({
              ...prev,
              type: event.target.value,
            }))
          }
          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        >
          {notificationTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Audience
        <select
          value={notificationForm.audience}
          onChange={(event) =>
            onNotificationFormChange((prev) => ({
              ...prev,
              audience: event.target.value,
            }))
          }
          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="members">Members</option>
          <option value="creatives">Creatives</option>
        </select>
      </label>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Priority
        <select
          value={notificationForm.priority}
          onChange={(event) =>
            onNotificationFormChange((prev) => ({
              ...prev,
              priority: event.target.value,
            }))
          }
          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        >
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>
      </label>
    </div>
    <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
      Title
      <input
        type="text"
        value={notificationForm.title}
        onChange={(event) =>
          onNotificationFormChange((prev) => ({
            ...prev,
            title: event.target.value,
          }))
        }
        className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        placeholder="Short alert title"
      />
    </label>
    <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
      Message
      <textarea
        value={notificationForm.message}
        onChange={(event) =>
          onNotificationFormChange((prev) => ({
            ...prev,
            message: event.target.value,
          }))
        }
        className="mt-1 h-24 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        placeholder="Write the notice details"
      />
    </label>
    {formFeedback.message && (
      <p
        className={`text-xs ${
          formFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
        }`}
      >
        {formFeedback.message}
      </p>
    )}
    <button
      type="submit"
      disabled={formLoading}
      className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
    >
      {formLoading ? 'Publishing...' : 'Publish Notice'}
    </button>
  </form>
)

export default memo(NotificationForm)
