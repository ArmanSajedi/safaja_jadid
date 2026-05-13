'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price);

const banks = [
  { id: 'mellat', name: 'بانک ملت' },
  { id: 'melli', name: 'بانک ملی' },
  { id: 'saman', name: 'بانک سامان' },
  { id: 'tejarat', name: 'بانک تجارت' },
];

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedBank, setSelectedBank] = useState(banks[0].id);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const isLoggedIn = typeof window !== 'undefined' && window.localStorage.getItem('demo-auth') === 'true';
    if (!isLoggedIn) {
      router.replace('/account');
    }
  }, [router]);

  const bookingInfo = useMemo(() => {
    const villaName = searchParams.get('name') ?? 'ویلا';
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const nights = Number(searchParams.get('nights') ?? 0);
    const total = Number(searchParams.get('total') ?? 0);

    return {
      villaName,
      start,
      end,
      nights,
      total,
    };
  }, [searchParams]);

  const formatDate = (value: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('fa-IR');
  };

  const handlePay = () => {
    setSuccessMessage('پرداخت آزمایشی ثبت شد. نتیجه نهایی بعداً از درگاه واقعی می آید.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCardIcon className="h-6 w-6 text-wood-600" />
            <h1 className="text-2xl font-bold text-wood-800">پرداخت رزرو</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="rounded-xl border border-wood-100 bg-cream-50 p-3">
              <p className="text-xs text-gray-500">ویلا</p>
              <p className="font-semibold text-wood-800">{bookingInfo.villaName}</p>
            </div>
            <div className="rounded-xl border border-wood-100 bg-cream-50 p-3">
              <p className="text-xs text-gray-500">تاریخ اقامت</p>
              <p className="font-semibold text-wood-800">
                {formatDate(bookingInfo.start)} تا {formatDate(bookingInfo.end)}
              </p>
            </div>
            <div className="rounded-xl border border-wood-100 bg-cream-50 p-3">
              <p className="text-xs text-gray-500">تعداد شب</p>
              <p className="font-semibold text-wood-800">{bookingInfo.nights} شب</p>
            </div>
            <div className="rounded-xl border border-wood-100 bg-cream-50 p-3">
              <p className="text-xs text-gray-500">مبلغ کل</p>
              <p className="font-semibold text-wood-800">{formatPrice(bookingInfo.total)} تومان</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-wood-800 mb-4">انتخاب بانک</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {banks.map((bank) => (
              <button
                key={bank.id}
                type="button"
                onClick={() => setSelectedBank(bank.id)}
                className={`rounded-xl border p-4 text-right transition-colors ${
                  selectedBank === bank.id
                    ? 'border-wood-700 bg-wood-700 text-white'
                    : 'border-wood-100 bg-white hover:bg-cream-50'
                }`}
              >
                <p className="text-sm font-semibold">{bank.name}</p>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handlePay}
            className="mt-6 w-full rounded-xl border border-black bg-white py-3 font-semibold text-black transition-colors hover:bg-black hover:text-white"
          >
            پرداخت و ادامه
          </button>

          {successMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              <CheckCircleIcon className="h-5 w-5" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
