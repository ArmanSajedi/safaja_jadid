'use client';

import React from 'react';
import {
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  SparklesIcon,
  MapPinIcon,
  CalendarDaysIcon,
  LifebuoyIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  BoltIcon,
  HomeModernIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

export default function ServicesPage() {
  const [heroTitle, setHeroTitle] = React.useState('خدمات حرفه ای سفرجا');
  const [heroIntro, setHeroIntro] = React.useState('از انتخاب مقصد تا پایان اقامت، هر قدم با ابزارهای کاربردی و پشتیبانی واقعی.');

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/pages');
        const payload = await res.json();
        if (res.ok && payload.success && payload.data?.services) {
          setHeroTitle(payload.data.services.heroTitle || heroTitle);
          setHeroIntro(payload.data.services.heroIntro || heroIntro);
        }
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  const pillars = [
    {
      title: 'رزرو هوشمند',
      description: 'تقويم لحظه اي، قوانين شفاف و تاييد سريع ميزبان.',
      bullets: ['تقويم قيمت و ظرفيت', 'ثبت رزرو در چند دقيقه', 'نوتيفيکيشن وضعيت رزرو'],
      icon: CalendarDaysIcon,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'تضمين کيفيت اقامت',
      description: 'بازبيني مستمر ويلاها و کنترل استاندارد نظافت و ايمني.',
      bullets: ['بازديد دوره اي', 'تطابق امکانات', 'پوشش خسارت محدود'],
      icon: ShieldCheckIcon,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'پشتيباني سفر 24/7',
      description: 'در هر مرحله از رزرو تا خروج، همراه شما هستيم.',
      bullets: ['چت سريع', 'پاسخگويي اضطراري', 'پيگيري لحظه اي'],
      icon: ChatBubbleLeftRightIcon,
      color: 'from-amber-500 to-amber-600',
    },
    {
      title: 'پرداخت امن و شفاف',
      description: 'پرداخت محافظت شده و تسويه شفاف با ميزبان.',
      bullets: ['درگاه امن', 'فاکتور رسمي', 'لغو طبق قانون'],
      icon: CreditCardIcon,
      color: 'from-rose-500 to-rose-600',
    },
  ];

  const tools = [
    {
      title: 'چک ليست قبل از سفر',
      desc: 'همه موارد مهم قبل از ورود را مرور کنيد.',
      icon: ClipboardDocumentCheckIcon,
    },
    {
      title: 'مشاوره مقصد',
      desc: 'پیشنهاد بهترين مقصد براساس فصل و بودجه.',
      icon: MapPinIcon,
    },
    {
      title: 'پشتيباني اضطراري',
      desc: 'پاسخگويي سريع در موقعيت هاي ضروري.',
      icon: LifebuoyIcon,
    },
    {
      title: 'امتیازدهی و نظر',
      desc: 'تجربه خود را ثبت کنيد تا سرويس بهتر شود.',
      icon: StarIcon,
    },
  ];

  const steps = [
    {
      title: 'جستجو و انتخاب',
      description: 'شهر، تاريخ و تعداد نفرات را مشخص کنيد.',
      icon: MapPinIcon,
    },
    {
      title: 'بررسي جزئيات',
      description: 'امکانات، قوانين و نظرات مهمانان را بخوانيد.',
      icon: HomeModernIcon,
    },
    {
      title: 'ثبت و پرداخت',
      description: 'رزرو را ثبت و پرداخت امن انجام دهيد.',
      icon: CreditCardIcon,
    },
    {
      title: 'ورود و پشتيباني',
      description: 'اطلاعات ورود ارسال مي شود و پشتيبان همراه شماست.',
      icon: LifebuoyIcon,
    },
  ];

  const guarantees = [
    {
      title: 'پاسخگويي کمتر از 10 دقيقه',
      desc: 'براي درخواست هاي فوري در ساعات کاري.',
      icon: BoltIcon,
    },
    {
      title: 'تاييد اطلاعات ويلا',
      desc: 'تطابق امکانات با اطلاعات ثبت شده.',
      icon: CheckCircleIcon,
    },
    {
      title: 'تسويه شفاف',
      desc: 'پرداخت ها با گزارش مالي قابل پيگيري.',
      icon: SparklesIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50">
      <section className="relative py-20 bg-gradient-to-r from-cream-50 via-wood-100 to-forest-100 text-wood-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <p className="uppercase tracking-[6px] text-wood-700 text-sm mb-4">SAFARJA SERVICES</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">خدمات حرفه اي سفرجا</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed text-wood-700">
              از انتخاب مقصد تا پايان اقامت، هر قدم با ابزارهاي کاربردي و پشتيباني واقعي.
            </p>
          </div>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-wood-900 text-cream-50 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition">شروع رزرو</button>
            <button className="border border-wood-500 text-wood-800 px-6 py-3 rounded-xl font-semibold hover:bg-wood-100 transition">تماس با پشتيباني</button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item) => (
              <div key={item.title} className="bg-white rounded-3xl shadow-2xl p-6 hover:-translate-y-1 transition">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-5`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-wood-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-wood-600" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-4xl font-bold text-wood-800 mb-3">ابزارهاي کاربردي سفر</h2>
              <p className="text-gray-600 max-w-2xl">
                اين ابزارها کمک مي کند سريع تر تصميم بگيريد و کنترل بيشتري روي سفر داشته باشيد.
              </p>
            </div>
            <button className="bg-wood-900 text-cream-50 px-6 py-3 rounded-xl font-semibold hover:bg-wood-950 transition">مشاهده راهنماها</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <div key={tool.title} className="rounded-2xl border border-wood-200 bg-cream-50/60 p-5">
                <div className="w-12 h-12 bg-wood-700 rounded-xl flex items-center justify-center mb-4">
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-wood-800 mb-2">{tool.title}</h3>
                <p className="text-sm text-gray-600">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-wood-800 mb-4">مسير رزرو شفاف</h2>
            <p className="text-gray-600">رزرو را در چهار مرحله کوتاه و مشخص پيش ببريد.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="bg-white rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-wood-600 rounded-xl flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-wood-200">0{index + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-wood-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream-50 text-wood-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">تعهدات خدماتي سفرجا</h2>
              <p className="text-wood-700 leading-relaxed">
                تعهدات مشخص براي پاسخگويي، امنيت پرداخت و تطابق اطلاعات اقامتگاه ها.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {guarantees.map((item) => (
                <div key={item.title} className="bg-white rounded-2xl p-5 border border-wood-200 shadow-lg">
                  <item.icon className="w-6 h-6 text-wood-700 mb-3" />
                  <p className="font-semibold mb-2">{item.title}</p>
                  <p className="text-sm text-wood-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-wood-800 mb-4">نياز به راهنمايي داريد؟</h2>
          <p className="text-gray-600 mb-8">تيم پشتيباني سفرجا آماده پاسخگويي به سوالات رزرو و اقامت شماست.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-wood-900 text-cream-50 px-6 py-3 rounded-xl font-semibold hover:bg-wood-950 transition">گفتگو با پشتيباني</button>
            <button className="border border-wood-300 text-wood-700 px-6 py-3 rounded-xl font-semibold">مشاهده راهنماي رزرو</button>
          </div>
        </div>
      </section>
    </div>
  );
}
