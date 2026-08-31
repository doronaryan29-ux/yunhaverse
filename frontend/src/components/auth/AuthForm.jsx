import OtpInputs from './OtpInputs'
import PasswordField from './PasswordField'

const AuthForm = ({
  formRef,
  onSubmit,
  mode,
  isOtpRoute,
  email,
  setEmail,
  otpEmail,
  onCancelOtp,
  password,
  setPassword,
  showPassword,
  onTogglePassword,
  confirmPassword,
  setConfirmPassword,
  showConfirmPassword,
  onToggleConfirmPassword,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  birthdate,
  setBirthdate,
  otpDigits,
  setOtpDigits,
  otpInputRefs,
  otpSent,
  otpReady,
  onOpenReset,
  onSendOtp,
  onGoogle,
  loading,
  feedback,
}) => (
  <form ref={formRef} className="mt-6 space-y-4" onSubmit={onSubmit}>
    <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
      Email address
      <input
        type="email"
        value={isOtpRoute ? otpEmail : email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@email.com"
        disabled={isOtpRoute}
        className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
        required
      />
    </label>
    {isOtpRoute && (
      <button
        type="button"
        className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500"
        onClick={onCancelOtp}
      >
        Not your email? Go back
      </button>
    )}

    {!isOtpRoute && mode === 'login' && (
      <div className="space-y-2">
        <PasswordField
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          show={showPassword}
          onToggle={onTogglePassword}
          placeholder="Your password"
          required
        />
        <button
          type="button"
          onClick={onOpenReset}
          className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500"
        >
          Forgot password?
        </button>
      </div>
    )}

    {!isOtpRoute && mode === 'signup' && (
      <>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            First name
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="First name"
              className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
              required
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Last name
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Last name"
              className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
              required
            />
          </label>
        </div>
        <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Birthdate
          <input
            type="date"
            value={birthdate}
            onChange={(event) => setBirthdate(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
            required
          />
        </label>
        <PasswordField
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          show={showPassword}
          onToggle={onTogglePassword}
          placeholder="Create a password"
          required
        />
        <PasswordField
          label="Confirm password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          show={showConfirmPassword}
          onToggle={onToggleConfirmPassword}
          placeholder="Re-enter password"
          required
        />
        <p className="text-xs text-slate-500">
          Password must be at least 8 characters and include 1 uppercase letter.
        </p>
      </>
    )}

    {isOtpRoute && otpSent && (
      <OtpInputs
        label="Email OTP"
        helpText="Paste the 6-character code or type it in."
        digits={otpDigits}
        setDigits={setOtpDigits}
        inputRefs={otpInputRefs}
      />
    )}

    <div className="flex flex-wrap gap-3">
      {mode === 'login' && !isOtpRoute ? (
        <button
          type="submit"
          className="flex-1 rounded-2xl border border-rose-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Working...' : 'Login'}
        </button>
      ) : (
        <>
          <button
            type="button"
            className="flex-1 rounded-2xl border border-rose-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={onSendOtp}
            disabled={loading}
          >
            {isOtpRoute ? 'Resend code' : 'Register'}
          </button>
          {isOtpRoute && (
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-rose-500 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading || !otpSent || !otpReady}
            >
              {loading ? 'Working...' : 'Verify & login'}
            </button>
          )}
        </>
      )}
    </div>

    {feedback.message && (
      <p
        className={`text-xs ${
          feedback.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
        }`}
      >
        {feedback.message}
      </p>
    )}

    {!isOtpRoute && (
      <>
        <div className="mt-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-rose-100" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            or
          </span>
          <span className="h-px flex-1 bg-rose-100" />
        </div>

        <button
          type="button"
          onClick={onGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-rose-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
        >
          <span className="text-base">
            <i className="fab fa-google" />
          </span>
          Continue with Google
        </button>

        <p className="text-xs text-slate-500">
          Google sign-in is optional, but it keeps logins fast and reduces OTP
          spam for returning members.
        </p>
      </>
    )}
  </form>
)

export default AuthForm
