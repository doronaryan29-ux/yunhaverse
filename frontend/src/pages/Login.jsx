import AuthCardHeader from '../components/auth/AuthCardHeader'
import AuthForm from '../components/auth/AuthForm'
import AuthHeader from '../components/auth/AuthHeader'
import LoginSplitCard from '../components/auth/LoginSplitCard'
import RedirectToast from '../components/auth/RedirectToast'
import SignupCard from '../components/auth/SignupCard'
import useAuthFlow from '../hooks/useAuthFlow'
import { API_BASE } from '../utils/apiBase'

const isAdminRole = (role) => String(role || '').trim().toLowerCase() === 'admin'

const Login = () => {
  const apiBase = API_BASE
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
    otpDigits,
    setOtpDigits,
    otpInputRefs,
    authFormRef,
    otpReady,
    toast,
    isOtpRoute,
    otpEmail,
    handleGoogleRedirect,
    handleSendOtp,
    handleModeSelect,
    handleCancelOtp,
    handleAuthSubmit,
  } = useAuthFlow({ apiBase, isAdminRole })

  return (
    <>
      <RedirectToast toast={toast} />
      <main className="min-h-screen bg-[#FFF9FB]">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-10">
          <AuthHeader onBack={() => window.location.replace('/#/')} />

          {mode === 'login' && !isOtpRoute ? (
            <div className="mt-10">
              <LoginSplitCard
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((prev) => !prev)}
                loading={loading}
                feedback={feedback}
                onSubmit={handleAuthSubmit}
                onGoogle={handleGoogleRedirect}
                onSwitchToSignup={() => handleModeSelect('signup')}
              />
            </div>
          ) : isOtpRoute ? (
            <div className="mt-10">
              <div className="auth-entrance nb-surface mx-auto w-full max-w-xl p-6 sm:p-10">
                <AuthCardHeader />
                <AuthForm
                  formRef={authFormRef}
                  onSubmit={handleAuthSubmit}
                  otpEmail={otpEmail}
                  onCancelOtp={handleCancelOtp}
                  otpDigits={otpDigits}
                  setOtpDigits={setOtpDigits}
                  otpInputRefs={otpInputRefs}
                  otpSent={otpSent}
                  otpReady={otpReady}
                  onSendOtp={handleSendOtp}
                  loading={loading}
                  feedback={feedback}
                />
              </div>
            </div>
          ) : (
            <div className="mt-10">
              <SignupCard
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                birthdate={birthdate}
                setBirthdate={setBirthdate}
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
                loading={loading}
                feedback={feedback}
                onSendOtp={handleSendOtp}
                onGoogle={handleGoogleRedirect}
                onSwitchToLogin={() => handleModeSelect('login')}
              />
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default Login
