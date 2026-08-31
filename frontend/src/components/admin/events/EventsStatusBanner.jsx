import { memo } from 'react'

const EventsStatusBanner = ({ formStatus, onDismiss }) => {
  if (!formStatus?.message) return null

  return (
    <div
      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
        formStatus.type === 'error'
          ? 'border-rose-200 bg-rose-50 text-rose-600'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      }`}
    >
      <span>{formStatus.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="text-xs font-semibold uppercase tracking-[0.2em]"
      >
        Dismiss
      </button>
    </div>
  )
}

export default memo(EventsStatusBanner)
