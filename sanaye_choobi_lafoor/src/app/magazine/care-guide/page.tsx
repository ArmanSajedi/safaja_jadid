import Link from 'next/link';

const tips = [
  'تهويه مناسب و نظافت دوره اي را در اولويت قرار دهيد.',
  'بازبيني تجهيزات گرمايش و سرمايش را قبل از فصل سفر انجام دهيد.',
  'چک ليست تحويل ويلا را آماده کنيد تا تجربه مهمان بهتر شود.',
  'از تصاوير به روز براي نمايش دقيق ويلا استفاده کنيد.',
];

export default function CareGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
      <div className="container-custom">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-wood-800">راهنماي مراقبت و نگهداري ويلا</h1>
          <p className="text-gray-600 mt-2">نکات ساده براي افزايش کيفيت و رضايت مهمان.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-cream-200">
          <ul className="space-y-3 text-gray-700">
            {tips.map((tip) => (
              <li key={tip} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-forest-500"></span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/hosts/register" className="btn-primary">
              ثبت نام ميزبان
            </Link>
            <Link href="/magazine" className="btn-secondary">
              بازگشت به مجله
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
