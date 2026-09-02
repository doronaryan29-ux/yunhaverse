// Lightweight hover/focus tooltip for icon-only controls. Pure CSS (group-hover
// + group-focus-within), no library — matches the site's dark-ink/pink tokens
// rather than a default browser title or an unstyled tooltip-lib look.
const Tooltip = ({ label, children, className = '' }) => (
  <span className={`group/tip relative inline-flex ${className}`}>
    {children}
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg border border-[var(--brand-400)] bg-[var(--nb-ink)] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white opacity-0 shadow-lg transition-[opacity,transform] duration-150 group-hover/tip:translate-y-0 group-hover/tip:opacity-100 group-focus-within/tip:translate-y-0 group-focus-within/tip:opacity-100 motion-reduce:transition-none"
    >
      {label}
      <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-[var(--brand-400)] bg-[var(--nb-ink)]" />
    </span>
  </span>
)

export default Tooltip
