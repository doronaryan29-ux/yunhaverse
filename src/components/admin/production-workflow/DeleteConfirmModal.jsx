import { memo } from 'react'
import { AppModal } from '../../common'

const DeleteConfirmModal = ({ deleteModal, onClose, submitting, onConfirm }) => (
  <AppModal
    open={Boolean(deleteModal)}
    onClose={onClose}
    eyebrow="Confirm Delete"
    title={
      deleteModal
        ? `Delete ${deleteModal.type === 'request' ? 'Request' : 'Submission'}`
        : 'Delete'
    }
  >
    {deleteModal ? (
      <>
        <p className="text-sm text-slate-600">
          This will permanently remove{' '}
          <span className="font-semibold text-slate-900">
            {deleteModal.title || 'this item'}
          </span>
          . Continue?
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              onConfirm(deleteModal)
              onClose()
            }}
            className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
          >
            {submitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </>
    ) : null}
  </AppModal>
)

export default memo(DeleteConfirmModal)
