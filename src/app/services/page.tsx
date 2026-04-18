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
      { type: 'image', src: '/optimized-media/DSC00170.jpeg' },
      { type: 'image', src: '/optimized-media/raw-photos-bathroom.jpg' },
      { type: 'image', src: '/optimized-media/DSC00200.jpg' },
      { type: 'image', src: '/optimized-media/DSC00191.jpeg' },
      { type: 'image', src: '/optimized-media/kitchen-dining-hdr.jpg' },
      { type: 'image', src: '/optimized-media/light-pole-hdr.jpg' },
      { type: 'image', src: '/optimized-media/raw-photos-sun-room.jpg' },
      { type: 'image', src: '/optimized-media/red-bed.jpg' },
      { type: 'image', src: '/optimized-media/v-style.jpeg' },
      { type: 'image', src: '/optimized-media/kitchen-hdr.jpg' },
      { type: 'image', src: '/optimized-media/KarahbarMasterBed.jpeg' },
      { type: 'image', src: '/optimized-media/ourstory.jpg' },
      { type: 'image', src: '/optimized-media/DSC00192.jpg' },
      { type: 'image', src: '/optimized-media/DSC00168.jpg' },
      { type: 'image', src: '/optimized-media/DSC00178.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00203.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00208.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00243.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00260.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00262.jpeg' },
      { type: 'image', src: '/optimized-media/DSC00282.jpeg' },
      { type: 'image', src: '/optimized-media/KarabarOutDoorLiving.jpeg' },
      { type: 'image', src: '/optimized-media/KarahbarLivingRoom.jpeg' },
      { type: 'image', src: '/optimized-media/Property_B34F_DSC00142-HDR_01-04-26_14_54.jpeg' },
      { type: 'image', src: '/optimized-media/Property_B3A4_DSC00108-HDR_01-04-26_13_16.jpeg' },
      { type: 'image', src: '/optimized-media/bedroom-compressed.jpg' },
      { type: 'image', src: '/optimized-media/DSC00125-HDR.jpg' }
    ]
  },
  {
    title: 'Videography',
    description: 'Deliver an immersive viewing experience through cinematic property storytelling. Our videography perfectly highlights the flow and lifestyle of every home with smooth dynamic transitions, modern styling, and professionally graded aesthetics.',
    features: ['4K ultra-HD production', 'Professional color grading', 'Licensed music tracks', 'Social media optimized formats'],
    galleryItems: [
      { type: 'video', src: '/optimized-media/anthony-house-final.mp4' },
      { type: 'video', src: '/optimized-media/anthony-inlaw-inc.mp4' },
      { type: 'video', src: '/optimized-media/chloe-inlaws.mp4' },
      { type: 'video', src: '/optimized-media/videography4_optimized.mp4' }
    ]
  },
  {
    title: 'Drone / Aerial',
    description: 'Provide an unparalleled perspective of the property and its surrounding environment. Our FAA-certified aerial media captures the true scale, contextual landscapes, and sweeping views that ground-level traditional photography simply cannot match.',
    features: ['Licensed & insured pilots', '4K aerial footage', 'Property line outlines', 'Neighborhood contextual shots'],
    galleryItems: [
      { type: 'video', src: '/optimized-media/dji_drone_optimized.mp4' },
      { type: 'video', src: '/optimized-media/dji_drone_optimized2.mp4' },
      { type: 'video', src: '/optimized-media/dji_drone_optimized3.mp4' },
      { type: 'image', src: '/optimized-media/dji_drone_optimized4.jpg' },
      { type: 'image', src: '/optimized-media/dji_drone_optimized5.jpg' },
      { type: 'image', src: '/optimized-media/dji_drone_optimized6.jpg' }
    ]
  },
  {
    title: 'Floor Plans',
    description: 'Empower buyers with accurate layouts and an easy-to-understand flow of the property. Our precise and clean architectural floor plans provide the exact structural insight needed to envision a future in the space.',
    features: ['Accurate laser measurements', '2D & 3D options', 'Fixed furniture included', 'PDF & JPG formats'],
    galleryItems: [
      { type: 'image', src: '/optimized-media/floor-plan1.png' },
      { type: 'image', src: '/optimized-media/floor-plan2.png' },
      { type: 'image', src: '/optimized-media/floor-plan3.png' }
    ]
  }
]

// Component for cycling through gallery items as a placeholder
function GalleryPlaceholder({ items }: { items: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!items || items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [items?.length])

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full opacity-60">
        <svg className="w-12 h-12 mb-2 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-white/40 text-sm font-medium tracking-wide uppercase">Media Coming Soon</p>
      </div>
    );
  }

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
                  {service.galleryItems && service.galleryItems.length > 0 ? (
                     <div 
                        className="aspect-[4/3] w-full bg-neutral-900 rounded-2xl flex border border-neutral-800 items-center justify-center shadow-lg relative overflow-hidden group cursor-pointer"
                        onClick={() => openGallery(service.galleryItems!)}
                     >
                        <GalleryPlaceholder items={service.galleryItems} />
                     </div>
                  ) : (
                     <div className="aspect-[4/3] w-full bg-neutral-900 rounded-2xl flex border border-neutral-800 items-center justify-center shadow-lg relative overflow-hidden group">
                           <GalleryPlaceholder items={[]} />
                     </div>
                  )}
                </div>              </div>
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
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in-scale"
          onClick={closeGallery}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); closeGallery(); }}
            className="absolute top-6 right-6 flex items-center gap-2 text-white/80 hover:text-white px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-50 text-sm font-semibold tracking-wide"
            aria-label="Close gallery"
          >
            <span>Close Gallery</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {isListView && (
            <div 
              className="w-full h-full pt-16 px-4 md:px-12 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-white text-3xl font-heading mb-8 text-center tracking-widest uppercase">Gallery Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto pb-20">
                {activeGallery.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-white/20 hover:border-white transition-all group shadow-xl"
                    onClick={(e) => {
                        e.stopPropagation();
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
                onClick={(e) => { e.stopPropagation(); setIsListView(true); }}
                className="absolute top-6 left-6 text-white/60 hover:text-white px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-50 text-sm font-semibold tracking-wide flex items-center gap-2"
                aria-label="Back to List"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Grid View
              </button>

              <div 
                className="relative w-full max-w-6xl flex items-center justify-center h-full max-h-[90vh]"
              >
                 {activeGallery[currentGalleryIndex].type === 'video' ? (
                    <video 
                      key={activeGallery[currentGalleryIndex].src} // Forces video remount on index change
                      src={activeGallery[currentGalleryIndex].src}
                      controls
                      autoPlay
                      className="max-w-full max-h-full object-contain rounded-xl shadow-2xl cursor-default"
                      onClick={(e) => e.stopPropagation()}
                    />
                 ) : (
                    <img 
                      src={activeGallery[currentGalleryIndex].src}
                      alt={`Gallery Image ${currentGalleryIndex + 1}`}
                      className="max-w-full max-h-full object-contain rounded-xl shadow-2xl cursor-default"
                      onClick={(e) => e.stopPropagation()}
                    />
                 )}
              </div>

              {activeGallery.length > 1 && (
                 <>
                   <button 
                     onClick={(e) => { e.stopPropagation(); prevItem(); }}
                     className="absolute left-4 md:left-12 text-white/60 hover:text-white p-4 bg-white/5 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md"
                   >
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                   </button>
                   <button 
                     onClick={(e) => { e.stopPropagation(); nextItem(); }}
                     className="absolute right-4 md:right-12 text-white/60 hover:text-white p-4 bg-white/5 rounded-full hover:bg-white/20 transition-colors backdrop-blur-md"
                   >
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                   </button>

                   <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/60 rounded-full border border-white/10 text-white/80 font-medium tracking-widest text-sm backdrop-blur-md pointer-events-none">
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
