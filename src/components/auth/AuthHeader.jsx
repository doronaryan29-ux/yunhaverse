const AuthHeader = ({ onBack }) => (
  <header className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <img
        src="/image/logoyunha.png"
        alt="Yunha Logo"
        className="h-11 w-11 rounded-full object-cover shadow"
      />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
          General Access
        </p>
        <h1 className="font-display text-2xl font-semibold text-slate-900">
          YUNHAverse Portal
        </h1>
      </div>
    </div>
    <button
      type="button"
      className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
      onClick={onBack}
    >
      Back to home
    </button>
  </header>
)

export default AuthHeader
