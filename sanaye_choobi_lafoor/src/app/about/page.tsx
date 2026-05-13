'use client';

import React from 'react';
import { 
  HeartIcon, 
  StarIcon, 
  UsersIcon, 
  TrophyIcon,
  ClockIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const [pageContent, setPageContent] = React.useState<any>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/pages');
        const payload = await res.json();
        if (res.ok && payload.success) setPageContent(payload.data.about || null);
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  const stats = [
    { number: '10+', label: 'سال تجربه', icon: ClockIcon },
    { number: '150K+', label: 'مهمان راضی', icon: UsersIcon },
    { number: '1,500+', label: 'اقامتگاه فعال', icon: TrophyIcon },
    { number: '28+', label: 'استان تحت پوشش', icon: GlobeAltIcon }
  ];

  const values = [
    {
      title: 'اقامت استاندارد',
      description: 'بررسی دقیق اقامتگاه‌ها برای تمیزی، ایمنی و کیفیت خدمات',
      icon: StarIcon
    },
    {
      title: 'صداقت و شفافیت',
      description: 'قیمت‌گذاری شفاف و قوانین روشن برای رزرو مطمئن',
      icon: HeartIcon
    },
    {
      title: 'پشتیبانی مداوم',
      description: 'همراهی تیم پشتیبانی قبل، حین و بعد از اقامت',
      icon: TrophyIcon
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-wood-700 via-wood-600 to-forest-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">{pageContent?.title ?? 'درباره شرکت تجارت الکترونیک آسایش سفر (سفرجا)'}</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              {pageContent?.intro ?? 'از سال ۱۳۹۲ همراه شما هستیم تا اقامتگاهی امن و دلنشین پیدا کنید'}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-wood-800 mb-6">داستان ما</h2>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  سفر جا (شرکت تجارت الکترونیک آسایش سفر) در سال ۱۳۹۶ با ایده‌ای ساده اما قدرتمند آغاز شد: ایجاد پلی میان مسافران و صاحبان ویلاهای منحصربه‌فرد در سراسر ایران. ما معتقدیم که هر سفر باید تجربه‌ای فراموش‌نشدنی باشد و هر ویلا داستانی خاص برای گفتن داشته باشد.
                </p>
                <p>
                  با تیمی متخصص و علاقه‌مند به گردشگری، ما هر ویلا را به دقت بررسی می‌کنیم. از استانداردهای بهداشتی گرفته تا زیبایی طبیعی منطقه، همه چیز برای ما اهمیت دارد.
                </p>
                <p>
                  امروز پس از ۸ سال فعالیت مستمر، مفتخریم که بیش از 4000 هزار خانواده ایرانی در بهترین ویلاهای کشور اقامت داشته‌اند و خاطرات شیرینی ساخته‌اند. در ادامه داستان ما اینه.
                </p>
                  <div dangerouslySetInnerHTML={{ __html: (pageContent?.story ?? `
                    <p>
                      اجاره ویلا سفرجا در سال ۱۳۹۲ با هدف ساده‌سازی فرآیند رزرو اقامتگاه آغاز به کار کرد.
                      ما با تکیه بر تجربه سفرهای داخلی و شناخت نیاز مهمانان، پلتفرمی ساختیم که رزرو را سریع، امن و شفاف می‌کند.
                    </p>
                    <p>
                      همکاری با میزبانان حرفه‌ای، بررسی مستمر کیفیت اقامتگاه‌ها و 
                      پشتیبانی در طول سفر، اصول اصلی کار ما محسوب می‌شوند.
                    </p>
                    <p>
                      امروز پس از سال‌ها فعالیت، مفتخریم که هزاران مهمان از طریق سفرجا تجربه اقامتی دلنشین داشته‌اند.
                    </p>
                  `) }} />
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-wood-100 to-wood-200 rounded-3xl p-8 h-96 flex items-center justify-center">
                <div className="text-wood-400 text-8xl">🏭</div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-wood-600 text-white p-4 rounded-2xl">
                <div className="text-2xl font-bold">۱۳۹۶</div>
                <div className="text-sm">سال تأسیس</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-wood-800 mb-4">آمار و ارقام</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              نگاهی به دستاوردهای ما در طول سال‌های فعالیت
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-wood-500 to-wood-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-wood-800 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-wood-800 mb-4">ارزش‌های ما</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              اصولی که در تمام مراحل کار ما راهنما هستند
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={value.title} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-forest-500 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-wood-800 mb-4">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-cream-50 to-wood-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-wood-800 mb-4">تیم ما</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              تیمی حرفه‌ای که اقامت شما را از ابتدا تا انتها همراهی می‌کند
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'احمد محمدی', role: 'مدیرعامل و بنیانگذار', experience: '12 سال تجربه' },
              { name: 'فاطمه کریمی', role: 'مدیر تجربه مشتری', experience: '9 سال تجربه' },
              { name: 'علی رضایی', role: 'مدیر عملیات و پشتیبانی', experience: '11 سال تجربه' }
            ].map((member, index) => (
              <div key={member.name} className="bg-white rounded-3xl p-8 shadow-xl text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-wood-200 to-wood-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <div className="text-wood-600 text-4xl">👨‍💼</div>
                </div>
                <h3 className="text-xl font-bold text-wood-800 mb-2">{member.name}</h3>
                <p className="text-forest-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-white border-2 border-wood-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-black">آماده همکاری با شما هستیم</h2>
          <p className="text-xl mb-8 leading-relaxed text-black">
            برای کسب اطلاعات بیشتر یا رزرو اقامتگاه، همین امروز با ما تماس بگیرید
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors">
              تماس با ما
            </button>
            <button className="border-2 border-wood-700 text-wood-700 px-8 py-4 rounded-xl font-bold hover:bg-wood-700 hover:text-white transition-colors">
              مشاهده ویلاها
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
