const PasswordField = ({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
  required,
}) => (
  <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
    {label}
    <div className="relative mt-2">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 pr-12 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        required={required}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={show ? `Hide ${label}` : `Show ${label}`}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 transition hover:text-rose-500"
      >
        {show ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17.94 17.94A10.92 10.92 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.07-2.95 3.05-5.36 5.6-6.74" />
            <path d="M9.9 4.24A10.5 10.5 0 0 1 12 4c5 0 9.27 3.11 11 8a11.05 11.05 0 0 1-2.6 4.03" />
            <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
            <path d="M1 1l22 22" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  </label>
)

export default PasswordField
