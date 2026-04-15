'use client'

import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Logo from './Logo'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/our-story', label: 'Behind the\npineapple' },
    { href: '/services', label: 'The\nCore' },
    { href: '/portfolio', label: 'Peel and\nreveal' },
    { href: '/team', label: 'The\nP Crew' },
    { href: '/contact', label: "Let's\nconnect" },
  ]

  return (
  <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10">
        <div className="flex h-24 sm:h-28 items-center justify-between">
          
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-20 w-48 sm:h-24 sm:w-64 lg:w-72 flex-shrink-0">
              <Image
                src="/logo1.png"
                alt="Pineapple Inc. Studios"
                fill
                priority
                className="object-contain"
                style={{ filter: 'brightness(0)' }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-black/80 hover:text-black transition-colors duration-300 font-medium text-sm tracking-wide text-center"
                style={{ whiteSpace: 'pre-line', lineHeight: '1.2' }}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center gap-4 pl-4 border-l border-neutral-200">
              <Link
                href="/booking"
                className="bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-sm hover:bg-neutral-800"
              >
                Book Now
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 -mr-2 rounded-md hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span className={`absolute block w-6 h-0.5 bg-primary transform transition-all duration-300 ${isOpen ? 'rotate-45 top-3' : 'top-1'}`}></span>
              <span className={`absolute block w-6 h-0.5 bg-primary transform transition-all duration-300 ${isOpen ? 'opacity-0' : 'top-3'}`}></span>
              <span className={`absolute block w-6 h-0.5 bg-primary transform transition-all duration-300 ${isOpen ? '-rotate-45 top-3' : 'top-5'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            // make the mobile dropdown slightly brighter so links are clearly visible on dark header
            'lg:hidden bg-neutral-800 mt-1 border-t border-neutral-700 rounded-b-2xl shadow-lg absolute inset-x-0 transition-all duration-300 ease-in-out origin-top',
            isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
          )}
        >
          <div className="px-6 py-6 space-y-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-base font-semibold text-white hover:text-white/90 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-6 mt-6 border-t border-neutral-700 space-y-4">
              <Link
                href="/booking"
                className="block w-full max-w-xs mx-auto bg-white text-black px-4 py-3 rounded-lg font-semibold text-center transition-all duration-300 shadow-sm hover:bg-neutral-100"
                onClick={() => setIsOpen(false)}
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
