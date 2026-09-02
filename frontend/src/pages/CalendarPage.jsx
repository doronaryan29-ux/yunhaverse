import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingParticles from '../components/layout/FloatingParticles'
import CalendarSection from '../components/home/CalendarSection'

const CalendarPage = () => (
  <div className="min-h-screen bg-[#FFF9FB] text-slate-800">
    <FloatingParticles />
    <div className="relative z-10">
      <Navbar />
      <main className="flex w-full flex-col gap-10 pb-20 pt-14 sm:pt-20">
        <CalendarSection />
      </main>
      <Footer />
    </div>
  </div>
)

export default CalendarPage
