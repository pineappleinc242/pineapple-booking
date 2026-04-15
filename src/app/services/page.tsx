'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/Button'
import { useState, useEffect } from 'react'

const services = [
    {
    title: 'Photography',
    description: 'Elevate your listings with high-resolution, magazine-quality imagery. We meticulously capture the distinct architecture, ambient lighting, and welcoming spaces of your property to ensure a striking first impression that instantly captivates prospective buyers.',
    features: ['High-resolution HDR images', 'Professional sky replacement', 'Next-day turnaround', 'Commercial usage rights'],
    galleryItems: [
      { type: 'image', src: '/optimized-media/DSC00107.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00108-HDR.jpg' },
      { type: 'image', src: '/optimized-media/DSC00108.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00109.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00110.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00114.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00115-HDR.jpg' },
      { type: 'image', src: '/optimized-media/DSC00117.jpg' },
      { type: 'image', src: '/optimized-media/DSC00118.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00119.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00119.jpg' },
      { type: 'image', src: '/optimized-media/DSC00124.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00125-HDR.jpg' },
      { type: 'image', src: '/optimized-media/DSC00125.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00126.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00128-HDR.jpg' },
      { type: 'image', src: '/optimized-media/DSC00131.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00132-HDR.jpg' },
      { type: 'image', src: '/optimized-media/DSC00132.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00135.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00136-HDR.jpg' },
      { type: 'image', src: '/optimized-media/DSC00137.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00138.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00138.jpg' },
      { type: 'image', src: '/optimized-media/DSC00139.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00142-HDR.jpg' },
      { type: 'image', src: '/optimized-media/DSC00144.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00144.jpg' },
      { type: 'image', src: '/optimized-media/DSC00145.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00146.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00149.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00151.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00152-HDR.jpg' },
      { type: 'image', src: '/optimized-media/DSC00159.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00162.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00163.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00168.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00168.jpg' },
      { type: 'image', src: '/optimized-media/DSC00170.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00171.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00178.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00185.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00186.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00190.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00191.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00192.jpg' },
      { type: 'image', src: '/optimized-media/DSC00193.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00196.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00197.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00199.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00200.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00200.jpg' },
      { type: 'image', src: '/optimized-media/DSC00201.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00203.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00203.jpg' },
      { type: 'image', src: '/optimized-media/DSC00208.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00212.jpg' },
      { type: 'image', src: '/optimized-media/DSC00226.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00227.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00231.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00232.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00241.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00243.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00247.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00254.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00258.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00260.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00262.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00266.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00267.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00270.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00271.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00274.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00282.jpeg' },
      { type: 'image', src: '/optimized-media/KarabarOutDoorLiving.jpeg' },
      { type: 'image', src: '/optimized-media/KarahbarLivingRoom.jpeg' },
      { type: 'image', src: '/optimized-media/KarahbarMasterBed.jpeg' },
      { type: 'image', src: '/optimized-media/My_First_Property_DSC00144_01-04-26_15_11.jpeg' },
      { type: 'image', src: '/optimized-media/Property_1B6A_DSC00138_01-04-26_15_09.jpeg' },
      { type: 'image', src: '/optimized-media/Property_B34F_DSC00142-HDR_01-04-26_14_54.jpeg' },
      { type: 'image', src: '/optimized-media/Property_B3A4_DSC00108-HDR_01-04-26_13_16.jpeg' }
    ]
  },
  {
    title: 'Videography',
    description: 'Deliver an immersive viewing experience through cinematic property storytelling. Our videography perfectly highlights the flow and lifestyle of every home with smooth dynamic transitions, modern styling, and professionally graded aesthetics.',
    features: ['4K ultra-HD production', 'Professional color grading', 'Licensed music tracks', 'Social media optimized formats'],
    galleryItems: [
      { type: 'video', src: '/anthony-house-final.mp4' },
      { type: 'video', src: '/anthony-inlaw-inc.mp4' },
      { type: 'video', src: '/chloe-inlaws.mp4' }
    ]
  },
  {
    title: 'Drone / Aerial',
    description: 'Provide an unparalleled perspective of the property and its surrounding environment. Our FAA-certified aerial media captures the true scale, contextual landscapes, and sweeping views that ground-level traditional photography simply cannot match.',
    features: ['Licensed & insured pilots', '4K aerial footage', 'Property line outlines', 'Neighborhood contextual shots'],
    imageSrc: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Floor Plans',
    description: 'Empower buyers with accurate layouts and an easy-to-understand flow of the property. Our precise and clean architectural floor plans provide the exact structural insight needed to envision a future in the space.',
    features: ['Accurate laser measurements', '2D & 3D options', 'Fixed furniture included', 'PDF & JPG formats'],
    imageSrc: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200'
  }
]

// Component for cycling through gallery items as a placeholder
function GalleryPlaceholder({ items }: { items: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [items.length])

  return (
    <div className="relative w-full h-full">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {item.type === 'video' ? (
            // #t=0.001 fetches the first frame efficiently for placeholders without autoplaying 400MB!
            <video
              src={`${item.src}#t=0.001`}
              preload="metadata"
              muted
              playsInline
              className="object-cover w-full h-full"
            />
          ) : (
            <Image
              src={item.src}
              alt="Gallery item"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function Services() {
  const [activeGallery, setActiveGallery] = useState<any[] | null>(null)
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)
  const [isListView, setIsListView] = useState(false)

  const openGallery = (items: any[]) => {
    setActiveGallery(items)
    setCurrentGalleryIndex(0)
    setIsListView(true)
  }

  const closeGallery = () => {
    setActiveGallery(null)
  }

  const nextItem = () => {
    if (activeGallery) {
      setCurrentGalleryIndex((prev) => (prev + 1) % activeGallery.length)
    }
  }

  const prevItem = () => {
    if (activeGallery) {
      setCurrentGalleryIndex((prev) => (prev - 1 + activeGallery.length) % activeGallery.length)
    }
  }

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-20 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl text-white font-heading tracking-tight"><span className="font-normal">The </span><span className="font-bold">Core</span></h1>
        </div>

        {/* Services Alternating Rows */}
        <div className="space-y-24 md:space-y-32">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className={`flex flex-col md:flex-row gap-10 lg:gap-16 items-center ${isEven ? '' : 'md:flex-row-reverse'}`}>
                
                {/* Content Side */}
                <div className="flex-1 space-y-6">
                  <h2 className="text-3xl md:text-5xl font-bold text-white font-heading tracking-tight">{service.title}</h2>
                  <p className="text-white/80 leading-relaxed text-lg md:text-xl font-light">{service.description}</p>
                  
                  <div className="pt-6">
                    <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest border-b border-neutral-800 pb-2">What&apos;s Included</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-white/70 text-sm md:text-base">
                          <svg className="w-5 h-5 text-white mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="pt-8 flex flex-wrap gap-4">
                    <Link 
                      href={`/booking?service=${encodeURIComponent(service.title)}`}
                      className="inline-block py-4 px-10 bg-white text-black text-lg rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                      Book <span className="font-extrabold">NOW</span>
                    </Link>
                  </div>
                </div>

                {/* Media Side */}
                <div className="flex-1 w-full relative">
                  {service.galleryItems ? (
                     <div 
                        className="aspect-[4/3] w-full bg-neutral-900 rounded-2xl flex border border-neutral-800 items-center justify-center shadow-lg relative overflow-hidden group cursor-pointer"
                        onClick={() => openGallery(service.galleryItems!)}
                     >
                        <GalleryPlaceholder items={service.galleryItems} />
                        
                     </div>
                  ) : (
                     <div className="aspect-[4/3] w-full bg-neutral-900 rounded-2xl flex border border-neutral-800 items-center justify-center shadow-lg relative overflow-hidden group">
                        <Image
                           src={service.imageSrc as string}
                           alt={service.title}
                           fill
                           className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                           sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        
                     </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-32 border-t border-neutral-800 pt-20 text-center">
          <h2 className="text-3xl md:text-5xl mb-6 font-heading text-white/90 tracking-tight">
            <span className="font-normal">Ready when the </span>
            <span className="font-bold text-white">Home</span>
            <span className="font-normal"> is.</span>
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
            Book your media packages securely and quickly online to secure your preferred slot.
          </p>
          <Button asChild className="bg-white text-black hover:bg-neutral-200 px-12 py-5 h-16 rounded-xl text-lg transition-transform hover:-translate-y-1">
            <Link href="/booking">Book <span className="font-extrabold ml-1">NOW</span></Link>
          </Button>
        </div>
      </div>

      {/* Gallery Modal */}
      {activeGallery && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in-scale">
          <button 
            onClick={closeGallery}
            className="absolute top-6 right-6 text-white/60 hover:text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-50"
            aria-label="Close gallery"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {isListView && (
            <div className="w-full h-full pt-16 px-4 md:px-12 overflow-y-auto">
              <h2 className="text-white text-3xl font-heading mb-8 text-center tracking-widest uppercase">Gallery Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto pb-20">
                {activeGallery.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-white/20 hover:border-white transition-all group shadow-xl"
                    onClick={() => {
                        setCurrentGalleryIndex(idx);
                        setIsListView(false);
                    }}
                  >
                    {item.type === 'video' ? (
                      <video src={`${item.src}#t=0.001`} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" preload="metadata" muted playsInline />
                    ) : (
                      <img src={item.src} alt={`Thumbnail ${idx}`} className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isListView && (
            <>
              {/* Back to List Button */}
              <button 
                onClick={() => setIsListView(true)}
                className="absolute top-6 left-6 text-white/60 hover:text-white px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-50 text-sm font-semibold tracking-wide flex items-center gap-2"
                aria-label="Back to List"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Grid View
              </button>

              <div className="relative w-full max-w-6xl aspect-video rounded-xl overflow-hidden flex items-center justify-center shadow-2xl border-none h-full max-h-[90vh]">
                 {activeGallery[currentGalleryIndex].type === 'video' ? (
                    <video 
                      key={activeGallery[currentGalleryIndex].src} // Forces video remount on index change
                      src={activeGallery[currentGalleryIndex].src}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                 ) : (
                    <img 
                      src={activeGallery[currentGalleryIndex].src}
                      alt={`Gallery Image ${currentGalleryIndex + 1}`}
                      className="object-contain w-full h-full"
                    />
                 )}
              </div>

              {activeGallery.length > 1 && (
                 <>
                   <button 
                     onClick={prevItem}
                     className="absolute left-4 md:left-12 text-white/60 hover:text-white p-4 bg-white/5 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md"
                   >
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                   </button>
                   <button 
                     onClick={nextItem}
                     className="absolute right-4 md:right-12 text-white/60 hover:text-white p-4 bg-white/5 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md"
                   >
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                   </button>

                   <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/60 rounded-full border border-white/10 text-white/80 font-medium tracking-widest text-sm backdrop-blur-md">
                     {currentGalleryIndex + 1} / {activeGallery.length}
                   </div>
                 </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
