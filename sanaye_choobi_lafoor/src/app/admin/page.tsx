'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  MapPinIcon,
  BanknotesIcon,
  ChartBarIcon,
  StarIcon,
  CogIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import type { Product } from '@/lib/api-client';
import type { HostApplication, HostApplicationStatus, HostDocumentStatus } from '@/lib/host-applications';

// Host applications persisted via server API

const baseHosts = [
  { id: 1, name: 'رضا کريمي', status: 'در انتظار بررسي' },
  { id: 2, name: 'مهدي ميرزايي', status: 'تاييد شده' },
];

const tabs = [
  { id: 'villas', name: 'مديريت ويلاها', icon: BuildingOffice2Icon },
  { id: 'users', name: 'مديريت کاربران و نقش ها', icon: UserGroupIcon },
  { id: 'hosts', name: 'مديريت ميزبان ها', icon: ShieldCheckIcon },
  { id: 'bookings', name: 'مديريت رزروها', icon: CalendarDaysIcon },
  { id: 'destinations', name: 'مقاصد و دسته ها', icon: MapPinIcon },
  { id: 'pricing', name: 'تقويم قيمت و تخفيف', icon: BanknotesIcon },
  { id: 'reports', name: 'گزارشات و تسويه ها', icon: ChartBarIcon },
  { id: 'reviews', name: 'نظرات و امتيازها', icon: StarIcon },
  { id: 'content', name: 'محتوا و بلاگ', icon: DocumentTextIcon },
  { id: 'settings', name: 'تنظيمات سايت', icon: CogIcon },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('villas');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingPage, setBookingPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [drawer, setDrawer] = useState<{
    isOpen: boolean;
    title: string;
    payload: { label: string; value: string }[];
  }>({ isOpen: false, title: '', payload: [] });
  type BlogPost = {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string | null;
    author: string;
    tags: string[];
    published: boolean;
    createdAt: string;
    publishedAt: string | null;
    slug: string;
  };

  type BlogApiPost = Partial<BlogPost> & {
    id?: number;
    tags?: unknown;
  };

  type HostApiRecord = {
    id?: number;
    firstName?: string;
    lastName?: string;
    nationalId?: string | null;
    phone?: string;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    status?: HostApplicationStatus;
    documentsStatus?: HostDocumentStatus;
    nationalIdImage?: string | null;
    ownershipDocImage?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };

  const normalizeHostApplication = (record: HostApiRecord): HostApplication => ({
    id: typeof record.id === 'number' ? record.id : Number(record.id || 0),
    firstName: record.firstName || '',
    lastName: record.lastName || '',
    nationalId: record.nationalId || '',
    phone: record.phone || '',
    address: record.address || '',
    city: record.city || '',
    province: record.province || '',
    status: record.status || 'pending',
    documentsStatus: record.documentsStatus || 'pending',
    nationalCardUrl: record.nationalIdImage || null,
    propertyDocumentUrl: record.ownershipDocImage || null,
    createdAt: record.createdAt || '',
    updatedAt: record.updatedAt || '',
  });

  const normalizeBlogPost = (post: BlogApiPost): BlogPost => ({
    id: typeof post.id === 'number' ? post.id : Number(post.id || 0),
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: post.content || '',
    imageUrl: post.imageUrl || null,
    author: post.author || '',
    tags: Array.isArray(post.tags) ? post.tags.map(String) : [],
    published: Boolean(post.published),
    createdAt: post.createdAt || '',
    publishedAt: post.publishedAt || null,
    slug: post.slug || '',
  });

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [blogSuccess, setBlogSuccess] = useState<string | null>(null);
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [blogImageUploading, setBlogImageUploading] = useState(false);
  const [blogImageError, setBlogImageError] = useState<string | null>(null);
  const [editingBlogPostId, setEditingBlogPostId] = useState<number | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    tags: '',
    author: 'ادمین',
    published: true,
  });
  const [villas, setVillas] = useState<Product[]>([]);
  const [users, setUsers] = useState([
    { id: 1, name: 'احمد محمدي', role: 'کاربر', status: 'فعال', phone: '09120001122', email: 'ahmad@example.com' },
    { id: 2, name: 'مينا احمدي', role: 'ميزبان', status: 'فعال', phone: '09120003344', email: 'mina@example.com' },
    { id: 3, name: 'ليلا رضايي', role: 'ادمين', status: 'فعال', phone: '09120005566', email: 'leila@example.com' },
    { id: 4, name: 'رضا کريمي', role: 'ميزبان', status: 'معلق', phone: '09120007788', email: 'reza@example.com' },
  ]);
  const [hosts, setHosts] = useState(baseHosts);
  const [hostApplications, setHostApplications] = useState<HostApplication[]>([]);
  const [bookings, setBookings] = useState([
    { id: 101, villa: 'ويلاي ساحلي رامسر', user: 'سارا احمدي', status: 'در انتظار', amount: 6400000, nights: 2, checkIn: '1403/06/10', checkOut: '1403/06/12' },
    { id: 102, villa: 'کلبه جنگلي ماسال', user: 'پريا موسوي', status: 'تاييد شده', amount: 4200000, nights: 1, checkIn: '1403/06/12', checkOut: '1403/06/13' },
    { id: 103, villa: 'ويلا استخردار متل قو', user: 'مريم شفيعي', status: 'لغو شده', amount: 5200000, nights: 2, checkIn: '1403/06/01', checkOut: '1403/06/03' },
    { id: 104, villa: 'آپارتمان تهران', user: 'کاوه صادقي', status: 'در انتظار', amount: 2800000, nights: 1, checkIn: '1403/06/15', checkOut: '1403/06/16' },
  ]);
  const [destinations, setDestinations] = useState([
    { id: 1, name: 'رامسر', count: 22 },
    { id: 2, name: 'چالوس', count: 18 },
  ]);
  const [discount, setDiscount] = useState({ code: 'SAFARJA10', percent: '10', expires: '1403/07/10' });
  const [payouts, setPayouts] = useState([
    { id: 1, host: 'مينا احمدي', amount: 12500000, status: 'در انتظار تسويه' },
    { id: 2, host: 'رضا کريمي', amount: 8200000, status: 'تسويه شد' },
  ]);
  const [reviews, setReviews] = useState([
    { id: 1, villa: 'ويلاي ساحلي رامسر', user: 'سارا احمدي', rating: 5, status: 'نمايش' },
    { id: 2, villa: 'کلبه جنگلي ماسال', user: 'نرگس سليمي', rating: 3, status: 'نيازمند بررسي' },
  ]);

  const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price);
  const quickStats = useMemo(() => (
    [
      { label: 'ويلاها', value: '48' },
      { label: 'کاربران', value: '245' },
      { label: 'رزروهاي امروز', value: '18' },
      { label: 'درآمد ماه', value: '4.2M' },
    ]
  ), []);

  const filteredVillas = villas.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBookings = bookings.filter((booking) => (
    bookingStatusFilter === 'all' || booking.status === bookingStatusFilter
  ));

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) || user.phone.includes(userSearch);
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const bookingPageSize = 3;
  const bookingTotalPages = Math.max(1, Math.ceil(filteredBookings.length / bookingPageSize));
  const bookingPageItems = filteredBookings.slice(
    (bookingPage - 1) * bookingPageSize,
    bookingPage * bookingPageSize
  );

  const openDrawer = (title: string, payload: { label: string; value: string }[]) => {
    setDrawer({ isOpen: true, title, payload });
  };

  const loadHostApplications = async () => {
    try {
      const res = await fetch('/api/hosts');
      const payload = await res.json();
      if (!res.ok || !payload.success) {
        setHostApplications([]);
        return;
      }

      const records: HostApiRecord[] = Array.isArray(payload.data) ? payload.data : [];
      const applications = records.map((record) => normalizeHostApplication(record));

      setHostApplications(applications);

      const approvedHosts = applications
        .filter((application) => application.status === 'approved' && application.documentsStatus === 'approved')
        .map((application) => ({
          id: application.id,
          name: `${application.firstName} ${application.lastName}`,
          status: 'تاييد شده',
        }));

      setHosts([...baseHosts, ...approvedHosts]);
    } catch (err) {
      console.error(err);
      setHostApplications([]);
    }
  };

  const loadVillas = async () => {
    try {
      const response = await fetch('/api/products?status=all');
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        setVillas([]);
        return;
      }

      setVillas(payload.data || []);
    } catch (error) {
      console.error(error);
      setVillas([]);
    }
  };

  const loadBlogPosts = async () => {
    try {
      setBlogLoading(true);
      setBlogError(null);
      const response = await fetch('/api/posts');
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'خطا در دريافت مطالب');
      }
      const records: BlogApiPost[] = Array.isArray(result.data) ? result.data : [];
      const normalized = records.map((post) => normalizeBlogPost(post));
      setBlogPosts(normalized);
    } catch (error) {
      console.error(error);
      setBlogError('دريافت مطالب با خطا مواجه شد.');
    } finally {
      setBlogLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'villas') {
      loadVillas();
    }
    if (activeTab === 'content') {
      loadBlogPosts();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'hosts') {
      loadHostApplications();
    }

    const handleStorage = () => {
      if (activeTab === 'hosts') {
        loadHostApplications();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [activeTab]);

  const handleBlogSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBlogSuccess(null);
    setBlogError(null);
    setBlogImageError(null);

    try {
      let resolvedImageUrl = blogForm.imageUrl;

      if (blogImageFile) {
        setBlogImageUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', blogImageFile);

        const uploadResponse = await fetch('/api/uploads', {
          method: 'POST',
          body: uploadData,
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error(uploadResult.message || 'خطا در آپلود تصوير');
        }

        resolvedImageUrl = uploadResult.url;
      }

      const isEditing = editingBlogPostId !== null;

      const response = await fetch(isEditing ? `/api/posts/${editingBlogPostId}` : '/api/posts', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: blogForm.title,
          excerpt: blogForm.excerpt,
          content: blogForm.content,
          imageUrl: resolvedImageUrl,
          tags: blogForm.tags,
          author: blogForm.author,
          published: blogForm.published,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'خطا در ثبت مطلب');
      }

      setBlogSuccess(isEditing ? 'مطلب با موفقيت به‌روز شد.' : 'مطلب با موفقيت ثبت شد.');
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        imageUrl: '',
        tags: '',
        author: 'ادمین',
        published: true,
      });
      setBlogImageFile(null);
      setEditingBlogPostId(null);
      loadBlogPosts();
    } catch (error) {
      console.error(error);
      setBlogError(editingBlogPostId !== null ? 'ويرايش مطلب ناموفق بود.' : 'ثبت مطلب ناموفق بود.');
      if (error instanceof Error && error.message.includes('تصوير')) {
        setBlogImageError('آپلود تصوير ناموفق بود.');
      }
    } finally {
      setBlogImageUploading(false);
    }
  };

  const startEditingBlogPost = (post: {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string | null;
    author: string;
    tags: string[];
    published: boolean;
  }) => {
    setEditingBlogPostId(post.id);
    setBlogForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl || '',
      tags: post.tags.join(', '),
      author: post.author,
      published: post.published,
    });
    setBlogImageFile(null);
    setBlogImageError(null);
    setBlogSuccess(null);
    setBlogError(null);
    setActiveTab('content');
  };

  const cancelEditingBlogPost = () => {
    setEditingBlogPostId(null);
    setBlogForm({
      title: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      tags: '',
      author: 'ادمین',
      published: true,
    });
    setBlogImageFile(null);
    setBlogImageError(null);
    setBlogSuccess(null);
    setBlogError(null);
  };

  const deleteBlogPost = async (postId: number, title: string) => {
    const shouldDelete = window.confirm(`آیا از حذف «${title}» مطمئن هستید؟`);
    if (!shouldDelete) {
      return;
    }

    try {
      setBlogLoading(true);
      setBlogError(null);
      const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'خطا در حذف مطلب');
      }

      if (editingBlogPostId === postId) {
        cancelEditingBlogPost();
      }

      setBlogSuccess('مطلب با موفقیت حذف شد.');
      loadBlogPosts();
    } catch (error) {
      console.error(error);
      setBlogError('حذف مطلب ناموفق بود.');
    } finally {
      setBlogLoading(false);
    }
  };

  const approveHostApplication = async (applicationId: number) => {
    await fetch(`/api/hosts/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' }),
    });
    loadHostApplications();
  };

  const approveHostDocuments = async (applicationId: number) => {
    await fetch(`/api/hosts/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentsStatus: 'approved' }),
    });
    loadHostApplications();
  };

  const rejectHostApplication = async (applicationId: number) => {
    await fetch(`/api/hosts/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected' }),
    });
    loadHostApplications();
  };

  const rejectHostDocuments = async (applicationId: number) => {
    await fetch(`/api/hosts/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentsStatus: 'rejected' }),
    });
    loadHostApplications();
  };

  const approveVilla = async (villaId: number) => {
    await fetch(`/api/products/${villaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' }),
    });
    loadVillas();
  };

  const rejectVilla = async (villaId: number) => {
    await fetch(`/api/products/${villaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected' }),
    });
    loadVillas();
  };

  const deleteVilla = async (villaId: number) => {
    await fetch(`/api/products/${villaId}`, { method: 'DELETE' });
    loadVillas();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">پنل ادمين سفرجا</h1>
            <p className="text-gray-600 mt-2">مديريت کامل ويلاها، رزروها و کاربران</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex items-center gap-2 rounded-lg border border-wood-200 px-4 py-2 text-sm text-wood-700 hover:bg-wood-50">
              گزارش روزانه
            </button>
            <Link href="/" className="bg-wood-600 text-white px-6 py-3 rounded-lg hover:bg-wood-700 transition-colors">
              بازگشت به سايت
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
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

            <section className="lg:col-span-4 p-6 space-y-6">
              {activeTab === 'villas' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-wood-800">مديريت ويلاها</h2>
                    <button className="flex items-center gap-2 bg-wood-700 text-white px-4 py-2 rounded-xl" onClick={() => setActiveTab('hosts')}>
                      <PlusCircleIcon className="h-5 w-5" />
                      بررسی میزبان‌ها
                    </button>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 rounded-xl border border-wood-200 px-4 py-2 text-sm"
                      placeholder="جستجو در ويلاها..."
                    />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="rounded-xl border border-wood-200 px-4 py-2 text-sm"
                    >
                      <option value="all">همه وضعيت ها</option>
                      <option value="approved">تایید شده</option>
                      <option value="pending_review">در انتظار بررسی</option>
                      <option value="rejected">رد شده</option>
                    </select>
                    <button className="rounded-xl border border-wood-200 px-4 py-2 text-sm text-wood-700">خروجي اکسل</button>
                  </div>
                  <div className="space-y-3">
                    {filteredVillas.length === 0 ? (
                      <div className="rounded-xl border border-wood-100 p-6 text-center text-gray-500">
                        هيچ ويلايي با اين فيلتر پيدا نشد.
                      </div>
                    ) : (
                      filteredVillas.map((villa) => (
                        <div key={villa.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-wood-100 p-4">
                          <div>
                            <p className="font-semibold text-wood-800">{villa.name}</p>
                            <p className="text-sm text-gray-500">ميزبان: {hostApplications.find((item) => item.id === villa.hostId)?.firstName || villa.hostId}</p>
                            <p className="text-sm text-gray-500">موقعیت: {villa.location}</p>
                            <p className="text-sm text-gray-500">تصاویر: {villa.imageDetails?.length || villa.images?.length || 0}</p>
                            <span className={`inline-flex mt-2 rounded-full px-2 py-1 text-xs ${
                              villa.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : villa.status === 'pending_review'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}>
                              {villa.status === 'approved' ? 'تایید شده' : villa.status === 'pending_review' ? 'در انتظار بررسی' : 'رد شده'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="flex items-center gap-1 rounded-lg border border-wood-200 px-3 py-1 text-sm text-wood-700"
                              onClick={() => {
                                const imageEntries = (villa.imageDetails && villa.imageDetails.length > 0)
                                  ? villa.imageDetails
                                  : (villa.images || []).map((image, index) => (
                                    typeof image === 'string'
                                      ? { url: image, title: '', order: index + 1 }
                                      : image
                                  ));
                                openDrawer('جزئيات ويلا', [
                                { label: 'نام ويلا', value: villa.name },
                                { label: 'ميزبان', value: hostApplications.find((item) => item.id === villa.hostId)?.firstName || String(villa.hostId) },
                                { label: 'وضعيت', value: villa.status === 'approved' ? 'تایید شده' : villa.status === 'pending_review' ? 'در انتظار بررسی' : 'رد شده' },
                                { label: 'موقعیت', value: villa.location || '-' },
                                { label: 'دسته', value: villa.category },
                                { label: 'قوانین', value: villa.rules || '-' },
                                ...imageEntries.map((image, index) => ({
                                  label: `تصویر ${index + 1}${image.title ? ` - ${image.title}` : ''}`,
                                  value: image.url,
                                })),
                              ]);
                              }}
                            >
                              مشاهده
                            </button>
                            <button className="flex items-center gap-1 rounded-lg border border-wood-200 px-3 py-1 text-sm text-wood-700">
                              <PencilSquareIcon className="h-4 w-4" />
                              ويرايش
                            </button>
                            {villa.status !== 'approved' && (
                              <button
                                type="button"
                                onClick={() => approveVilla(villa.id)}
                                className="rounded-lg border border-green-200 px-3 py-1 text-sm text-green-700 hover:bg-green-50"
                              >
                                تایید
                              </button>
                            )}
                            {villa.status !== 'rejected' && (
                              <button
                                type="button"
                                onClick={() => rejectVilla(villa.id)}
                                className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                              >
                                رد
                              </button>
                            )}
                            <button type="button" onClick={() => deleteVilla(villa.id)} className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600">
                              <TrashIcon className="h-4 w-4" />
                              حذف
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">مديريت کاربران و نقش ها</h2>
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="flex-1 rounded-xl border border-wood-200 px-4 py-2 text-sm"
                      placeholder="جستجو نام يا شماره..."
                    />
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="rounded-xl border border-wood-200 px-4 py-2 text-sm"
                    >
                      <option value="all">همه نقش ها</option>
                      <option value="کاربر">کاربر</option>
                      <option value="ميزبان">ميزبان</option>
                      <option value="ادمين">ادمين</option>
                    </select>
                    <select
                      value={userStatusFilter}
                      onChange={(e) => setUserStatusFilter(e.target.value)}
                      className="rounded-xl border border-wood-200 px-4 py-2 text-sm"
                    >
                      <option value="all">همه وضعيت ها</option>
                      <option value="فعال">فعال</option>
                      <option value="معلق">معلق</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    {filteredUsers.length === 0 ? (
                      <div className="rounded-xl border border-wood-100 p-6 text-center text-gray-500">
                        هيچ کاربري با اين فيلتر پيدا نشد.
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between rounded-xl border border-wood-100 p-4">
                          <div>
                            <p className="font-semibold text-wood-800">{user.name}</p>
                            <p className="text-sm text-gray-500">نقش: {user.role}</p>
                            <p className="text-sm text-gray-500">شماره: {user.phone}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="text-sm text-wood-700"
                              onClick={() => openDrawer('جزئيات کاربر', [
                                { label: 'نام', value: user.name },
                                { label: 'نقش', value: user.role },
                                { label: 'وضعيت', value: user.status },
                                { label: 'موبايل', value: user.phone },
                                { label: 'ايميل', value: user.email },
                              ])}
                            >
                              مشاهده
                            </button>
                            <select className="rounded-lg border border-wood-200 px-3 py-1 text-sm">
                              <option>کاربر</option>
                              <option>ميزبان</option>
                              <option>ادمين</option>
                            </select>
                            <button className="text-sm text-wood-700">ذخيره</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'hosts' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">مديريت ميزبان ها</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-wood-100 bg-cream-50 p-4">
                      <p className="text-sm text-gray-600">در انتظار بررسی</p>
                      <p className="text-2xl font-bold text-wood-800">{hostApplications.filter((item) => item.status === 'pending').length}</p>
                    </div>
                    <div className="rounded-2xl border border-wood-100 bg-white p-4">
                      <p className="text-sm text-gray-600">در انتظار مدارک</p>
                      <p className="text-2xl font-bold text-wood-800">{hostApplications.filter((item) => item.status === 'approved' && item.documentsStatus === 'pending').length}</p>
                    </div>
                    <div className="rounded-2xl border border-wood-100 bg-white p-4">
                      <p className="text-sm text-gray-600">تایید نهایی</p>
                      <p className="text-2xl font-bold text-wood-800">{hostApplications.filter((item) => item.status === 'approved' && item.documentsStatus === 'approved').length}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-wood-800">درخواست‌های جدید</h3>
                    {hostApplications.filter((item) => item.status === 'pending').length === 0 ? (
                      <div className="rounded-xl border border-wood-100 p-6 text-center text-gray-500">
                        درخواست جدیدی برای بررسی وجود ندارد.
                      </div>
                    ) : (
                      hostApplications
                        .filter((item) => item.status === 'pending')
                        .map((application) => (
                          <div key={application.id} className="rounded-xl border border-wood-100 p-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div>
                                <p className="font-semibold text-wood-800">
                                  {application.firstName} {application.lastName}
                                </p>
                                <p className="text-sm text-gray-500">موبایل: {application.phone}</p>
                                <p className="text-sm text-gray-500">شهر: {application.city} - {application.province}</p>
                                <p className="text-sm text-gray-500">کد ملی: {application.nationalId}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openDrawer('جزئیات درخواست میزبان', [
                                    { label: 'نام', value: `${application.firstName} ${application.lastName}` },
                                    { label: 'موبایل', value: application.phone },
                                    { label: 'کد ملی', value: application.nationalId || '-' },
                                    { label: 'استان', value: application.province || '-' },
                                    { label: 'شهر', value: application.city || '-' },
                                    { label: 'آدرس', value: application.address || '-' },
                                    { label: 'وضعیت', value: 'در انتظار بررسی' },
                                  ])}
                                  className="rounded-lg border border-wood-200 px-3 py-1 text-sm text-wood-700"
                                >
                                  مشاهده
                                </button>
                                <button
                                  type="button"
                                  onClick={() => approveHostApplication(application.id)}
                                  className="rounded-lg border border-green-200 px-3 py-1 text-sm text-green-700 hover:bg-green-50"
                                >
                                  تایید
                                </button>
                                <button
                                  type="button"
                                  onClick={() => rejectHostApplication(application.id)}
                                  className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                                >
                                  رد
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-wood-800">بررسی مدارک</h3>
                    {hostApplications.filter((item) => item.status === 'approved' && item.documentsStatus !== 'approved').length === 0 ? (
                      <div className="rounded-xl border border-wood-100 p-6 text-center text-gray-500">
                        مدرک جدیدی برای بررسی وجود ندارد.
                      </div>
                    ) : (
                      hostApplications
                        .filter((item) => item.status === 'approved' && item.documentsStatus !== 'approved')
                        .map((application) => (
                          <div key={application.id} className="rounded-xl border border-wood-100 p-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div>
                                <p className="font-semibold text-wood-800">
                                  {application.firstName} {application.lastName}
                                </p>
                                <p className="text-sm text-gray-500">وضعیت مدارک: {application.documentsStatus === 'pending' ? 'در انتظار بررسی' : 'رد شده'}</p>
                                <p className="text-sm text-gray-500">کارت ملی: {application.nationalCardUrl ? 'آپلود شده' : 'ندارد'}</p>
                                <p className="text-sm text-gray-500">جواز/وکالت: {application.propertyDocumentUrl ? 'آپلود شده' : 'ندارد'}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openDrawer('جزئیات مدارک میزبان', [
                                    { label: 'نام', value: `${application.firstName} ${application.lastName}` },
                                    { label: 'موبایل', value: application.phone },
                                    { label: 'کارت ملی', value: application.nationalCardUrl || 'آپلود نشده' },
                                    { label: 'جواز/وکالت', value: application.propertyDocumentUrl || 'آپلود نشده' },
                                    { label: 'وضعیت مدارک', value: application.documentsStatus === 'pending' ? 'در انتظار بررسی' : 'رد شده' },
                                  ])}
                                  className="rounded-lg border border-wood-200 px-3 py-1 text-sm text-wood-700"
                                >
                                  مشاهده
                                </button>
                                <button
                                  type="button"
                                  onClick={() => approveHostDocuments(application.id)}
                                  className="rounded-lg border border-green-200 px-3 py-1 text-sm text-green-700 hover:bg-green-50"
                                >
                                  تایید مدارک
                                </button>
                                <button
                                  type="button"
                                  onClick={() => rejectHostDocuments(application.id)}
                                  className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                                >
                                  رد مدارک
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-wood-800">میزبان‌های نهایی</h3>
                    {hosts.filter((item) => item.status === 'تاييد شده').length === 0 ? (
                      <div className="rounded-xl border border-wood-100 p-6 text-center text-gray-500">
                        هنوز میزبان نهایی تایید نشده است.
                      </div>
                    ) : (
                      hosts
                        .filter((item) => item.status === 'تاييد شده')
                        .map((host) => (
                          <div key={host.id} className="flex items-center justify-between rounded-xl border border-wood-100 p-4">
                            <div>
                              <p className="font-semibold text-wood-800">{host.name}</p>
                              <p className="text-sm text-gray-500">وضعيت: {host.status}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="rounded-lg border border-wood-200 px-3 py-1 text-sm text-wood-700">مشاهده</button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">مديريت رزروها</h2>
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <select
                      value={bookingStatusFilter}
                      onChange={(e) => {
                        setBookingStatusFilter(e.target.value);
                        setBookingPage(1);
                      }}
                      className="rounded-xl border border-wood-200 px-4 py-2 text-sm"
                    >
                      <option value="all">همه وضعيت ها</option>
                      <option value="در انتظار">در انتظار</option>
                      <option value="تاييد شده">تاييد شده</option>
                      <option value="لغو شده">لغو شده</option>
                    </select>
                    <button className="rounded-xl border border-wood-200 px-4 py-2 text-sm text-wood-700">خروجي اکسل</button>
                  </div>
                  <div className="space-y-3">
                    {bookingPageItems.length === 0 ? (
                      <div className="rounded-xl border border-wood-100 p-6 text-center text-gray-500">
                        رزروي براي نمايش وجود ندارد.
                      </div>
                    ) : (
                      bookingPageItems.map((booking) => (
                        <div key={booking.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-xl border border-wood-100 p-4">
                          <div>
                            <p className="font-semibold text-wood-800">رزرو #{booking.id}</p>
                            <p className="text-sm text-gray-500">{booking.villa} - {booking.user}</p>
                            <p className="text-sm text-gray-500">تاريخ: {booking.checkIn} تا {booking.checkOut}</p>
                            <span className={`inline-flex mt-2 rounded-full px-2 py-1 text-xs ${
                              booking.status === 'تاييد شده'
                                ? 'bg-green-100 text-green-700'
                                : booking.status === 'لغو شده'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded-lg border border-wood-200 px-3 py-1 text-sm text-wood-700"
                              onClick={() => openDrawer('جزئيات رزرو', [
                                { label: 'شناسه رزرو', value: booking.id.toString() },
                                { label: 'ويلا', value: booking.villa },
                                { label: 'مهمان', value: booking.user },
                                { label: 'شب ها', value: booking.nights.toString() },
                                { label: 'مبلغ', value: `${formatPrice(booking.amount)} تومان` },
                                { label: 'وضعيت', value: booking.status },
                              ])}
                            >
                              مشاهده
                            </button>
                            <button className="rounded-lg border border-wood-200 px-3 py-1 text-sm text-wood-700">تاييد</button>
                            <button className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600">لغو</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">صفحه {bookingPage} از {bookingTotalPages}</span>
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-lg border border-wood-200 px-3 py-1 text-sm text-wood-700"
                        onClick={() => setBookingPage(Math.max(1, bookingPage - 1))}
                        disabled={bookingPage === 1}
                      >
                        قبلي
                      </button>
                      <button
                        className="rounded-lg border border-wood-200 px-3 py-1 text-sm text-wood-700"
                        onClick={() => setBookingPage(Math.min(bookingTotalPages, bookingPage + 1))}
                        disabled={bookingPage === bookingTotalPages}
                      >
                        بعدي
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'destinations' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">مقاصد و دسته ها</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destinations.map((item) => (
                      <div key={item.id} className="rounded-xl border border-wood-100 p-4">
                        <p className="font-semibold text-wood-800">{item.name}</p>
                        <p className="text-sm text-gray-500">ويلاها: {item.count}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-wood-100 p-4">
                    <label className="block text-sm font-semibold text-wood-700 mb-2">افزودن مقصد</label>
                    <div className="flex gap-2">
                      <input className="flex-1 border border-wood-200 rounded-xl px-3 py-2 text-sm" placeholder="نام مقصد" />
                      <button className="bg-wood-700 text-white px-4 rounded-xl">افزودن</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">تقويم قيمت و تخفيف</h2>
                  <div className="rounded-2xl border border-wood-100 p-4">
                    <p className="text-sm text-gray-600">کد تخفيف فعال</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      <input className="border border-wood-200 rounded-xl px-3 py-2 text-sm" value={discount.code} onChange={(e) => setDiscount({ ...discount, code: e.target.value })} />
                      <input className="border border-wood-200 rounded-xl px-3 py-2 text-sm" value={discount.percent} onChange={(e) => setDiscount({ ...discount, percent: e.target.value })} />
                      <input className="border border-wood-200 rounded-xl px-3 py-2 text-sm" value={discount.expires} onChange={(e) => setDiscount({ ...discount, expires: e.target.value })} />
                    </div>
                    <button className="mt-3 bg-wood-700 text-white px-4 py-2 rounded-xl">ثبت تخفيف</button>
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">گزارشات و تسويه ها</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-wood-100 p-4">
                      <p className="text-sm text-gray-500">درآمد اين ماه</p>
                      <p className="text-2xl font-bold text-wood-800">4.2M</p>
                    </div>
                    <div className="rounded-xl border border-wood-100 p-4">
                      <p className="text-sm text-gray-500">تسويه هاي معوق</p>
                      <p className="text-2xl font-bold text-wood-800">3</p>
                    </div>
                    <div className="rounded-xl border border-wood-100 p-4">
                      <p className="text-sm text-gray-500">ميانگين رزرو</p>
                      <p className="text-2xl font-bold text-wood-800">2.6 شب</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {payouts.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-xl border border-wood-100 p-4">
                        <div>
                          <p className="font-semibold text-wood-800">{item.host}</p>
                          <p className="text-sm text-gray-500">{formatPrice(item.amount)} تومان</p>
                        </div>
                        <span className="text-sm text-wood-600">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">نظرات و امتيازها</h2>
                  <div className="space-y-3">
                    {reviews.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-xl border border-wood-100 p-4">
                        <div>
                          <p className="font-semibold text-wood-800">{item.villa}</p>
                          <p className="text-sm text-gray-500">کاربر: {item.user} - امتياز: {item.rating}</p>
                        </div>
                        <button className="text-sm text-wood-700">{item.status}</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">محتوا و بلاگ</h2>
                  <div className="rounded-2xl border border-wood-100 p-4">
                    <form onSubmit={handleBlogSubmit} className="space-y-4">
                        {editingBlogPostId !== null && (
                          <div className="rounded-xl border border-wood-200 bg-wood-50 p-3 text-sm text-wood-800 flex items-center justify-between gap-3">
                            <span>در حال ویرایش مطلب شماره {editingBlogPostId}</span>
                            <button
                              type="button"
                              onClick={cancelEditingBlogPost}
                              className="rounded-lg border border-wood-200 px-3 py-1 text-xs font-semibold text-wood-700 hover:bg-white"
                            >
                              لغو ویرایش
                            </button>
                          </div>
                        )}
                      <div>
                        <label className="block text-sm font-semibold text-wood-700 mb-2">عنوان مطلب جديد *</label>
                        <input
                          value={blogForm.title}
                          onChange={(event) => setBlogForm({ ...blogForm, title: event.target.value })}
                          className="w-full border border-wood-200 rounded-xl px-3 py-2 text-sm"
                          placeholder="عنوان"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-wood-700 mb-2">نام نويسنده *</label>
                        <input
                          value={blogForm.author}
                          onChange={(event) => setBlogForm({ ...blogForm, author: event.target.value })}
                          className="w-full border border-wood-200 rounded-xl px-3 py-2 text-sm"
                          placeholder="نام نويسنده"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-wood-700 mb-2">خلاصه مطلب *</label>
                        <textarea
                          value={blogForm.excerpt}
                          onChange={(event) => setBlogForm({ ...blogForm, excerpt: event.target.value })}
                          className="w-full border border-wood-200 rounded-xl px-3 py-2 text-sm"
                          rows={3}
                          placeholder="خلاصه کوتاه براي نمايش در ليست"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-wood-700 mb-2">محتوا *</label>
                        <textarea
                          value={blogForm.content}
                          onChange={(event) => setBlogForm({ ...blogForm, content: event.target.value })}
                          className="w-full border border-wood-200 rounded-xl px-3 py-2 text-sm"
                          rows={6}
                          placeholder="متن کامل مقاله"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-wood-700 mb-2">آپلود تصوير</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0] || null;
                              setBlogImageFile(file);
                            }}
                            className="w-full border border-wood-200 rounded-xl px-3 py-2 text-sm"
                          />
                          {blogImageFile && (
                            <p className="text-xs text-gray-500 mt-2">فايل انتخاب شده: {blogImageFile.name}</p>
                          )}
                          {blogImageError && (
                            <p className="text-xs text-red-600 mt-2">{blogImageError}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-wood-700 mb-2">تگ ها</label>
                          <input
                            value={blogForm.tags}
                            onChange={(event) => setBlogForm({ ...blogForm, tags: event.target.value })}
                            className="w-full border border-wood-200 rounded-xl px-3 py-2 text-sm"
                            placeholder="مثال: سفر, رزرو, ويلا"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <label className="flex items-center gap-2 text-sm text-wood-700">
                          <input
                            type="checkbox"
                            checked={blogForm.published}
                            onChange={(event) => setBlogForm({ ...blogForm, published: event.target.checked })}
                          />
                          انتشار بلافاصله
                        </label>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2 border-t border-wood-100">
                        {editingBlogPostId !== null && (
                          <button
                            type="button"
                            onClick={cancelEditingBlogPost}
                            className="inline-flex items-center justify-center rounded-xl border border-wood-200 bg-white px-6 py-3 text-sm font-semibold text-wood-700 shadow-sm transition-colors hover:bg-wood-50"
                          >
                            لغو
                          </button>
                        )}
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-xl border border-black bg-white px-6 py-3 text-sm font-extrabold tracking-wide text-black shadow-md transition-colors hover:bg-wood-50 hover:border-black/80 disabled:cursor-not-allowed disabled:border-black/40 disabled:bg-wood-50 disabled:text-black"
                          disabled={blogImageUploading}
                        >
                          {blogImageUploading ? 'در حال آپلود...' : editingBlogPostId !== null ? 'به‌روزرسانی مطلب' : 'ارسال مطلب'}
                        </button>
                      </div>
                      {blogSuccess && (
                        <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                          {blogSuccess}
                        </div>
                      )}
                      {blogError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                          {blogError}
                        </div>
                      )}
                    </form>
                  </div>

                  <div className="rounded-2xl border border-wood-100 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-wood-800">آخرين مطالب</h3>
                      <button
                        className="text-sm text-wood-700"
                        onClick={loadBlogPosts}
                      >
                        بروزرسانی
                      </button>
                    </div>
                    {blogLoading ? (
                      <p className="text-sm text-gray-500">در حال دريافت مطالب...</p>
                    ) : blogPosts.length === 0 ? (
                      <p className="text-sm text-gray-500">هيچ مطلبي ثبت نشده است.</p>
                    ) : (
                      <div className="space-y-3">
                        {blogPosts.slice(0, 5).map((post) => (
                          <div key={post.id} className="flex flex-col gap-3 rounded-xl border border-wood-100 p-4 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="font-semibold text-wood-800">{post.title}</p>
                              <p className="text-xs text-gray-500">نويسنده: {post.author}</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                  <span key={tag} className="rounded-full bg-wood-100 px-2 py-1 text-xs text-wood-700">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className={`rounded-full px-2 py-1 text-xs ${
                              post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {post.published ? 'منتشر شده' : 'پيش نويس'}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => startEditingBlogPost(post)}
                                className="inline-flex items-center gap-1 rounded-lg border border-wood-200 px-3 py-1 text-sm text-wood-700 hover:bg-wood-50"
                              >
                                <PencilSquareIcon className="h-4 w-4" />
                                ويرايش
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteBlogPost(post.id, post.title)}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                              >
                                <TrashIcon className="h-4 w-4" />
                                حذف
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-wood-800">تنظيمات سايت</h2>
                  <div className="rounded-2xl border border-wood-100 p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-wood-700 mb-2">نام برند</label>
                      <input className="w-full border border-wood-200 rounded-xl px-3 py-2 text-sm" defaultValue="سفرجا" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-wood-700 mb-2">پيام خوش آمدگويي</label>
                      <input className="w-full border border-wood-200 rounded-xl px-3 py-2 text-sm" defaultValue="رزرو مطمئن ويلا و اقامتگاه" />
                    </div>
                    <button className="bg-wood-700 text-white px-4 py-2 rounded-xl">ذخيره تنظيمات</button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {drawer.isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawer({ isOpen: false, title: '', payload: [] })}
          ></div>
          <div className="absolute right-0 top-0 bottom-0 h-full w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-wood-800">{drawer.title}</h3>
              <button
                className="text-sm text-wood-700"
                onClick={() => setDrawer({ isOpen: false, title: '', payload: [] })}
              >
                بستن
              </button>
            </div>
            <div className="space-y-4">
              {drawer.payload.map((item) => (
                <div key={item.label} className="rounded-xl border border-wood-100 p-4">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  {typeof item.value === 'string' && (item.label.includes('کارت') || item.label.includes('جواز') || item.value.startsWith('/uploads/')) ? (
                    item.value && item.value !== 'آپلود نشده' ? (
                      <div className="mt-2">
                        <img src={item.value} alt={item.label} className="max-h-44 w-full object-contain rounded-md border" />
                        <a href={item.value} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-wood-700 underline">باز کردن در تب جدید</a>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-wood-800 mt-1">{item.value}</p>
                    )
                  ) : (
                    <p className="text-sm font-semibold text-wood-800 mt-1">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button className="flex-1 rounded-xl border border-wood-200 px-4 py-2 text-sm text-wood-700">
                ويرايش
              </button>
              <button className="flex-1 rounded-xl bg-wood-700 px-4 py-2 text-sm text-white">
                اقدام
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
