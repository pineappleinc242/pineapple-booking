"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const HERO_IMAGES = [
  "/optimized-media/DSC00108-HDR.jpg",
  "/optimized-media/DSC00142-HDR.jpg",
  "/optimized-media/KarabarOutDoorLiving.jpeg",
  "/optimized-media/KarahbarLivingRoom.jpeg",
  "/optimized-media/DSC00125-HDR.jpg",
  "/optimized-media/DSC00136-HDR.jpg",
  "/optimized-media/DSC00152-HDR.jpg",
  "/optimized-media/KarahbarMasterBed.jpeg"
];

export default function Home() {
  const [phase, setPhase] = useState<'first' | 'second' | 'none'>('first')
  const [settled, setSettled] = useState(false)
  const [showReadyHeading, setShowReadyHeading] = useState(false)
  const [showParagraph, setShowParagraph] = useState(false)
  const [showBook, setShowBook] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    // Initial entrance marker
    const t2 = setTimeout(() => setSettled(true), 2500)
    return () => clearTimeout(t2)
  }, [])
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Cycle text with a complete fade-out phase between the two phrases
    const runCycle = () => {
      setPhase('first')
      timeout = setTimeout(() => {
        setPhase('none')
        timeout = setTimeout(() => {
          setPhase('second')
          timeout = setTimeout(() => {
            setPhase('none')
            timeout = setTimeout(runCycle, 1200) // Stay hidden for 1.2s before showing first again
          }, 3500) // Show second phrase for 3.5s
        }, 1200) // Stay hidden for 1.2s before showing second
      }, 3500) // Show first phrase for 3.5s
    }

    // Start cycle
    runCycle()

    // Cycle background images every 5s for slower, smoother transitions
    const imgInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    
    return () => {
      clearTimeout(timeout)
      clearInterval(imgInterval)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (!showReadyHeading && window.scrollY > 40) {
        setShowReadyHeading(true)
        setShowParagraph(true)
      }
      if (!showBook && window.scrollY > 600) {
        setShowBook(true)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [showReadyHeading, showBook])

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-black text-white">
      <section className="relative min-h-screen flex items-center justify-center w-full px-4 overflow-hidden">
        {/* Animated Background Image Carousel */}
        <div className="absolute inset-0 z-0 bg-black">
          {HERO_IMAGES.map((img, index) => (
            <img 
              key={img}
              src={img}
              alt="Hero background property image"
              className={`absolute inset-0 w-full h-full object-cover animate-slow-zoom transition-opacity duration-[2000ms] ease-in-out ${index === currentImageIndex ? 'opacity-80' : 'opacity-0'}`} 
            />
          ))}
          {/* Subtle gradients to ensure text stands out without making the image too dark */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.5)] pointer-events-none"></div>
        </div>

        <h1 className="relative z-10 text-[clamp(2.2rem,7vw,5.5rem)] font-extrabold tracking-tight text-center leading-[1.2] w-full max-w-full">
          <div className={`headline-stack relative min-h-[3em] sm:min-h-[1.5em] w-full flex items-center justify-center ${settled ? 'settled' : ''}`}>
              <div className={`headline-layer flex-wrap gap-x-[0.3em] gap-y-2 w-full ${phase === 'first' ? 'show' : ''} font-normal`}>
                <span>Media</span>
                <span>that</span>
                <span>carries</span>
                <span className="font-extrabold text-white">Weight</span>
              </div>
              <div className={`headline-layer flex-wrap gap-x-[0.3em] gap-y-2 w-full ${phase === 'second' ? 'show' : ''} font-normal`}>
                <span>Motion</span>
                <span>that</span>
                <span className="font-extrabold text-white">Holds</span>
                <span>it</span>
              </div>
          </div>
        </h1>
      </section>

      {/* Reveal on scroll: Ready heading + paragraph */}
      <section className={`w-full max-w-3xl mx-auto px-6 py-12 ${showReadyHeading ? 'fade-up' : 'opacity-0'}`}>
        {showReadyHeading && (
          <h2 className="text-3xl md:text-4xl text-center mb-6 text-white/90">
            <span className="font-normal">Ready when the </span>
            <span className="font-bold text-white">Home</span>
            <span className="font-normal"> is.</span>
          </h2>
        )}

        {showParagraph && (
          <p className="text-base md:text-lg leading-relaxed text-center text-white/90">
            A property prepared for market should never be held back by slow turnaround or inconsistent execution. At Pineapple Inc, we deliver premium visual media with the responsiveness the industry demands, combining sharp creative standards with an efficient, professional service model that helps agents and vendors move from preparation to presentation without losing momentum.
          </p>
        )}
      </section>

      {/* Book CTA revealed further down; links to booking form */}
      <section className={`min-h-[30vh] flex items-center justify-center w-full px-4 ${showBook ? 'fade-up' : 'opacity-0'}`}>
        <Link href="/booking" className="text-2xl sm:text-3xl md:text-4xl bg-black text-white px-8 py-4 rounded-lg hover:bg-neutral-800 transition-colors border border-neutral-800 font-normal">
          Book <span className="font-extrabold">NOW</span>
        </Link>
      </section>
    </main>
  )
}
