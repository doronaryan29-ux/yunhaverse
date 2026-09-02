import OtpInputs from './OtpInputs'

// Only ever rendered for the post-signup OTP-verification step now — login
// uses LoginSplitCard and the pre-OTP signup form uses SignupCard.
const AuthForm = ({
  formRef,
  onSubmit,
  otpEmail,
  onCancelOtp,
  otpDigits,
  setOtpDigits,
  otpInputRefs,
  otpSent,
  otpReady,
  onSendOtp,
  loading,
  feedback,
}) => (
  <form ref={formRef} className="mt-6 space-y-4" onSubmit={onSubmit}>
    <label className="block">
      <span className="field-label">Email Address</span>
      <input
        type="email"
        value={otpEmail}
        disabled
        className="nb-input w-full px-4 py-3 text-sm text-slate-700 disabled:text-slate-400"
      />
    </label>
    <button
      type="button"
      className="text-xs font-bold uppercase tracking-[0.3em] text-rose-500"
      onClick={onCancelOtp}
    >
      Not your email? Go back
    </button>

    {otpSent && (
      <OtpInputs
        label="Email OTP"
        helpText="Paste the 6-character code or type it in."
        digits={otpDigits}
        setDigits={setOtpDigits}
        inputRefs={otpInputRefs}
      />
    )}

    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        className="nb-pill flex-1 bg-white px-4 py-3 text-xs uppercase tracking-[0.3em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        onClick={onSendOtp}
        disabled={loading}
      >
        Resend code
      </button>
      <button
        type="submit"
        className="nb-btn flex-1 bg-rose-500 px-4 py-3 text-xs tracking-[0.3em] text-white hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        disabled={loading || !otpSent || !otpReady}
      >
        <span className="flex items-center justify-center gap-2">
          {loading && (
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {loading ? 'Verifying...' : 'Verify & login'}
        </span>
      </button>
    </div>

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
  </form>
)

export default AuthForm
