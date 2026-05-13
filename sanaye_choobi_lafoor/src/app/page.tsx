import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ShoppingBagIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

import { getPublishedPosts } from '@/lib/magazine';
import { getPublishedVillas, listVillas } from '@/lib/villas';

export const dynamic = 'force-dynamic';

const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price);

const formatMagazineDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'تازه منتشر شده';
  }

  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export default async function HomePage() {
  const magazinePosts = await getPublishedPosts(4);
  const featuredVillas = await getPublishedVillas(4);
  const discountSourceVillas = await listVillas();
  const discountedVillas = discountSourceVillas.filter((villa) => {
    return Number(villa.discount) > 0;
  }).slice(0, 3);
  const featuredMagazinePost = magazinePosts[0] ?? null;
  const recentMagazinePosts = magazinePosts.slice(1);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pwa-hero relative md:h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Wood Pattern */}
        <div className="absolute inset-0 z-0">
          {/* Main Background */}
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 69, 19, 0.4), rgba(46, 139, 87, 0.4)),
                url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><pattern id="wood" patternUnits="userSpaceOnUse" width="200" height="200"><rect width="200" height="200" fill="%23DEB887"/><path d="M0,100 Q50,80 100,100 T200,100" stroke="%23CD853F" stroke-width="2" fill="none" opacity="0.5"/><path d="M0,120 Q50,100 100,120 T200,120" stroke="%23CD853F" stroke-width="1.5" fill="none" opacity="0.3"/><path d="M0,80 Q50,60 100,80 T200,80" stroke="%23D2B48C" stroke-width="1" fill="none" opacity="0.4"/><circle cx="50" cy="100" r="15" fill="%23A0522D" opacity="0.3"/><circle cx="150" cy="120" r="10" fill="%23A0522D" opacity="0.2"/></pattern></defs><rect width="1200" height="800" fill="url(%23wood)"/><g opacity="0.1"><circle cx="200" cy="150" r="50" fill="%23228B22"/><circle cx="800" cy="200" r="70" fill="%23228B22"/><circle cx="1000" cy="600" r="60" fill="%23228B22"/><path d="M100,300 Q200,250 300,300 Q400,350 500,300" stroke="%23228B22" stroke-width="10" fill="none"/></g></svg>')
              `
            }}
          >
          </div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 text-6xl opacity-20 animate-bounce-gentle" style={{animationDelay: '0s'}}>🌲</div>
            <div className="absolute top-1/3 right-1/4 text-4xl opacity-15 animate-bounce-gentle" style={{animationDelay: '1s'}}>🍃</div>
            <div className="absolute bottom-1/3 left-1/3 text-5xl opacity-10 animate-bounce-gentle" style={{animationDelay: '2s'}}>🌿</div>
            <div className="absolute bottom-1/4 right-1/3 text-3xl opacity-20 animate-bounce-gentle" style={{animationDelay: '0.5s'}}>🪵</div>
            <div className="absolute top-1/2 left-1/6 text-4xl opacity-15 animate-bounce-gentle" style={{animationDelay: '1.5s'}}>🌳</div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container-custom text-center">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-wood-700 text-sm font-medium mb-6 shadow-lg">
              <span className="w-2 h-2 bg-forest-500 rounded-full ml-2"></span>
              رزرو مطمئن ویلا و اقامتگاه
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-wood-800 mb-6 leading-tight">
              اجاره ویلا
              <span className="block text-forest-700">سفرجا</span>
            </h1>

            <form action="/search" method="get" className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  name="q"
                  placeholder="جستجوی ویلا یا مقصد..."
                  className="w-full rounded-full border border-wood-200 bg-white/95 px-5 py-3 pr-12 text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-wood-500"
                />
                <button
                  type="button"
                  title="جستجوی صوتی"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-gray-600 hover:text-wood-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10a7 7 0 0014 0" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17v4" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Subtitle */}
            <p className="text-lg md:text-2xl text-gray-800 mb-8 leading-relaxed max-w-2xl mx-auto font-medium">
              تجربه اقامت دلنشین در مقاصد محبوب ایران
              <br />
              <span className="text-forest-700 font-bold">رزرو سریع، پشتیبانی کامل، قیمت منصفانه</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
              <Link
                href="/products"
                className="btn-primary text-lg px-8 py-4 flex items-center gap-3 group"
              >
                مشاهده ویلاها
                <ArrowLeftIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/special-offers"
                className="btn-secondary text-lg px-8 py-4 flex items-center gap-3"
              >
                <ClockIcon className="w-5 h-5" />
                پیشنهادهای ویژه
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-wood-900">۸۰+</div>
                <div className="text-sm text-gray-800 font-medium">مقصد محبوب</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-wood-900">۱۵۰۰+</div>
                <div className="text-sm text-gray-800 font-medium">ویلا و اقامتگاه</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-wood-900">۲۰کـ</div>
                <div className="text-sm text-gray-800 font-medium">مهمان راضی</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle hidden md:flex">
          <div className="w-6 h-10 border-2 border-wood-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-wood-600 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Featured Villas Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-wood-800 mb-4">ویلاهای پرطرفدار</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              انتخاب بهترین اقامتگاه‌ها با امکانات کامل و موقعیت عالی
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredVillas.map((villa) => (
              <Link
                key={villa.id}
                href={`/villa/${villa.id}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-lg hover-lift"
              >
                <div className="relative aspect-square overflow-hidden bg-cream-100">
                  <div className="absolute top-3 right-3 z-10">
                    <span className="rounded-full bg-wood-600 px-3 py-1 text-xs font-medium text-white">
                      {villa.discount > 0 ? `${villa.discount}% تخفیف` : villa.isNew ? 'جدید' : 'ویژه'}
                    </span>
                  </div>

                  {villa.images?.[0]?.url ? (
                    <img src={villa.images[0].url} alt={villa.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-wood-100 to-wood-200 text-wood-400 text-6xl">
                      🏠
                    </div>
                  )}
                </div>

                <div className="p-6 pt-5">
                  <h3 className="mb-2 line-clamp-2 text-lg font-bold text-wood-800 group-hover:text-wood-600 transition-colors">
                    {villa.name}
                  </h3>
                  <p className="mb-3 text-forest-600">{villa.location || villa.category}</p>

                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, index) => (
                        <span key={index} className={index < Math.floor(villa.rating) ? 'text-yellow-400' : 'text-gray-300'}>⭐</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 mr-2">({villa.rating})</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {villa.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(villa.originalPrice)} تومان
                      </span>
                    )}
                    <span className="text-xl font-bold text-wood-700">
                      {formatPrice(villa.price)} تومان / شب
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products" className="btn-outline text-lg px-8 py-3 inline-flex items-center gap-3 group">
              مشاهده همه ویلاها
              <ArrowLeftIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Social Network Section */}
      <section className="py-20 bg-gradient-to-br from-cream-50 to-wood-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-wood-800 mb-4">شبکه اجتماعي سفرجا</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              بهترين لحظه هاي سفر را ثبت کنيد، در چالش هاي هفتگي شرکت کنيد و جايزه بگيريد.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-bold text-wood-800 mb-3">چالش بهترين عکس ويلا</h3>
              <p className="text-gray-700 leading-relaxed">
                از ويلا يا اقامتگاه خود عکس بگيريد، منتشر کنيد و براي جايزه ماهانه رقابت کنيد.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-wood-800 mb-3">چالش هاي سفر</h3>
              <p className="text-gray-700 leading-relaxed">
                چالش هاي خلاقانه مثل بهترين طلوع، بهترين غذاي محلي و تجربه خاص سفر.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-wood-800 mb-3">جوايز و امتيازها</h3>
              <p className="text-gray-700 leading-relaxed">
                امتياز بگيريد، در قرعه کشي ها شرکت کنيد و تخفيف هاي ويژه دريافت کنيد.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-wood-800 mb-4">چطور شرکت کنم؟</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-wood-600" />
                    عکس يا ويديو از اقامت خود بگيريد و با هشتگ سفرجا منتشر کنيد.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-wood-600" />
                    در صفحه شبکه اجتماعي، لينک پست را ثبت کنيد.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-wood-600" />
                    بهترين آثار هر ماه انتخاب مي شوند و جايزه مي گيرند.
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/social"
                  className="btn-primary px-6 py-3 inline-flex items-center justify-center"
                >
                  ثبت چالش جديد
                </Link>
                <Link
                  href="/social"
                  className="btn-outline px-6 py-3 inline-flex items-center justify-center"
                >
                  مشاهده تجربه ها
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">🔥</div>
          <div className="absolute top-20 right-20 text-4xl">✨</div>
          <div className="absolute bottom-20 left-20 text-5xl">�</div>
          <div className="absolute bottom-10 right-10 text-3xl">💎</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">�️</div>
        </div>
        
        <div className="container-custom relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">🔥 تخفیف ویژه هفته! 🔥</h2>
            <p className="text-xl mb-8 text-white drop-shadow-md">
              تا ۳۰٪ تخفیف روی ویلاهای منتخب
              <br />
              <span className="text-yellow-200 font-semibold">فقط تا پایان این هفته!</span>
            </p>

            {/* Countdown Timer */}
            <div className="flex justify-center items-center gap-6 mb-8">
              {[
                { time: '۰۳', label: 'روز' },
                { time: '۱۲', label: 'ساعت' },
                { time: '۲۴', label: 'دقیقه' },
                { time: '۳۵', label: 'ثانیه' }
              ].map(({ time, label }, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/25 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/40 shadow-xl">
                    <span className="text-2xl font-bold text-white drop-shadow-lg">{time}</span>
                  </div>
                  <div className="text-sm mt-2 text-yellow-100 font-medium">{label}</div>
                </div>
              ))}
            </div>

            <Link
              href="/special-offers"
              className="btn-primary bg-white text-orange-600 hover:bg-yellow-50 hover:text-red-600 text-lg px-8 py-4 inline-flex items-center gap-3 shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              🎁 مشاهده تخفیف‌ها
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
          </div>

          {discountedVillas.length === 0 ? (
            <div className="mt-12 text-center text-white/90">
              هنوز تخفیف فعالی ثبت نشده است.
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {discountedVillas.map((villa) => {
                const basePrice = villa.originalPrice && villa.originalPrice > villa.price
                  ? villa.originalPrice
                  : villa.price;
                const discountedPrice = Math.max(0, Math.round(basePrice * (1 - (villa.discount || 0) / 100)));
                const firstImage = villa.images?.[0];
                const imageUrl = typeof firstImage === 'string'
                  ? firstImage
                  : (firstImage?.url || '');

                return (
                  <Link
                    key={villa.id}
                    href={`/villa/${villa.id}`}
                    className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden text-right"
                  >
                    <div className="h-40 bg-gradient-to-br from-wood-100 via-cream-100 to-forest-100 flex items-center justify-center text-4xl overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt={villa.name} className="h-full w-full object-cover" />
                      ) : (
                        <span>🏡</span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                          تخفیف {villa.discount}%
                        </span>
                        <span className="text-xs text-gray-500">{villa.location || villa.category}</span>
                      </div>
                      <h3 className="text-lg font-bold text-wood-800 mb-2 group-hover:text-wood-600 transition-colors">
                        {villa.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-wood-800">
                          {discountedPrice.toLocaleString('fa-IR')} تومان
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {basePrice.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-wood-800 mb-4">مقاصد محبوب</h2>
            <p className="text-xl text-gray-700 font-medium">
              مقصدتان را انتخاب کنید و رزرو را آغاز کنید
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'رامسر', icon: '🌊', count: '۸۵ اقامتگاه', color: 'from-orange-400 to-orange-600' },
              { name: 'چالوس', icon: '🌲', count: '۴۲ اقامتگاه', color: 'from-green-400 to-green-600' },
              { name: 'متل قو', icon: '🏖️', count: '۶۳ اقامتگاه', color: 'from-blue-400 to-blue-600' },
              { name: 'ماسال', icon: '⛰️', count: '۲۷ اقامتگاه', color: 'from-purple-400 to-purple-600' },
              { name: 'کیش', icon: '☀️', count: '۱۹ اقامتگاه', color: 'from-pink-400 to-pink-600' },
              { name: 'شیراز', icon: '🏛️', count: '۳۱ اقامتگاه', color: 'from-indigo-400 to-indigo-600' },
              { name: 'اصفهان', icon: '🕌', count: '۱۵ اقامتگاه', color: 'from-yellow-400 to-yellow-600' },
              { name: 'همه مقاصد', icon: '🌟', count: '۲۸۲ اقامتگاه', color: 'from-wood-500 to-wood-700' },
            ].map((category, index) => (
              <Link
                key={index}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group card hover-lift text-center p-6 cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="font-semibold text-wood-800 mb-2 group-hover:text-wood-600">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-700 font-medium">{category.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-wood-50 to-cream-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-wood-900 mb-4">نظرات مهمانان</h2>
            <p className="text-xl text-gray-800 font-medium">
              آنچه مهمانان ما درباره اقامتشان می‌گویند
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'سارا احمدی',
                role: 'مهمان رامسر',
                avatar: '👩‍🍳',
                rating: 5,
                comment: 'اقامت فوق‌العاده‌ای داشتیم. ویلا بسیار تمیز و دقیقا مطابق عکس‌ها بود.'
              },
              {
                name: 'علی رضایی',
                role: 'مهمان چالوس',
                avatar: '👨‍🎨',
                rating: 5,
                comment: 'فرآیند رزرو سریع بود و پشتیبانی در طول سفر همیشه پاسخگو بود.'
              },
              {
                name: 'فاطمه کریمی',
                role: 'مهمان کیش',
                avatar: '👩‍👧‍👦',
                rating: 5,
                comment: 'اقامتگاه امکانات کامل داشت و میزبان بسیار خوش‌برخورد بود. دوباره رزرو می‌کنم.'
              }
            ].map((testimonial, index) => (
              <div key={index} className="card text-center">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-800 mb-4 leading-relaxed font-medium">&ldquo;{testimonial.comment}&rdquo;</p>
                <div>
                  <h4 className="font-semibold text-wood-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-700">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Magazine/Blog Section */}
      <section className="py-20 bg-gradient-to-br from-cream-50 to-wood-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-wood-900 mb-4">📖 مجله سفر و اقامت</h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto font-medium">
              راهنماها، نکات کاربردی و تجربه‌های واقعی از سفر و اقامت
            </p>
          </div>

          {magazinePosts.length > 0 ? (
            <>
              {/* Featured Article - Mobile-First Design */}
              <div className="mb-12">
                <div className="card overflow-hidden hover-lift group">
                  <div className="md:flex">
                    {/* Article Image */}
                    <div className="md:w-1/2 relative">
                      <div className="aspect-video md:aspect-[4/3] bg-gradient-to-br from-wood-200 via-wood-300 to-wood-500 flex items-center justify-center relative overflow-hidden">
                        {featuredMagazinePost?.imageUrl ? (
                          <img
                            src={featuredMagazinePost.imageUrl}
                            alt={featuredMagazinePost.title}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-orange-200/50"></div>
                            <div className="relative text-center z-10">
                              <div className="text-6xl mb-2">🛠️</div>
                              <div className="flex justify-center gap-3 text-2xl">
                                <span>🪚</span>
                                <span>🔨</span>
                                <span>🪵</span>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-wood-900/80 via-wood-900/40 to-transparent"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden z-10">
                          <span className="inline-block bg-forest-500 text-white px-3 py-1 rounded-full text-xs font-medium mb-2">
                            {featuredMagazinePost?.tags[0] || 'مجله سفر'}
                          </span>
                          <h3 className="text-white font-bold text-lg leading-tight">
                            {featuredMagazinePost?.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="md:w-1/2 p-6 md:p-8">
                      <div className="hidden md:block mb-4">
                        <span className="inline-block bg-forest-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                          {featuredMagazinePost?.tags[0] || 'مجله سفر'}
                        </span>
                      </div>

                      <h3 className="hidden md:block text-2xl font-bold text-wood-900 mb-4 group-hover:text-wood-700 transition-colors">
                        {featuredMagazinePost?.title}
                      </h3>

                      <h3 className="md:hidden text-xl font-bold text-wood-900 mb-3 mt-4">
                        {featuredMagazinePost?.title}
                      </h3>

                      <p className="text-gray-800 leading-relaxed mb-6 text-base md:text-lg font-medium">
                        {featuredMagazinePost?.excerpt}
                      </p>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 bg-wood-500 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-white text-sm">👨‍🏫</span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-wood-900 text-sm truncate">
                              {featuredMagazinePost?.author}
                            </p>
                            <p className="text-gray-700 text-xs">
                              {featuredMagazinePost
                                ? formatMagazineDate(featuredMagazinePost.publishedAt || featuredMagazinePost.createdAt)
                                : ''}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={featuredMagazinePost ? `/blog/${featuredMagazinePost.id}` : '/blog'}
                          className="text-forest-600 hover:text-forest-700 font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all shrink-0"
                        >
                          مطالعه
                          <ArrowLeftIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Articles Grid - Mobile-optimized */}
              {recentMagazinePosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recentMagazinePosts.map((post, index) => {
                    const gradients = [
                      'from-orange-400 to-red-500',
                      'from-blue-400 to-purple-500',
                      'from-green-400 to-teal-500',
                    ];

                    return (
                      <Link
                        key={post.id}
                        href={`/blog/${post.id}`}
                        className="card group hover-lift cursor-pointer"
                      >
                        <div className={`aspect-video bg-gradient-to-br ${gradients[index % gradients.length]} rounded-xl mb-4 flex items-center justify-center text-4xl relative overflow-hidden`}>
                          {post.imageUrl ? (
                            <img src={post.imageUrl} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
                          ) : (
                            <span>📚</span>
                          )}

                          <div className="absolute top-3 right-3">
                            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                              {post.tags[0] || 'مجله سفر'}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-3">
                            <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                              <ClockIcon className="w-3 h-3" />
                              مطالعه سریع
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-wood-900 mb-3 leading-snug group-hover:text-wood-700 transition-colors">
                            {post.title}
                          </h4>

                          <div className="flex items-center justify-between text-sm text-gray-800 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 bg-wood-200 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-xs">✍️</span>
                              </div>
                              <span className="font-medium truncate">{post.author}</span>
                            </div>
                            <span className="font-medium shrink-0">{formatMagazineDate(post.publishedAt || post.createdAt)}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-3xl border border-wood-200 bg-white p-8 text-center shadow-sm">
              <h3 className="text-2xl font-bold text-wood-900 mb-3">هنوز مطلبی در مجله ثبت نشده</h3>
              <p className="text-gray-700 mb-6">به محض اینکه از پنل ادمین مطلب منتشر شود، همین بخش به‌صورت خودکار با محتوای واقعی پر می‌شود.</p>
              <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
                مشاهده مجله
                <ArrowLeftIcon className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* View All Articles Button */}
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="btn-outline text-lg px-8 py-3 inline-flex items-center gap-3 group"
            >
              📚 مشاهده همه مقالات
              <ArrowLeftIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact / Office Info */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-wood-800 mb-4">اطلاعات تماس و پشتیبانی</h2>
            <p className="text-xl text-gray-700 font-medium">
              برای ارتباط سریع با تیم سفرجا از اطلاعات زیر استفاده کنید.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-wood-100 bg-cream-50 p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-wood-800 mb-6">راه‌های ارتباطی</h3>
              <div className="space-y-5 text-gray-700">
                <div>
                  <p className="font-semibold text-wood-800 mb-2">تلفن تماس</p>
                  <p className="text-lg">011-4244-4703</p>
                  <p className="mt-1 text-sm text-gray-600">پشتیبانی ۲۴ ساعته</p>
                </div>
                <div>
                  <p className="font-semibold text-wood-800 mb-2">ایمیل</p>
                  <p className="text-lg">info@safarja.com</p>
                  <p className="text-lg">support@safarja.com</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-wood-100 bg-white p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-wood-800 mb-6">آدرس و ساعات کاری</h3>
              <div className="space-y-5 text-gray-700">
                <div>
                  <p className="font-semibold text-wood-800 mb-2">آدرس</p>
                  <p>مازندران، سوادکوه، شهر شیرگاه</p>
                  <p>کوچه شهید تیموری، جنب ثبت احوال، دفتر رزرواسیون</p>
                </div>
                <div>
                  <p className="font-semibold text-wood-800 mb-2">ساعات کاری</p>
                  <p>شنبه تا چهارشنبه: 8 تا 17</p>
                  <p>پنجشنبه: 8 تا 13</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
