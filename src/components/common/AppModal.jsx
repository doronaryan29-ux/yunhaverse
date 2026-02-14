import { memo } from 'react'

const AppModal = ({ open, onClose, eyebrow, title, subtitle, children, footer }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 px-4 py-6">
      <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
                {eyebrow}
              </p>
            ) : null}
            <h4 className="mt-2 font-display text-2xl font-semibold text-slate-900">
              {title}
            </h4>
            {subtitle ? (
              <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
            ) : null}
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          ) : null}
        </div>
        {children ? <div className="mt-6">{children}</div> : null}
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  )
}

export default memo(AppModal)
