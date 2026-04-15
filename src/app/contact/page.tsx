'use client'

import Link from 'next/link'
import { Button } from '@/components/Button'

export default function Contact() {
  return (
    <div className="min-h-screen bg-black py-16 flex items-center">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <div className="bg-neutral-900 rounded-3xl p-8 md:p-12 lg:p-16 shadow-xl border border-neutral-800/60 animate-fade-in-scale">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Left: Text & Booking CTA */}
            <div className="flex-1 space-y-8 flex flex-col justify-center">
              <div>
                <h1 className="text-4xl md:text-5xl text-white mb-6 font-heading tracking-tight">
                  <span className="font-bold">Book</span> <span className="font-normal">your moment</span>
                </h1>
                <div className="space-y-4 text-base md:text-lg text-white/80 font-light leading-relaxed">
                  <p>
                    If you're preparing a property for market and want premium presentation delivered with professionalism and responsiveness, we'd love to hear from you.
                  </p>
                  <p>
                    Pineapple Inc. Studios works with agents and vendors who value quality, timing, and trust. The fastest way to work with us is to check our availability and book a slot directly through our booking portal.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button asChild className="bg-white text-black hover:bg-neutral-200 px-8 py-4 h-auto rounded-xl transition-all shadow-md group border-none">
                  <Link href="/booking" className="font-medium text-lg">
                    View Availability & Book
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Contact Information Box */}
            <div className="lg:w-5/12 bg-neutral-800/50 rounded-2xl p-8 border border-neutral-700/50 shadow-inner relative overflow-hidden">
              <h2 className="text-2xl text-white mb-8 border-b border-neutral-700 pb-4 font-heading">
                <span className="font-bold">Contact</span> <span className="font-normal">Information</span>
              </h2>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mr-4 border border-neutral-700 flex-shrink-0 shadow-sm">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Email</h3>
                    <a href="mailto:pineappleincstudios@gmail.com" className="text-white/70 hover:text-white transition-colors">pineappleincstudios@gmail.com</a>
                    <p className="text-xs text-white/50 mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mr-4 border border-neutral-700 flex-shrink-0 shadow-sm">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Phone</h3>
                    <a href="tel:+61414347289" className="text-white/70 hover:text-white transition-colors">+61 414 347 289</a>
                    <p className="text-xs text-white/50 mt-1">Mon-Fri 9AM-6PM AEST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mr-4 border border-neutral-700 flex-shrink-0 shadow-sm">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Location</h3>
                    <p className="text-white/70">Level 2/3 Hobart Place</p>
                    <p className="text-xs text-white/50 mt-1">Canberra ACT 2601</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
