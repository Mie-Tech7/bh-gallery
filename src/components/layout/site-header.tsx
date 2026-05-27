'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useCartStore } from '@/lib/hooks/use-cart';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Artists', href: '/artists' },
  { label: 'Shop', href: '/shop' },
  { label: 'Appraisal Services', href: '/appraisal', accent: true },
];

export function SiteHeader() {
  const { user, isAdmin } = useAuth();
  const { itemCount, openCart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-nav">
      <nav className="container-bhg flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
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

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
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

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Sign in / Account */}
          <Link
            href={user ? '/account' : '/api/auth'}
            className="hidden md:flex items-center gap-1.5 text-body-sm font-sans text-bhg-gray-600 hover:text-bhg-black transition-colors"
          >
            <User size={18} />
            <span>{user ? 'Account' : 'Sign in'}</span>
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-1.5 text-body-sm font-sans text-bhg-gray-600 hover:text-bhg-black transition-colors"
            aria-label={`Shopping cart with ${itemCount} items`}
          >
            <ShoppingCart size={18} />
            <span className="hidden md:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-bhg-copper text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Join Community CTA */}
          <Link href="/community" className="hidden md:inline-flex btn-primary text-body-sm py-2 px-4">
            Join Community
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-bhg-black"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-bhg-gray-200 animate-fade-in">
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
            <li className="pt-2 border-t border-bhg-gray-200">
              <Link
                href={user ? '/account' : '/api/auth'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-body-md font-sans text-bhg-gray-600"
              >
                {user ? 'My Account' : 'Sign In'}
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-body-md font-sans text-bhg-copper font-medium"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
