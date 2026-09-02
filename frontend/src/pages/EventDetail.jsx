import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingParticles from '../components/layout/FloatingParticles'
import { getEventById } from '../data/eventsData'

const EventDetail = ({ eventId }) => {
  const event = getEventById(eventId)

  if (!event) {
    return (
      <div className="min-h-screen bg-[#FFF9FB] text-slate-800">
        <FloatingParticles />
        <div className="relative z-10">
          <Navbar />
          <main className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 px-6 py-24 text-center">
            <h1 className="font-display text-3xl font-extrabold text-slate-900">
              Event not found
            </h1>
            <p className="text-slate-500">
              This event may have been removed or the link is incorrect.
            </p>
            <a href="/#/" className="nb-pill inline-flex bg-white px-5 py-2 text-xs uppercase tracking-[0.2em] text-rose-500">
              Back to home
            </a>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF9FB] text-slate-800">
      <FloatingParticles />
      <div className="relative z-10">
        <Navbar />
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-14">
          <a
            href="/#/"
            className="nb-pill inline-flex w-fit items-center gap-2 bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-rose-500"
          >
            <i className="fas fa-arrow-left" aria-hidden="true" />
            Back to home
          </a>

          <article className="nb-surface overflow-hidden">
            <div className="relative h-64 overflow-hidden border-b-[var(--nb-border-w)] border-[var(--nb-ink)] sm:h-80">
              <img
                src={event.image}
                alt={event.title}
                className="h-full w-full object-cover"
              />
              {event.isPlaceholder && (
                <span className="nb-pill absolute right-4 top-4 bg-white px-3 py-1 text-xs uppercase tracking-[0.15em] text-slate-500">
                  Placeholder Content
                </span>
              )}
            </div>

            <div className="flex flex-col gap-6 p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="nb-pill inline-flex bg-rose-100 px-3 py-1 text-xs uppercase tracking-[0.15em] text-rose-600">
                  {event.date}
                </span>
                <span className="nb-pill inline-flex bg-white px-3 py-1 text-xs uppercase tracking-[0.15em] text-slate-500">
                  <i className="fas fa-location-dot mr-1.5" aria-hidden="true" />
                  {event.location}
                </span>
              </div>

              <h1 className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">
                {event.title}
              </h1>

              <p className="text-base leading-relaxed text-slate-600">
                {event.summary}
              </p>

              {!event.isPlaceholder && (
                <div className="nb-chip flex flex-col gap-4 bg-rose-50/60 p-5 text-sm text-slate-600">
                  <p className="font-bold uppercase tracking-[0.15em] text-rose-500">
                    Full recap — content pending
                  </p>
                  <p>
                    This is where the complete original post goes. Paste the
                    full caption text here to fill in the sections below —
                    nothing has been invented in the meantime.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="nb-chip bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                        Staff Credits
                      </p>
                      <p className="mt-2 text-slate-400">
                        Add the staff/organizing team shoutout here.
                      </p>
                    </div>
                    <div className="nb-chip bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                        Sponsor Shoutouts
                      </p>
                      <p className="mt-2 text-slate-400">
                        Add sponsor names/logos here.
                      </p>
                    </div>
                    <div className="nb-chip bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                        Hashtags
                      </p>
                      <p className="mt-2 text-slate-400">
                        Add the event hashtags here.
                      </p>
                    </div>
                    <div className="nb-chip bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                        Photo Gallery
                      </p>
                      <p className="mt-2 text-slate-400">
                        Add the Google Drive photo link here.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {event.isPlaceholder && (
                <div className="nb-chip bg-amber-50 p-5 text-sm text-amber-700">
                  This event card is filler content. Replace the title, date,
                  location, and description with real event details when
                  ready.
                </div>
              )}
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default EventDetail
