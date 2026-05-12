import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'اجاره ویلا سفرجا - رزرو مطمئن اقامتگاه',
    template: '%s | اجاره ویلا سفرجا',
  },
  description: 'اجاره ویلا سفرجا با سال‌ها تجربه، مجموعه‌ای از ویلاها و اقامتگاه‌های منتخب را در سراسر ایران ارائه می‌دهد. رزرو سریع، قیمت شفاف و پشتیبانی کامل.',
  keywords: [
    'اجاره ویلا',
    'سفرجا',
    'رزرو ویلا',
    'اقامتگاه',
    'ویلا ساحلی',
    'کلبه جنگلی',
    'رزرو آنلاین',
    'سفر داخلی',
    'پشتیبانی سفر',
  ],
  authors: [{ name: 'اجاره ویلا سفرجا' }],
  creator: 'اجاره ویلا سفرجا',
  publisher: 'اجاره ویلا سفرجا',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://laforvillas.ir',
    title: 'اجاره ویلا سفرجا - رزرو مطمئن اقامتگاه',
    description: 'ویلاها و اقامتگاه‌های منتخب در سراسر ایران با رزرو سریع و پشتیبانی کامل.',
    siteName: 'اجاره ویلا سفرجا',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'اجاره ویلا سفرجا',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'اجاره ویلا سفرجا - رزرو مطمئن اقامتگاه',
    description: 'ویلاها و اقامتگاه‌های منتخب با رزرو سریع و پشتیبانی کامل',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-verification-code',
  },
  alternates: {
    canonical: 'https://laforvillas.ir',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="rtl" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#8B4513" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased bg-cream-50 text-gray-900">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pb-24 pwa-main">
            {children}
          </main>
          <BottomNav />
          <Footer />
        </div>
      </body>
    </html>
  );
}
