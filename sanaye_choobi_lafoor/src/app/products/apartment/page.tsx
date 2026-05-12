import Link from 'next/link';

export default function ApartmentProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
      <div className="container-custom">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-wood-800">آپارتمان مبله</h1>
          <p className="text-gray-600 mt-2">اقامت شهري و خانوادگي با دسترسي آسان.</p>
          <Link href="/products" className="mt-5 inline-flex btn-primary">
            مشاهده همه ويلاها
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-cream-200">
          <p className="text-gray-600">اين بخش به زودي با ليست کامل آپارتمان ها تکميل مي شود.</p>
        </div>
      </div>
    </div>
  );
}
