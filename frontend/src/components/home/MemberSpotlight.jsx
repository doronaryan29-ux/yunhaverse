import { Tooltip } from '../common'

const quickFacts = [
  { label: 'Stage Name', value: 'Yunha (윤하)' },
  { label: 'Birth Name', value: 'Bang Yunha (방윤하)' },
  { label: 'Birth Date', value: 'February 28, 2009' },
  { label: 'Position', value: 'All-rounder' },
  { label: 'MBTI Type', value: 'INFP' },
  { label: 'Nationality', value: 'South Korean' },
]

const MemberSpotlight = () => (
  <section
    id="spotlight"
    className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 scroll-mt-28"
  >
    <div className="text-center">
      <span className="nb-pill inline-flex bg-rose-100 px-4 py-1.5 text-xs uppercase tracking-[0.4em] text-rose-600">
        Meet Yunha
      </span>
      <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900">
        Member Spotlight
      </h2>
    </div>

    <div className="nb-surface grid gap-10 p-6 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center">
      <div className="mx-auto flex flex-col items-center gap-4">
        <img
          src="/image/spotlight_pic.jpg"
          alt="Yunha"
          className="h-40 w-40 rounded-full border-[var(--nb-border-w)] border-[var(--nb-ink)] object-cover sm:h-48 sm:w-48"
        />
        <p className="max-w-xs text-center text-sm italic text-slate-500">
          &ldquo;Every day with UNIS and our fans feels like a dream I never
          want to wake up from.&rdquo;
        </p>
        <div className="flex gap-3">
          <Tooltip label="Follow on Instagram">
            <a
              href="https://www.instagram.com/yunhaverseph"
              target="_blank"
              rel="noreferrer"
              aria-label="Follow on Instagram"
              className="nb-pill flex h-10 w-10 items-center justify-center bg-white text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              <i className="fab fa-instagram" />
            </a>
          </Tooltip>
          <Tooltip label="Follow on Twitter/X">
            <a
              href="https://x.com/YunhaversePH"
              target="_blank"
              rel="noreferrer"
              aria-label="Follow on Twitter/X"
              className="nb-pill flex h-10 w-10 items-center justify-center bg-white text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              <i className="fab fa-twitter" />
            </a>
          </Tooltip>
          <Tooltip label="See more updates">
            <a
              href="#spotlight"
              aria-label="See more updates about Yunha"
              className="nb-pill flex h-10 w-10 items-center justify-center bg-white text-rose-500 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              <i className="fas fa-heart" />
            </a>
          </Tooltip>
        </div>
      </div>

      <div
        className="nb-chip border-l-8 bg-rose-50/60 p-6"
        style={{ borderLeftColor: 'var(--brand-500)' }}
      >
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-rose-500">
          Quick Facts
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {quickFacts.map((fact) => (
            <div key={fact.label}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {fact.label}
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default MemberSpotlight
