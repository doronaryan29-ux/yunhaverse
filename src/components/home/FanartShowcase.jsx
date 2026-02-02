const FanartShowcase = ({ items }) => (
  <section className="flex flex-col gap-8">
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.5em] text-rose-500">
        Fan Creativity
      </p>
      <h2 className="font-display text-3xl font-semibold text-slate-900">
        Fan Art Showcase
      </h2>
    </div>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="group overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-lg transition hover:-translate-y-1"
        >
          <div className="relative h-56 overflow-hidden">
            <img
              src={item.src}
              alt={item.alt}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="space-y-3 p-6">
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="text-sm text-slate-500">Artist: {item.artist}</p>
            <div className="flex items-center gap-3 text-sm font-semibold text-rose-500">
              <a href="#" className="flex items-center gap-2 hover:text-rose-600">
                <i className="fab fa-instagram" /> Instagram
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-rose-600">
                <i className="fab fa-twitter" /> Twitter
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
)

export default FanartShowcase
