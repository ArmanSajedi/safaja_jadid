"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, FunnelIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { apiClient, Product } from '@/lib/api-client';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');
  const [priceRange, setPriceRange] = useState([0, 20000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['همه', 'رامسر', 'چالوس', 'متل قو', 'ماسال'];

  // Load products from API
  useEffect(() => {
    loadProducts();
  }, [searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: { category?: string; search?: string } = {};
      if (selectedCategory !== 'همه') {
        params.category = selectedCategory;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm;
      }

      const response = await apiClient.getProducts(params);
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError('خطا در دریافت ویلاها');
      }
    } catch (err) {
      setError('خطا در اتصال به سرور');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesPrice;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Cart */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-wood-800">
            ویلاهای اجاره‌ای سفرجا
          </h1>
          <div className="relative cursor-pointer bg-wood-100 p-3 rounded-full hover:bg-wood-200 transition-colors">
            <ShoppingCartIcon className="h-10 w-10 text-wood-700" />
            {cartItems > 0 && (
              <span className="absolute -top-1 -left-1 bg-red-500 text-white text-sm font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white shadow-lg">
                {cartItems}
              </span>
            )}
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-wood-400" />
              <input
                type="text"
                placeholder="جستجو در ویلاها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
              />
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-lg border-2 border-gray-300 hover:border-wood-500 transition-colors font-semibold shadow-md hover:shadow-lg"
            >
              <FunnelIcon className="h-5 w-5 stroke-2 text-black" />
              <span className="text-lg text-black">فیلترها</span>
              {showFilters ? (
                <span className="text-sm text-black">▲</span>
              ) : (
                <span className="text-sm text-black">▼</span>
              )}
            </button>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-wood-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-wood-700 font-semibold mb-3">شهر/منطقه</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Price Range */}
              <div>
                <label className="block text-wood-700 font-semibold mb-3">
                  محدوده قیمت هر شب: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])} تومان
                </label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="20000000"
                    step="500000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="20000000"
                    step="500000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood-600 mx-auto mb-4"></div>
            <p className="text-wood-600">در حال بارگذاری ویلاها...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-red-700 mb-2">خطا در بارگذاری</h3>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={loadProducts}
              className="bg-wood-600 text-white px-6 py-2 rounded-lg hover:bg-wood-700 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/villa/${product.id}`}
                className="block bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 relative"
              >
              {/* Badges */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                {product.discount > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {product.discount}% تخفیف
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    جدید
                  </span>
                )}
              </div>
              
              {/* Product Image */}
              <div className="h-64 bg-gradient-to-br from-wood-100 to-wood-200 flex items-center justify-center relative overflow-hidden">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <>
                    <div className="text-wood-400 text-6xl">📦</div>
                    <div className="absolute inset-0 opacity-10">
                      <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                          <pattern id={`wood-grain-${product.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M0,10 Q5,5 10,10 T20,10" stroke="#8B4513" strokeWidth="0.5" fill="none"/>
                            <path d="M0,15 Q7,12 15,15 T20,15" stroke="#A0522D" strokeWidth="0.3" fill="none"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#wood-grain-${product.id})`}/>
                      </svg>
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-wood-800 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-forest-600 mb-3">{product.category}</p>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 mr-2">({product.rating})</span>
                </div>
                
                {/* Price */}
                <div className="flex flex-col gap-2 mb-4">
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)} تومان
                    </span>
                  )}
                  <span className="text-xl font-bold text-wood-700">
                    {formatPrice(product.price)} تومان / شب
                  </span>
                </div>
                
                <span className="block w-full bg-white border-2 border-wood-600 text-black py-3 rounded-lg text-center font-semibold">
                  مشاهده جزييات
                </span>
              </div>
              </Link>
            ))}
          </div>
        )}
        
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-wood-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-wood-700 mb-2">ویلایی یافت نشد</h3>
            <p className="text-wood-500">لطفاً فیلترها را تغییر دهید یا کلمه کلیدی دیگری امتحان کنید</p>
          </div>
        )}
      </div>
    </div>
  );
}
