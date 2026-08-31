import { memo } from 'react'
import { AppModal } from '../../common'

const StatusModal = ({ statusModal, onClose }) => (
  <AppModal
    open={Boolean(statusModal)}
    onClose={onClose}
    eyebrow={statusModal?.type === 'error' ? 'Action Failed' : 'Success'}
    title={statusModal?.title || 'Update'}
  >
    <p className="text-sm text-slate-600">{statusModal?.message}</p>
    <div className="mt-6 flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition ${
          statusModal?.type === 'error'
            ? 'border border-rose-200 text-rose-500 hover:bg-rose-50'
            : 'bg-rose-500 text-white shadow-lg shadow-rose-200 hover:-translate-y-0.5'
        }`}
      >
        {statusModal?.type === 'error' ? 'Dismiss' : 'Done'}
      </button>
    </div>
  </AppModal>
)

export default memo(StatusModal)
