import Link from 'next/link'
import Image from 'next/image'

const portfolioItems = [
  {
    title: 'Peel and Reveal 1',
    description: 'Transforming property aesthetics with before-and-after visual contrast.',
    category: 'Photography',
    imageUrl: '/optimized-media/peel-and-reveal-1.jpg'
  },
  {
    title: 'Peel and Reveal 2',
    description: 'A striking showcase of property progression and architectural details.',
    category: 'Photography',
    imageUrl: '/optimized-media/peel-and-reveal-2.jpg'
  },
  {
    title: 'Peel and Reveal 3',
    description: 'Capturing the full narrative of a property with stunning high-res imagery.',
    category: 'Photography',
    imageUrl: '/optimized-media/peel-and-reveal-3.jpg'
  }
]

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Hero Section */}
        <div className="mb-16 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl text-white mb-4 font-heading tracking-tight"><span className="font-normal">Peel and </span><span className="font-bold">Reveal</span></h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            We specialize in premium virtual styling, seamlessly transforming anything from a single room to an entire home.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {portfolioItems.map((item, index) => (
            <div 
              key={index} 
              className="group relative rounded-3xl overflow-hidden bg-neutral-900 aspect-[4/5] shadow-lg animate-fade-in-scale cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Image */}
              <Image 
                src={item.imageUrl} 
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="inline-block bg-white text-black font-semibold text-xs px-3 py-1 rounded-full mb-3 w-fit shadow-md">
                  {item.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2 font-heading">{item.title}</h3>
                <p className="text-neutral-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center animate-fade-in-up delay-300">
          <p className="text-neutral-500 mb-6 font-medium text-lg">Want to see more specific examples for your property type?</p>
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center px-10 py-4 bg-white text-black rounded-lg font-bold hover:bg-neutral-200 transition-colors shadow-lg"
          >
            Get in Touch
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  )
}
