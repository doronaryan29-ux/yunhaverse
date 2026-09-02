import { memo, useState } from 'react'
import NotificationForm from './NotificationForm'
import { AppModal } from '../../common'
import DashboardCard from './DashboardCard'

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
  const [actionModal, setActionModal] = useState(null)

  const baseButton =
    'flex items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-sm font-medium transition motion-safe:active:scale-[0.98]'
  const inactiveButton =
    'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
  const activeButton = 'border-indigo-600 bg-indigo-50 text-indigo-700'

  const handleAction = (key, payload) => {
    setActiveAction(key)
    if (payload) onQuickAction(payload)
    if (key === 'broadcast' || key === 'discord' || key === 'donation') {
      setActionModal(key)
    }
  }

  return (
    <>
      <DashboardCard title="Quick Actions" bodyClassName="flex flex-col justify-center">
        <div className="grid gap-2.5 sm:grid-cols-2">
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
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
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
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
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
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
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
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              <i className="fas fa-hand-holding-heart text-sm" />
            </span>
            Add Donation Record
          </button>
        </div>
      </DashboardCard>

      <AppModal
        open={actionModal === 'broadcast' || actionModal === 'discord'}
        onClose={() => setActionModal(null)}
        variant="drawer-right"
        panelClassName="max-w-lg"
        eyebrow="Quick Action"
        title={actionModal === 'discord' ? 'Post Discord Notice' : 'Broadcast Email'}
        subtitle="Fill this form to publish the notice."
      >
        <NotificationForm
          notificationTypes={notificationTypes}
          notificationForm={notificationForm}
          formFeedback={formFeedback}
          formLoading={formLoading}
          onNotificationFormChange={onNotificationFormChange}
          onSubmitNotification={onSubmitNotification}
        />
      </AppModal>

      <AppModal
        open={actionModal === 'donation'}
        onClose={() => setActionModal(null)}
        variant="drawer-right"
        panelClassName="max-w-lg"
        eyebrow="Quick Action"
        title="Add Donation Record"
        subtitle="Open the funds page to create or manage donations."
      >
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => window.location.replace('/#/admin/funds')}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition motion-safe:active:scale-[0.97] hover:bg-indigo-700"
          >
            Open Funds
          </button>
        </div>
      </AppModal>
    </>
  )
}

export default memo(QuickActionsSection)
