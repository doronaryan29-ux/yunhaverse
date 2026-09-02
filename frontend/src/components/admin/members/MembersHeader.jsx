import { memo } from 'react'

const MembersHeader = ({ permission }) => (
  <header className="rounded-xl border border-slate-200 bg-white p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Members
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Member Directory
        </h2>
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
        Permission: {permission}
      </span>
    </div>
  </header>
)

export default memo(MembersHeader)
