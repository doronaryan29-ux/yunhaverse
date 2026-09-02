import PasswordField from './PasswordField'

const SignupCard = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  birthdate,
  setBirthdate,
  password,
  setPassword,
  showPassword,
  onTogglePassword,
  confirmPassword,
  setConfirmPassword,
  showConfirmPassword,
  onToggleConfirmPassword,
  loading,
  feedback,
  onSendOtp,
  onGoogle,
  onSwitchToLogin,
}) => (
  <div className="auth-entrance nb-surface mx-auto w-full max-w-xl p-5 sm:p-7">
    <div className="text-center">
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-rose-500">
        General Access
      </p>
      <h1 className="mt-1 font-display text-xl font-extrabold text-slate-900 sm:text-2xl">
        Join the YUNHAverse
      </h1>
      <p className="mt-1 text-xs text-slate-500">
        Create your member access and never miss a Yunha moment again.
      </p>
    </div>

    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSendOtp()
      }}
      className="mt-4 flex flex-col gap-2.5"
    >
      <div className="grid gap-2.5 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">First Name</span>
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First name"
            className="nb-input w-full px-3 py-2 text-sm text-slate-700"
            required
          />
        </label>
        <label className="block">
          <span className="field-label">Last Name</span>
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Last name"
            className="nb-input w-full px-3 py-2 text-sm text-slate-700"
            required
          />
        </label>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Email Address</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            className="nb-input w-full px-3 py-2 text-sm text-slate-700"
            required
          />
        </label>

        <label className="block">
          <span className="field-label">Birthdate</span>
          <input
            type="date"
            value={birthdate}
            onChange={(event) => setBirthdate(event.target.value)}
            className="nb-input w-full px-3 py-2 text-sm text-slate-700"
            required
          />
        </label>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        <PasswordField
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          show={showPassword}
          onToggle={onTogglePassword}
          placeholder="Create a password"
          required
          compact
        />
        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          show={showConfirmPassword}
          onToggle={onToggleConfirmPassword}
          placeholder="Re-enter password"
          required
          compact
        />
      </div>
      <p className="-mt-1 text-[11px] text-slate-500">
        Password must be at least 8 characters and include 1 uppercase letter.
      </p>

      <button
        type="submit"
        disabled={loading}
        className="nb-btn mt-1 w-full bg-rose-500 px-6 py-2.5 text-sm tracking-[0.2em] text-white hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {loading && (
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
        )}
        {loading ? 'Creating Account...' : 'Create Account'}
        {!loading && (
          <i className="fas fa-arrow-right text-xs" aria-hidden="true" />
        )}
      </button>

      {feedback.message && (
        <p
          className={`text-xs font-semibold ${
            feedback.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
          }`}
          role={feedback.type === 'error' ? 'alert' : undefined}
        >
          {feedback.message}
        </p>
      )}

      <p className="text-center text-[11px] text-slate-500">
        By signing up, you agree to our{' '}
        <a href="#" className="font-bold text-rose-500 hover:text-rose-600">
          Fan Guidelines
        </a>
        .
      </p>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-rose-100" />
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">
          or
        </span>
        <span className="h-px flex-1 bg-rose-100" />
      </div>

      <button
        type="button"
        onClick={onGoogle}
        className="nb-pill flex w-full items-center justify-center gap-3 bg-white px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
      >
        <i className="fab fa-google" />
        Continue with Google
      </button>
    </form>

    <p className="mt-3 text-center text-sm text-slate-500">
      Already part of the universe?{' '}
      <button
        type="button"
        onClick={onSwitchToLogin}
        className="font-bold text-rose-500 transition hover:text-rose-600"
      >
        Login here
      </button>
    </p>
  </div>
)

export default SignupCard
