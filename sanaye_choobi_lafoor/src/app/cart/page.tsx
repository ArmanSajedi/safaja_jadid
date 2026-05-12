'use client';

import React, { useState } from 'react';
import { TrashIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'ویلا ساحلی لوکس در رامسر',
      price: 3200000,
      originalPrice: 3800000,
      quantity: 1,
      image: '📦',
      category: 'رامسر'
    },
    {
      id: 2,
      name: 'کلبه جنگلی دنج در ماسال',
      price: 2100000,
      originalPrice: 2500000,
      quantity: 2,
      image: '📦',
      category: 'ماسال'
    }
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (item.originalPrice) {
        return total + ((item.originalPrice - item.price) * item.quantity);
      }
      return total;
    }, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingCartIcon className="h-24 w-24 text-wood-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-wood-800 mb-4">سبد رزرو شما خالی است</h1>
            <p className="text-forest-600 mb-8">ویلاهای مورد علاقه خود را به سبد رزرو اضافه کنید</p>
            <Link
              href="/products"
              className="inline-block bg-wood-600 text-white px-8 py-3 rounded-lg hover:bg-wood-700 transition-colors font-semibold"
            >
              مشاهده ویلاها
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-wood-800 text-center mb-8">سبد رزرو</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-wood-100">
                <h2 className="text-xl font-bold text-wood-800">
                  ویلاهای انتخابی ({cartItems.length} مورد)
                </h2>
              </div>
              
              <div className="divide-y divide-wood-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-wood-100 rounded-xl flex items-center justify-center">
                        <span className="text-3xl">{item.image}</span>
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-wood-800 mb-2">{item.name}</h3>
                        <p className="text-forest-600 text-sm mb-3">{item.category}</p>
                        
                        <div className="flex items-center gap-4">
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.originalPrice)} تومان
                            </span>
                          )}
                          <span className="text-lg font-bold text-wood-700">
                            {formatPrice(item.price)} تومان / شب
                          </span>
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-wood-100 rounded-full flex items-center justify-center hover:bg-wood-200 transition-colors"
                        >
                          <MinusIcon className="h-4 w-4 text-wood-600" />
                        </button>
                        
                        <span className="w-12 text-center font-semibold text-wood-800">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-wood-100 rounded-full flex items-center justify-center hover:bg-wood-200 transition-colors"
                        >
                          <PlusIcon className="h-4 w-4 text-wood-600" />
                        </button>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-wood-800 mb-6">خلاصه سفارش</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-forest-600">قیمت رزرو:</span>
                  <span className="font-semibold text-wood-800">
                    {formatPrice(getTotalPrice() + getTotalDiscount())} تومان
                  </span>
                </div>
                
                {getTotalDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>تخفیف:</span>
                    <span className="font-semibold">
                      -{formatPrice(getTotalDiscount())} تومان
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-forest-600">هزینه ارسال:</span>
                  <span className="font-semibold text-green-600">بدون هزینه</span>
                </div>
                
                <div className="border-t border-wood-100 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-wood-800">مجموع:</span>
                    <span className="text-lg font-bold text-wood-800">
                      {formatPrice(getTotalPrice())} تومان
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-wood-600 text-white py-3 rounded-lg hover:bg-wood-700 transition-colors font-semibold">
                  ادامه فرآیند رزرو
                </button>
                
                <Link
                  href="/products"
                  className="block w-full text-center bg-white border-2 border-wood-600 text-wood-600 py-3 rounded-lg hover:bg-wood-50 transition-colors font-semibold"
                >
                  ادامه جستجو
                </Link>
              </div>
              
              {/* Shipping Info */}
              <div className="mt-6 p-4 bg-wood-50 rounded-lg">
                <h3 className="font-semibold text-wood-800 mb-2">اطلاعات رزرو</h3>
                <ul className="text-sm text-forest-600 space-y-1">
                  <li>• امکان لغو مطابق قوانین میزبان</li>
                  <li>• پشتیبانی در طول سفر</li>
                  <li>• پرداخت امن و شفاف</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
