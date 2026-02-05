import AuthCardHeader from '../components/auth/AuthCardHeader'
import AuthForm from '../components/auth/AuthForm'
import AuthHeader from '../components/auth/AuthHeader'
import BenefitsPanel from '../components/auth/BenefitsPanel'
import ErrorModal from '../components/auth/ErrorModal'
import ResetPasswordModal from '../components/auth/ResetPasswordModal'
import ToastBanner from '../components/auth/ToastBanner'
import useAuthFlow from '../hooks/useAuthFlow'

const benefits = [
  'Early access to ticket drops and preregistration slots.',
  'Members-only merch and fanart spotlight features.',
  'Priority RSVP confirmations for Yunha gatherings.',
  'Direct updates delivered straight to your inbox.',
]
const isAdminRole = (role) => String(role || '').trim().toLowerCase() === 'admin'

const Login = () => {
  const apiBase = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'
  const {
    mode,
    email,
    setEmail,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    birthdate,
    setBirthdate,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    otpSent,
    feedback,
    loading,
    errorModal,
    setErrorModal,
    otpDigits,
    setOtpDigits,
    otpInputRefs,
    authFormRef,
    otpReady,
                setExistingSession,
    resetOpen,
    resetStep,
    setResetStep,
    resetEmail,
    setResetEmail,
    resetOtpDigits,
    setResetOtpDigits,
    resetOtpRefs,
    resetFormRef,
    resetToken,
    setResetToken,
    resetPassword,
    setResetPassword,
    resetConfirm,
    setResetConfirm,
    resetLoading,
    setResetLoading,
    resetFeedback,
    setResetFeedback,
    toast,
    isOtpRoute,
    headline,
    otpEmail,
    openToast,
    handleGoogleRedirect,
    handleSendOtp,
    handleModeSelect,
    handleCancelOtp,
    handleAuthSubmit,
    openResetModal,
    closeResetModal,
    passwordResetValid,
    passwordResetMatches,
  } = useAuthFlow({ apiBase, isAdminRole })

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-100">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
          <AuthHeader onBack={() => window.location.replace('/#/')} />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <BenefitsPanel headline={headline} benefits={benefits} />

            <section className="rounded-[32px] border border-rose-100 bg-white p-8 shadow-2xl shadow-rose-100">
              <AuthCardHeader
                isOtpRoute={isOtpRoute}
                mode={mode}
                onSelectMode={handleModeSelect}
              />
              <AuthForm
                formRef={authFormRef}
                onSubmit={handleAuthSubmit}
                mode={mode}
                isOtpRoute={isOtpRoute}
                email={email}
                setEmail={setEmail}
                otpEmail={otpEmail}
                onCancelOtp={handleCancelOtp}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((prev) => !prev)}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                showConfirmPassword={showConfirmPassword}
                onToggleConfirmPassword={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                birthdate={birthdate}
                setBirthdate={setBirthdate}
                otpDigits={otpDigits}
                setOtpDigits={setOtpDigits}
                otpInputRefs={otpInputRefs}
                otpSent={otpSent}
                otpReady={otpReady}
                onOpenReset={openResetModal}
                onSendOtp={handleSendOtp}
                onGoogle={handleGoogleRedirect}
                loading={loading}
                feedback={feedback}
              />
            </section>
          </div>
        </div>
        <ErrorModal message={errorModal} onClose={() => setErrorModal('')} />
        <ToastBanner toast={toast} />
      </main>

      <ResetPasswordModal
        open={resetOpen}
        onClose={closeResetModal}
        step={resetStep}
        onSubmit={async (event) => {
          event.preventDefault()
          setResetFeedback({ type: '', message: '' })
          setResetLoading(true)
          try {
            if (resetStep === 'request') {
              if (!resetEmail) {
                throw new Error('Email is required.')
              }
              const response = await fetch(`${apiBase}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail }),
              })
              const data = await response.json()
              if (!response.ok) {
                throw new Error(data?.message || 'Failed to send OTP.')
              }
              setResetFeedback({ type: 'success', message: 'OTP sent.' })
              openToast({
                type: 'success',
                message: 'Reset code sent to your email.',
              })
              setResetStep('verify')
              return
            }

            if (resetStep === 'verify') {
              const otpValue = resetOtpDigits.join('')
              if (!otpValue || otpValue.length < 6) {
                throw new Error('Enter the 6-character code.')
              }
              const response = await fetch(`${apiBase}/auth/verify-reset-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail, otp: otpValue }),
              })
              const data = await response.json()
              if (!response.ok) {
                throw new Error(data?.message || 'Invalid OTP.')
              }
              setResetToken(data.resetToken || '')
              setResetFeedback({ type: 'success', message: 'OTP verified.' })
              openToast({
                type: 'success',
                message: 'Code verified. Set your new password.',
              })
              setResetStep('reset')
              return
            }

            if (!passwordResetValid) {
              throw new Error(
                'Password must be at least 8 characters and include 1 uppercase letter.',
              )
            }
            if (!passwordResetMatches) {
              throw new Error('Passwords do not match.')
            }
            const response = await fetch(`${apiBase}/auth/reset-password`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: resetEmail,
                resetToken,
                password: resetPassword,
              }),
            })
            const data = await response.json()
            if (!response.ok) {
              throw new Error(data?.message || 'Failed to reset password.')
            }
            setResetFeedback({
              type: 'success',
              message: 'Password reset. You can now log in.',
            })
            openToast({
              type: 'success',
              message: 'Password reset. You can log in now.',
            })
            closeResetModal()
          } catch (error) {
            setResetFeedback({
              type: 'error',
              message: error.message || 'Reset failed.',
            })
          } finally {
            setResetLoading(false)
          }
        }}
        formRef={resetFormRef}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        resetOtpDigits={resetOtpDigits}
        setResetOtpDigits={setResetOtpDigits}
        resetOtpRefs={resetOtpRefs}
        resetPassword={resetPassword}
        setResetPassword={setResetPassword}
        resetConfirm={resetConfirm}
        setResetConfirm={setResetConfirm}
        resetFeedback={resetFeedback}
        resetLoading={resetLoading}
      />
    </>
  )
}

export default Login
