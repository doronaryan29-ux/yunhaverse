import { memo } from 'react'

// Shared card shell for the dashboard grid: consistent border/padding, and
// (when `fillHeight` is true) `flex h-full flex-col` so every card in a
// stretched grid row fills the row's height instead of leaving a shorter
// card looking cut off next to a taller neighbor.
//
// `fillHeight` must be false for a card that isn't paired inside a
// `grid items-stretch` row: with no sibling row to match, `h-full` instead
// resolves against the whole scrollable content pane (its nearest ancestor
// with a definite height), ballooning the card to fill most of the
// viewport.
const DashboardCard = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  bodyClassName = '',
  fillHeight = true,
}) => (
  <section
    className={`flex flex-col rounded-xl border border-slate-200 bg-white p-5 ${fillHeight ? 'h-full' : ''} ${className}`}
  >
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      {action || null}
    </div>
    <div className={`mt-4 flex-1 ${bodyClassName}`}>{children}</div>
  </section>
)

export default memo(DashboardCard)
