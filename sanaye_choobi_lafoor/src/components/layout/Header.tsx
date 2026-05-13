'use client';

import { useEffect, useState } from 'react';
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
  const [isUserAuthed, setIsUserAuthed] = useState(false);
  const [accountLabel, setAccountLabel] = useState('حساب کاربری');
  const [accountHref, setAccountHref] = useState('/account');
  const [accountAvatar, setAccountAvatar] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isHostAuthed = window.localStorage.getItem('demo-host-auth') === 'true';
    const isUserAuthed = window.localStorage.getItem('demo-auth') === 'true';
    setIsUserAuthed(isUserAuthed);

    if (isHostAuthed) {
      setAccountLabel('حساب میزبانی');
      setAccountHref('/hosts/dashboard');
      setAccountAvatar('م');
      return;
    }

    if (isUserAuthed) {
      setAccountLabel('حساب کاربری');
      setAccountHref('/account');
      const storedUser = window.localStorage.getItem('demo-user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser) as { firstName?: string; lastName?: string };
          const initials = `${parsed.firstName?.[0] || ''}${parsed.lastName?.[0] || ''}`.trim();
          setAccountAvatar(initials || 'ک');
        } catch {
          setAccountAvatar('ک');
        }
      } else {
        setAccountAvatar('ک');
      }
      return;
    }

    setAccountLabel('حساب کاربری');
    setAccountHref('/account');
    setAccountAvatar('');
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-cream-200 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center gap-6 py-3 md:py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-lg flex items-center justify-center bg-white border border-cream-200 overflow-hidden">
                <img
                  src="/safarja_logo2.png"
                  alt="سفرجا"
                  className="h-full w-full object-contain"
                />
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
          <div className="flex items-center space-x-4 space-x-reverse ms-auto">
            {/* Search Button */}
            <Link href="/search" className="p-2 text-gray-600 hover:text-wood-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* User Account */}
            <Link href={accountHref} className="p-2 text-gray-600 hover:text-wood-700 transition-colors flex items-center gap-2">
              {accountAvatar ? (
                <span className="h-7 w-7 rounded-full bg-wood-100 text-wood-700 text-xs font-bold flex items-center justify-center">
                  {accountAvatar}
                </span>
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
              <span className="hidden md:inline text-sm font-medium">{accountLabel}</span>
            </Link>

            {/* Shopping Cart */}
            {isUserAuthed && (
              <Link href="/cart" className="relative p-2 text-gray-600 hover:text-wood-700 transition-colors" title="سبد خرید">
                <ShoppingBagIcon className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="order-last lg:order-none lg:hidden p-2 text-gray-600 hover:text-wood-700 transition-colors"
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
