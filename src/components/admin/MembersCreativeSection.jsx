import { memo, useMemo } from 'react'
import { formatDateInManila } from '../../utils/date'

const MembersCreativeSection = ({ memberItems }) => {
  const previewMembers = useMemo(() => memberItems.slice(0, 4), [memberItems])

  return (
    <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl font-semibold text-slate-900">
          Members & Creative Staff
        </h3>
        <button
          type="button"
          onClick={() => window.location.replace('/#/admin/members')}
          className="rounded-2xl border border-rose-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
        >
          View All Members
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {previewMembers.length === 0 && (
          <p className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-500">
            No members found.
          </p>
        )}
        {previewMembers.map((member) => {
          const displayName =
            member.name ||
            member.full_name ||
            [member.first_name, member.last_name].filter(Boolean).join(' ') ||
            [member.firstName, member.lastName].filter(Boolean).join(' ') ||
            member.email ||
            'Unknown'
          return (
            <div
              key={`${member.id}-${member.email || displayName}`}
              className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50/60 p-4"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-500">
                  {(member.role || 'member')}
                  {member.joinedAt || member.created_at ? ' • Joined ' : ''}
                  {member.joinedAt || member.created_at
                    ? formatDateInManila(member.joinedAt || member.created_at)
                    : ''}
                </p>
                {member.email && (
                  <p className="mt-1 text-[11px] text-slate-400">{member.email}</p>
                )}
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500">
                {member.status || 'active'}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default memo(MembersCreativeSection)
