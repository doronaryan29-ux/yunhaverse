import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import FloatingParticles from '../components/layout/FloatingParticles'
import FanartShowcase from '../components/home/FanartShowcase'
import { fanartItems } from '../data/homeData'

const Gallery = () => (
  <div className="min-h-screen bg-[#FFF9FB] text-slate-800">
    <FloatingParticles />
    <div className="relative z-10">
      <Navbar />
      <main className="flex w-full flex-col gap-10 pb-20 pt-14 sm:pt-20">
        <FanartShowcase items={fanartItems} />
      </main>
      <Footer />
    </div>
  </div>
)

export default Gallery
