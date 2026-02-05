import OtpInputs from './OtpInputs'

const ResetPasswordModal = ({
  open,
  onClose,
  step,
  onSubmit,
  formRef,
  resetEmail,
  setResetEmail,
  resetOtpDigits,
  setResetOtpDigits,
  resetOtpRefs,
  resetPassword,
  setResetPassword,
  resetConfirm,
  setResetConfirm,
  resetFeedback,
  resetLoading,
}) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
              Password Reset
            </p>
            <h4 className="mt-2 font-display text-2xl font-semibold text-slate-900">
              {step === 'request'
                ? 'Request a reset code'
                : step === 'verify'
                  ? 'Verify your code'
                  : 'Set a new password'}
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600"
          >
            Close
          </button>
        </div>

        <form
          ref={formRef}
          data-reset-form
          className="mt-6 space-y-5"
          onSubmit={onSubmit}
        >
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Email
            <input
              type="email"
              value={resetEmail}
              onChange={(event) => setResetEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
              required
            />
          </label>

          {step !== 'request' && (
            <OtpInputs
              label="Reset Code"
              helpText="Paste the 6-character code or type it in."
              digits={resetOtpDigits}
              setDigits={setResetOtpDigits}
              inputRefs={resetOtpRefs}
            />
          )}

          {step === 'reset' && (
            <>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                New Password
                <input
                  type="password"
                  value={resetPassword}
                  onChange={(event) => setResetPassword(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Confirm Password
                <input
                  type="password"
                  value={resetConfirm}
                  onChange={(event) => setResetConfirm(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
                />
              </label>
            </>
          )}

          {resetFeedback.message && (
            <p
              className={`text-xs ${
                resetFeedback.type === 'success'
                  ? 'text-emerald-600'
                  : 'text-rose-500'
              }`}
            >
              {resetFeedback.message}
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resetLoading}
              className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 disabled:opacity-70"
            >
              {resetLoading
                ? 'Working...'
                : step === 'request'
                  ? 'Send Code'
                  : step === 'verify'
                    ? 'Verify Code'
                    : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordModal
