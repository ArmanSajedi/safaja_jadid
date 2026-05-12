import Link from 'next/link';

export default function ForestProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
      <div className="container-custom">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-wood-800">ويلاهاي جنگلي</h1>
          <p className="text-gray-600 mt-2">اقامت دنج در دل طبيعت و جنگل هاي شمال.</p>
          <Link href="/products" className="mt-5 inline-flex btn-primary">
            مشاهده همه ويلاها
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-cream-200">
          <p className="text-gray-600">اين بخش به زودي با ليست کامل ويلاهاي جنگلي تکميل مي شود.</p>
        </div>
      </div>
    </div>
  );
}
