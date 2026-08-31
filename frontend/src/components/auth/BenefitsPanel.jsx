const BenefitsPanel = ({ headline, benefits }) => (
  <section className="flex flex-col justify-between rounded-[32px] border border-rose-100 bg-white/70 p-8 shadow-xl shadow-rose-100">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-500">
        General Access
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900">
        {headline}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Sign in with your password or register with a quick email OTP. Every
        account is verified to keep the community safe and exclusive.
      </p>
      <div className="mt-8 space-y-4">
        {benefits.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-white px-4 py-3"
          >
            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-500">
              <i className="fas fa-star" />
            </span>
            <p className="text-sm text-slate-600">{item}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="mt-8 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-xs text-rose-700">
      Use the same email every time to keep your member perks synced.
    </div>
  </section>
)

export default BenefitsPanel
