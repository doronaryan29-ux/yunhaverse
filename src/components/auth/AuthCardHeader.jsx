const AuthCardHeader = ({ isOtpRoute, mode, onSelectMode }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
        {isOtpRoute
          ? 'OTP Verification'
          : mode === 'login'
            ? 'General Login'
            : 'General Signup'}
      </p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900">
        {isOtpRoute
          ? 'Enter the code we emailed you.'
          : mode === 'login'
            ? 'Sign in to continue.'
            : 'Create your member access.'}
      </h2>
    </div>
    {!isOtpRoute && (
      <div className="flex w-full items-center gap-1 rounded-full bg-rose-50 p-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-rose-500 sm:w-auto sm:text-xs sm:tracking-[0.2em]">
        <button
          type="button"
          onClick={() => onSelectMode('login')}
          className={`flex-1 whitespace-nowrap rounded-full px-4 py-2 transition ${
            mode === 'login'
              ? 'bg-rose-500 text-white shadow'
              : 'text-rose-500'
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => onSelectMode('signup')}
          className={`flex-1 whitespace-nowrap rounded-full px-4 py-2 transition ${
            mode === 'signup'
              ? 'bg-rose-500 text-white shadow'
              : 'text-rose-500'
          }`}
        >
          Sign up
        </button>
      </div>
    )}
  </div>
)

export default AuthCardHeader
