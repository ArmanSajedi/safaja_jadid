'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CurrencyDollarIcon,
  TruckIcon,
  ShieldCheckIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// Host applications now persist via API

export default function HostRegisterPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      nationalId: '',
      phone: '',
      address: '',
      city: '',
      province: ''
    }
  });

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    const payload = {
      firstName: formData.personalInfo.firstName.trim(),
      lastName: formData.personalInfo.lastName.trim(),
      nationalId: formData.personalInfo.nationalId.trim(),
      phone: formData.personalInfo.phone.trim(),
      address: formData.personalInfo.address.trim(),
      city: formData.personalInfo.city.trim(),
      province: formData.personalInfo.province,
    };

    try {
      const res = await fetch('/api/hosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'خطا در ثبت درخواست');
      }

      setSuccessMessage(`درخواست شما با شماره ${result.data.id} ثبت شد و در پنل ادمین در انتظار بررسی است.`);
      // store phone locally for dashboard convenience
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('demo-current-host-phone', payload.phone);
      }

      router.push('/hosts/dashboard');
    } catch (err) {
      console.error(err);
      setSuccessMessage('ثبت درخواست ناموفق بود. لطفاً دوباره تلاش کنید.');
    }
  };

  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: 'درآمد مطمئن',
      description: 'درآمد منظم از هر رزرو'
    },
    {
      icon: TruckIcon,
      title: 'تسویه شفاف',
      description: 'تسویه سریع و گزارش مالی دقیق'
    },
    {
      icon: ShieldCheckIcon,
      title: 'پشتیبانی کامل',
      description: 'پشتیبانی میزبان در تمام مراحل'
    },
    {
      icon: StarIcon,
      title: 'برند معتبر',
      description: 'افزایش دیده‌شدن اقامتگاه شما'
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-wood-700 via-wood-600 to-forest-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">عضویت در شبکه میزبان‌های سفرجا</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              با پیوستن به شبکه میزبان‌های سفرجا، اقامتگاه خود را حرفه‌ای‌تر مدیریت کنید
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <div key={benefit.title} className="bg-white rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-wood-500 to-wood-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-wood-800 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <form onSubmit={handleSubmit} className="p-8">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-wood-800 mb-6">اطلاعات شخصی</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">نام *</label>
                      <input
                        type="text"
                        required
                        value={formData.personalInfo.firstName}
                        onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                        className="w-full p-4 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="نام خود را وارد کنید"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">نام خانوادگی *</label>
                      <input
                        type="text"
                        required
                        value={formData.personalInfo.lastName}
                        onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                        className="w-full p-4 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="نام خانوادگی"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">کد ملی *</label>
                      <input
                        type="text"
                        required
                        value={formData.personalInfo.nationalId}
                        onChange={(e) => handleInputChange('personalInfo', 'nationalId', e.target.value)}
                        className="w-full p-4 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="کد ملی 10 رقمی"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">شماره تماس *</label>
                      <input
                        type="tel"
                        required
                        value={formData.personalInfo.phone}
                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                        className="w-full p-4 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="09123456789"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">استان *</label>
                      <select
                        required
                        value={formData.personalInfo.province}
                        onChange={(e) => handleInputChange('personalInfo', 'province', e.target.value)}
                        className="w-full p-4 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500"
                      >
                        <option value="">انتخاب استان</option>
                        <option value="تهران">تهران</option>
                        <option value="اصفهان">اصفهان</option>
                        <option value="شیراز">شیراز</option>
                        <option value="مشهد">مشهد</option>
                        <option value="سایر">سایر</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">شهر *</label>
                      <input
                        type="text"
                        required
                        value={formData.personalInfo.city}
                        onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                        className="w-full p-4 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="نام شهر"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-wood-700 font-semibold mb-2">آدرس کامل *</label>
                    <textarea
                      required
                      value={formData.personalInfo.address}
                      onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                      rows={3}
                      className="w-full p-4 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right resize-none"
                      placeholder="آدرس کامل محل سکونت"
                    ></textarea>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300"
                    >
                      ثبت درخواست
                    </button>
                    <span className="text-sm text-gray-500">اطلاعات اقامتگاه و بانکي بعدا تکميل مي شود.</span>
                  </div>
                  {successMessage && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                      {successMessage}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-wood-800 mb-4">مزایای همکاری</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span>درآمد منظم از هر رزرو</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span>راهنمایی برای بهبود امتیاز</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span>پشتیبانی میزبانان</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span>معرفی و بازاریابی اقامتگاه</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span>تسویه شفاف و منظم</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-wood-200">
              <h3 className="text-xl font-bold mb-4 text-black">نیاز به مشاوره؟</h3>
              <p className="text-sm mb-4 text-gray-700">
                تیم ما آماده پاسخگویی به سؤالات شما است
              </p>
              <div className="space-y-2 text-sm text-black">
                <div>📞 021-88776655</div>
                <div>📧 hosts@laforvillas.ir</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}