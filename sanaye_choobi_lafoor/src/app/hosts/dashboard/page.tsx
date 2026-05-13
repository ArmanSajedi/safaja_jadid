"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  PlusCircleIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  HomeIcon,
  PencilSquareIcon,
  TrashIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { JalaaliDateTimePicker } from 'jalaali-date-time-picker';

import type { Product } from '@/lib/api-client';

// Host application persistence is handled via server API endpoints

const tabs = [
  { id: 'new-villa', name: 'اضافه کردن ويلاي جديد', icon: PlusCircleIcon },
  { id: 'documents', name: 'مدارک و تاييد', icon: ShieldCheckIcon },
  { id: 'commission', name: 'کميسيون', icon: BanknotesIcon },
  { id: 'calendar', name: 'تقويم', icon: CalendarDaysIcon },
  { id: 'rules', name: 'قوانين', icon: DocumentTextIcon },
  { id: 'my-villas', name: 'ويلاهاي من', icon: HomeIcon },
];

export default function HostDashboardPage() {
  const [activeTab, setActiveTab] = useState('new-villa');
  const [isHostAuthed, setIsHostAuthed] = useState(false);
  const [hostPhone, setHostPhone] = useState('');
  const [hostCode, setHostCode] = useState('');
  const [hostAuthStep, setHostAuthStep] = useState<'phone' | 'code'>('phone');
  const [hostAuthMessage, setHostAuthMessage] = useState('');
  const [hostAuthError, setHostAuthError] = useState('');
  const [hostRequesting, setHostRequesting] = useState(false);
  const [hostVerifying, setHostVerifying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<{
    id: number;
    phone: string;
    status: 'pending' | 'approved' | 'rejected';
    name: string;
    documentsStatus: 'not_required' | 'pending' | 'approved' | 'rejected';
    nationalCardUrl: string | null;
    propertyDocumentUrl: string | null;
  } | null>(null);
  const [nationalCardFile, setNationalCardFile] = useState<File | null>(null);
  const [propertyDocumentFile, setPropertyDocumentFile] = useState<File | null>(null);
  const [documentUploading, setDocumentUploading] = useState(false);
  const [documentSuccess, setDocumentSuccess] = useState('');
  const [documentError, setDocumentError] = useState('');
  const [newVilla, setNewVilla] = useState({
    name: '',
    category: '',
    location: '',
    price: '',
    originalPrice: '',
    weekendPrice: '',
    holidayPrice: '',
    extraGuestPrice: '',
    capacity: '',
    description: '',
    address: '',
    rules: '',
  });
  const [amenityInput, setAmenityInput] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [accessInput, setAccessInput] = useState('');
  const [accessItems, setAccessItems] = useState<string[]>([]);
  const [rulesInput, setRulesInput] = useState('');
  const [rulesItems, setRulesItems] = useState<string[]>([]);
  const [villaImageFile, setVillaImageFile] = useState<File | null>(null);
  const [villaImageTitle, setVillaImageTitle] = useState('');
  const [villaImageOrder, setVillaImageOrder] = useState('1');
  const [villaImages, setVillaImages] = useState<Array<{ url: string; title: string; order: number }>>([]);
  const [villaSubmitting, setVillaSubmitting] = useState(false);
  const [myVillas, setMyVillas] = useState<Product[]>([]);
  const [myVillasLoading, setMyVillasLoading] = useState(false);
  const [myVillasError, setMyVillasError] = useState('');
  const [discountForms, setDiscountForms] = useState<Record<number, { percent: string; startDate: string; endDate: string }>>({});
  const [selectedMonth, setSelectedMonth] = useState('شهريور ۱۴۰۳');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [calendar, setCalendar] = useState(() => ({
    10: { price: 3200000, status: 'available' },
    11: { price: 3400000, status: 'available' },
    12: { price: 3600000, status: 'booked' },
    13: { price: 3300000, status: 'available' },
    14: { price: 3500000, status: 'blocked' },
    15: { price: 3800000, status: 'available' },
  } as Record<number, { price: number; status: 'available' | 'booked' | 'blocked' }>));
  const [dayPrice, setDayPrice] = useState('');
  const [dayStatus, setDayStatus] = useState<'available' | 'booked' | 'blocked'>('available');

  const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price);
  const weekdayLabels = ['ش', 'ي', 'د', 'س', 'چ', 'پ', 'ج'];
  const daysInMonth = 31;
  const monthStartOffset = 2;

  const selectedDayInfo = useMemo(() => {
    if (!selectedDay) return null;
    return calendar[selectedDay] || { price: 0, status: 'available' };
  }, [calendar, selectedDay]);

  const toIsoDate = (value?: Date | null) => {
    if (!value) return '';
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseIsoDate = (value?: string) => {
    if (!value) return undefined;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/uploads', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'خطا در آپلود فایل');
    }

    return result.url as string;
  };

  const refreshApplicationStatus = async () => {
    const phone = typeof window !== 'undefined' ? window.localStorage.getItem('demo-current-host-phone') : '';
    if (!phone) {
      setApplicationStatus(null);
      return;
    }

    try {
      const res = await fetch(`/api/hosts?phone=${encodeURIComponent(phone)}`);
      const payload = await res.json();
      if (!res.ok || !payload.success) {
        setApplicationStatus(null);
        return;
      }

      const application = Array.isArray(payload.data) && payload.data.length > 0 ? payload.data[0] : null;
      if (!application) {
        setApplicationStatus(null);
        return;
      }

      setApplicationStatus({
        id: application.id,
        phone: application.phone,
        status: application.status,
        name: `${application.firstName} ${application.lastName}`,
        documentsStatus: application.documentsStatus,
        nationalCardUrl: application.nationalIdImage || null,
        propertyDocumentUrl: application.ownershipDocImage || null,
      });
    } catch (err) {
      console.error(err);
      setApplicationStatus(null);
    }
  };

  useEffect(() => {
    const storedAuth = typeof window !== 'undefined' ? window.localStorage.getItem('demo-host-auth') : null;
    const storedPhone = typeof window !== 'undefined' ? window.localStorage.getItem('demo-current-host-phone') : null;
    if (storedPhone) {
      setHostPhone(storedPhone);
    }
    if (storedAuth === 'true') {
      setIsHostAuthed(true);
    }
    refreshApplicationStatus();
    window.addEventListener('storage', refreshApplicationStatus);
    return () => window.removeEventListener('storage', refreshApplicationStatus);
  }, []);

  const handleHostSendCode = async () => {
    setHostAuthError('');
    setHostAuthMessage('');
    const normalizedPhone = hostPhone.replace(/[^0-9]/g, '').trim();
    if (!normalizedPhone) {
      setHostAuthError('شماره موبایل را وارد کنید.');
      return;
    }

    try {
      setHostRequesting(true);
      const response = await fetch('/api/hosts/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedPhone }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'ارسال کد ناموفق بود.');
      }

      setHostAuthStep('code');
      setHostAuthMessage('کد تایید ارسال شد.');
    } catch (error) {
      console.error(error);
      setHostAuthError(error instanceof Error ? error.message : 'ارسال کد ناموفق بود.');
    } finally {
      setHostRequesting(false);
    }
  };

  const handleHostVerifyCode = async () => {
    setHostAuthError('');
    setHostAuthMessage('');
    const normalizedPhone = hostPhone.replace(/[^0-9]/g, '').trim();
    if (!normalizedPhone || !hostCode.trim()) {
      setHostAuthError('شماره موبایل و کد تایید الزامی است.');
      return;
    }

    try {
      setHostVerifying(true);
      const response = await fetch('/api/hosts/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedPhone, code: hostCode.trim() }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'تایید کد ناموفق بود.');
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('demo-host-auth', 'true');
        window.localStorage.setItem('demo-current-host-phone', normalizedPhone);
      }

      setIsHostAuthed(true);
      setHostAuthMessage('با موفقیت وارد شدید.');
      refreshApplicationStatus();
    } catch (error) {
      console.error(error);
      setHostAuthError(error instanceof Error ? error.message : 'تایید کد ناموفق بود.');
    } finally {
      setHostVerifying(false);
    }
  };

  const loadMyVillas = async () => {
    if (!applicationStatus?.id) {
      setMyVillas([]);
      return;
    }

    try {
      setMyVillasLoading(true);
      setMyVillasError('');
      const response = await fetch(`/api/products?hostId=${applicationStatus.id}&status=all`);
      const payload = await response.json();
      if (response.ok && payload.success) {
        setMyVillas(payload.data || []);
      } else {
        setMyVillas([]);
        setMyVillasError('دریافت ویلاها ناموفق بود.');
      }
    } catch (error) {
      console.error(error);
      setMyVillas([]);
      setMyVillasError('دریافت ویلاها ناموفق بود.');
    } finally {
      setMyVillasLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-villas') {
      loadMyVillas();
    }
  }, [activeTab, applicationStatus?.id]);

  useEffect(() => {
    if (myVillas.length === 0) return;
    setDiscountForms((prev) => {
      const next = { ...prev };
      myVillas.forEach((villa) => {
        if (next[villa.id]) return;
        const specs = villa.specifications || {};
        next[villa.id] = {
          percent: villa.discount ? String(villa.discount) : '',
          startDate: specs.discountStartDate || '',
          endDate: specs.discountEndDate || '',
        };
      });
      return next;
    });
  }, [myVillas]);

  const handleDocumentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setDocumentSuccess('');
    setDocumentError('');

    if (!applicationStatus || applicationStatus.status !== 'approved') {
      setDocumentError('ابتدا باید درخواست اولیه شما توسط ادمین تایید شود.');
      return;
    }

    if (!nationalCardFile || !propertyDocumentFile) {
      setDocumentError('هر دو فایل کارت ملی و جواز/وکالت باید بارگذاری شوند.');
      return;
    }

    try {
      setDocumentUploading(true);

      const formData = new FormData();
      formData.append('nationalId', nationalCardFile as File);
      formData.append('ownershipDoc', propertyDocumentFile as File);

      // need host id: fetch host record by phone
      const phone = applicationStatus.phone;
      const listRes = await fetch(`/api/hosts?phone=${encodeURIComponent(phone)}`);
      const listPayload = await listRes.json();
      if (!listRes.ok || !listPayload.success || !Array.isArray(listPayload.data) || listPayload.data.length === 0) {
        throw new Error('کاربر میزبان یافت نشد');
      }
      const host = listPayload.data[0];

      const uploadRes = await fetch(`/api/hosts/${host.id}/documents`, {
        method: 'POST',
        body: formData,
      });

      const uploadPayload = await uploadRes.json();
      if (!uploadRes.ok || !uploadPayload.success) {
        throw new Error(uploadPayload.message || 'خطا در ارسال مدارک');
      }

      setDocumentSuccess('مدارک شما ثبت شد و در انتظار بررسی ادمین است.');
      setNationalCardFile(null);
      setPropertyDocumentFile(null);
      refreshApplicationStatus();
    } catch (error) {
      console.error(error);
      setDocumentError('ثبت مدارک ناموفق بود. دوباره تلاش کنید.');
    } finally {
      setDocumentUploading(false);
    }
  };

  const addAmenity = () => {
    const trimmed = amenityInput.trim();
    if (!trimmed) return;
    setAmenities((prev) => [...prev, trimmed]);
    setAmenityInput('');
  };

  const removeAmenity = (item: string) => {
    setAmenities((prev) => prev.filter((amenity) => amenity !== item));
  };

  const addAccessItem = () => {
    const trimmed = accessInput.trim();
    if (!trimmed) return;
    setAccessItems((prev) => [...prev, trimmed]);
    setAccessInput('');
  };

  const addRuleItem = () => {
    const trimmed = rulesInput.trim();
    if (!trimmed) return;
    setRulesItems((prev) => [...prev, trimmed]);
    setRulesInput('');
  };

  const removeAccessItem = (item: string) => {
    setAccessItems((prev) => prev.filter((access) => access !== item));
  };

  const removeRuleItem = (item: string) => {
    setRulesItems((prev) => prev.filter((rule) => rule !== item));
  };

  const handleVillaImageUpload = async () => {
    if (!villaImageFile) return;

    const uploadedUrl = await uploadFile(villaImageFile);
    const nextOrder = Number(villaImageOrder) || villaImages.length + 1;

    setVillaImages((prev) => [
      ...prev,
      {
        url: uploadedUrl,
        title: villaImageTitle.trim() || `تصویر ${nextOrder}`,
        order: nextOrder,
      },
    ].sort((a, b) => a.order - b.order));

    setVillaImageFile(null);
    setVillaImageTitle('');
    setVillaImageOrder(String(villaImages.length + 2));
  };

  const updateVillaImage = (index: number, updates: Partial<{ title: string; order: number }>) => {
    setVillaImages((prev) => prev.map((image, currentIndex) => (
      currentIndex === index ? { ...image, ...updates } : image
    )).sort((a, b) => a.order - b.order));
  };

  const moveVillaImage = (index: number, direction: -1 | 1) => {
    setVillaImages((prev) => {
      const next = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next.map((image, orderIndex) => ({ ...image, order: orderIndex + 1 }));
    });
  };

  const removeVillaImage = (index: number) => {
    setVillaImages((prev) => prev
      .filter((_, currentIndex) => currentIndex !== index)
      .map((image, orderIndex) => ({ ...image, order: orderIndex + 1 })));
  };

  const handleAddVilla = async () => {
    if (!applicationStatus || applicationStatus.status !== 'approved' || applicationStatus.documentsStatus !== 'approved') {
      setMyVillasError('ابتدا باید درخواست و مدارک شما توسط ادمین تایید شوند.');
      return;
    }

    if (!newVilla.name.trim() || !newVilla.price.trim() || !villaImages.length) {
      setMyVillasError('نام ویلا، قیمت و حداقل یک تصویر را وارد کنید.');
      return;
    }

    try {
      setVillaSubmitting(true);
      setMyVillasError('');

      const price = Number(newVilla.price);
      const originalPrice = newVilla.originalPrice.trim() ? Number(newVilla.originalPrice) : null;
      const weekendPrice = newVilla.weekendPrice.trim() ? Number(newVilla.weekendPrice) : null;
      const holidayPrice = newVilla.holidayPrice.trim() ? Number(newVilla.holidayPrice) : null;
      const extraGuestPrice = newVilla.extraGuestPrice.trim() ? Number(newVilla.extraGuestPrice) : null;
      const discount = originalPrice && originalPrice > price
        ? Math.max(0, Math.round((1 - price / originalPrice) * 100))
        : 0;

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostId: applicationStatus.id,
          name: newVilla.name.trim(),
          location: newVilla.location.trim() || newVilla.address.trim() || newVilla.category.trim(),
          category: newVilla.category.trim() || newVilla.location.trim(),
          description: newVilla.description.trim(),
          price,
          originalPrice,
          rating: 0,
          reviewsCount: 0,
          discount,
          isNew: true,
          images: villaImages,
          amenities,
          access: accessItems,
          rules: rulesItems.length > 0 ? rulesItems.join(' | ') : newVilla.rules.trim(),
          specifications: {
            capacity: newVilla.capacity.trim(),
            address: newVilla.address.trim(),
            weekendPrice: weekendPrice ? String(weekendPrice) : '',
            holidayPrice: holidayPrice ? String(holidayPrice) : '',
            extraGuestPrice: extraGuestPrice ? String(extraGuestPrice) : '',
          },
          stock: Number(newVilla.capacity) || 1,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || 'خطا در ثبت ویلا');
      }

      setNewVilla({
        name: '',
        category: '',
        location: '',
        price: '',
        originalPrice: '',
        weekendPrice: '',
        holidayPrice: '',
        extraGuestPrice: '',
        capacity: '',
        description: '',
        address: '',
        rules: '',
      });
      setAmenities([]);
      setAccessItems([]);
      setRulesItems([]);
      setRulesInput('');
      setVillaImages([]);
      setVillaImageFile(null);
      setVillaImageTitle('');
      setVillaImageOrder('1');
      setDocumentSuccess('ویلا ذخیره شد و در انتظار تایید ادمین است.');
      await loadMyVillas();
    } catch (error) {
      console.error(error);
      setMyVillasError(error instanceof Error ? error.message : 'ثبت ویلا ناموفق بود.');
    } finally {
      setVillaSubmitting(false);
    }
  };

  const toggleVillaStatus = async (id: number) => {
    const villa = myVillas.find((item) => item.id === id);
    if (!villa) return;

    const nextStatus = villa.status === 'approved' ? 'draft' : 'pending_review';

    await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });

    await loadMyVillas();
  };

  const removeVilla = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    await loadMyVillas();
  };

  const updateDiscountForm = (villaId: number, updates: Partial<{ percent: string; startDate: string; endDate: string }>) => {
    setDiscountForms((prev) => ({
      ...prev,
      [villaId]: {
        percent: prev[villaId]?.percent || '',
        startDate: prev[villaId]?.startDate || '',
        endDate: prev[villaId]?.endDate || '',
        ...updates,
      },
    }));
  };

  const applyDiscountForVilla = async (villa: Product) => {
    const form = discountForms[villa.id] || { percent: '', startDate: '', endDate: '' };
    const percentValue = form.percent.trim() ? Number(form.percent) : 0;
    if (Number.isNaN(percentValue) || percentValue < 0 || percentValue > 100) {
      setMyVillasError('درصد تخفیف باید بین 0 تا 100 باشد.');
      return;
    }
    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      setMyVillasError('تاریخ شروع نمی‌تواند بعد از تاریخ پایان باشد.');
      return;
    }

    setMyVillasError('');
    const specs = villa.specifications || {};
    const nextSpecs = {
      ...specs,
      discountStartDate: form.startDate || '',
      discountEndDate: form.endDate || '',
    };

    await fetch(`/api/products/${villa.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        discount: percentValue,
        specifications: nextSpecs,
      }),
    });

    await loadMyVillas();
  };

  const getHostDisplayName = (hostId?: number) => {
    if (!hostId) return 'نامشخص';
    return applicationStatus?.id === hostId ? applicationStatus.name : `میزبان #${hostId}`;
  };

  const getVillaStatusLabel = (status?: string) => {
    if (status === 'approved') return 'تایید شده';
    if (status === 'pending_review') return 'در انتظار بررسی';
    if (status === 'rejected') return 'رد شده';
    return 'پیش‌نویس';
  };

  const getVillaDrawerPayload = (villa: Product) => {
    const imageEntries = (villa.imageDetails && villa.imageDetails.length > 0)
      ? villa.imageDetails
      : (villa.images || []).map((url, index) => ({ url, title: `تصویر ${index + 1}`, order: index + 1 }));

    return [
      { label: 'نام ویلا', value: villa.name },
      { label: 'ميزبان', value: getHostDisplayName(villa.hostId) },
      { label: 'وضعيت', value: getVillaStatusLabel(villa.status) },
      { label: 'موقعیت', value: villa.location || '-' },
      { label: 'دسته', value: villa.category },
      { label: 'قوانین', value: villa.rules || '-' },
      ...imageEntries.map((image, index) => ({
        label: `تصویر ${index + 1}${image.title ? ` - ${image.title}` : ''}`,
        value: image.url,
      })),
    ];
  };

  const myVillasSection = (() => {
    if (myVillasLoading) {
      return <div className="rounded-xl border border-wood-100 p-6 text-center text-gray-500">در حال دریافت ویلاها...</div>;
    }

    if (myVillasError) {
      return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{myVillasError}</div>;
    }

    if (myVillas.length === 0) {
      return <div className="rounded-xl border border-wood-100 p-6 text-center text-gray-500">هنوز ویلایی ثبت نشده است.</div>;
    }

    // Helper to check if discount is active and calculate remaining time
    const getDiscountStatus = (villa: Product) => {
      const percent = villa.discount || 0;
      const specs = villa.specifications || {};
      const start = specs.discountStartDate ? new Date(specs.discountStartDate) : null;
      const end = specs.discountEndDate ? new Date(specs.discountEndDate) : null;
      if (end) {
        end.setHours(23, 59, 59, 999);
      }
      const now = new Date();
      let isActive = false;
      let remaining = '';
      if (percent > 0 && start && end && now >= start && now <= end) {
        isActive = true;
        // Calculate remaining time (days, hours)
        const diffMs = end.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (diffDays > 0) {
          remaining = `${diffDays} روز و ${diffHours} ساعت`;
        } else if (diffHours > 0) {
          remaining = `${diffHours} ساعت`;
        } else {
          remaining = 'کمتر از ۱ ساعت';
        }
      }
      return { isActive, percent, remaining, start, end };
    };

    return (
      <div className="space-y-3">
        {myVillas.map((villa) => {
          const discount = getDiscountStatus(villa);
          return (
            <div key={villa.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-wood-100 bg-white p-4 relative">
              {/* Discount badge */}
              {discount.isActive && (
                <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                  <span className="rounded-full bg-red-500 text-white px-3 py-1 text-xs font-bold animate-pulse">تخفیف فعال {discount.percent}%</span>
                  <span className="rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs">{discount.remaining} باقی‌مانده</span>
                </div>
              )}
              <div>
                <p className="font-semibold text-wood-800">{villa.name}</p>
                <p className="text-sm text-gray-500">وضعیت: {getVillaStatusLabel(villa.status)}</p>
                <p className="text-sm text-gray-500">قیمت پایه: {formatPrice(villa.price)} تومان</p>
                <p className="text-sm text-gray-500">عکس‌ها: {villa.images.length} مورد</p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2 flex-wrap">
                <div className="rounded-xl border border-wood-100 bg-cream-50 p-3 text-xs text-gray-700">
                  <p className="font-semibold text-wood-800 mb-2">تخفیف ویژه</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={discountForms[villa.id]?.percent || ''}
                      onChange={(event) => updateDiscountForm(villa.id, { percent: event.target.value })}
                      className="rounded-lg border border-wood-200 px-2 py-1 text-xs"
                      placeholder="درصد"
                    />
                    <div className="text-right">
                      <JalaaliDateTimePicker
                        className="w-full rounded-lg border border-wood-200 px-2 py-1 text-xs"
                        value={parseIsoDate(discountForms[villa.id]?.startDate)}
                        onChange={(value) => updateDiscountForm(villa.id, { startDate: toIsoDate(value) })}
                        format="jalali"
                        showTime={false}
                        clearable
                        placeholderLabel="تاریخ شروع"
                      />
                    </div>
                    <div className="text-right">
                      <JalaaliDateTimePicker
                        className="w-full rounded-lg border border-wood-200 px-2 py-1 text-xs"
                        value={parseIsoDate(discountForms[villa.id]?.endDate)}
                        onChange={(value) => updateDiscountForm(villa.id, { endDate: toIsoDate(value) })}
                        format="jalali"
                        showTime={false}
                        clearable
                        placeholderLabel="تاریخ پایان"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => applyDiscountForVilla(villa)}
                    className="mt-2 w-full rounded-lg border border-black bg-white px-3 py-1 text-xs font-semibold text-black transition-colors hover:bg-black hover:text-white"
                  >
                    اعمال تخفیف
                  </button>
                </div>
                <Link href={`/villa/${villa.id}`} className="flex items-center gap-1 rounded-lg border border-wood-200 px-3 py-1 text-sm text-wood-700">
                  <PencilSquareIcon className="h-4 w-4" />
                  مشاهده
                </Link>
                <button
                  type="button"
                  onClick={() => toggleVillaStatus(villa.id)}
                  className="rounded-lg border border-wood-200 px-3 py-1 text-sm text-wood-700"
                >
                  ارسال مجدد برای تایید
                </button>
                <button
                  type="button"
                  onClick={() => removeVilla(villa.id)}
                  className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                  حذف
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  })();

  const handleCalendarDaySelect = (day: number) => {
    setSelectedDay(day);
    const info = calendar[day];
    setDayPrice(info ? String(info.price) : '');
    setDayStatus(info ? info.status : 'available');
  };

  const applyCalendarUpdate = () => {
    if (!selectedDay) return;
    setCalendar((prev) => ({
      ...prev,
      [selectedDay]: {
        price: Number(dayPrice) || 0,
        status: dayStatus,
      },
    }));
  };

  if (!isHostAuthed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-wood-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-10 w-10 text-wood-600" />
              </div>
              <h1 className="text-2xl font-bold text-wood-800 mb-2">ورود میزبان</h1>
              <p className="text-forest-600">برای ورود کد تایید پیامکی دریافت کنید.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-wood-700 font-semibold mb-2">شماره موبایل</label>
                <input
                  type="tel"
                  placeholder="09123456789"
                  value={hostPhone}
                  onChange={(event) => setHostPhone(event.target.value)}
                  disabled={hostAuthStep !== 'phone'}
                  className="w-full p-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 text-right disabled:bg-gray-100"
                />
              </div>

              {hostAuthStep === 'code' && (
                <div>
                  <label className="block text-wood-700 font-semibold mb-2">کد تایید</label>
                  <input
                    type="text"
                    placeholder="کد پیامک شده"
                    value={hostCode}
                    onChange={(event) => setHostCode(event.target.value)}
                    className="w-full p-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                  />
                </div>
              )}

              {hostAuthStep === 'phone' ? (
                <button
                  type="button"
                  onClick={handleHostSendCode}
                  disabled={hostRequesting}
                  className="w-full rounded-lg border border-black bg-white py-3 font-semibold text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50"
                >
                  {hostRequesting ? 'در حال ارسال کد...' : 'ارسال کد تایید'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleHostVerifyCode}
                  disabled={hostVerifying}
                  className="w-full rounded-lg border border-black bg-white py-3 font-semibold text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50"
                >
                  {hostVerifying ? 'در حال تایید...' : 'تایید کد و ورود'}
                </button>
              )}

              {hostAuthMessage && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  {hostAuthMessage}
                </div>
              )}
              {hostAuthError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {hostAuthError}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {applicationStatus && (
          <div className={`mb-6 rounded-2xl border p-4 text-sm ${
            applicationStatus.status === 'pending'
              ? 'border-yellow-200 bg-yellow-50 text-yellow-800'
              : applicationStatus.status === 'approved'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
          }`}>
            <p className="font-semibold">
              وضعیت درخواست میزبان برای {applicationStatus.name}
            </p>
            <p className="mt-1">
              {applicationStatus.status === 'pending'
                ? 'درخواست شما ثبت شده و در پنل ادمین در انتظار بررسی است.'
                : applicationStatus.status === 'approved'
                  ? 'درخواست شما تایید شده است. در مرحله بعد باید مدارک خود را آپلود کنید.'
                  : 'درخواست شما رد شده است. در صورت نیاز می‌توانید اطلاعات را اصلاح و دوباره ارسال کنید.'}
            </p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="border-b border-wood-100 px-6 py-6">
            <h1 className="text-3xl font-bold text-wood-800">پنل ميزبان سفرجا</h1>
            <p className="text-gray-600 mt-2">مديريت ويلاها، رزروها و تنظيمات ميزباني</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4">
            <aside className="bg-cream-50 p-6 border-l border-wood-100">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-right transition-colors ${
                        isActive
                          ? 'bg-wood-700 text-white'
                          : 'bg-white text-wood-700 hover:bg-wood-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-semibold">{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="lg:col-span-3 p-6 space-y-6">
              {activeTab === 'new-villa' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-wood-800">اضافه کردن ويلاي جديد</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">نام ويلا</label>
                      <input
                        type="text"
                        value={newVilla.name}
                        onChange={(event) => setNewVilla({ ...newVilla, name: event.target.value })}
                        className="w-full p-3 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="مثال: ويلاي ساحلي رامسر"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">شهر / دسته</label>
                      <input
                        type="text"
                        value={newVilla.category}
                        onChange={(event) => setNewVilla({ ...newVilla, category: event.target.value })}
                        className="w-full p-3 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="مثال: رامسر"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">موقعیت دقیق ویلا</label>
                      <input
                        type="text"
                        value={newVilla.location}
                        onChange={(event) => setNewVilla({ ...newVilla, location: event.target.value })}
                        className="w-full p-3 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="مثال: رامسر، بلوار ساحلی، پلاک ۱۲"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">قيمت هر شب (تومان)</label>
                      <input
                        type="number"
                        value={newVilla.price}
                        onChange={(event) => setNewVilla({ ...newVilla, price: event.target.value })}
                        className="w-full p-3 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="3200000"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">قیمت قبل / مرجع</label>
                      <input
                        type="number"
                        value={newVilla.originalPrice}
                        onChange={(event) => setNewVilla({ ...newVilla, originalPrice: event.target.value })}
                        className="w-full p-3 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="3800000"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">ظرفيت نفر</label>
                      <input
                        type="number"
                        value={newVilla.capacity}
                        onChange={(event) => setNewVilla({ ...newVilla, capacity: event.target.value })}
                        className="w-full p-3 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="6"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">قيمت آخر هفته (تومان)</label>
                      <input
                        type="number"
                        value={newVilla.weekendPrice}
                        onChange={(event) => setNewVilla({ ...newVilla, weekendPrice: event.target.value })}
                        className="w-full p-3 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="3800000"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">قيمت روزهای پیک/تعطيلات (تومان)</label>
                      <input
                        type="number"
                        value={newVilla.holidayPrice}
                        onChange={(event) => setNewVilla({ ...newVilla, holidayPrice: event.target.value })}
                        className="w-full p-3 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="4200000"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">هزينه هر نفر اضافه (تومان)</label>
                      <input
                        type="number"
                        value={newVilla.extraGuestPrice}
                        onChange={(event) => setNewVilla({ ...newVilla, extraGuestPrice: event.target.value })}
                        className="w-full p-3 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="250000"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">آدرس کامل</label>
                      <input
                        type="text"
                        value={newVilla.address}
                        onChange={(event) => setNewVilla({ ...newVilla, address: event.target.value })}
                        className="w-full p-3 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="مثال: بلوار ساحلي، کوچه نسيم"
                      />
                    </div>
                    <div>
                      <label className="block text-wood-700 font-semibold mb-2">قوانين ويلا</label>
                      <input
                        type="text"
                        value={newVilla.rules}
                        onChange={(event) => setNewVilla({ ...newVilla, rules: event.target.value })}
                        className="w-full p-3 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="مثال: ورود 14، خروج 12"
                      />
                    </div>
                  </div>
                  <div className="bg-white border border-wood-100 rounded-2xl p-4">
                    <label className="block text-wood-700 font-semibold mb-2">افزودن قوانین بیشتر</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={rulesInput}
                        onChange={(event) => setRulesInput(event.target.value)}
                        className="flex-1 p-2 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                        placeholder="مثال: استعمال دخانيات ممنوع"
                      />
                      <button
                        type="button"
                        onClick={addRuleItem}
                        className="rounded-xl border border-black bg-white px-4 text-black transition-colors hover:bg-black hover:text-white"
                      >
                        افزودن
                      </button>
                    </div>
                    {rulesItems.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {rulesItems.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => removeRuleItem(item)}
                            className="rounded-full border border-wood-200 px-3 py-1 text-xs text-wood-700"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-wood-700 font-semibold mb-2">توضيحات ويلا</label>
                    <textarea
                      rows={4}
                      value={newVilla.description}
                      onChange={(event) => setNewVilla({ ...newVilla, description: event.target.value })}
                      className="w-full p-3 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                      placeholder="توضيح کوتاه درباره ويلا و امکانات"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-wood-100 rounded-2xl p-4">
                      <label className="block text-wood-700 font-semibold mb-2">افزودن امکانات</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={amenityInput}
                          onChange={(event) => setAmenityInput(event.target.value)}
                          className="flex-1 p-2 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                          placeholder="مثال: استخر اختصاصي"
                        />
                        <button
                          type="button"
                          onClick={addAmenity}
                          className="rounded-xl border border-black bg-white px-4 text-black transition-colors hover:bg-black hover:text-white"
                        >
                          افزودن
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {amenities.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => removeAmenity(item)}
                            className="rounded-full border border-wood-200 px-3 py-1 text-xs text-wood-700"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white border border-wood-100 rounded-2xl p-4">
                      <label className="block text-wood-700 font-semibold mb-2">افزودن فاصله تا مکان‌ها</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={accessInput}
                          onChange={(event) => setAccessInput(event.target.value)}
                          className="flex-1 p-2 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                          placeholder="مثال: 5 دقیقه تا ساحل"
                        />
                        <button
                          type="button"
                          onClick={addAccessItem}
                          className="rounded-xl border border-black bg-white px-4 text-black transition-colors hover:bg-black hover:text-white"
                        >
                          افزودن
                        </button>
                      </div>
                      <div className="mt-3 space-y-2 text-xs text-gray-600">
                        {accessItems.map((item) => (
                          <div key={item} className="flex items-center justify-between rounded-lg border border-wood-100 px-2 py-1">
                            <span className="truncate">{item}</span>
                            <button type="button" onClick={() => removeAccessItem(item)} className="text-red-500">
                              حذف
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-wood-100 rounded-2xl p-4">
                      <label className="block text-wood-700 font-semibold mb-2">آپلود عکس ویلا</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => setVillaImageFile(event.target.files?.[0] || null)}
                        className="w-full rounded-xl border border-wood-200 px-3 py-2 text-sm"
                      />
                      <div className="mt-3 grid grid-cols-1 gap-3">
                        <input
                          type="text"
                          value={villaImageTitle}
                          onChange={(event) => setVillaImageTitle(event.target.value)}
                          className="w-full p-2 border border-wood-200 rounded-xl text-right"
                          placeholder="عنوان عکس"
                        />
                        <input
                          type="number"
                          value={villaImageOrder}
                          onChange={(event) => setVillaImageOrder(event.target.value)}
                          className="w-full p-2 border border-wood-200 rounded-xl text-right"
                          placeholder="ترتیب نمایش"
                        />
                        <button
                          type="button"
                          onClick={handleVillaImageUpload}
                          disabled={!villaImageFile}
                          className="rounded-xl border border-black bg-white px-4 py-2 text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50"
                        >
                          افزودن عکس
                        </button>
                      </div>
                    </div>
                    <div className="bg-white border border-wood-100 rounded-2xl p-4 space-y-3">
                      <p className="block text-wood-700 font-semibold mb-2">لیست عکس‌ها</p>
                      {villaImages.length === 0 ? (
                        <p className="text-sm text-gray-500">هنوز عکسی اضافه نشده است.</p>
                      ) : (
                        villaImages.map((image, index) => (
                          <div key={`${image.url}-${index}`} className="rounded-xl border border-wood-100 p-3 space-y-2">
                            <div className="flex items-start gap-3">
                              <img src={image.url} alt={image.title} className="h-16 w-24 rounded-lg object-cover border" />
                              <div className="flex-1 space-y-2">
                                <input
                                  type="text"
                                  value={image.title}
                                  onChange={(event) => updateVillaImage(index, { title: event.target.value })}
                                  className="w-full rounded-lg border border-wood-200 px-3 py-2 text-sm text-right"
                                  placeholder="عنوان عکس"
                                />
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">ترتیب {image.order}</span>
                                  <button type="button" onClick={() => moveVillaImage(index, -1)} className="rounded-lg border border-wood-200 px-2 py-1 text-xs">↑</button>
                                  <button type="button" onClick={() => moveVillaImage(index, 1)} className="rounded-lg border border-wood-200 px-2 py-1 text-xs">↓</button>
                                  <button type="button" onClick={() => removeVillaImage(index)} className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600">حذف</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVilla}
                    disabled={villaSubmitting}
                    className="rounded-xl border border-black bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50"
                  >
                    {villaSubmitting ? 'در حال ذخیره...' : 'ذخيره و ارسال برای تایید'}
                  </button>
                  {myVillasError && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{myVillasError}</div>}
                </div>
              )}

              {activeTab === 'commission' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">کميسيون</h2>
                  <div className="rounded-2xl border border-wood-100 bg-cream-50 p-4 text-sm text-gray-700">
                    درصد کميسيون شما بر اساس عملکرد و امتياز ميزباني محاسبه مي شود.
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm text-gray-600">ماه</label>
                    <select
                      value={selectedMonth}
                      onChange={(event) => setSelectedMonth(event.target.value)}
                      className="rounded-xl border border-wood-100 px-3 py-2 text-sm"
                    >
                      <option value="شهريور ۱۴۰۳">شهريور ۱۴۰۳</option>
                      <option value="مهر ۱۴۰۳">مهر ۱۴۰۳</option>
                      <option value="آبان ۱۴۰۳">آبان ۱۴۰۳</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-wood-100 p-4">
                      <p className="text-sm text-gray-500">کميسيون اين ماه</p>
                      <p className="text-2xl font-bold text-wood-800">18٪</p>
                    </div>
                    <div className="bg-white rounded-xl border border-wood-100 p-4">
                      <p className="text-sm text-gray-500">درآمد تخميني</p>
                      <p className="text-2xl font-bold text-wood-800">42,500,000</p>
                    </div>
                    <div className="bg-white rounded-xl border border-wood-100 p-4">
                      <p className="text-sm text-gray-500">امتياز ميزبان</p>
                      <p className="text-2xl font-bold text-wood-800">4.7</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-wood-100 p-4">
                    <h3 className="text-lg font-bold text-wood-800 mb-3">پرداخت هاي اخير</h3>
                    <div className="space-y-3 text-sm">
                      {[
                        { date: '1403/06/05', amount: 12500000, status: 'تسويه شد' },
                        { date: '1403/06/12', amount: 8200000, status: 'در انتظار تسويه' },
                        { date: '1403/06/18', amount: 5600000, status: 'در انتظار تسويه' },
                      ].map((payment) => (
                        <div key={payment.date} className="flex items-center justify-between border border-wood-100 rounded-xl px-3 py-2">
                          <span>{payment.date}</span>
                          <span className="font-semibold">{formatPrice(payment.amount)} تومان</span>
                          <span className="text-xs text-wood-600">{payment.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">مدارک و تایید نهایی</h2>
                  {applicationStatus?.status !== 'approved' ? (
                    <div className="rounded-2xl border border-wood-100 bg-cream-50 p-6 text-sm text-gray-700">
                      پس از تایید اولیه درخواست، اینجا می‌توانید عکس کارت ملی و جواز یا فرم وکالت ویلا را آپلود کنید.
                    </div>
                  ) : applicationStatus.documentsStatus === 'approved' ? (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-sm text-green-800">
                      مدارک شما تایید نهایی شده‌اند و پروفایل میزبان شما فعال است.
                    </div>
                  ) : (
                    <>
                      <div className="rounded-2xl border border-wood-100 bg-cream-50 p-4 text-sm text-gray-700">
                        <p className="font-semibold text-wood-800">مرحله دوم ثبت‌نام</p>
                        <p className="mt-1">
                          اگر هنوز مدارک خود را ثبت نکرده‌اید، لطفاً ابتدا مدارک خود را آپلود کنید تا برای بررسی نهایی به ادمین ارسال شود.
                        </p>
                      </div>

                      <form onSubmit={handleDocumentSubmit} className="space-y-4 rounded-2xl border border-wood-100 bg-white p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-wood-700 font-semibold mb-2">عکس کارت ملی *</label>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(event) => setNationalCardFile(event.target.files?.[0] || null)}
                              className="w-full rounded-xl border border-wood-200 px-3 py-2 text-sm"
                            />
                            {nationalCardFile && (
                              <p className="mt-2 text-xs text-gray-500">فایل انتخاب شده: {nationalCardFile.name}</p>
                            )}
                            {applicationStatus.nationalCardUrl && (
                              <a href={applicationStatus.nationalCardUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-wood-700 underline">
                                مشاهده فایل قبلی کارت ملی
                              </a>
                            )}
                          </div>
                          <div>
                            <label className="block text-wood-700 font-semibold mb-2">جواز یا فرم وکالت ویلا *</label>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(event) => setPropertyDocumentFile(event.target.files?.[0] || null)}
                              className="w-full rounded-xl border border-wood-200 px-3 py-2 text-sm"
                            />
                            {propertyDocumentFile && (
                              <p className="mt-2 text-xs text-gray-500">فایل انتخاب شده: {propertyDocumentFile.name}</p>
                            )}
                            {applicationStatus.propertyDocumentUrl && (
                              <a href={applicationStatus.propertyDocumentUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-wood-700 underline">
                                مشاهده فایل قبلی جواز/وکالت
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            type="submit"
                            disabled={documentUploading}
                            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black border border-black hover:bg-black hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {documentUploading ? 'در حال آپلود...' : 'ارسال مدارک'}
                          </button>
                          <span className="text-sm text-gray-500">
                            پس از ارسال، وضعیت به «در انتظار بررسی» تغییر می‌کند.
                          </span>
                        </div>

                        {documentSuccess && (
                          <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                            {documentSuccess}
                          </div>
                        )}
                        {documentError && (
                          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {documentError}
                          </div>
                        )}
                      </form>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'calendar' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">تقويم</h2>
                  <div className="rounded-2xl border border-wood-100 bg-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-600">ماه انتخابي</p>
                      <span className="text-wood-700 font-semibold">{selectedMonth}</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 mb-3">
                      {weekdayLabels.map((label) => (
                        <div key={label} className="font-semibold">{label}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: monthStartOffset }).map((_, index) => (
                        <div key={`empty-${index}`} className="h-12 rounded-lg bg-cream-50" />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const info = calendar[day];
                        const isSelected = selectedDay === day;
                        const badge = info?.status === 'booked'
                          ? 'bg-red-100 text-red-600'
                          : info?.status === 'blocked'
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-forest-100 text-forest-700';
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleCalendarDaySelect(day)}
                            className={`h-12 rounded-lg border text-xs transition-colors ${
                              isSelected
                                ? 'border-wood-700 bg-wood-700 text-white'
                                : 'border-wood-100 bg-white text-gray-700 hover:border-wood-500'
                            }`}
                          >
                            <div className="font-semibold">{day}</div>
                            <div className={`text-[10px] ${isSelected ? 'text-white/90' : 'text-wood-600'}`}>
                              {info ? `${formatPrice(info.price)} ت` : '—'}
                            </div>
                            {info && (
                              <div className={`mt-1 rounded-full px-2 py-0.5 text-[9px] ${badge}`}>
                                {info.status === 'booked' ? 'رزرو' : info.status === 'blocked' ? 'بسته' : 'آزاد'}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-wood-100 bg-white p-6">
                    <h3 className="text-lg font-bold text-wood-800 mb-4">تنظيمات روز انتخابي</h3>
                    {selectedDay ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-wood-700 mb-2">روز</label>
                          <input
                            type="text"
                            value={`${selectedMonth} - ${selectedDay}`}
                            disabled
                            className="w-full rounded-xl border border-wood-100 px-3 py-2 text-sm text-gray-600 bg-cream-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-wood-700 mb-2">قيمت روزانه</label>
                          <input
                            type="number"
                            value={dayPrice}
                            onChange={(event) => setDayPrice(event.target.value)}
                            className="w-full rounded-xl border border-wood-100 px-3 py-2 text-sm text-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-wood-700 mb-2">وضعيت</label>
                          <select
                            value={dayStatus}
                            onChange={(event) => setDayStatus(event.target.value as typeof dayStatus)}
                            className="w-full rounded-xl border border-wood-100 px-3 py-2 text-sm"
                          >
                            <option value="available">آزاد</option>
                            <option value="booked">رزرو</option>
                            <option value="blocked">بسته</option>
                          </select>
                        </div>
                        <div className="md:col-span-3">
                          <button
                            type="button"
                            onClick={applyCalendarUpdate}
                            className="bg-wood-700 text-white px-6 py-2 rounded-xl font-semibold hover:bg-wood-800"
                          >
                            ذخيره تغييرات
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">يک روز را از تقويم انتخاب کنيد.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">قوانين</h2>
                  <div className="bg-white rounded-2xl border border-wood-100 p-6 space-y-3 text-sm text-gray-700">
                    <p>1. ساعت ورود و خروج بايد مشخص باشد.</p>
                    <p>2. قوانين لغو رزرو را شفاف اعلام کنيد.</p>
                    <p>3. امکانات ويلا را دقيق و به روز نگه داريد.</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-wood-100 p-6">
                    <label className="block text-sm font-semibold text-wood-700 mb-2">افزودن قانون جديد</label>
                    <textarea
                      rows={3}
                      className="w-full p-3 border border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                      placeholder="مثال: استعمال دخانيات داخل ويلا ممنوع است."
                    />
                    <button className="mt-3 bg-wood-700 text-white px-5 py-2 rounded-xl">
                      ثبت قانون
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'my-villas' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">ويلاهاي من</h2>
                  {myVillasSection}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
    
  );
}
