const ErrorModal = ({ message, onClose }) => {
  if (!message) return null

  return (
    <>
      <button
        type="button"
        aria-label="Close error"
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur"
        onClick={onClose}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
              Password issue
            </p>
            <h3 className="font-display text-xl font-semibold text-slate-900">
              Fix your password
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 text-rose-500"
            onClick={onClose}
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-600">{message}</p>
        <button
          type="button"
          className="mt-6 w-full rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5"
          onClick={onClose}
        >
          Got it
        </button>
      </div>
    </>
  )
}

export default ErrorModal
