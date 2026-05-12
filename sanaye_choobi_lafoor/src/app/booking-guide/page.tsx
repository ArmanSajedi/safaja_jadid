import { CheckCircleIcon, MapPinIcon, CreditCardIcon, HomeModernIcon } from '@heroicons/react/24/outline';

export default function BookingGuidePage() {
  const steps = [
    {
      title: 'انتخاب مقصد',
      description: 'شهر، تاريخ ورود و خروج و تعداد مهمان را مشخص کنيد.',
      icon: MapPinIcon,
    },
    {
      title: 'بررسي ويلا',
      description: 'امکانات، قوانين، نظرات و تقويم قيمت را بررسي کنيد.',
      icon: HomeModernIcon,
    },
    {
      title: 'ثبت رزرو',
      description: 'درخواست رزرو را ثبت و اطلاعات مهمان را تکميل کنيد.',
      icon: CheckCircleIcon,
    },
    {
      title: 'پرداخت امن',
      description: 'پرداخت را از طريق درگاه امن سفرجا انجام دهيد.',
      icon: CreditCardIcon,
    },
  ];

  const tips = [
    'پيش از رزرو، قوانين ميزبان را با دقت بخوانيد.',
    'در صورت نياز به راهنمايي، با پشتيباني تماس بگيريد.',
    'براي تخفيف هاي ويژه، اعلان هاي سفرجا را فعال کنيد.',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50">
      <section className="relative py-20 bg-gradient-to-r from-wood-700 via-wood-600 to-forest-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">راهنماي رزرو</h1>
          <p className="text-xl max-w-3xl mx-auto">مراحل رزرو ويلا در سفرجا را قدم به قدم دنبال کنيد.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div key={step.title} className="bg-white rounded-2xl shadow-xl p-6 flex gap-4">
              <div className="w-12 h-12 bg-wood-600 rounded-xl flex items-center justify-center">
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-wood-800 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-wood-800 mb-4">نکات مهم قبل از رزرو</h2>
          <ul className="space-y-3 text-gray-700">
            {tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-wood-600" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
