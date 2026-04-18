import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/Button'

export default function OurStory() {
  return (
    <div className="min-h-screen bg-black pt-2 pb-16 md:pt-4 -mt-2">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Story Section */}
        <div className="bg-neutral-900 rounded-3xl p-6 md:p-10 lg:p-12 shadow-xl border border-neutral-800/60 mb-16 animate-fade-in-scale">
          <div className="flex flex-col md:flex-row items-stretch gap-12 lg:gap-16">
            {/* Image Side (Left) */}
            <div className="w-full md:w-1/2 relative min-h-[400px] lg:min-h-[650px] rounded-2xl overflow-hidden border border-neutral-800/50 shadow-inner">
              <Image
                src="/optimized-media/light-pole-hdr.jpg"
                alt="Our Story - Pineapple Inc. Studios"
                fill
                className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* Content Side (Right) */}
            <div className="w-full md:w-1/2 text-left">
              <h1 className="text-4xl md:text-5xl font-normal text-white mb-8 font-heading tracking-tight">
                Our <span className="font-bold">Story</span>
              </h1>
              <div className="space-y-5 text-base md:text-lg">
                <p className="text-white/80 leading-relaxed font-light">
                  Pineapple Inc. Studios began with a clear observation: properties that were ready for market were too often being delayed, not because they lacked potential, but because the right media support was not available when it was needed.
                </p>
                <p className="text-white/80 leading-relaxed font-light">
                  That gap had real consequences. In property, timing and presentation are deeply connected. Momentum can be difficult to create and easy to lose. When a campaign is ready to launch, every delay matters.
                </p>
                <p className="text-white/80 leading-relaxed font-light">
                  Pineapple Inc. Studios was built in response to that reality.
                </p>
                <p className="text-white/80 leading-relaxed font-light">
                  We created a studio where premium visual media and responsiveness exist side by side—where homes can be captured with polish, professionalism, and speed, and where agents and vendors can move forward with confidence when the moment is right.
                </p>
                <p className="text-white/80 leading-relaxed font-light mb-8">
                  This is the foundation of everything we do: to help properties enter the market beautifully presented, strategically positioned, and without unnecessary delay.
                </p>
              </div>
              
              <div className="pt-6">
                <Button asChild className="bg-white text-black hover:bg-neutral-200 px-8 py-4 h-auto rounded-xl transition-all shadow-md group">
                  <Link href="/booking">
                    Book <span className="font-extrabold ml-1 group-hover:scale-105 inline-block transition-transform">NOW</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
