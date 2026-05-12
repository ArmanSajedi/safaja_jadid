import Link from 'next/link';

const roles = [
  { id: 1, title: 'کارشناس پشتيباني مشتريان', type: 'تمام وقت' },
  { id: 2, title: 'توليد محتوا و سوشال', type: 'دورکار' },
  { id: 3, title: 'طراح رابط کاربري', type: 'پروژه اي' },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
      <div className="container-custom">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-wood-800">فرصت هاي شغلي</h1>
          <p className="text-gray-600 mt-2">به تيم سفرجا بپيونديد و تجربه هاي بهتر بسازيد.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="bg-white rounded-2xl shadow-lg p-6 border border-cream-200">
              <h3 className="text-lg font-bold text-wood-800">{role.title}</h3>
              <p className="text-sm text-gray-500 mt-2">{role.type}</p>
              <Link href="/contact" className="mt-4 inline-flex text-wood-700 font-semibold">
                ارسال رزومه
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
