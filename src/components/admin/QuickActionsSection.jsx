import { memo, useState } from 'react'
import NotificationForm from './NotificationForm'

const QuickActionsSection = ({
  notificationTypes,
  notificationForm,
  formFeedback,
  formLoading,
  onNotificationFormChange,
  onSubmitNotification,
  onQuickAction,
  onOpenFlagModal,
}) => {
  const [activeAction, setActiveAction] = useState(null)

  const baseButton =
    'flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] transition hover:-translate-y-0.5'
    const inactiveButton = 'border-rose-200 text-rose-500 hover:bg-rose-50'
  const activeButton = 'border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-200'

  const handleAction = (key, payload) => {
    setActiveAction(key)
    if (payload) onQuickAction(payload)
  }

  return (
    <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl font-semibold text-slate-900">
          Quick Admin Actions
        </h3>
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          Primary tasks
        </span>
      </div>

    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        className={`${baseButton} ${
          activeAction === 'broadcast' ? activeButton : inactiveButton
          }`}
          onClick={() =>
            handleAction('broadcast', {
              type: 'announcement',
              audience: 'all',
            })
          }
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-rose-500">
            <i className="fas fa-bullhorn text-sm" />
          </span>
          Broadcast Email
        </button>
        <button
          type="button"
          className={`${baseButton} ${
            activeAction === 'discord' ? activeButton : inactiveButton
          }`}
          onClick={() =>
            handleAction('discord', {
              type: 'discord_meetup',
              audience: 'members',
            })
          }
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-rose-500">
            <i className="fab fa-discord text-sm" />
          </span>
          Post Discord Notice
        </button>
      <button
        type="button"
        className={`${baseButton} ${
          activeAction === 'flag' ? activeButton : inactiveButton
        }`}
        onClick={() => {
          handleAction('flag')
          onOpenFlagModal?.()
        }}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-rose-500">
          <i className="fas fa-clipboard-check text-sm" />
        </span>
        Flag Issues
      </button>
        <button
          type="button"
          className={`${baseButton} ${
            activeAction === 'donation' ? activeButton : inactiveButton
          }`}
          onClick={() => handleAction('donation')}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-rose-500">
            <i className="fas fa-hand-holding-heart text-sm" />
          </span>
          Add Donation Record
        </button>
    </div>

    <NotificationForm
        notificationTypes={notificationTypes}
        notificationForm={notificationForm}
        formFeedback={formFeedback}
        formLoading={formLoading}
        onNotificationFormChange={onNotificationFormChange}
        onSubmitNotification={onSubmitNotification}
      />
    </section>
  )
}

export default memo(QuickActionsSection)
