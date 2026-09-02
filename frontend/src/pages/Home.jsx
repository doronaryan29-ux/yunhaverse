import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingParticles from '../components/layout/FloatingParticles'
import Hero from '../components/home/Hero'
import MemberSpotlight from '../components/home/MemberSpotlight'
import Countdown from '../components/home/Countdown'
import LatestEvents from '../components/home/LatestEvents'
import { countdownEvents } from '../data/homeData'
import { latestEvents } from '../data/eventsData'

const Home = () => (
  <div className="min-h-screen bg-[#FFF9FB] text-slate-800">
    <FloatingParticles />
    <div className="relative z-10">
      <Navbar />

      <main className="flex w-full flex-col gap-20 pb-20 pt-14 sm:gap-24 sm:pt-20">
        <Hero />
        <Countdown events={countdownEvents} />
        <LatestEvents events={latestEvents} />
        <MemberSpotlight />
      </main>

      <Footer />
    </div>
  </div>
)

export default Home
