import { memo, useEffect, useState } from 'react'

// iOS-style drawer curve (Ionic Framework) — confident deceleration, no overshoot.
// Written as one complete literal class string: Tailwind's build-time scanner
// only picks up arbitrary values that appear whole in the source, not ones
// assembled from separate interpolated fragments.
const DRAWER_EASING_CLASS = 'ease-[cubic-bezier(0.32,0.72,0,1)]'

const ENTER_MS = 300
const EXIT_MS = 200
const BACKDROP_MS = 300

const AppModal = ({
  open,
  onClose,
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  variant = 'center',
  panelClassName,
}) => {
  const [shouldRender, setShouldRender] = useState(open)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  const isDrawer = variant === 'drawer-right'

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (event) => setPrefersReducedMotion(event.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  // Mount immediately on open; delay unmount on close so the exit
  // transition can finish playing before the node leaves the DOM.
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronizing mount state with the `open` prop is the point of this effect.
      setShouldRender(true)
      return undefined
    }

    const unmountDelay = prefersReducedMotion ? 0 : Math.max(EXIT_MS, BACKDROP_MS)
    const timeout = window.setTimeout(() => setShouldRender(false), unmountDelay)
    return () => window.clearTimeout(timeout)
  }, [open, prefersReducedMotion])

  if (!shouldRender) return null

  // `@starting-style` (Tailwind's `starting:` variant) supplies the closed
  // look for the element's very first paint after mount, so the browser
  // animates it in natively — no JS-driven "flip a flag after rAF" race
  // that can get coalesced into a single frame and skip the animation.
  const backdropClassName = `absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
    open ? 'opacity-100' : 'opacity-0'
  }`

  const drawerPanelClassName = [
    'relative h-full w-full overflow-y-auto border-l border-slate-200 bg-white p-5 shadow-2xl sm:p-6',
    panelClassName || 'max-w-2xl',
    'transition-[transform,opacity]',
    DRAWER_EASING_CLASS,
    'starting:translate-x-full starting:opacity-0',
    'motion-reduce:transition-none motion-reduce:translate-x-0 motion-reduce:starting:translate-x-0',
    open ? 'translate-x-0 opacity-100 duration-300' : 'translate-x-full opacity-0 duration-200',
  ].join(' ')

  const centerPanelClassName = [
    'relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6',
    'transition-[transform,opacity] ease-out',
    'starting:translate-y-2 starting:opacity-0',
    'motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:starting:translate-y-0',
    open ? 'translate-y-0 opacity-100 duration-300' : 'translate-y-2 opacity-0 duration-200',
  ].join(' ')

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isDrawer
          ? 'flex items-stretch justify-end'
          : 'flex items-center justify-center overflow-y-auto px-4 py-6'
      }`}
    >
      <div className={backdropClassName} />
      {onClose ? (
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute inset-0 h-full w-full cursor-default"
        />
      ) : null}
      <div className={isDrawer ? drawerPanelClassName : centerPanelClassName}>
        <div className="flex items-start justify-between gap-3">
          <div>
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {eyebrow}
              </p>
            ) : null}
            <h4 className="mt-2 text-2xl font-semibold text-slate-900">
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
