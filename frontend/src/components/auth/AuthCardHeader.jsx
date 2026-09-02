// Only ever rendered for the post-signup OTP-verification step now — login
// and signup each have their own bespoke heading (LoginSplitCard/SignupCard).
const AuthCardHeader = () => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
      OTP Verification
    </p>
    <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900">
      Enter the code we emailed you.
    </h2>
  </div>
)

export default AuthCardHeader
