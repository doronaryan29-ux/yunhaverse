import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingParticles from '../components/layout/FloatingParticles'
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
  <div className="min-h-screen bg-[#FFF9FB] text-slate-800">
    <FloatingParticles />
    <div className="relative z-10">
      <Navbar />

      <main className="flex w-full flex-col gap-20 pb-20 pt-14 sm:gap-24 sm:pt-20">
        <Hero />
        <Carousel items={carouselItems} />
        <FanartShowcase items={fanartItems} />
        <Countdown events={countdownEvents} />
        <CalendarSection />
      </main>

      <Footer />
    </div>
  </div>
)

export default Home
