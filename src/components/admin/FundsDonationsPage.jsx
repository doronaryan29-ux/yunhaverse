import { memo, useRef, useState } from 'react'
import { formatDateInManila } from '../../utils/date'

const FundsDonationsPage = ({
  donations = [],
  loading = false,
  apiBase,
  requesterRole,
  members = [],
  onRefresh,
}) => {
  const items = Array.isArray(donations) ? donations : []
  const memberOptions = Array.isArray(members) ? members : []
  const totalRaised = items.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const formatPeso = (value) =>
    `₱${Number(value || 0).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  const [formOpen, setFormOpen] = useState(false)
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [donationForm, setDonationForm] = useState({
    userId: '',
    name: '',
    email: '',
    amount: '',
    channel: '',
    status: 'completed',
  })
  const [memberQuery, setMemberQuery] = useState('')
  const amountInputRef = useRef(null)
  const [rowEdits, setRowEdits] = useState({})
  const canSubmit = Boolean(apiBase && requesterRole)

  const clearFormStatus = () => setFormStatus({ type: '', message: '' })
  const resetDonationForm = () => {
    setDonationForm({
      userId: '',
      name: '',
      email: '',
      amount: '',
      channel: '',
      status: 'completed',
    })
    setMemberQuery('')
  }

  const resolveMemberName = (member) =>
    (
      member?.full_name ||
      [member?.first_name, member?.last_name].filter(Boolean).join(' ') ||
      [member?.firstName, member?.lastName].filter(Boolean).join(' ') ||
      member?.email ||
      ''
    ).trim()

  const filteredMembers = memberQuery
    ? memberOptions.filter((member) => {
        const haystack = `${resolveMemberName(member)} ${member.email || ''}`
          .trim()
          .toLowerCase()
        return haystack.includes(memberQuery.toLowerCase())
      })
    : memberOptions.slice(0, 6)

  const handleSelectMember = (member) => {
    const resolvedName = resolveMemberName(member)
    setDonationForm((prev) => ({
      ...prev,
      userId: String(member.id),
      name: resolvedName || prev.name,
      email: member.email || prev.email,
    }))
    setMemberQuery('')
    window.requestAnimationFrame(() => {
      amountInputRef.current?.focus()
    })
  }

  const handleCreateDonation = async (event) => {
    event.preventDefault()
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${apiBase}/admin/donations?requesterRole=${encodeURIComponent(requesterRole)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requesterRole,
            userId: donationForm.userId ? Number(donationForm.userId) : null,
            name: donationForm.name.trim() || null,
            email: donationForm.email.trim() || null,
            amount: Number(donationForm.amount || 0),
            channel: donationForm.channel.trim() || null,
            status: donationForm.status,
            currency: 'PHP',
          }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create donation.')
      }
      resetDonationForm()
      setFormStatus({ type: 'success', message: 'Donation created.' })
      setFormOpen(false)
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const updateDonation = async (id, payload) => {
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${apiBase}/admin/donations/${id}?requesterRole=${encodeURIComponent(requesterRole)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requesterRole, ...payload }),
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to update donation.')
      }
      setFormStatus({ type: 'success', message: 'Donation updated.' })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const deleteDonation = async (id) => {
    if (!canSubmit) return
    clearFormStatus()
    setSubmitting(true)
    try {
      const response = await fetch(
        `${apiBase}/admin/donations/${id}/delete?requesterRole=${encodeURIComponent(requesterRole)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      )
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to delete donation.')
      }
      setFormStatus({ type: 'success', message: 'Donation deleted.' })
      onRefresh?.()
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message })
    } finally {
      setSubmitting(false)
    }
  }

  const getEditRow = (item) =>
    rowEdits[item.id] || {
      amount: item.amount ?? '',
      status: item.status || 'completed',
    }

  const isDirty = (item, edit) =>
    String(edit.amount || '') !== String(item.amount || '') ||
    String(edit.status || '') !== String(item.status || '')

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
              Funds & Donations
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
              Funding Overview
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="rounded-2xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
            >
              Add Donation
            </button>
            <button
              type="button"
              className="rounded-2xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              Export Report
            </button>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Raised', value: formatPeso(totalRaised) },
          { label: 'Donations (30d)', value: items.length },
        ].map((stat) => (
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
      </section>

      <section className="rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-lg shadow-rose-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-slate-900">
            Recent Donations
          </h3>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            {items.length} records
          </span>
        </div>

        {formStatus.message && (
          <div
            className={`mb-4 flex items-center justify-between rounded-2xl border px-4 py-3 text-sm ${
              formStatus.type === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            <span>{formStatus.message}</span>
            <button
              type="button"
              onClick={clearFormStatus}
              className="text-xs font-semibold uppercase tracking-[0.2em]"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="mt-5 overflow-hidden rounded-2xl border border-rose-100">
          <div className="grid grid-cols-[1.4fr_0.9fr_1.1fr_1fr_0.9fr] gap-3 bg-rose-50/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>Donor</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Channel</span>
            <span>Date</span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <p className="px-4 py-6 text-sm text-slate-500">Loading donations...</p>
            )}
            {!loading && items.length === 0 && (
              <p className="px-4 py-6 text-sm text-slate-500">No donations yet.</p>
            )}
            {!loading &&
              items.map((item) => {
                const edit = getEditRow(item)
                const dirty = isDirty(item, edit)
                return (
                  <div
                    key={`${item.id}-${item.email || item.name}`}
                    className="grid grid-cols-[1.4fr_0.9fr_1.1fr_1fr_0.9fr] gap-3 border-t border-rose-100 px-4 py-3 text-sm text-slate-700"
                  >
                    <span className="font-semibold text-slate-900">
                      {item.name || item.email || 'Anonymous'}
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={edit.amount}
                      onChange={(event) =>
                        setRowEdits((prev) => ({
                          ...prev,
                          [item.id]: { ...edit, amount: event.target.value },
                        }))
                      }
                      className="rounded-full border border-rose-200 bg-white px-3 py-1 text-[12px] text-slate-700"
                    />
                    <select
                      value={edit.status}
                      onChange={(event) =>
                        setRowEdits((prev) => ({
                          ...prev,
                          [item.id]: { ...edit, status: event.target.value },
                        }))
                      }
                      className="rounded-full border border-rose-200 bg-white px-3 py-1 text-[12px] text-slate-700"
                    >
                      <option value="completed">completed</option>
                      <option value="pending">pending</option>
                      <option value="failed">failed</option>
                    </select>
                    <span>{item.channel || 'Direct'}</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span>
                        {item.created_at ? formatDateInManila(item.created_at) : '—'}
                      </span>
                      <button
                        type="button"
                        disabled={!canSubmit || submitting || !dirty}
                        onClick={() =>
                          updateDonation(item.id, {
                            amount: Number(edit.amount || 0),
                            status: edit.status,
                          })
                        }
                        className="rounded-full border border-rose-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 disabled:opacity-60"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        disabled={!canSubmit || submitting}
                        onClick={() => {
                          if (!window.confirm('Delete this donation?')) return
                          deleteDonation(item.id)
                        }}
                        className="rounded-full border border-rose-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-500 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </section>

      {formOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
                  Donations
                </p>
                <h4 className="mt-2 font-display text-2xl font-semibold text-slate-900">
                  Add Donation
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetDonationForm()
                  setFormOpen(false)
                }}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleCreateDonation}>
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
                      <p className="px-3 py-2 text-xs text-slate-500">
                        No matching members.
                      </p>
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
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetDonationForm()
                    setFormOpen(false)
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
          </div>
        </div>
      )}
    </section>
  )
}

export default memo(FundsDonationsPage)
