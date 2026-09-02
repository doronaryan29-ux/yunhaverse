import { memo, useState } from 'react'

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
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const hasActiveFilters =
    search.trim() !== '' ||
    roleFilter !== 'all' ||
    statusFilter !== 'all' ||
    verifiedFilter !== 'all'

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setFiltersOpen((prev) => !prev)}
          className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition motion-safe:active:scale-[0.97] ${
            filtersOpen
              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
              : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <i className="fas fa-filter text-[10px]" />
            {filtersOpen ? 'Hide Filters' : 'Filters'}
          </span>
        </button>
        {hasActiveFilters ? (
          <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">
            Active
          </span>
        ) : null}
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          filtersOpen ? 'mt-3 max-h-[520px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Search
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, email, role..."
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Role
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All roles' : role}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All statuses' : status}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Verified
            <select
              value={verifiedFilter}
              onChange={(event) => setVerifiedFilter(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </label>
          <div className="sm:col-span-2 lg:col-span-4">
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setRoleFilter('all')
                setStatusFilter('all')
                setVerifiedFilter('all')
              }}
              className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition motion-safe:active:scale-[0.97] hover:border-slate-300 hover:bg-white"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(MembersFilters)
