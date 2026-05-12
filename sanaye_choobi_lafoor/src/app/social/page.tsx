import Link from 'next/link';
import {
  CameraIcon,
  TrophyIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';

export default function SocialPage() {
  const challenges = [
    {
      title: 'بهترين عکس ويلا',
      desc: 'زيباترين قاب از ويلا يا اقامتگاه خود را ثبت کنيد.',
      prize: 'جايزه نقدي و تخفيف رزرو بعدي',
      icon: CameraIcon,
    },
    {
      title: 'طلوع يا غروب خاص',
      desc: 'قاب هاي خاص از طلوع يا غروب محل اقامت.',
      prize: 'هداياي سفرجا',
      icon: SparklesIcon,
    },
    {
      title: 'تجربه محلي',
      desc: 'بهترين تجربه غذاي محلي يا جاذبه نزديک.',
      prize: 'امتياز سفرجا',
      icon: ChatBubbleLeftRightIcon,
    },
  ];

  const steps = [
    'عکس يا ويديو بگيريد و در شبکه اجتماعي منتشر کنيد.',
    'از هشتگ #سفرجا و لوکيشن اقامتگاه استفاده کنيد.',
    'لينک پست را در صفحه ثبت چالش وارد کنيد.',
    'برندگان هر ماه اعلام مي شوند.',
  ];

  const stories = [
    { name: 'سارا', location: 'رامسر', highlight: 'طلوع دريا' },
    { name: 'مريم', location: 'چالوس', highlight: 'ويلا استخردار' },
    { name: 'علي', location: 'ماسال', highlight: 'کلبه جنگلي' },
    { name: 'رها', location: 'متل قو', highlight: 'غروب ساحل' },
    { name: 'امير', location: 'کلاردشت', highlight: 'پياده روي' },
    { name: 'ليلا', location: 'رامسر', highlight: 'صبحانه محلي' },
  ];

  const gallery = [
    { id: 1, title: 'ويلاي ساحلي', tag: '#سفرجا' },
    { id: 2, title: 'صبح مه آلود', tag: '#ماسال' },
    { id: 3, title: 'غروب نارنجی', tag: '#چالوس' },
    { id: 4, title: 'تراس جنگلي', tag: '#کلبه' },
    { id: 5, title: 'استخر شبانه', tag: '#ويلا' },
    { id: 6, title: 'صبحانه محلي', tag: '#محلي' },
    { id: 7, title: 'مسير طبيعت', tag: '#پياده روي' },
    { id: 8, title: 'نور شومينه', tag: '#کلبه' },
    { id: 9, title: 'دورهمي', tag: '#خانواده' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50">
      <section className="relative py-20 bg-gradient-to-r from-wood-800 via-wood-700 to-forest-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
          <p className="uppercase tracking-[6px] text-wood-100 text-sm mb-4">SAFARJA SOCIAL</p>
          <h1 className="text-5xl font-bold mb-6">شبکه اجتماعي سفرجا</h1>
          <p className="text-xl max-w-3xl mx-auto text-wood-50">
            تجربه هايتان را به اشتراک بگذاريد و در چالش هاي جذاب برنده شويد.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {challenges.map((item) => (
            <div key={item.title} className="bg-white rounded-3xl shadow-xl p-6">
              <div className="w-14 h-14 bg-wood-600 rounded-2xl flex items-center justify-center mb-5">
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-wood-800 mb-3">{item.title}</h3>
              <p className="text-gray-700 mb-4">{item.desc}</p>
              <div className="flex items-center gap-2 text-wood-700 text-sm">
                <TrophyIcon className="w-4 h-4" />
                <span>{item.prize}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-wood-800">استوري هاي سفرجا</h2>
            <span className="text-sm text-wood-600">آخرين لحظه ها</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {stories.map((story) => (
              <div key={story.name} className="min-w-[120px] text-center">
                <div className="w-20 h-20 rounded-full border-2 border-forest-500 p-1 mx-auto">
                  <div className="w-full h-full bg-cream-50 rounded-full flex items-center justify-center text-2xl">📷</div>
                </div>
                <p className="text-sm font-semibold text-wood-800 mt-2">{story.name}</p>
                <p className="text-xs text-gray-500">{story.location}</p>
                <p className="text-xs text-wood-600">{story.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-wood-800">گالري تجربه ها</h2>
          <div className="flex items-center gap-3 text-sm text-wood-600">
            <PlayCircleIcon className="w-5 h-5" />
            ريلز و عکس هاي برتر
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => (
            <div key={item.id} className="group bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="h-56 bg-gradient-to-br from-wood-100 via-cream-100 to-forest-100 flex items-center justify-center text-4xl">
                🏡
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-wood-800">{item.title}</h3>
                  <span className="text-xs text-wood-600">{item.tag}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <HeartIcon className="w-4 h-4" />
                    1.2k
                  </div>
                  <div className="flex items-center gap-2">
                    <ChatBubbleOvalLeftIcon className="w-4 h-4" />
                    84
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-wood-800 mb-4">چطور شرکت کنم؟</h2>
          <ul className="space-y-3 text-gray-700">
            {steps.map((step) => (
              <li key={step} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-wood-600" />
                {step}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/support"
              className="btn-primary px-6 py-3 inline-flex items-center justify-center"
            >
              ثبت لينک چالش
            </Link>
            <Link
              href="/blog"
              className="btn-outline px-6 py-3 inline-flex items-center justify-center gap-2"
            >
              مشاهده تجربه ها
              <ArrowLeftIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
