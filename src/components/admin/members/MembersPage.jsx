import { memo, useMemo, useState } from 'react'
import { getManilaYearMonth } from '../../../utils/date'
import MemberDrawer from './MemberDrawer'
import MembersFilters from './MembersFilters'
import MembersHeader from './MembersHeader'
import MembersStats from './MembersStats'
import MembersTable from './MembersTable'

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
      <MembersHeader permission={permission} />
      <MembersStats stats={overviewStats} />

      <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-slate-900">
            Directory
          </h3>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {filteredMembers.length} records
          </span>
        </div>

        <MembersFilters
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          verifiedFilter={verifiedFilter}
          setVerifiedFilter={setVerifiedFilter}
          roleOptions={roleOptions}
          statusOptions={statusOptions}
        />
        <MembersTable
          members={filteredMembers}
          loading={loading}
          onSelect={(memberId) => setSelectedMember(memberId)}
        />
      </section>

      <MemberDrawer
        member={drawerMember}
        onClose={() => setSelectedMember(null)}
        canEdit={canEdit}
        canAdmin={canAdmin}
        notes={drawerMember ? notesById[drawerMember.id] || '' : ''}
        onNoteChange={(value) => drawerMember && handleNoteSave(drawerMember.id, value)}
        flagged={drawerMember ? Boolean(flaggedById[drawerMember.id]) : false}
        onToggleFlag={() =>
          drawerMember &&
          setFlaggedById((prev) => ({
            ...prev,
            [drawerMember.id]: !prev[drawerMember.id],
          }))
        }
      />
    </section>
  )
}

export default memo(MembersPage)
