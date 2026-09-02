import AuthHeader from './AuthHeader'
import RedirectToast from './RedirectToast'

const ResetPasswordShell = ({ eyebrow, title, subtitle, toast, children }) => (
  <>
    <RedirectToast toast={toast} />
    <main className="min-h-screen bg-[#FFF9FB]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        <AuthHeader onBack={() => window.location.replace('/#/')} />
        <div className="mt-10">
          <div className="auth-entrance nb-surface mx-auto w-full max-w-xl p-6 sm:p-10">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-500">
                {eyebrow}
              </p>
              <h1 className="mt-2 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
              )}
            </div>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </main>
  </>
)

export default ResetPasswordShell
