import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import AnnouncementBanner from '../components/layout/AnnouncementBanner'
import FloatingParticles from '../components/layout/FloatingParticles'
import Hero from '../components/home/Hero'
import Carousel from '../components/home/Carousel'
import FanartShowcase from '../components/home/FanartShowcase'
import Countdown from '../components/home/Countdown'
import CalendarSection from '../components/home/CalendarSection'
import PlayerBar from '../components/PlayerBar'
import {
  carouselItems,
  countdownEvents,
  fanartItems,
} from '../data/homeData'

const Home = () => (
  <div className="min-h-screen bg-[#FFF0F5] text-slate-800">
    <FloatingParticles />
    <div className="relative z-10 pb-28">
      <AnnouncementBanner />
      <Navbar />

      <main className="flex w-full flex-col gap-12 pb-16 pt-8 sm:gap-16 sm:pt-10">
        <Hero />
        <Carousel items={carouselItems} />
        <FanartShowcase items={fanartItems} />
        <Countdown events={countdownEvents} />
        <CalendarSection />
      </main>

      <Footer />
      <PlayerBar />
    </div>
  </div>
)

export default Home
