const PasswordField = ({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
  required,
  compact = false,
}) => (
  <label className="block">
    <span className="field-label">{label}</span>
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`nb-input w-full pr-12 text-sm text-slate-700 ${
          compact ? 'px-3 py-2' : 'px-4 py-3'
        }`}
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
