import Link from 'next/link';

const steps = [
  'ثبت نام و تکميل اطلاعات ويلا',
  'بارگذاري تصاوير و امکانات',
  'تاييد نهايي توسط تيم پشتيباني',
  'شروع رزرو و مديريت تقويم',
];

export default function HostsGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
      <div className="container-custom">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-wood-800">راهنماي ميزبانان</h1>
          <p className="text-gray-600 mt-2">مسير ساده براي شروع ميزباني در سفرجا.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-cream-200">
          <ol className="space-y-3 text-gray-700 list-decimal list-inside">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/hosts/register" className="btn-primary">
              ثبت نام ميزبان
            </Link>
            <Link href="/hosts/rules" className="btn-secondary">
              قوانين ميزباني
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
