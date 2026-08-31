import { memo } from 'react'

const AuditLogsSearch = ({ value, onChange }) => (
  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
    Search
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Action, user, role, ip..."
      className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
    />
  </label>
)

export default memo(AuditLogsSearch)
