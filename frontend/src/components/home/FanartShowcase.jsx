const FanartShowcase = ({ items }) => (
  <section id="gallery" className="flex flex-col gap-8 scroll-mt-28">
    <div className="text-center">
      <span className="nb-pill inline-flex bg-rose-100 px-4 py-1.5 text-xs uppercase tracking-[0.4em] text-rose-600">
        Fan Creativity
      </span>
      <h2 className="mt-4 font-display text-3xl font-extrabold text-slate-900">
        Fan Art Showcase
      </h2>
    </div>
    <div className="mx-auto w-full max-w-7xl px-6">
      <div className="grid justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="nb-surface nb-hover-lift group w-full max-w-[380px] overflow-hidden"
          >
            <div className="relative h-56 overflow-hidden border-b-[var(--nb-border-w)] border-[var(--nb-ink)]">
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="space-y-3 p-6">
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-500">Artist: {item.artist}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                <a
                  href="#"
                  className="nb-pill flex items-center gap-1.5 bg-white px-3 py-1.5 hover:bg-rose-50"
                >
                  <i className="fab fa-instagram" /> Instagram
                </a>
                <a
                  href="#"
                  className="nb-pill flex items-center gap-1.5 bg-white px-3 py-1.5 hover:bg-rose-50"
                >
                  <i className="fab fa-twitter" /> Twitter
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default FanartShowcase
