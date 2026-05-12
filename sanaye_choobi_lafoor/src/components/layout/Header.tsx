'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'خانه', href: '/' },
  { name: 'ویلاها', href: '/products' },
  { name: 'خدمات اقامت', href: '/services' },
  { name: 'مجله سفر', href: '/blog' },
  { name: 'درباره ما', href: '/about' },
  { name: 'تماس', href: '/contact' },
  { name: 'میزبان‌ها', href: '/hosts/register' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-cream-200 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center gap-6 py-3 md:py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-wood-500 via-wood-600 to-wood-700 rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden group">
                {/* Wood grain pattern background */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="logoGrain" patternUnits="userSpaceOnUse" width="20" height="20"><path d="M0,10 Q5,8 10,10 T20,10" stroke="%23654321" stroke-width="0.5" fill="none" opacity="0.6"/><path d="M0,15 Q5,13 10,15 T20,15" stroke="%234A2C2A" stroke-width="0.3" fill="none" opacity="0.4"/></pattern></defs><rect width="100" height="100" fill="url(%23logoGrain)"/></svg>')`
                  }}
                />
                {/* Tree icon with leaves */}
                <div className="relative z-10 text-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl font-bold">🌳</span>
                </div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-forest-500/20 rounded-xl"></div>
              </div>
              <div className="hidden sm:flex flex-col">
                <h1 className="text-xl font-bold text-wood-800 leading-tight">اجاره ویلا سفرجا</h1>
                <p className="text-xs text-forest-600 font-medium">اقامت مطمئن در سراسر ایران</p>
              </div>
              {/* Mobile version - shorter text */}
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-wood-800">سفرجا</h1>
                <p className="text-xs text-forest-600">اجاره ویلا</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 space-x-reverse">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-wood-700 font-medium transition-colors duration-200 relative group px-4 py-2"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-wood-700 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 space-x-reverse ml-auto">
            {/* Search Button */}
            <Link href="/search" className="p-2 text-gray-600 hover:text-wood-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* User Account */}
            <Link href="/account" className="p-2 text-gray-600 hover:text-wood-700 transition-colors">
              <UserIcon className="w-5 h-5" />
            </Link>

            {/* Admin Panel */}
            <Link href="/admin/products" className="p-2 text-gray-600 hover:text-wood-700 transition-colors" title="پنل ادمین">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-wood-700 transition-colors">
              <ShoppingBagIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-2 text-gray-600 hover:text-wood-700 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
        )}>
          <nav className="flex flex-col space-y-3 pt-4 border-t border-cream-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-wood-700 font-medium py-2 px-4 rounded-lg hover:bg-cream-100 transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
