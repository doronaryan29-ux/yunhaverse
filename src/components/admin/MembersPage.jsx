import { memo, useMemo, useState } from 'react'
import {
  formatDateInManila,
  formatDateTimeInManila,
  getManilaYearMonth,
} from '../../utils/date'

const getPermissionLevel = (role) => {
  const normalized = String(role || '').trim().toLowerCase()
  if (normalized === 'admin') return 'admin'
  return 'viewer'
}

const MembersPage = ({ members, loading, currentRole }) => {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [verifiedFilter, setVerifiedFilter] = useState('all')
  const [selectedMember, setSelectedMember] = useState(null)
  const [notesById, setNotesById] = useState({})
  const [flaggedById, setFlaggedById] = useState({})

  const permission = getPermissionLevel(currentRole)
  const canEdit = permission === 'admin' 
  const canAdmin = permission === 'admin'

  const roleOptions = useMemo(() => {
    const roles = new Set()
    members.forEach((member) => {
      if (member.role) roles.add(member.role)
    })
    return ['all', ...Array.from(roles).sort()]
  }, [members])

  const statusOptions = useMemo(() => {
    const statuses = new Set()
    members.forEach((member) => {
      if (member.status) statuses.add(member.status)
    })
    return ['all', ...Array.from(statuses).sort()]
  }, [members])

  const overviewStats = useMemo(() => {
    const total = members.length
    const active = members.filter((m) => String(m.status || '').toLowerCase() === 'active').length
    const inactive = total - active
    const verified = members.filter((m) => Boolean(m.email_verified_at)).length
    const creatives = members.filter((m) => String(m.role || '').toLowerCase().includes('creative')).length
    const now = getManilaYearMonth(new Date())
    const newThisMonth = members.filter((m) => {
      const createdAt = m.created_at || m.joinedAt
      if (!createdAt) return false
      const created = getManilaYearMonth(createdAt)
      return created.year === now.year && created.month === now.month
    }).length


    return [
      { label: 'Total Members', value: total },
      { label: 'Active', value: active },
      { label: 'Inactive', value: inactive },
      { label: 'Verified Emails', value: verified },
      { label: 'Creative Staff', value: creatives },
      { label: 'New This Month', value: newThisMonth },
    ]
  }, [members])

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return members.filter((member) => {
      if (roleFilter !== 'all' && member.role !== roleFilter) return false
      if (statusFilter !== 'all' && member.status !== statusFilter) return false
      if (verifiedFilter !== 'all') {
        const isVerified = Boolean(member.email_verified_at)
        if (verifiedFilter === 'verified' && !isVerified) return false
        if (verifiedFilter === 'unverified' && isVerified) return false
      }
      if (!normalizedSearch) return true

      const name =
        member.name ||
        member.full_name ||
        [member.first_name, member.last_name].filter(Boolean).join(' ') ||
        [member.firstName, member.lastName].filter(Boolean).join(' ') ||
        member.email
      const haystack = [name, member.email, member.role, member.status]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(normalizedSearch)
    })
  }, [members, search, roleFilter, statusFilter, verifiedFilter])

  const drawerMember = selectedMember
    ? members.find((member) => member.id === selectedMember)
    : null

  const handleNoteSave = (memberId, note) => {
    setNotesById((prev) => ({ ...prev, [memberId]: note }))
  }

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
              Members
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
              Member Directory
            </h2>
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Permission: {permission}
          </span>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {overviewStats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-3xl border border-rose-100 bg-white/90 p-5 shadow-lg shadow-rose-100"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {stat.label}
            </p>
            <p className="mt-3 font-display text-3xl font-semibold text-slate-900">
              {stat.value}
            </p>
          </article>
        ))}
      </div>

      <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-slate-900">
            Directory
          </h3>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {filteredMembers.length} records
          </span>
        </div>

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

        <div className="mt-5 overflow-hidden rounded-2xl border border-rose-100">
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 bg-rose-50/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>Member</span>
            <span>Role</span>
            <span>Status</span>
            <span>Last Login</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <p className="px-4 py-6 text-sm text-slate-500">Loading members...</p>
            )}
            {!loading && filteredMembers.length === 0 && (
              <p className="px-4 py-6 text-sm text-slate-500">No members found.</p>
            )}
            {!loading &&
              filteredMembers.map((member) => {
                const name =
                  member.name ||
                  member.full_name ||
                  [member.first_name, member.last_name].filter(Boolean).join(' ') ||
                  [member.firstName, member.lastName].filter(Boolean).join(' ') ||
                  member.email ||
                  'Unknown'
                return (
                  <button
                    type="button"
                    key={member.id}
                    onClick={() => setSelectedMember(member.id)}
                    className="grid w-full grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 border-t border-rose-100 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-rose-50"
                  >
                    <span>
                      <span className="font-semibold text-slate-900">{name}</span>
                      {member.email && (
                        <span className="mt-1 block text-xs text-slate-400">
                          {member.email}
                        </span>
                      )}
                    </span>
                    <span>{member.role || 'member'}</span>
                    <span>{member.status || 'active'}</span>
                    <span>
                      {member.last_login_at
                        ? formatDateTimeInManila(member.last_login_at)
                        : '—'}
                    </span>
                  </button>
                )
              })}
          </div>
        </div>
      </section>

      {drawerMember && (
        <div className="fixed inset-0 z-40 flex">
          <div
            className="flex-1 bg-slate-900/40"
            onClick={() => setSelectedMember(null)}
          />
          <aside className="w-full max-w-lg bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
                  Member Detail
                </p>
                <h4 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                  {drawerMember.full_name ||
                    drawerMember.name ||
                    [drawerMember.first_name, drawerMember.last_name]
                      .filter(Boolean)
                      .join(' ') ||
                    [drawerMember.firstName, drawerMember.lastName]
                      .filter(Boolean)
                      .join(' ') ||
                    drawerMember.email ||
                    'Unknown'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Email:</span>{' '}
                {drawerMember.email || '—'}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Role:</span>{' '}
                {drawerMember.role || 'member'}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Status:</span>{' '}
                {drawerMember.status || 'active'}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Joined:</span>{' '}
                {drawerMember.created_at || drawerMember.joinedAt
                  ? formatDateInManila(
                      drawerMember.created_at || drawerMember.joinedAt,
                    )
                  : '—'}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Last Login:</span>{' '}
                {drawerMember.last_login_at
                  ? formatDateTimeInManila(drawerMember.last_login_at)
                  : '—'}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Actions
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={!canAdmin}
                  className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:opacity-50"
                >
                  Reset Password
                </button>
                <button
                  type="button"
                  disabled={!canEdit}
                  className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:opacity-50"
                >
                  Change Role
                </button>
                <button
                  type="button"
                  disabled={!canEdit}
                  className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:opacity-50"
                >
                  Deactivate
                </button>
                <button
                  type="button"
                  disabled={!canEdit}
                  className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:opacity-50"
                >
                  Resend Verification
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Notes / Flags
              </p>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Internal Note
                <textarea
                  value={notesById[drawerMember.id] || ''}
                  onChange={(event) =>
                    handleNoteSave(drawerMember.id, event.target.value)
                  }
                  className="mt-1 h-24 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                  placeholder="Add a note for internal reference"
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  setFlaggedById((prev) => ({
                    ...prev,
                    [drawerMember.id]: !prev[drawerMember.id],
                  }))
                }
                className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
              >
                {flaggedById[drawerMember.id] ? 'Remove Flag' : 'Flag Member'}
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  )
}

export default memo(MembersPage)
