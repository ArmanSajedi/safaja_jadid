import Link from 'next/link';

const offers = [
  {
    id: 1,
    title: 'ويلا استخردار متل قو',
    location: 'متل قو',
    price: '3,900,000',
    discount: '30%',
  },
  {
    id: 2,
    title: 'کلبه جنگلي ماسال',
    location: 'ماسال',
    price: '2,100,000',
    discount: '25%',
  },
  {
    id: 3,
    title: 'ويلا ساحلي رامسر',
    location: 'رامسر',
    price: '3,200,000',
    discount: '20%',
  },
];

export default function SpecialOffersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
      <div className="container-custom">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-wood-800">پیشنهادهای ويژه اين هفته</h1>
          <p className="text-gray-600 mt-2">تخفيض‌هاي محدود براي رزرو سريع.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">
              مشاهده همه ويلاها
            </Link>
            <Link href="/search" className="btn-secondary">
              جستجوي سريع
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl shadow-lg p-6 border border-cream-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold bg-red-500 text-white px-2 py-1 rounded-full">
                  {offer.discount} تخفيف
                </span>
                <span className="text-xs text-gray-500">{offer.location}</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-wood-800">{offer.title}</h3>
              <p className="text-wood-700 mt-2">{offer.price} تومان / شب</p>
              <Link href="/products" className="mt-4 inline-flex text-wood-700 font-semibold">
                مشاهده جزئيات
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
