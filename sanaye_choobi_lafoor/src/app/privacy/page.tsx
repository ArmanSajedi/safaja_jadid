import { LockClosedIcon, EyeSlashIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function PrivacyPage() {
  const sections = [
    {
      title: 'اطلاعات جمع آوري شده',
      icon: LockClosedIcon,
      items: [
        'اطلاعات تماس و هويتي براي تکميل رزرو.',
        'اطلاعات پرداخت براي پردازش امن تراکنش ها.',
        'سوابق رزرو براي بهبود تجربه کاربر.',
      ],
    },
    {
      title: 'نحوه استفاده از داده ها',
      icon: GlobeAltIcon,
      items: [
        'ارائه خدمات رزرو و پشتيباني.',
        'ارسال اعلان ها و پيگيري وضعيت رزرو.',
        'بهبود کيفيت خدمات و تجربه کاربر.',
      ],
    },
    {
      title: 'حريم خصوصي و امنيت',
      icon: EyeSlashIcon,
      items: [
        'داده ها با استانداردهاي امنيتي نگهداري مي شوند.',
        'اطلاعات کاربران بدون اجازه به شخص ثالث ارائه نمي شود.',
        'کاربر مي تواند درخواست حذف يا اصلاح اطلاعات خود را ثبت کند.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50">
      <section className="relative py-20 bg-gradient-to-r from-wood-700 via-wood-600 to-forest-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">حريم خصوصي</h1>
          <p className="text-xl">ما متعهد به حفظ امنيت اطلاعات کاربران هستيم.</p>
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
