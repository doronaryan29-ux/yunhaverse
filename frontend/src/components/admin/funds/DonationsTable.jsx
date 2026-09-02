import { memo } from 'react'
import { formatDateInManila } from '../../../utils/date'

const DonationsTable = ({
  items,
  loading,
  canSubmit,
  submitting,
  getEditRow,
  isDirty,
  setRowEdits,
  updateDonation,
  onRequestDelete,
}) => (
  <section className="rounded-xl border border-slate-200 bg-white p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-base font-semibold text-slate-900">
        Recent Donations
      </h3>
      <span className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
        {items.length} records
      </span>
    </div>

    <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
      <div className="min-w-[860px]">
        <div className="grid grid-cols-[1.4fr_0.9fr_1.1fr_1fr_0.9fr] gap-3 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          <span>Donor</span>
          <span>Amount</span>
          <span>Status</span>
          <span>Channel</span>
          <span>Date</span>
        </div>
        <div className="max-h-96 overflow-y-auto">
        {loading && <p className="px-4 py-6 text-sm text-slate-500">Loading donations...</p>}
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
                className="grid grid-cols-[1.4fr_0.9fr_1.1fr_1fr_0.9fr] gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-700"
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
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-700"
                />
                <select
                  value={edit.status}
                  onChange={(event) =>
                    setRowEdits((prev) => ({
                      ...prev,
                      [item.id]: { ...edit, status: event.target.value },
                    }))
                  }
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[12px] text-slate-700"
                >
                  <option value="completed">completed</option>
                  <option value="pending">pending</option>
                  <option value="failed">failed</option>
                </select>
                <span>{item.channel || 'Direct'}</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span>{item.created_at ? formatDateInManila(item.created_at) : '—'}</span>
                  <button
                    type="button"
                    disabled={!canSubmit || submitting || !dirty}
                    onClick={() =>
                      updateDonation(item.id, {
                        amount: Number(edit.amount || 0),
                        status: edit.status,
                      })
                    }
                    className="rounded-full border border-slate-200 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-600 disabled:opacity-60"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    disabled={!canSubmit || submitting}
                    onClick={() => onRequestDelete(item)}
                    className="rounded-full border border-red-200 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-red-600 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  </section>
)

export default memo(DonationsTable)
