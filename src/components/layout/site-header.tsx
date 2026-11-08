'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Launch nav: only pages that exist. Gallery, Artists and Shop come back
// once her pieces are photographed and online.
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Appraisals', href: '/appraisal', accent: true },
  { label: 'Contact', href: '/contact' },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-nav">
      <nav className="container-bhg flex items-center justify-between h-16 md:h-18">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/icons/logo-header.png"
            alt="Black Heritage Gallery"
            width={32}
            height={40}
            priority
            className="h-10 w-auto"
          />
          <span className="font-serif text-heading-md text-bhg-copper">
            Black Heritage Gallery
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'px-3 py-2 text-body-sm font-sans font-medium rounded-button transition-colors',
                  link.accent
                    ? 'text-bhg-copper hover:text-bhg-copper-dark'
                    : 'text-bhg-gray-600 hover:text-bhg-black'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-bhg-black"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-bhg-gray-200 animate-fade-in">
          <ul className="container-bhg py-4 space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-button text-body-md font-sans transition-colors',
                    link.accent
                      ? 'text-bhg-copper font-medium'
                      : 'text-bhg-black hover:bg-bhg-cream'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
