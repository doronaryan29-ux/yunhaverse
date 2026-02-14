import { memo } from 'react'
import { AppModal } from '../../common'
import { formatDateInManila } from '../../../utils/date'

const RequestHistoryModal = ({ historyModal, historyItems, historyLoading, onClose }) => (
  <AppModal
    open={Boolean(historyModal)}
    onClose={onClose}
    eyebrow="Request History"
    title={historyModal ? historyModal.title : 'History'}
  >
    {historyLoading ? (
      <p className="text-sm text-slate-600">Loading history...</p>
    ) : historyItems.length === 0 ? (
      <p className="text-sm text-slate-600">No history yet.</p>
    ) : (
      <div className="space-y-3 text-sm text-slate-600">
        {historyItems.map((entry) => (
          <div
            key={entry.id}
            className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">
                {entry.action?.replace('_', ' ') || 'update'}
              </span>
              <span className="text-xs text-slate-400">
                {entry.created_at ? formatDateInManila(entry.created_at) : '—'}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              By {entry.actor_name || 'System'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Stage: {entry.from_stage || '—'} → {entry.to_stage || '—'}
            </p>
            {entry.notes ? (
              <p className="mt-2 text-xs text-slate-500">{entry.notes}</p>
            ) : null}
          </div>
        ))}
      </div>
    )}
  </AppModal>
)

export default memo(RequestHistoryModal)
