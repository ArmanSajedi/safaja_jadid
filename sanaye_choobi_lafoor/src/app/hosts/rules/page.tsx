import Link from 'next/link';

const rules = [
  'تاييد هويت و مالکيت ويلا الزامي است.',
  'قيمت گذاري شفاف و مطابق امکانات ارائه شود.',
  'زمان پاسخگويي به رزروها حداکثر 24 ساعت است.',
  'رعايت نظافت و امنيت در اولويت است.',
];

export default function HostsRulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
      <div className="container-custom">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-wood-800">قوانين ميزباني</h1>
          <p className="text-gray-600 mt-2">رعايت قوانين براي حفظ کيفيت خدمات و اعتماد مهمانان.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-cream-200">
          <ul className="space-y-3 text-gray-700">
            {rules.map((rule) => (
              <li key={rule} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-wood-600"></span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link href="/hosts/register" className="btn-primary">
              شروع ميزباني
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
