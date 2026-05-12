import {
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

export default function SupportPage() {
  const channels = [
    {
      title: 'چت با پشتيباني',
      description: 'پاسخگويي سريع براي سوالات رزرو و اقامت',
      detail: '24 ساعته',
      icon: ChatBubbleLeftRightIcon,
      color: 'from-wood-600 to-forest-600',
    },
    {
      title: 'تماس تلفني',
      description: 'پاسخگويي در ساعات کاري',
      detail: '021-88776655',
      icon: PhoneIcon,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'ايميل پشتيباني',
      description: 'ارسال درخواست براي پيگيري رسمي',
      detail: 'support@safarja.ir',
      icon: EnvelopeIcon,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'ساعت پاسخگويي',
      description: 'شنبه تا پنجشنبه',
      detail: '8:00 تا 22:00',
      icon: ClockIcon,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const faqs = [
    {
      question: 'چطور رزرو خود را پيگيري کنم؟',
      answer: 'از پنل کاربري وارد بخش رزروها شويد و وضعيت رزرو را مشاهده کنيد.',
    },
    {
      question: 'اگر ميزبان پاسخ ندهد چه کنيم؟',
      answer: 'با پشتيباني سفرجا تماس بگيريد تا رزرو جايگزين پيشنهاد شود.',
    },
    {
      question: 'بازگشت وجه چگونه انجام مي شود؟',
      answer: 'طبق قوانين لغو هر ويلا و پس از تاييد ميزبان، تسويه انجام مي شود.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50">
      <section className="relative py-20 bg-gradient-to-r from-wood-700 via-wood-600 to-forest-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">پشتيباني سفرجا</h1>
          <p className="text-xl max-w-3xl mx-auto">
            هر زمان که سوال يا مشکلي داشتيد، تيم پشتيباني همراه شماست.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {channels.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl shadow-xl p-6 text-center">
              <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-wood-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <span className="text-wood-700 font-semibold">{item.detail}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-wood-600 rounded-xl flex items-center justify-center">
              <QuestionMarkCircleIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-wood-800">سوالات پرتکرار</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="border border-wood-200 rounded-2xl p-4">
                <p className="font-semibold text-wood-800">{faq.question}</p>
                <p className="text-gray-600 mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
