import { memo } from 'react'

const MembersFilters = ({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  verifiedFilter,
  setVerifiedFilter,
  roleOptions,
  statusOptions,
}) => (
  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
      Search
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Name, email, role..."
        className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
      />
    </label>
    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
      Role
      <select
        value={roleFilter}
        onChange={(event) => setRoleFilter(event.target.value)}
        className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
      >
        {roleOptions.map((role) => (
          <option key={role} value={role}>
            {role === 'all' ? 'All roles' : role}
          </option>
        ))}
      </select>
    </label>
    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
      Status
      <select
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
        className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status === 'all' ? 'All statuses' : status}
          </option>
        ))}
      </select>
    </label>
    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
      Verified
      <select
        value={verifiedFilter}
        onChange={(event) => setVerifiedFilter(event.target.value)}
        className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
      >
        <option value="all">All</option>
        <option value="verified">Verified</option>
        <option value="unverified">Unverified</option>
      </select>
    </label>
  </div>
)

export default memo(MembersFilters)
