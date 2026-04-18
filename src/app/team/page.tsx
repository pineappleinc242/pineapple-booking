import Link from 'next/link'
import Image from 'next/image'

export default function Team() {
  return (
    <div className="relative min-h-screen bg-black py-20 overflow-hidden flex items-center">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Text Description */}
          <div className="animate-fade-in-up md:pr-10 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-heading tracking-tight text-white mb-6">
              The <span className="font-bold">P Crew</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed mb-10">
              Behind the studio is a dedicated team committed to producing premium property media with consistency, efficiency, and care. Together, Pineapple Inc. Studios brings strategy, responsiveness, and modern visual production into one service experience.
            </p>
            <Link 
              href="/services" 
              className="inline-block border border-white/20 hover:bg-white hover:text-black transition-colors text-white px-8 py-4 rounded-full text-sm font-semibold tracking-widest uppercase"
            >
              Explore the Core
            </Link>
          </div>

          {/* Right Side: Circular Images (2 on top, 1 below) */}
          <div className="relative flex flex-col items-center gap-10 lg:gap-12 animate-fade-in-up delay-200">
            
            {/* Top Row: 2 Images */}
            <div className="flex justify-center gap-8 md:gap-16 w-full">
              {/* Ritik */}
              <div className="flex flex-col items-center text-center group">
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/10 mb-4 shadow-2xl transition-all duration-500 group-hover:border-white/40">
                  <img
                    src="/optimized-media/ritik.jpg" 
                    alt="Ritik Kaushal" 
                    className="object-cover object-[center_10%] w-full h-full scale-[1.2] transition-transform duration-700 group-hover:scale-[1.3]"
                  />
                </div>
                <h3 className="text-xl font-bold text-white font-heading">Ritik Kaushal</h3>
                <p className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-3">Lead Videographer</p>
                <p className="text-white/60 text-sm max-w-[200px] font-light leading-relaxed">
                  Crafting cinematic journeys. Ritik captures the flow, warmth, and emotion of a space, seamlessly translating the heart and soul of your home into motion.
                </p>
              </div>

              {/* Chloe */}
              <div className="flex flex-col items-center text-center group">
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/10 mb-4 shadow-2xl transition-all duration-500 group-hover:border-white/40">
                  <img
                    src="/optimized-media/chloe.jpg" 
                    alt="Chloe Pragt" 
                    className="object-cover object-[center_10%] w-full h-full scale-[1.2] transition-transform duration-700 group-hover:scale-[1.3]"
                  />
                </div>
                <h3 className="text-xl font-bold text-white font-heading">Chloe Pragt</h3>
                <p className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-3">Lead Photographer</p>
                <p className="text-white/60 text-sm max-w-[200px] font-light leading-relaxed">
                  Mastering the still frame. Chloe uses light and flawless composition to reveal the true architectural character, heart, and soul of every property.
                </p>
              </div>
            </div>

            {/* Bottom Row: 1 Image (Founder) */}
            <div className="flex flex-col items-center text-center group mt-4">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/10 mb-5 shadow-2xl transition-all duration-500 group-hover:border-white/40">
                <img
                  src="/optimized-media/anthony.jpg" 
                  alt="Anthony Ferraro" 
                  className="object-cover object-[center_10%] w-full h-full scale-[1.2] transition-transform duration-700 group-hover:scale-[1.3]"
                />
              </div>
              <h3 className="text-2xl font-bold text-white font-heading">Anthony Ferraro</h3>
              <p className="text-sm uppercase tracking-widest text-white/50 font-semibold mb-4">Founder / Director</p>
              <p className="text-white/60 text-base max-w-[300px] font-light leading-relaxed">
                Recognizing a gap in the market, Anthony built Pineapple Inc. to deliver high-end creative work with speed, intent, and real impact. By bringing the right talent together, he created a sharper, faster brand focused entirely on quality, experience, and execution.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
