import Link from 'next/link';

import { listVillas } from '@/lib/villas';

export const dynamic = 'force-dynamic';

const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price);

const hasActiveDiscount = (specs: Record<string, string>, discount: number) => {
  void specs;
  return Number(discount) > 0;
};

export default async function SpecialOffersPage() {
  const villas = await listVillas();
  const offers = villas.filter((villa) => hasActiveDiscount(villa.specifications || {}, villa.discount || 0));
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

        {offers.length === 0 ? (
          <div className="rounded-2xl border border-wood-100 bg-white p-6 text-center text-gray-600">
            در حال حاضر تخفیف فعالی ثبت نشده است.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-cream-200">
                <div className="relative h-44 bg-gradient-to-br from-wood-100 via-cream-100 to-forest-100 overflow-hidden">
                  {offer.images?.[0]?.url ? (
                    <img
                      src={offer.images[0].url}
                      alt={offer.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl text-wood-400">
                      🏡
                    </div>
                  )}
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <span className="text-xs font-bold bg-red-700 text-white px-2 py-1 rounded-full shadow-md ring-1 ring-white/20">
                      {offer.discount}% تخفيف
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {(() => {
                    const basePrice = offer.originalPrice && offer.originalPrice > 0 ? offer.originalPrice : offer.price;
                    const discountedPrice = Math.max(0, Math.round(basePrice * 0.98));

                    return (
                      <>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-500">{offer.location || offer.category}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-wood-800">{offer.name}</h3>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-wood-700 font-semibold">{formatPrice(discountedPrice)} تومان / شب</p>
                    <p className="text-sm text-gray-400 line-through">{formatPrice(basePrice)} تومان</p>
                  </div>
                  <Link href={`/villa/${offer.id}`} className="mt-4 inline-flex text-wood-700 font-semibold">
                    مشاهده جزئيات
                  </Link>
                      </>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
