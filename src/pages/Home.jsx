import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/home/Hero'
import Carousel from '../components/home/Carousel'
import FanartShowcase from '../components/home/FanartShowcase'
import Countdown from '../components/home/Countdown'
import CalendarSection from '../components/home/CalendarSection'
import {
  carouselItems,
  countdownEvents,
  fanartItems,
} from '../data/homeData'

const Home = () => (
  <div className="min-h-screen bg-linear-to-b from-rose-50 via-pink-50 to-amber-50 text-slate-800">
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="absolute right-0 top-80 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
    </div>

    <Navbar />

    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-16 pt-10">
      <Hero />
      <Carousel items={carouselItems} />
      <FanartShowcase items={fanartItems} />
      <Countdown events={countdownEvents} />
      <CalendarSection />
    </main>

    <Footer />
  </div>
)

export default Home
