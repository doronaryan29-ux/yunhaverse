import { memo } from 'react'
import { AppModal } from '../../common'

const DonationFormModal = ({
  open,
  onClose,
  donationForm,
  setDonationForm,
  memberQuery,
  setMemberQuery,
  filteredMembers,
  resolveMemberName,
  handleSelectMember,
  amountInputRef,
  submitting,
  canSubmit,
  onSubmit,
  onReset,
}) => (
  <AppModal
    open={open}
    onClose={() => {
      onReset()
      onClose()
    }}
    variant="drawer-right"
    eyebrow="Donations"
    title="Add Donation"
  >
    <form className="space-y-4" onSubmit={onSubmit}>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Member (Search)
        <input
          type="text"
          value={memberQuery}
          onChange={(event) => setMemberQuery(event.target.value)}
          placeholder="Search by name or email"
          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        />
        {memberQuery && (
          <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-rose-100 bg-white">
            {filteredMembers.length === 0 && (
              <p className="px-3 py-2 text-xs text-slate-500">No matching members.</p>
            )}
            {filteredMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => handleSelectMember(member)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-slate-700 hover:bg-rose-50"
              >
                <span>{resolveMemberName(member) || member.email}</span>
                <span className="text-[10px] text-slate-400">#{member.id}</span>
              </button>
            ))}
          </div>
        )}
      </label>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Name
        <input
          type="text"
          value={donationForm.name}
          onChange={(event) =>
            setDonationForm((prev) => ({ ...prev, name: event.target.value }))
          }
          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        />
      </label>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Email
        <input
          type="email"
          value={donationForm.email}
          onChange={(event) =>
            setDonationForm((prev) => ({ ...prev, email: event.target.value }))
          }
          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Amount (PHP)
          <input
            type="number"
            min="1"
            required
            ref={amountInputRef}
            value={donationForm.amount}
            onChange={(event) =>
              setDonationForm((prev) => ({ ...prev, amount: event.target.value }))
            }
            className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Status
          <select
            value={donationForm.status}
            onChange={(event) =>
              setDonationForm((prev) => ({ ...prev, status: event.target.value }))
            }
            className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          >
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </label>
      </div>
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Channel
        <input
          type="text"
          value={donationForm.channel}
          onChange={(event) =>
            setDonationForm((prev) => ({ ...prev, channel: event.target.value }))
          }
          className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        />
      </label>
      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            onReset()
            onClose()
          }}
          className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
        >
          {submitting ? 'Saving...' : 'Create Donation'}
        </button>
      </div>
    </form>
  </AppModal>
)

export default memo(DonationFormModal)
