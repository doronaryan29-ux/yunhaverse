import { memo } from 'react'
import { AppModal } from '../../common'

const LogoutConfirmModal = ({ open, onClose, onConfirm }) => (
  <AppModal open={open} onClose={onClose} eyebrow="Confirm Logout" title="Sign out of staff portal?">
    <p className="text-sm text-slate-600">You will be returned to the login screen.</p>
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
        onClick={onConfirm}
        className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
      >
        Logout
      </button>
    </div>
  </AppModal>
)

export default memo(LogoutConfirmModal)
