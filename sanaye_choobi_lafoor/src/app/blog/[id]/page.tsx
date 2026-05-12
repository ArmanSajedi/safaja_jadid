'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarDaysIcon,
  UserIcon,
  TagIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  content: string;
  tags: string[];
  imageUrl: string | null;
  createdAt: string;
  publishedAt: string | null;
};

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const { id } = await params;
        const response = await fetch(`/api/posts/${id}`);
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'مقاله اي يافت نشد');
        }
        const data = result.data;
        if (!isMounted) return;
        setPost({
          id: data.id,
          title: data.title,
          excerpt: data.excerpt,
          author: data.author,
          content: data.content,
          tags: Array.isArray(data.tags) ? data.tags : [],
          imageUrl: data.imageUrl || null,
          createdAt: data.createdAt,
          publishedAt: data.publishedAt,
        });
      } catch (err) {
        console.error(err);
        if (!isMounted) return;
        setError('مقاله اي يافت نشد');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPost();
    return () => {
      isMounted = false;
    };
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-wood-800 mb-3">در حال بارگذاري</h1>
          <p className="text-gray-600">لطفا چند لحظه صبر کنيد.</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-wood-800 mb-3">مقاله اي يافت نشد</h1>
          <p className="text-gray-600 mb-6">لطفا به صفحه مجله برگرديد و مقاله ديگري را انتخاب کنيد.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 text-wood-600 font-semibold">
            بازگشت به مجله
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = post.content.split('\n').filter((item) => item.trim());

  return (
    <div className="min-h-screen bg-gradient-to-br from-wood-50 via-cream-50 to-forest-50">
      <section className="relative py-20 bg-gradient-to-r from-wood-700 via-wood-600 to-forest-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <p className="text-sm font-semibold text-wood-100 mb-4">{post.tags[0] || 'مجله سفرجا'}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          <p className="text-lg text-wood-50 max-w-3xl mx-auto">{post.excerpt}</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {post.imageUrl && (
            <div className="mb-8 overflow-hidden rounded-2xl">
              <img src={post.imageUrl} alt={post.title} className="w-full h-72 object-cover" />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
            <span className="flex items-center gap-1">
              <UserIcon className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDaysIcon className="w-4 h-4" />
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('fa-IR')}
            </span>
            <span className="flex items-center gap-1">
              <TagIcon className="w-4 h-4" />
              {post.tags.length ? post.tags.join('، ') : 'بدون تگ'}
            </span>
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-wood-600 font-semibold">
            بازگشت به مجله
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
