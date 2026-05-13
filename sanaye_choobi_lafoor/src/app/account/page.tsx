'use client';

import React, { useEffect, useState } from 'react';
import {
  UserIcon,
  CogIcon,
  ShoppingBagIcon,
  HeartIcon,
  ClockIcon,
  MapPinIcon,
  ShieldCheckIcon,
  HomeIcon,
  CreditCardIcon,
  LifebuoyIcon,
} from '@heroicons/react/24/outline';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<{ firstName: string; lastName: string; phone: string } | null>(null);
  const [authStep, setAuthStep] = useState<'phone' | 'code' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [code, setCode] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('demo-auth');
    const storedUser = localStorage.getItem('demo-user');
    if (stored === 'true' && storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as { firstName: string; lastName: string; phone: string };
        setUserProfile(parsed);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem('demo-auth');
        localStorage.removeItem('demo-user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('demo-auth');
    localStorage.removeItem('demo-user');
    setIsLoggedIn(false);
    setUserProfile(null);
  };

  const handleSendCode = async () => {
    setAuthError('');
    setAuthMessage('');
    const normalizedPhone = phone.replace(/[^0-9]/g, '').trim();
    if (!normalizedPhone) {
      setAuthError('شماره موبایل را وارد کنید.');
      return;
    }

    try {
      setRequesting(true);
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedPhone }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'ارسال کد ناموفق بود.');
      }
      setAuthStep('code');
      setAuthMessage('کد تایید ارسال شد.');
    } catch (error) {
      console.error(error);
      setAuthError(error instanceof Error ? error.message : 'ارسال کد ناموفق بود.');
    } finally {
      setRequesting(false);
    }
  };

  const handleVerifyCode = async () => {
    setAuthError('');
    setAuthMessage('');
    const normalizedPhone = phone.replace(/[^0-9]/g, '').trim();
    if (!normalizedPhone || !code.trim()) {
      setAuthError('شماره موبایل و کد تایید الزامی است.');
      return;
    }
    try {
      setVerifying(true);
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: normalizedPhone,
          code: code.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'تایید کد ناموفق بود.');
      }

      if (payload.requiresProfile) {
        setAuthStep('profile');
        setAuthMessage('کد تایید شد. لطفاً نام و نام خانوادگی را وارد کنید.');
        return;
      }

      const nextProfile = {
        firstName: payload.data.firstName,
        lastName: payload.data.lastName,
        phone: payload.data.phone,
      };

      localStorage.setItem('demo-auth', 'true');
      localStorage.setItem('demo-user', JSON.stringify(nextProfile));
      setUserProfile(nextProfile);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      setAuthError(error instanceof Error ? error.message : 'تایید کد ناموفق بود.');
    } finally {
      setVerifying(false);
    }
  };

  const handleCompleteProfile = async () => {
    setAuthError('');
    setAuthMessage('');
    const normalizedPhone = phone.replace(/[^0-9]/g, '').trim();
    if (!normalizedPhone || !firstName.trim() || !lastName.trim()) {
      setAuthError('نام و نام خانوادگی را کامل وارد کنید.');
      return;
    }

    try {
      setVerifying(true);
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: normalizedPhone,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'ثبت اطلاعات ناموفق بود.');
      }

      const nextProfile = {
        firstName: payload.data.firstName,
        lastName: payload.data.lastName,
        phone: payload.data.phone,
      };

      localStorage.setItem('demo-auth', 'true');
      localStorage.setItem('demo-user', JSON.stringify(nextProfile));
      setUserProfile(nextProfile);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      setAuthError(error instanceof Error ? error.message : 'ثبت اطلاعات ناموفق بود.');
    } finally {
      setVerifying(false);
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'داشبورد', icon: HomeIcon },
    { id: 'profile', name: 'پروفایل', icon: UserIcon },
    { id: 'orders', name: 'رزروها', icon: ShoppingBagIcon },
    { id: 'favorites', name: 'علاقه‌مندی‌ها', icon: HeartIcon },
    { id: 'addresses', name: 'آدرس‌ها', icon: MapPinIcon },
    { id: 'payments', name: 'پرداخت‌ها', icon: CreditCardIcon },
    { id: 'support', name: 'پشتیبانی', icon: LifebuoyIcon },
    { id: 'access', name: 'سطح دسترسی', icon: ShieldCheckIcon },
    { id: 'settings', name: 'تنظیمات', icon: CogIcon },
  ];

  const orders = [
    { id: '12345', date: '1403/05/15', status: 'اقامت انجام شد', total: '6,400,000', items: 2 },
    { id: '12346', date: '1403/05/10', status: 'در انتظار تایید میزبان', total: '3,200,000', items: 1 },
    { id: '12347', date: '1403/04/28', status: 'لغو شده', total: '4,800,000', items: 1 },
  ];

  const accessItems = [
    { id: 1, title: 'رزرو ويلا', desc: 'امکان ثبت رزرو و پيگيري پرداخت ها', status: 'فعال' },
    { id: 2, title: 'لغو رزرو', desc: 'لغو رزرو مطابق با قوانين ميزبان', status: 'فعال' },
    { id: 3, title: 'ارسال نظر', desc: 'ثبت امتياز و نظر بعد از اقامت', status: 'فعال' },
    { id: 4, title: 'درخواست پشتيباني ويژه', desc: 'دسترسي به تيم پشتيباني سريع', status: 'غير فعال' },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-wood-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="h-10 w-10 text-wood-600" />
              </div>
              <h1 className="text-2xl font-bold text-wood-800 mb-2">
                ورود / ثبت نام با پیامک
              </h1>
              <p className="text-forest-600">
                شماره موبایل را وارد کنید تا کد تایید ارسال شود.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-wood-700 font-semibold mb-2">شماره موبایل</label>
                <input
                  type="tel"
                  placeholder="09123456789"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  disabled={authStep !== 'phone'}
                  className="w-full p-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 text-right disabled:bg-gray-100"
                />
              </div>

              {authStep === 'code' && (
                <div>
                  <label className="block text-wood-700 font-semibold mb-2">کد تایید</label>
                  <input
                    type="text"
                    placeholder="کد پیامک شده"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    className="w-full p-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                  />
                </div>
              )}

              {authStep === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-wood-700 font-semibold mb-2">نام</label>
                    <input
                      type="text"
                      placeholder="نام"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      className="w-full p-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-wood-700 font-semibold mb-2">نام خانوادگی</label>
                    <input
                      type="text"
                      placeholder="نام خانوادگی"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      className="w-full p-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                    />
                  </div>
                </div>
              )}

              {authStep === 'phone' && (
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={requesting}
                  className="w-full rounded-lg border border-black bg-white py-3 font-semibold text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50"
                >
                  {requesting ? 'در حال ارسال کد...' : 'ارسال کد تایید'}
                </button>
              )}

              {authStep === 'code' && (
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={verifying}
                  className="w-full rounded-lg border border-black bg-white py-3 font-semibold text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50"
                >
                  {verifying ? 'در حال تایید...' : 'تایید کد'}
                </button>
              )}

              {authStep === 'profile' && (
                <button
                  type="button"
                  onClick={handleCompleteProfile}
                  disabled={verifying}
                  className="w-full rounded-lg border border-black bg-white py-3 font-semibold text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50"
                >
                  {verifying ? 'در حال ثبت...' : 'ثبت نام و ورود'}
                </button>
              )}

              {authMessage && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  {authMessage}
                </div>
              )}
              {authError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {authError}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-1/4 bg-wood-50 p-6 border-l border-wood-200">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-wood-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="h-10 w-10 text-wood-600" />
                </div>
                <h2 className="text-lg font-bold text-wood-800">{userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'کاربر'}</h2>
                <p className="text-forest-600 text-sm">شماره: {userProfile?.phone || '—'}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-right transition-colors ${
                        activeTab === tab.id
                          ? 'bg-wood-600 text-white'
                          : 'text-wood-700 hover:bg-wood-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full mt-8 bg-red-100 text-red-700 py-3 rounded-lg hover:bg-red-200 transition-colors font-semibold"
              >
                خروج از حساب
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              {activeTab === 'dashboard' && (
                <div>
                  <h1 className="text-2xl font-bold text-wood-800 mb-6">داشبورد کاربر</h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="border border-wood-200 rounded-xl p-4">
                      <p className="text-sm text-forest-600">رزروهاي فعال</p>
                      <p className="text-2xl font-bold text-wood-800 mt-2">2</p>
                    </div>
                    <div className="border border-wood-200 rounded-xl p-4">
                      <p className="text-sm text-forest-600">علاقه مندي ها</p>
                      <p className="text-2xl font-bold text-wood-800 mt-2">5</p>
                    </div>
                    <div className="border border-wood-200 rounded-xl p-4">
                      <p className="text-sm text-forest-600">امتيازهاي ثبت شده</p>
                      <p className="text-2xl font-bold text-wood-800 mt-2">3</p>
                    </div>
                  </div>
                  <div className="border border-wood-200 rounded-xl p-5">
                    <h2 className="text-lg font-bold text-wood-800">دسترسي هاي کلي</h2>
                    <p className="text-forest-600 text-sm mt-2">
                      بعدا براساس نقش و سطح کاربر، دسترسي هاي ويژه اعمال مي شود.
                    </p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {accessItems.slice(0, 2).map((item) => (
                        <div key={item.id} className="border border-wood-200 rounded-lg p-3">
                          <p className="font-semibold text-wood-800">{item.title}</p>
                          <p className="text-sm text-forest-600 mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h1 className="text-2xl font-bold text-wood-800 mb-6">اطلاعات شخصی</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">نام</label>
                      <input
                        type="text"
                        value={userProfile?.firstName || ''}
                        readOnly
                        className="w-full p-3 border border-wood-200 rounded-lg bg-cream-50 text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">نام خانوادگی</label>
                      <input
                        type="text"
                        value={userProfile?.lastName || ''}
                        readOnly
                        className="w-full p-3 border border-wood-200 rounded-lg bg-cream-50 text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">شماره موبایل</label>
                      <input
                        type="tel"
                        value={userProfile?.phone || ''}
                        readOnly
                        className="w-full p-3 border border-wood-200 rounded-lg bg-cream-50 text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">ایمیل</label>
                      <input
                        type="email"
                        value=""
                        readOnly
                        className="w-full p-3 border border-wood-200 rounded-lg bg-cream-50 text-right"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled
                    className="mt-6 rounded-lg border border-wood-200 bg-wood-50 px-8 py-3 font-semibold text-wood-600"
                  >
                    ذخیره تغییرات
                  </button>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h1 className="text-2xl font-bold text-wood-800 mb-6">رزروهای من</h1>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-wood-200 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-wood-800">رزرو #{order.id}</h3>
                            <p className="text-forest-600 text-sm flex items-center gap-2 mt-1">
                              <ClockIcon className="h-4 w-4" />
                              {order.date}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.status === 'اقامت انجام شد' ? 'bg-green-100 text-green-700' :
                            order.status === 'در انتظار تایید میزبان' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-wood-700">
                            {order.items} شب • {order.total} تومان
                          </p>
                          <button className="text-wood-600 hover:text-wood-700 font-semibold">
                            مشاهده جزییات رزرو
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <h1 className="text-2xl font-bold text-wood-800 mb-6">علاقه مندي ها</h1>
                  <div className="border border-wood-200 rounded-xl p-6 text-forest-600">
                    هنوز ويلايي به علاقه مندي ها اضافه نکرده ايد.
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h1 className="text-2xl font-bold text-wood-800 mb-6">آدرس ها</h1>
                  <div className="border border-wood-200 rounded-xl p-6 text-forest-600">
                    آدرس جديد براي فاکتور يا ارتباط را ثبت کنيد.
                  </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div>
                  <h1 className="text-2xl font-bold text-wood-800 mb-6">پرداخت ها</h1>
                  <div className="space-y-3">
                    <div className="border border-wood-200 rounded-xl p-4">
                      <p className="font-semibold text-wood-800">پرداخت #P-2451</p>
                      <p className="text-sm text-forest-600">موفق - 3,200,000 تومان</p>
                    </div>
                    <div className="border border-wood-200 rounded-xl p-4">
                      <p className="font-semibold text-wood-800">پرداخت #P-2419</p>
                      <p className="text-sm text-forest-600">موفق - 6,400,000 تومان</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'support' && (
                <div>
                  <h1 className="text-2xl font-bold text-wood-800 mb-6">پشتيباني</h1>
                  <div className="border border-wood-200 rounded-xl p-6">
                    <p className="text-forest-600">سوال يا مشکلتان را ثبت کنيد تا پشتيباني سفرجا پيگيري کند.</p>
                    <textarea
                      rows={4}
                      className="mt-4 w-full p-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                      placeholder="توضيح مشکل"
                    />
                    <button className="mt-3 bg-wood-600 text-white px-6 py-2 rounded-lg">ارسال درخواست</button>
                  </div>
                </div>
              )}

              {activeTab === 'access' && (
                <div>
                  <h1 className="text-2xl font-bold text-wood-800 mb-6">سطح دسترسي ها</h1>
                  <div className="space-y-3">
                    {accessItems.map((item) => (
                      <div key={item.id} className="border border-wood-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-wood-800">{item.title}</p>
                            <p className="text-sm text-forest-600 mt-1">{item.desc}</p>
                          </div>
                          <span className={`text-sm font-semibold ${
                            item.status === 'فعال' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h1 className="text-2xl font-bold text-wood-800 mb-6">تنظيمات</h1>
                  <div className="space-y-4">
                    <div className="border border-wood-200 rounded-xl p-4">
                      <p className="font-semibold text-wood-800">اعلان ها</p>
                      <p className="text-sm text-forest-600 mt-1">دريافت اعلان رزرو و تخفيف ها</p>
                    </div>
                    <div className="border border-wood-200 rounded-xl p-4">
                      <p className="font-semibold text-wood-800">حريم خصوصي</p>
                      <p className="text-sm text-forest-600 mt-1">مديريت نمايش اطلاعات پروفايل</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
