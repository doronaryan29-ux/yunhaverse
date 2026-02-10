import { AppModal } from '../common'

const ErrorModal = ({ message, onClose }) => (
  <AppModal
    open={Boolean(message)}
    onClose={onClose}
    eyebrow="Login Issue"
    title="Fix your sign-in"
  >
    <p className="text-sm text-slate-600">{message}</p>
    <div className="mt-6 flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
      >
        Got it
      </button>
    </div>
  </AppModal>
)

export default ErrorModal
