import { memo, useEffect, useState } from 'react'

const AppModal = ({
  open,
  onClose,
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  variant = 'center',
}) => {
  const [shouldRender, setShouldRender] = useState(open)
  const [isVisible, setIsVisible] = useState(false)

  const isDrawer = variant === 'drawer-right'
  const panelTransitionMs = 300
  const backdropTransitionMs = 360

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      const frame = window.requestAnimationFrame(() => setIsVisible(true))
      return () => window.cancelAnimationFrame(frame)
    }

    setIsVisible(false)
    const timeout = window.setTimeout(
      () => setShouldRender(false),
      backdropTransitionMs,
    )
    return () => window.clearTimeout(timeout)
  }, [open])

  if (!shouldRender) return null

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isDrawer
          ? 'flex items-stretch justify-end'
          : 'flex items-center justify-center overflow-y-auto px-4 py-6'
      }`}
    >
      <div
        className="absolute inset-0 bg-slate-900/50 transition-opacity ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDuration: `${backdropTransitionMs}ms`,
        }}
      />
      {onClose ? (
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute inset-0 h-full w-full cursor-default"
        />
      ) : null}
      <div
        className={`relative ${
          isDrawer
            ? 'h-full w-full max-w-2xl overflow-y-auto border-l border-rose-100 bg-rose-50/95 p-5 shadow-2xl backdrop-blur-sm sm:p-6'
            : 'w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-5 shadow-2xl sm:p-6'
        } transition-all duration-300 ease-out`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isDrawer
            ? isVisible
              ? 'translateX(0)'
              : 'translateX(24px)'
            : isVisible
              ? 'translateY(0) scale(1)'
              : 'translateY(8px) scale(0.99)',
          transitionDuration: `${panelTransitionMs}ms`,
        }}
      >
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
