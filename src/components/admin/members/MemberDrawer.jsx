import { memo } from 'react'
import { formatDateInManila, formatDateTimeInManila } from '../../../utils/date'

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

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-slate-900/40" onClick={onClose} />
      <aside className="h-full w-full max-w-lg overflow-y-auto bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
              Member Detail
            </p>
            <h4 className="mt-2 font-display text-2xl font-semibold text-slate-900">
              {member.full_name ||
                member.name ||
                [member.first_name, member.last_name].filter(Boolean).join(' ') ||
                [member.firstName, member.lastName].filter(Boolean).join(' ') ||
                member.email ||
                'Unknown'}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600"
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-3 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-900">Email:</span> {member.email || '—'}
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
              : '—'}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Last Login:</span>{' '}
            {member.last_login_at
              ? formatDateTimeInManila(member.last_login_at)
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
              value={notes}
              onChange={(event) => onNoteChange(event.target.value)}
              className="mt-1 h-24 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
              placeholder="Add a note for internal reference"
            />
          </label>
          <button
            type="button"
            onClick={onToggleFlag}
            className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
          >
            {flagged ? 'Remove Flag' : 'Flag Member'}
          </button>
        </div>
      </aside>
    </div>
  )
}

export default memo(MemberDrawer)
