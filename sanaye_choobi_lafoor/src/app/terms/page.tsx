import { ShieldCheckIcon, ClipboardDocumentListIcon, BanknotesIcon } from '@heroicons/react/24/outline';

export default function TermsPage() {
  const sections = [
    {
      title: 'شرکت کننده ها و مسئوليت ها',
      icon: ShieldCheckIcon,
      items: [
        'سفرجا واسطه رزرو است و مالک اقامتگاه نيست.',
        'ميزبان مسئول صحت اطلاعات و کيفيت اقامتگاه است.',
        'مهمان موظف است قوانين ميزبان را رعايت کند.',
      ],
    },
    {
      title: 'رزرو و لغو',
      icon: ClipboardDocumentListIcon,
      items: [
        'ثبت رزرو به معناي پذيرش شرايط سفرجا است.',
        'لغو رزرو طبق قوانين هر ويلا انجام مي شود.',
        'بازگشت وجه بعد از تاييد ميزبان انجام خواهد شد.',
      ],
    },
    {
      title: 'پرداخت و تسويه',
      icon: BanknotesIcon,
      items: [
        'پرداخت ها تنها از طريق درگاه هاي معتبر سفرجا انجام مي شود.',
        'تسويه با ميزبان طبق زمان بندي اعلام شده انجام خواهد شد.',
        'هرگونه پرداخت خارج از سيستم سفرجا مورد تاييد نيست.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50">
      <section className="relative py-20 bg-gradient-to-r from-wood-700 via-wood-600 to-forest-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">شرايط و قوانين</h1>
          <p className="text-xl">لطفا پيش از رزرو، قوانين و تعهدات را مطالعه کنيد.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-wood-600 rounded-xl flex items-center justify-center">
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-wood-800">{section.title}</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-wood-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
