import { memo } from 'react'
import { TeamMemberRow } from '../../workflow-shared/StaffCards'

const TeamPulseSection = ({ teamMembers, safeString }) => (
  <section
    id="team"
    className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100"
  >
    <h3 className="font-display text-xl font-semibold text-slate-900">Team Pulse</h3>
    <p className="mt-2 text-sm text-slate-600">
      Who is active across creative staff today.
    </p>
    <div className="mt-4 grid gap-3">
      {teamMembers.length === 0 ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-3 text-sm text-slate-600">
          Team roster will appear once admin grants access.
        </div>
      ) : (
        teamMembers.slice(0, 5).map((member) => (
          <TeamMemberRow
            key={member?.id || member?.email}
            name={safeString(
              [member?.first_name, member?.last_name].filter(Boolean).join(' ') ||
                member?.name,
              'Creative Staff',
            )}
            email={safeString(member?.email, 'No email')}
            role={safeString(member?.role, 'Creative')}
          />
        ))
      )}
    </div>
  </section>
)

export default memo(TeamPulseSection)
