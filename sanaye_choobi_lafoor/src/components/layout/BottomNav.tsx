"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
  ShoppingBagIcon,
  UserIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

export default function BottomNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('demo-auth');
    setIsLoggedIn(stored === 'true');
  }, []);

  const navItems = [
    { name: 'خانه', href: '/', icon: HomeIcon },
    { name: 'جستجو', href: '/search', icon: MagnifyingGlassIcon },
    { name: 'ویلاها', href: '/products', icon: BuildingOffice2Icon },
    isLoggedIn
      ? { name: 'رزروها', href: '/cart', icon: ShoppingBagIcon }
      : { name: 'میزبان شوید', href: '/hosts/register', icon: UserPlusIcon },
    { name: 'حساب', href: '/account', icon: UserIcon },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:pb-6">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-2xl border border-cream-200 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur-md md:max-w-2xl md:rounded-full md:px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-gray-700 transition-colors hover:text-wood-700"
            >
              <Icon className="h-5 w-5 md:h-6 md:w-6" />
              <span className="text-[11px] font-medium md:text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
