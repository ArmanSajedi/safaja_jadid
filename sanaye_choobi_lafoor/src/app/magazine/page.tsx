import Link from 'next/link';

const articles = [
  {
    id: 1,
    title: 'راهنماي انتخاب ويلا در شمال',
    excerpt: 'چگونه بهترين ويلا را براساس بودجه و نياز انتخاب کنيم.',
    href: '/blog',
  },
  {
    id: 2,
    title: 'راهنماي مراقبت و نگهداري ويلا',
    excerpt: 'نکات مهم براي ميزبانان جهت حفظ کيفيت ويلا.',
    href: '/magazine/care-guide',
  },
  {
    id: 3,
    title: 'چک ليست قبل از سفر',
    excerpt: 'آماده سازي قبل از رزرو و سفر به ويلا.',
    href: '/blog',
  },
];

export default function MagazinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
      <div className="container-custom">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-wood-800">مجله سفرجا</h1>
          <p className="text-gray-600 mt-2">مطالب آموزشي و راهنماهاي سفر و ميزباني.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((item) => (
            <Link key={item.id} href={item.href} className="bg-white rounded-2xl shadow-lg p-6 border border-cream-200 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-bold text-wood-800">{item.title}</h3>
              <p className="text-gray-600 mt-3 text-sm">{item.excerpt}</p>
              <span className="mt-4 inline-flex text-wood-700 font-semibold">مطالعه</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
