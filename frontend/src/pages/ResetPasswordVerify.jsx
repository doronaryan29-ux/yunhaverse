import { useEffect, useRef, useState } from 'react'
import OtpInputs from '../components/auth/OtpInputs'
import ResetPasswordShell from '../components/auth/ResetPasswordShell'
import useResetPasswordFlow, { clearResetFlow } from '../hooks/useResetPasswordFlow'
import { API_BASE } from '../utils/apiBase'

const ResetPasswordVerify = () => {
  const { storedEmail, loading, feedback, toast, verifyCode } =
    useResetPasswordFlow({ apiBase: API_BASE })
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(''))
  const otpInputRefs = useRef([])
  const formRef = useRef(null)

  useEffect(() => {
    if (!storedEmail) {
      window.location.hash = '#/forgot-password'
    }
  }, [storedEmail])

  useEffect(() => {
    otpInputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (otpDigits.every((digit) => digit) && !loading) {
      formRef.current?.requestSubmit()
    }
  }, [otpDigits, loading])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const otp = otpDigits.join('')
    if (otp.length < 6) return
    const ok = await verifyCode(storedEmail, otp)
    if (ok) {
      window.location.hash = '#/forgot-password/new'
    }
  }

  const handleCancel = () => {
    clearResetFlow()
    window.location.hash = '#/login'
  }

  if (!storedEmail) {
    return null
  }

  return (
    <ResetPasswordShell
      eyebrow="Password Reset"
      title="Verify your code"
      subtitle={`Enter the 6-character code we emailed to ${storedEmail}.`}
      toast={toast}
    >
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <OtpInputs
          label="Reset Code"
          helpText="Paste the 6-character code or type it in."
          digits={otpDigits}
          setDigits={setOtpDigits}
          inputRefs={otpInputRefs}
        />

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

        <button
          type="submit"
          disabled={loading || otpDigits.some((digit) => !digit)}
          className="nb-btn mt-2 w-full bg-rose-500 px-6 py-3 text-sm tracking-[0.2em] text-white hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {loading && (
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 transition hover:text-rose-500"
        >
          Cancel
        </button>
      </form>
    </ResetPasswordShell>
  )
}

export default ResetPasswordVerify
