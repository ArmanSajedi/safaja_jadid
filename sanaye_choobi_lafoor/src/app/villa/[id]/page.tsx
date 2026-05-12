'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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

  const imageDetails = useMemo<{ url: string; title: string; order: number }[]>(
    () => villa?.imageDetails || villa?.images.map((url: string, index: number) => ({
      url,
      title: `تصویر ${index + 1}`,
      order: index,
    })) || [],
    [villa]
  );
  const selectedImage = imageDetails[selectedImageIndex] || imageDetails[0];

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
              <button className="w-full bg-wood-700 text-white py-3 rounded-xl font-semibold hover:bg-wood-800 transition-colors">
                درخواست رزرو
              </button>
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