'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { 
  CalendarDaysIcon,
  UserIcon,
  TagIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  createdAt: string;
  publishedAt: string | null;
  tags: string[];
  imageUrl: string | null;
};

type BlogApiPost = Partial<BlogPost> & {
  id?: number;
  tags?: unknown;
};

const normalizeBlogPost = (post: BlogApiPost): BlogPost => ({
  id: typeof post.id === 'number' ? post.id : Number(post.id || 0),
  title: post.title || '',
  excerpt: post.excerpt || '',
  author: post.author || '',
  createdAt: post.createdAt || '',
  publishedAt: post.publishedAt || null,
  tags: Array.isArray(post.tags) ? post.tags.map(String) : [],
  imageUrl: post.imageUrl || null,
});

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('همه');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/posts?published=true');
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'خطا در دريافت مقالات');
        }
        const records: BlogApiPost[] = Array.isArray(result.data) ? result.data : [];
        const normalized = records.map((post) => normalizeBlogPost(post));
        setBlogPosts(normalized);
      } catch (err) {
        console.error(err);
        setError('دريافت مقالات با خطا مواجه شد.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>();
    blogPosts.forEach((post) => post.tags.forEach((tag) => set.add(tag)));
    return ['همه', ...Array.from(set)];
  }, [blogPosts]);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'همه' || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const featuredPosts = blogPosts.slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-wood-700 via-wood-600 to-forest-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">مجله سفر و اقامت</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              آخرین اخبار، راهنماها و تجربه‌های سفر و اقامت
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-wood-400" />
                  <input
                    type="text"
                    placeholder="جستجو در مقالات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500 text-right"
                  />
                </div>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-4 py-3 border border-wood-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wood-500"
                >
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Posts */}
            {selectedTag === 'همه' && searchTerm === '' && featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-wood-800 mb-8">مقالات ویژه</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`}>
                      <article className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                        <div className="h-48 bg-gradient-to-br from-wood-100 to-wood-200 flex items-center justify-center relative overflow-hidden">
                          {post.imageUrl ? (
                            <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="text-wood-400 text-4xl">📖</div>
                          )}
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            ویژه
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <CalendarDaysIcon className="w-4 h-4" />
                              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('fa-IR')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TagIcon className="w-4 h-4" />
                              <span>{post.tags[0] || 'عمومی'}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-wood-800 mb-3 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>نويسنده: {post.author}</span>
                            <span>برچسب: {post.tags[0] || 'عمومی'}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Posts */}
            <div>
              <h2 className="text-3xl font-bold text-wood-800 mb-8">
                {selectedTag === 'همه' ? 'تمام مقالات' : `برچسب ${selectedTag}`}
              </h2>
              
              {loading ? (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <div className="text-wood-400 text-6xl mb-4">⏳</div>
                  <h3 className="text-xl font-semibold text-wood-700 mb-2">در حال بارگذاری</h3>
                  <p className="text-wood-500">لطفا چند لحظه صبر کنيد</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold text-red-700 mb-2">خطا در دريافت</h3>
                  <p className="text-red-500">{error}</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <div className="text-wood-400 text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-wood-700 mb-2">مقاله‌ای یافت نشد</h3>
                  <p className="text-wood-500">لطفاً کلمه کلیدی دیگری امتحان کنید</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`} className="block">
                      <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1">
                        <div className="md:flex">
                          <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-wood-100 to-wood-200 flex items-center justify-center relative overflow-hidden">
                            {post.imageUrl ? (
                              <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="text-wood-400 text-5xl">📖</div>
                            )}
                          </div>
                          <div className="md:w-2/3 p-6">
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center gap-1">
                                <UserIcon className="w-4 h-4" />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CalendarDaysIcon className="w-4 h-4" />
                                <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('fa-IR')}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TagIcon className="w-4 h-4" />
                                <span>{post.tags[0] || 'عمومی'}</span>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-wood-800 mb-3 group-hover:text-wood-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>برچسب: {post.tags[0] || 'عمومی'}</span>
                              </div>
                              <div className="flex items-center gap-1 text-wood-600 font-semibold text-sm group-hover:text-wood-800 transition-colors">
                                <span>ادامه مطلب</span>
                                <ChevronRightIcon className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Posts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-wood-800 mb-6">جدیدترین مقالات</h3>
              <div className="space-y-4">
                {blogPosts.slice(0, 5).map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <div className="flex gap-3 cursor-pointer group">
                      <div className="w-16 h-16 bg-gradient-to-br from-wood-100 to-wood-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {post.imageUrl ? (
                          <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="text-wood-400 text-xl">📖</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-wood-800 line-clamp-2 group-hover:text-wood-600 transition-colors">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <CalendarDaysIcon className="w-3 h-3" />
                          <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('fa-IR')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-wood-800 mb-6">تگ ها</h3>
              <div className="space-y-2">
                {tags.slice(1).map((tag) => {
                  const count = blogPosts.filter(post => post.tags.includes(tag)).length;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-right transition-colors ${
                        selectedTag === tag
                          ? 'bg-wood-100 text-wood-800'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span>{tag}</span>
                      <span className="text-sm text-gray-500">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-white border-2 border-wood-200 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-black">عضویت در خبرنامه</h3>
              <p className="text-sm mb-4 text-black">
                برای دریافت جدیدترین مقالات و اخبار عضو شوید
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="ایمیل شما"
                  className="w-full p-3 rounded-lg border border-wood-200 text-gray-800 text-right focus:outline-none focus:ring-2 focus:ring-wood-500"
                />
                <button className="w-full bg-wood-700 text-white py-3 rounded-lg font-semibold hover:bg-wood-800 transition-colors">
                  عضویت
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
