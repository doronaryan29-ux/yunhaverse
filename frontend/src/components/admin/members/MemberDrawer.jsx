import { memo } from 'react'
import { formatDateInManila, formatDateTimeInManila } from '../../../utils/date'
import { AppModal } from '../../common'

const MemberDrawer = ({
  member,
  onClose,
  canEdit,
  canAdmin,
  notes,
  onNoteChange,
  flagged,
  onToggleFlag,
}) => {
  if (!member) return null

  const memberName =
    member.full_name ||
    member.name ||
    [member.first_name, member.last_name].filter(Boolean).join(' ') ||
    [member.firstName, member.lastName].filter(Boolean).join(' ') ||
    member.email ||
    'Unknown'

  return (
    <AppModal
      open={Boolean(member)}
      onClose={onClose}
      variant="drawer-right"
      eyebrow="Member Detail"
      title={memberName}
    >
      <div className="space-y-4">
        <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <div className="grid gap-2 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-slate-900">Email:</span>{' '}
              {member.email || '-'}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Role:</span>{' '}
              {member.role || 'member'}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Status:</span>{' '}
              {member.status || 'active'}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Joined:</span>{' '}
              {member.created_at || member.joinedAt
                ? formatDateInManila(member.created_at || member.joinedAt)
                : '-'}
            </p>
            <p className="sm:col-span-2">
              <span className="font-semibold text-slate-900">Last Login:</span>{' '}
              {member.last_login_at
                ? formatDateTimeInManila(member.last_login_at)
                : '-'}
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Actions
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={!canAdmin}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition motion-safe:active:scale-[0.97] hover:bg-slate-50 disabled:opacity-50"
            >
              Reset Password
            </button>
            <button
              type="button"
              disabled={!canEdit}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition motion-safe:active:scale-[0.97] hover:bg-slate-50 disabled:opacity-50"
            >
              Change Role
            </button>
            <button
              type="button"
              disabled={!canEdit}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition motion-safe:active:scale-[0.97] hover:bg-slate-50 disabled:opacity-50"
            >
              Deactivate
            </button>
            <button
              type="button"
              disabled={!canEdit}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition motion-safe:active:scale-[0.97] hover:bg-slate-50 disabled:opacity-50"
            >
              Resend Verification
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Notes / Flags
          </p>
          <label className="mt-3 block text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
            Internal Note
            <textarea
              value={notes}
              onChange={(event) => onNoteChange(event.target.value)}
              className="mt-1 h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none"
              placeholder="Add a note for internal reference"
            />
          </label>
          <button
            type="button"
            onClick={onToggleFlag}
            className="mt-3 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition motion-safe:active:scale-[0.97] hover:bg-slate-50"
          >
            {flagged ? 'Remove Flag' : 'Flag Member'}
          </button>
        </section>
      </div>
    </AppModal>
  )
}

export default memo(MemberDrawer)
