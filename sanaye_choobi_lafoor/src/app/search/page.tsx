'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

type SearchResult = {
  id: number;
  title: string;
  price: string;
  category: string;
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState([
    'ویلا ساحلی', 'کلبه جنگلی', 'ویلا استخردار', 'آپارتمان مبله'
  ]);

  const suggestedKeywords = [
    'ویلا استخردار', 'کلبه سوئیسی', 'ویلا جنگلی', 'ویلا ساحلی', 
    'اقامتگاه بومگردی', 'آپارتمان مبله', 'ویلا مدرن', 'اقامت خانوادگی'
  ];

  const handleSearch = (term: string) => {
    if (term.trim()) {
      // در اینجا باید API را صدا بزنیم
      console.log('جستجو برای:', term);
      // فعلاً نتایج dummy اضافه می‌کنیم
      setSearchResults([
        { id: 1, title: 'ویلا ساحلی لوکس در رامسر', price: '3,200,000', category: 'رامسر' },
        { id: 2, title: 'کلبه جنگلی دنج در ماسال', price: '2,100,000', category: 'ماسال' },
      ]);
    }
  };

  const removeRecentSearch = (index: number) => {
    setRecentSearches(recentSearches.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-wood-800 mb-4">جستجو در ویلاها</h1>
          <p className="text-forest-600 text-lg">اقامتگاه مورد نظر خود را پیدا کنید</p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-wood-400" />
            <input
              type="text"
              placeholder="جستجو در ویلاها، مناطق و نوع اقامتگاه..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              className="w-full pr-14 pl-4 py-4 text-lg border-2 border-wood-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-wood-500 focus:border-wood-500 text-right"
            />
            <button
              onClick={() => handleSearch(searchTerm)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-wood-600 text-white px-6 py-2 rounded-lg hover:bg-wood-700 transition-colors font-semibold"
            >
              جستجو
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {searchResults.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-wood-800 mb-6">
                  نتایج جستجو ({searchResults.length} مورد)
                </h2>
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <div key={result.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-wood-800 mb-2">{result.title}</h3>
                          <p className="text-forest-600 mb-2">{result.category}</p>
                          <p className="text-xl font-bold text-wood-700">{result.price} تومان / شب</p>
                        </div>
                        <div className="w-20 h-20 bg-wood-100 rounded-lg flex items-center justify-center">
                          <span className="text-wood-400 text-2xl">📦</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="h-24 w-24 text-wood-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-wood-700 mb-2">
                  برای شروع جستجو کنید
                </h3>
                <p className="text-wood-500">
                  نام ویلا، منطقه یا نوع اقامتگاه مورد نظر خود را وارد کنید
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-wood-800 mb-4">جستجوهای اخیر</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div key={index} className="flex items-center justify-between group">
                      <button
                        onClick={() => {
                          setSearchTerm(search);
                          handleSearch(search);
                        }}
                        className="text-forest-600 hover:text-wood-700 transition-colors"
                      >
                        {search}
                      </button>
                      <button
                        onClick={() => removeRecentSearch(index)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Keywords */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-wood-800 mb-4">کلمات پیشنهادی</h3>
              <div className="flex flex-wrap gap-2">
                {suggestedKeywords.map((keyword, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchTerm(keyword);
                      handleSearch(keyword);
                    }}
                    className="bg-wood-100 text-wood-700 px-3 py-1 rounded-full text-sm hover:bg-wood-200 transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-wood-800 mb-4">مقاصد پرطرفدار</h3>
              <div className="space-y-2">
                {['رامسر', 'چالوس', 'متل قو', 'ماسال'].map((category) => (
                  <button
                    key={category}
                    className="block w-full text-right text-forest-600 hover:text-wood-700 hover:bg-wood-50 p-2 rounded-lg transition-all"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
