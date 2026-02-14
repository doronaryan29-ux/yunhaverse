import { memo } from 'react'
import { formatDateTimeInManila } from '../../../utils/date'

const MembersTable = ({ members, loading, onSelect }) => (
  <div className="mt-5 overflow-x-auto rounded-2xl border border-rose-100">
    <div className="grid min-w-[720px] grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 bg-rose-50/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
      <span>Member</span>
      <span>Role</span>
      <span>Status</span>
      <span>Last Login</span>
    </div>
    <div className="max-h-96 overflow-y-auto">
      {loading && <p className="px-4 py-6 text-sm text-slate-500">Loading members...</p>}
      {!loading && members.length === 0 && (
        <p className="px-4 py-6 text-sm text-slate-500">No members found.</p>
      )}
      {!loading &&
        members.map((member) => {
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
              onClick={() => onSelect(member.id)}
              className="grid min-w-[720px] w-full grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 border-t border-rose-100 px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-rose-50"
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
                {member.last_login_at ? formatDateTimeInManila(member.last_login_at) : '—'}
              </span>
            </button>
          )
        })}
    </div>
  </div>
)

export default memo(MembersTable)
