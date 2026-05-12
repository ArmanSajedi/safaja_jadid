import Link from 'next/link';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const footerNavigation = {
  products: [
    { name: 'ویلاهای ساحلی', href: '/products/coastal' },
    { name: 'ویلاهای جنگلی', href: '/products/forest' },
    { name: 'کلبه سوئیسی', href: '/products/chalet' },
    { name: 'آپارتمان مبله', href: '/products/apartment' },
  ],
  company: [
    { name: 'درباره ما', href: '/about' },
    { name: 'تماس با ما', href: '/contact' },
    { name: 'فرصت‌های شغلی', href: '/careers' },
    { name: 'اخبار و مقالات', href: '/blog' },
  ],
  support: [
    { name: 'راهنمای رزرو', href: '/booking-guide' },
    { name: 'شرایط و قوانین', href: '/terms' },
    { name: 'حریم خصوصی', href: '/privacy' },
    { name: 'پشتیبانی', href: '/support' },
  ],
  hosts: [
    { name: 'ثبت‌نام میزبان', href: '/hosts/register' },
    { name: 'پنل میزبان', href: '/hosts/dashboard' },
    { name: 'راهنمای میزبان', href: '/hosts/guide' },
    { name: 'قوانین میزبان', href: '/hosts/rules' },
  ],
};

const socialLinks = [
  {
    name: 'اینستاگرام',
    href: '#',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12.017 0C8.396 0 7.999.016 6.79.048 5.579.081 4.794.208 4.09.396a5.84 5.84 0 00-2.11 1.373A5.84 5.84 0 00.396 4.09C.208 4.794.081 5.579.048 6.79.016 7.999 0 8.396 0 12.017c0 3.624.016 4.021.048 5.23.033 1.211.16 1.996.348 2.7a5.84 5.84 0 001.373 2.11 5.84 5.84 0 002.11 1.373c.704.188 1.489.315 2.7.348 1.209.032 1.606.048 5.23.048 3.624 0 4.021-.016 5.23-.048 1.211-.033 1.996-.16 2.7-.348a5.84 5.84 0 002.11-1.373 5.84 5.84 0 001.373-2.11c.188-.704.315-1.489.348-2.7.032-1.209.048-1.606.048-5.23 0-3.624-.016-4.021-.048-5.23-.033-1.211-.16-1.996-.348-2.7a5.84 5.84 0 00-1.373-2.11A5.84 5.84 0 0019.913.396c-.704-.188-1.489-.315-2.7-.348C16.004.016 15.607 0 12.017 0zm0 2.16c3.557 0 3.98.015 5.38.047 1.296.059 2.003.275 2.47.458.622.242 1.066.532 1.532.998.467.466.757.91.998 1.532.183.467.399 1.174.458 2.47.032 1.4.047 1.823.047 5.38 0 3.557-.015 3.98-.047 5.38-.059 1.296-.275 2.003-.458 2.47-.242.622-.532 1.066-.998 1.532-.466.467-.91.757-1.532.998-.467.183-1.174.399-2.47.458-1.4.032-1.823.047-5.38.047-3.557 0-3.98-.015-5.38-.047-1.296-.059-2.003-.275-2.47-.458-.622-.242-1.066-.532-1.532-.998-.467-.466-.757-.91-.998-1.532-.183-.467-.399-1.174-.458-2.47-.032-1.4-.047-1.823-.047-5.38 0-3.557.015-3.98.047-5.38.059-1.296.275-2.003.458-2.47.242-.622.532-1.066.998-1.532.466-.467.91-.757 1.532-.998.467-.183 1.174-.399 2.47-.458 1.4-.032 1.823-.047 5.38-.047z"
          clipRule="evenodd"
        />
        <path d="M12.017 5.838a6.179 6.179 0 100 12.358 6.179 6.179 0 000-12.358zm0 10.186a4.007 4.007 0 110-8.014 4.007 4.007 0 010 8.014zm7.846-10.405a1.441 1.441 0 11-2.883 0 1.441 1.441 0 012.883 0z" />
      </svg>
    ),
  },
  {
    name: 'تلگرام',
    href: '#',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm5.568 8.16c-.123 1.286-.862 6.03-1.218 8.001-.151.836-.448 1.115-.736 1.143-.625.057-1.1-.413-1.705-.809-1.094-.719-1.711-1.164-2.771-1.866-1.226-.815-.431-1.264.267-1.997.182-.191 3.344-3.063 3.406-3.326.008-.033.014-.156-.059-.221-.073-.066-.181-.043-.259-.025-.109.025-1.845 1.174-5.212 3.447-.493.337-.94.501-1.341.492-.442-.01-1.291-.25-1.922-.455-.775-.251-1.391-.384-1.337-.809.028-.221.336-.447.925-.677 3.629-1.585 6.048-2.63 7.257-3.135 3.453-1.402 4.17-1.646 4.636-1.654.103-.002.334.024.483.144.127.103.161.239.179.336.017.097.039.318.022.49z"/>
      </svg>
    ),
  },
  {
    name: 'واتساپ',
    href: '#',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.085"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-wood-50 to-cream-100 border-t border-cream-200">
      <div className="container-custom">
        <div className="md:hidden py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-wood-800">اجاره ویلا سفرجا</p>
              <p className="text-xs text-gray-600">پشتیبانی ۲۴/۷</p>
            </div>
            <Link
              href="/support"
              className="text-sm font-medium text-wood-700 bg-white rounded-full px-4 py-2 shadow-sm"
            >
              پشتیبانی
            </Link>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-wood-700 transition-colors">
              حریم خصوصی
            </Link>
            <Link href="/terms" className="hover:text-wood-700 transition-colors">
              شرایط استفاده
            </Link>
            <Link href="/contact" className="hover:text-wood-700 transition-colors">
              تماس
            </Link>
          </div>
        </div>

        <div className="hidden md:block">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 space-x-reverse mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-wood-500 to-wood-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">ل</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-wood-800">اجاره ویلا سفرجا</h3>
                  <p className="text-sm text-forest-600">اقامت مطمئن و آسان</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                اجاره ویلا سفرجا با سال‌ها تجربه، مجموعه‌ای از ویلاهای منتخب و استاندارد را در مقاصد محبوب ایران ارائه می‌دهد. هر اقامتگاه با دقت بررسی می‌شود تا تجربه‌ای امن، تمیز و خاطره‌انگیز داشته باشید.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 space-x-reverse text-gray-600">
                  <PhoneIcon className="w-5 h-5 text-forest-600 flex-shrink-0" />
                  <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse text-gray-600">
                  <EnvelopeIcon className="w-5 h-5 text-forest-600 flex-shrink-0" />
                  <span>info@laforvillas.ir</span>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse text-gray-600">
                  <MapPinIcon className="w-5 h-5 text-forest-600 flex-shrink-0 mt-0.5" />
                  <span>تهران، خیابان آزادی، پلاک ۱۲۳</span>
                </div>
              </div>
            </div>

            {/* Products Links */}
            <div>
              <h3 className="text-lg font-semibold text-wood-800 mb-6">ویلاها</h3>
              <ul className="space-y-3">
                {footerNavigation.products.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-wood-700 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold text-wood-800 mb-6">شرکت</h3>
              <ul className="space-y-3">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-wood-700 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold text-wood-800 mb-6">پشتیبانی</h3>
              <ul className="space-y-3 mb-6">
                {footerNavigation.support.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-wood-700 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Links */}
              <div>
                <h4 className="text-sm font-semibold text-wood-800 mb-3">ما را دنبال کنید</h4>
                <div className="flex space-x-3 space-x-reverse">
                  {socialLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-wood-600 hover:text-wood-800 hover:bg-cream-200 transition-all duration-200 shadow-sm"
                    >
                      <span className="sr-only">{item.name}</span>
                      <item.icon className="w-4 h-4" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-cream-300">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-wood-800 mb-4">عضویت در خبرنامه</h3>
            <p className="text-gray-600 mb-4 text-sm">
              از جدیدترین ویلاها، تخفیف‌ها و اخبار سفر با خبر شوید.
            </p>
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="ایمیل شما"
                className="flex-1 input-custom text-sm"
              />
              <button
                type="submit"
                className="btn-primary text-sm px-4 py-2 whitespace-nowrap"
              >
                عضویت
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-cream-300">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Trust Symbols and Digital Badges */}
            <div className="flex flex-col items-center md:items-start">
              <p className="text-sm text-gray-600 mb-3">
                © ۱۴۰۳ اجاره ویلا سفرجا. تمامی حقوق محفوظ است.
              </p>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-4">
                {/* E-commerce Symbol */}
                <div className="w-16 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <div className="text-white text-center">
                    <div className="text-xs font-bold">نماد</div>
                    <div className="text-xs">اعتماد</div>
                  </div>
                </div>

                {/* Electronic Trust Symbol */}
                <div className="w-16 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                  <div className="text-white text-center">
                    <div className="text-lg">🛡️</div>
                    <div className="text-xs">ایمن</div>
                  </div>
                </div>

                {/* Quality Assurance */}
                <div className="w-16 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                  <div className="text-white text-center">
                    <div className="text-lg">✓</div>
                    <div className="text-xs">کیفیت</div>
                  </div>
                </div>

                {/* Secure Payment */}
                <div className="w-16 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <div className="text-white text-center">
                    <div className="text-lg">💳</div>
                    <div className="text-xs">امن</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-wood-700 transition-colors">
                حریم خصوصی
              </Link>
              <Link href="/terms" className="hover:text-wood-700 transition-colors">
                شرایط استفاده
              </Link>
              <Link href="/cookies" className="hover:text-wood-700 transition-colors">
                کوکی‌ها
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
