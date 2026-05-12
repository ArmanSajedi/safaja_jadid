'use client';

import React, { useState } from 'react';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ClockIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // اینجا منطق ارسال فرم قرار می‌گیرد
    setSubmitStatus('success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: 'تلفن تماس',
      details: ['021-88776655', '021-88776644'],
      color: 'from-green-500 to-green-600'
    },
    {
      icon: EnvelopeIcon,
      title: 'ایمیل',
      details: ['info@laforvillas.ir', 'support@laforvillas.ir'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MapPinIcon,
      title: 'آدرس',
      details: ['تهران، بزرگراه ستاری، خیابان صنعتی', 'پلاک 245، دفتر مرکزی سفرجا'],
      color: 'from-red-500 to-red-600'
    },
    {
      icon: ClockIcon,
      title: 'ساعات کاری',
      details: ['شنبه تا چهارشنبه: 8 تا 17', 'پنجشنبه: 8 تا 13'],
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const departments = [
    { name: 'رزرو و مشاوره سفر', value: 'booking' },
    { name: 'پشتیبانی اقامت', value: 'support' },
    { name: 'کیفیت اقامتگاه', value: 'quality' },
    { name: 'همکاری میزبانان', value: 'partnership' },
    { name: 'سایر موضوعات', value: 'other' }
  ];

  const isValid = formData.name && formData.phone && formData.subject && formData.message;

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-wood-700 via-wood-600 to-forest-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">تماس با ما</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              ما آماده پاسخگویی به سوالات شما درباره رزرو و اقامت هستیم
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {contactInfo.map((info, index) => (
            <div key={info.title} className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <info.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-wood-800 mb-3">{info.title}</h3>
              <div className="space-y-1">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-wood-500 to-wood-600 rounded-xl flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-wood-800">ارسال پیام</h2>
                <p className="text-gray-600">پیام خود را برای تیم پشتیبانی ارسال کنید</p>
              </div>
            </div>

            {submitStatus === 'success' && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700 text-sm">
                پیام شما ثبت شد. تیم پشتیبانی به زودی با شما تماس می‌گیرد.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-wood-700 font-semibold mb-2">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                    placeholder="نام خود را وارد کنید"
                  />
                </div>
                <div>
                  <label className="block text-wood-700 font-semibold mb-2">شماره تماس *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                    placeholder="09123456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-wood-700 font-semibold mb-2">ایمیل</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-wood-700 font-semibold mb-2">موضوع *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500"
                >
                  <option value="">موضوع را انتخاب کنید</option>
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-wood-700 font-semibold mb-2">پیام شما *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full p-4 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right resize-none"
                  placeholder="پیام خود را اینجا بنویسید..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isValid
                    ? 'bg-gradient-to-r from-wood-600 to-forest-600 text-white hover:from-wood-700 hover:to-forest-700 transform hover:scale-105'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                ارسال پیام
              </button>
              <p className="text-xs text-gray-500 text-center">
                با ارسال پیام، قوانین و حریم خصوصی سفرجا را می‌پذیرید.
              </p>
            </form>
          </div>

          {/* Map and Additional Info */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-wood-800 mb-6 flex items-center gap-3">
                <MapPinIcon className="w-6 h-6" />
                موقعیت ما روی نقشه
              </h3>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-64 rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPinIcon className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium">نقشه تعاملی</p>
                  <p className="text-sm">تهران، بزرگراه ستاری، خیابان صنعتی</p>
                </div>
              </div>
            </div>

            {/* Office Info */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold text-wood-800 mb-6 flex items-center gap-3">
                <BuildingOfficeIcon className="w-6 h-6" />
                دفتر مرکزی
              </h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-wood-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">آدرس کامل:</p>
                    <p className="text-sm">تهران، بزرگراه ستاری، خیابان صنعتی، پلاک 245، طبقه 3، واحد 12</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PhoneIcon className="w-5 h-5 text-wood-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">تلفن‌های تماس:</p>
                    <p className="text-sm">021-88776655 (دفتر مرکزی)</p>
                    <p className="text-sm">021-88776644 (فروش)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClockIcon className="w-5 h-5 text-wood-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">ساعات کاری:</p>
                    <p className="text-sm">شنبه تا چهارشنبه: 8:00 تا 17:00</p>
                    <p className="text-sm">پنجشنبه: 8:00 تا 13:00</p>
                    <p className="text-sm text-red-600">جمعه تعطیل</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-20">
          <h2 className="text-3xl font-bold text-wood-800 text-center mb-12">سؤالات متداول</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { q: 'چگونه می‌توانم رزرو انجام دهم؟', a: 'از طریق سایت، تلفن یا همین فرم می‌توانید درخواست رزرو ثبت کنید.' },
              { q: 'شرایط لغو رزرو چگونه است؟', a: 'قوانین لغو برای هر اقامتگاه مشخص است و قبل از پرداخت نمایش داده می‌شود.' },
              { q: 'چه ساعتی می‌توانم اقامتگاه را تحویل بگیرم؟', a: 'زمان ورود و خروج در صفحه هر اقامتگاه درج شده است.' },
              { q: 'آیا پشتیبانی در طول سفر دارید؟', a: 'بله، پشتیبانی ۲۴/۷ در طول سفر همراه شماست.' }
            ].map((faq, index) => (
              <div key={index} className="border-r-4 border-wood-500 pr-4">
                <h4 className="font-bold text-wood-800 mb-2">{faq.q}</h4>
                <p className="text-gray-700 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
