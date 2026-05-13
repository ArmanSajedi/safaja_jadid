'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPinIcon,
  StarIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

import { apiClient, Product } from '../../../lib/api-client';

const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price);

export default function VillaDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [villaId, setVillaId] = useState<number | null>(null);
  const [villa, setVilla] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedStartIso, setSelectedStartIso] = useState<string | null>(null);
  const [selectedEndIso, setSelectedEndIso] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [bookingError, setBookingError] = useState('');
  const [reviews, setReviews] = useState<Array<{ id: number; userName: string; rating: number; comment: string; createdAt: string }>>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const loadVilla = async () => {
      try {
        setLoading(true);
        setError(null);
        const { id } = await params;
        const nextId = Number(id);
        if (!Number.isFinite(nextId)) {
          setError('شناسه ویلا نامعتبر است');
          setLoading(false);
          return;
        }
        if (isMounted) {
          setVillaId(nextId);
        }
        const response = await apiClient.getProductById(nextId);
        if (response.success && response.data) {
          if (isMounted) {
            setVilla(response.data);
          }
        } else {
          if (isMounted) {
            setError('ویلا پیدا نشد');
          }
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError('خطا در دریافت اطلاعات ویلا');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVilla();
    return () => {
      isMounted = false;
    };
  }, [params]);

  useEffect(() => {
    const storedUser = typeof window !== 'undefined' ? window.localStorage.getItem('demo-user') : null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as { firstName: string; lastName: string };
        const fullName = `${parsed.firstName} ${parsed.lastName}`.trim();
        if (fullName) {
          setReviewName(fullName);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      if (!villaId) return;
      try {
        setReviewsLoading(true);
        const response = await fetch(`/api/reviews?villaId=${villaId}`);
        const payload = await response.json();
        if (response.ok && payload.success) {
          setReviews(payload.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [villaId]);

  const handleSubmitReview = async () => {
    if (!villaId) return;
    setReviewError('');
    setReviewSuccess('');

    if (!reviewName.trim() || !reviewComment.trim()) {
      setReviewError('نام و متن نظر الزامی است.');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          villaId,
          userName: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'ثبت نظر ناموفق بود.');
      }

      setReviewSuccess('نظر شما ثبت شد.');
      setReviewComment('');
      setReviewRating(5);

      if (payload.meta && villa) {
        setVilla({
          ...villa,
          rating: payload.meta.averageRating ?? villa.rating,
          reviewsCount: payload.meta.reviewsCount ?? villa.reviewsCount,
        });
      }

      const listResponse = await fetch(`/api/reviews?villaId=${villaId}`);
      const listPayload = await listResponse.json();
      if (listResponse.ok && listPayload.success) {
        setReviews(listPayload.data || []);
      }
    } catch (err) {
      console.error(err);
      setReviewError(err instanceof Error ? err.message : 'ثبت نظر ناموفق بود.');
    }
  };

  const imageDetails = useMemo<{ url: string; title: string; order: number }[]>(
    () => villa?.imageDetails || villa?.images.map((url: string, index: number) => ({
      url,
      title: `تصویر ${index + 1}`,
      order: index,
    })) || [],
    [villa]
  );
  const selectedImage = imageDetails[selectedImageIndex] || imageDetails[0];

  const pricingCalendar = useMemo(() => {
    if (!villa) {
      return { days: [], basePrice: 0, weekendPrice: 0, holidayPrice: 0, minPrice: 0, maxPrice: 0 };
    }

    const specs = villa.specifications || {};
    const basePrice = Number(villa.price) || 0;
    const weekendPrice = Number(specs.weekendPrice) || basePrice;
    const holidayPrice = Number(specs.holidayPrice) || weekendPrice || basePrice;

    const holidayDatesRaw = typeof specs.holidayDates === 'string'
      ? specs.holidayDates
      : typeof specs.holidayDays === 'string'
        ? specs.holidayDays
        : '';
    const holidayDates = new Set(
      holidayDatesRaw
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
    );

    const startOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const endOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();

    const days = Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index + 1);
      const iso = date.toISOString().slice(0, 10);
      const weekday = date.getDay();
      const isWeekend = weekday === 3 || weekday === 4;
      const isHoliday = holidayDates.has(iso);
      const price = isHoliday ? holidayPrice : isWeekend ? weekendPrice : basePrice;
      return {
        iso,
        date,
        price,
        type: isHoliday ? 'holiday' : isWeekend ? 'weekend' : 'normal',
      };
    });

    const priceValues = [basePrice, weekendPrice, holidayPrice].filter((value) => value > 0);
    const minPrice = priceValues.length ? Math.min(...priceValues) : 0;
    const maxPrice = priceValues.length ? Math.max(...priceValues) : 0;

    return { days, basePrice, weekendPrice, holidayPrice, minPrice, maxPrice };
  }, [calendarMonth, villa]);

  const selectedStartDay = pricingCalendar.days.find((day) => day.iso === selectedStartIso) || null;
  const selectedEndDay = pricingCalendar.days.find((day) => day.iso === selectedEndIso) || null;
  const selectedRange = useMemo(() => {
    if (!selectedStartIso || !selectedEndIso) return [];
    return pricingCalendar.days.filter((day) => day.iso >= selectedStartIso && day.iso <= selectedEndIso);
  }, [pricingCalendar.days, selectedStartIso, selectedEndIso]);
  const selectedRangeTotal = selectedRange.reduce((sum, day) => sum + day.price, 0);
  const selectedRangeNights = selectedRange.length;
  const weekDayLabels = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  const startOffset = pricingCalendar.days.length
    ? (pricingCalendar.days[0].date.getDay() + 1) % 7
    : 0;
  const calendarLabel = calendarMonth.toLocaleDateString('fa-IR', { month: 'long', year: 'numeric' });
  const hostName = villa?.specifications?.hostName || 'میزبان سفرجا';
  const hostAvatar = villa?.specifications?.hostAvatar ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='64' fill='%23E8DED3'/%3E%3Ccircle cx='64' cy='50' r='22' fill='%23B59A7C'/%3E%3Cpath d='M24 112c8-22 28-34 40-34s32 12 40 34' fill='%23C7B09A'/%3E%3C/svg%3E";

  const handlePrevMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDaySelect = (iso: string) => {
    setBookingError('');
    if (!selectedStartIso || (selectedStartIso && selectedEndIso)) {
      setSelectedStartIso(iso);
      setSelectedEndIso(null);
      return;
    }

    if (iso < selectedStartIso) {
      setSelectedEndIso(selectedStartIso);
      setSelectedStartIso(iso);
      return;
    }

    setSelectedEndIso(iso);
  };

  const handleBooking = () => {
    if (!selectedStartIso || !selectedEndIso || !villaId) {
      setBookingError('برای رزرو باید بازه زمانی انتخاب شود.');
      return;
    }

    if (typeof window !== 'undefined') {
      const isLoggedIn = window.localStorage.getItem('demo-auth') === 'true';
      if (!isLoggedIn) {
        setBookingError('برای ادامه رزرو باید وارد حساب شوید.');
        router.push('/account');
        return;
      }
    }

    const params = new URLSearchParams({
      villaId: String(villaId),
      start: selectedStartIso,
      end: selectedEndIso,
      total: String(selectedRangeTotal),
      nights: String(selectedRangeNights),
      name: villa?.name ?? 'ویلا',
    });
    router.push(`/payment?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood-600 mx-auto mb-4"></div>
          <p className="text-wood-600">در حال بارگذاری اطلاعات ویلا...</p>
        </div>
      </div>
    );
  }

  if (error || !villa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-wood-800 mb-4">ویلا پیدا نشد</h1>
          <p className="text-wood-600 mb-6">{error || 'لطفا به لیست ویلاها برگردید و دوباره انتخاب کنید.'}</p>
          <Link href="/products" className="btn-primary px-6 py-3">
            بازگشت به ویلاها
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-wood-800 mb-2">{villa.name}</h1>
            <div className="flex items-center gap-2 text-forest-600 flex-wrap">
              <MapPinIcon className="h-5 w-5" />
              <span>{villa.location || villa.category}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm">{villa.status === 'approved' ? 'تایید شده' : 'در انتظار بررسی'}</span>
            </div>
          </div>
          <Link href="/products" className="text-wood-700 hover:text-wood-800 flex items-center gap-1">
            <ChevronRightIcon className="h-4 w-4" />
            بازگشت به ویلاها
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <div className="aspect-video rounded-xl bg-wood-100 overflow-hidden flex items-center justify-center border border-wood-100">
                {selectedImage ? (
                  <img src={selectedImage.url} alt={selectedImage.title || villa.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="text-wood-400 text-xl">بدون تصویر</div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {imageDetails.map((image, index) => (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`text-right rounded-xl border p-2 transition-colors ${selectedImageIndex === index ? 'border-wood-700 bg-wood-50' : 'border-wood-100 bg-white hover:bg-cream-50'}`}
                  >
                    <div className="aspect-video rounded-lg overflow-hidden bg-cream-100 mb-2">
                      <img src={image.url} alt={image.title || villa.name} className="h-full w-full object-cover" />
                    </div>
                    <p className="text-xs font-semibold text-wood-800 truncate">{image.title || `تصویر ${index + 1}`}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-wood-800 mb-4">توضیحات ویلا</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{villa.description}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-wood-800 mb-4">چت با میزبان</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={hostAvatar}
                    alt={hostName}
                    className="h-16 w-16 rounded-full border border-wood-100 object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold text-wood-800">{hostName}</p>
                    <p className="text-sm text-gray-600">پاسخگویی سریع و راهنمایی رزرو</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-xl border border-black bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
                >
                  چت و رزرو رایگان 5 دقیقه
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-wood-800 mb-4">امکانات</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(villa.amenities || []).map((item: string) => (
                  <div key={item} className="flex items-center gap-2 text-gray-700">
                    <CheckCircleIcon className="h-5 w-5 text-forest-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-wood-800 mb-4">فاصله تا مکان‌های مهم</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(villa.access || []).map((item: string) => (
                  <div key={item} className="flex items-center gap-2 text-gray-700">
                    <MapPinIcon className="h-5 w-5 text-wood-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-wood-800 mb-4">قوانین و مقررات</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {villa.rules || 'قوانین ویژه‌ای ثبت نشده است.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-wood-800">تقویم قیمتی</h2>
                  <p className="text-sm text-gray-600">برای رزرو، یک روز را انتخاب کنید.</p>
                </div>
                <div className="text-sm text-wood-700">
                  رنج قیمت: {formatPrice(pricingCalendar.minPrice)} تا {formatPrice(pricingCalendar.maxPrice)} تومان
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="flex items-center gap-2 rounded-xl border border-wood-200 bg-white px-3 py-2 text-sm text-wood-700 transition-colors hover:bg-cream-50"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                  ماه قبل
                </button>
                <div className="text-sm font-semibold text-wood-800">{calendarLabel}</div>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="flex items-center gap-2 rounded-xl border border-wood-200 bg-white px-3 py-2 text-sm text-wood-700 transition-colors hover:bg-cream-50"
                >
                  ماه بعد
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-700 mb-4">
                <span className="rounded-full border border-wood-200 px-3 py-1">روز عادی: {formatPrice(pricingCalendar.basePrice)} تومان</span>
                <span className="rounded-full border border-wood-200 px-3 py-1">آخر هفته: {formatPrice(pricingCalendar.weekendPrice)} تومان</span>
                <span className="rounded-full border border-wood-200 px-3 py-1">پیک/تعطیلات: {formatPrice(pricingCalendar.holidayPrice)} تومان</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-xs text-gray-600 mb-2">
                {weekDayLabels.map((label) => (
                  <div key={label} className="text-center font-semibold">
                    {label}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startOffset }).map((_, index) => (
                  <div key={`empty-${index}`} className="rounded-xl border border-transparent p-2" />
                ))}
                {pricingCalendar.days.map((day) => (
                  <button
                    key={day.iso}
                    type="button"
                    onClick={() => handleDaySelect(day.iso)}
                    className={`rounded-xl border p-2 text-right transition-colors ${
                      (selectedStartIso === day.iso || selectedEndIso === day.iso)
                        ? 'border-wood-700 bg-wood-700 text-white'
                        : selectedStartIso && selectedEndIso && day.iso > selectedStartIso && day.iso < selectedEndIso
                          ? 'border-wood-800 bg-wood-600 text-white'
                          : 'border-wood-100 bg-white hover:bg-cream-50'
                    }`}
                  >
                    <div className={`text-xs font-semibold ${(selectedStartIso === day.iso || selectedEndIso === day.iso || (selectedStartIso && selectedEndIso && day.iso > selectedStartIso && day.iso < selectedEndIso)) ? 'text-white' : 'text-wood-700'}`}>
                      {day.date.toLocaleDateString('fa-IR', { weekday: 'short' })}
                    </div>
                    <div className={`text-xs ${(selectedStartIso === day.iso || selectedEndIso === day.iso || (selectedStartIso && selectedEndIso && day.iso > selectedStartIso && day.iso < selectedEndIso)) ? 'text-white/80' : 'text-gray-500'}`}>
                      {day.date.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className={`text-sm font-semibold ${(selectedStartIso === day.iso || selectedEndIso === day.iso || (selectedStartIso && selectedEndIso && day.iso > selectedStartIso && day.iso < selectedEndIso)) ? 'text-white' : 'text-wood-800'}`}>
                      {formatPrice(day.price)} تومان
                    </div>
                    <div className={`text-[10px] ${(selectedStartIso === day.iso || selectedEndIso === day.iso || (selectedStartIso && selectedEndIso && day.iso > selectedStartIso && day.iso < selectedEndIso)) ? 'text-white/70' : 'text-gray-500'}`}>
                      {day.type === 'holiday' ? 'پیک' : day.type === 'weekend' ? 'آخر هفته' : 'عادی'}
                    </div>
                  </button>
                ))}
              </div>

              {selectedStartDay && (
                <div className="mt-4 rounded-xl border border-wood-100 bg-cream-50 p-3 text-sm text-wood-700">
                  {selectedEndDay ? (
                    <>
                      بازه انتخاب‌شده: {selectedStartDay.date.toLocaleDateString('fa-IR')} تا {selectedEndDay.date.toLocaleDateString('fa-IR')} • {selectedRangeNights} شب • مجموع: {formatPrice(selectedRangeTotal)} تومان
                    </>
                  ) : (
                    <>
                      روز شروع: {selectedStartDay.date.toLocaleDateString('fa-IR')} • برای انتخاب بازه، روز پایان را انتخاب کنید.
                    </>
                  )}
                </div>
              )}

              <div className="mt-4">
                <button
                  type="button"
                  disabled={!selectedStartIso || !selectedEndIso}
                  onClick={handleBooking}
                  className="w-full rounded-xl border border-black bg-white py-3 font-semibold text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50"
                >
                  درخواست رزرو
                </button>
                {bookingError ? (
                  <p className="mt-2 text-xs text-red-500">{bookingError}</p>
                ) : (!selectedStartIso || !selectedEndIso) && (
                  <p className="mt-2 text-xs text-red-500">برای رزرو باید بازه زمانی انتخاب شود.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-wood-800 mb-4">نظرات کاربران</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-wood-700 font-semibold mb-2">نام</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(event) => setReviewName(event.target.value)}
                      className="w-full p-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                      placeholder="نام شما"
                    />
                  </div>
                  <div>
                    <label className="block text-wood-700 font-semibold mb-2">امتیاز</label>
                    <select
                      value={reviewRating}
                      onChange={(event) => setReviewRating(Number(event.target.value))}
                      className="w-full p-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500"
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>{value} از 5</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-wood-700 font-semibold mb-2">نظر شما</label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    className="w-full p-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                    placeholder="تجربه خود را بنویسید"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="rounded-lg border border-black bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-black hover:text-white"
                >
                  ثبت نظر
                </button>
                {reviewSuccess && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    {reviewSuccess}
                  </div>
                )}
                {reviewError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {reviewError}
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                {reviewsLoading ? (
                  <p className="text-sm text-gray-500">در حال بارگذاری نظرات...</p>
                ) : reviews.length === 0 ? (
                  <p className="text-sm text-gray-500">هنوز نظری ثبت نشده است.</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-wood-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-wood-800">{review.userName}</p>
                        <span className="text-xs text-wood-600">{review.rating} از 5</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                      <p className="mt-2 text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('fa-IR')}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">قیمت هر شب</p>
                  <p className="text-2xl font-bold text-wood-800">{formatPrice(villa.price)} تومان</p>
                </div>
                <div className="flex items-center gap-2 text-forest-600">
                  <StarIcon className="h-5 w-5" />
                  <span className="font-semibold">{villa.rating}</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                این ویلا {villa.status === 'approved' ? 'منتشر شده' : 'بعد از تایید ادمین قابل نمایش است'}.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-wood-800">اطلاعات کلی</h3>
                <CalendarDaysIcon className="h-5 w-5 text-wood-600" />
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between gap-4"><span>دسته</span><span>{villa.category}</span></div>
                <div className="flex justify-between gap-4"><span>تعداد تصاویر</span><span>{imageDetails.length}</span></div>
                <div className="flex justify-between gap-4"><span>امتیاز</span><span>{villa.rating} از 5</span></div>
                <div className="flex justify-between gap-4"><span>وضعیت</span><span>{villa.status === 'approved' ? 'تایید شده' : 'در انتظار بررسی'}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-wood-800">نکات ویژه</h3>
                <ChevronLeftIcon className="h-5 w-5 text-wood-600" />
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p>{villa.isNew ? 'این ویلا به تازگی ثبت شده است.' : 'این ویلا در دسترس است.'}</p>
                {villa.originalPrice ? <p>قیمت قبل: {formatPrice(villa.originalPrice)} تومان</p> : null}
                <p>تخفیف: {villa.discount}%</p>
                <p>تعداد نظرات: {villa.reviewsCount}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}