export type HostApplicationStatus = 'pending' | 'approved' | 'rejected';
export type HostDocumentStatus = 'not_required' | 'pending' | 'approved' | 'rejected';

export type HostApplication = {
  id: number;
  firstName: string;
  lastName: string;
  nationalId?: string | null;
  phone: string;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  status: HostApplicationStatus;
  documentsStatus: HostDocumentStatus;
  nationalCardUrl?: string | null;
  propertyDocumentUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type HostApplicationInput = {
  firstName: string;
  lastName: string;
  nationalId?: string;
  phone: string;
  address?: string;
  city?: string;
  province?: string;
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
  nationalId: record.nationalId || null,
  phone: record.phone || '',
  address: record.address || null,
  city: record.city || null,
  province: record.province || null,
  status: record.status || 'pending',
  documentsStatus: record.documentsStatus || 'pending',
  nationalCardUrl: record.nationalIdImage || null,
  propertyDocumentUrl: record.ownershipDocImage || null,
  createdAt: record.createdAt || '',
  updatedAt: record.updatedAt || '',
});

const CURRENT_HOST_PHONE_KEY = 'demo-current-host-phone';

export const getHostApplications = async (): Promise<HostApplication[]> => {
  const res = await fetch('/api/hosts');
  const payload = await res.json();
  if (!res.ok || !payload.success) return [];
  const records: HostApiRecord[] = Array.isArray(payload.data) ? payload.data : [];
  return records.map((record) => normalizeHostApplication(record));
};

export const submitHostApplication = async (input: HostApplicationInput) => {
  const res = await fetch('/api/hosts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const payload = await res.json();
  if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to create host application');
  return payload.data as HostApplication;
};

export const updateHostApplicationStatus = async (id: number, status: HostApplicationStatus) => {
  const res = await fetch(`/api/hosts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const payload = await res.json();
  if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to update status');
  return payload.data as HostApplication;
};

export const submitHostDocuments = async (phone: string, input: { nationalCardUrl?: string; propertyDocumentUrl?: string }) => {
  // find host by phone, then patch
  const listRes = await fetch(`/api/hosts?phone=${encodeURIComponent(phone)}`);
  const listPayload = await listRes.json();
  if (!listRes.ok || !listPayload.success || !Array.isArray(listPayload.data) || listPayload.data.length === 0) {
    throw new Error('Host not found');
  }
  const host = listPayload.data[0];
  const res = await fetch(`/api/hosts/${host.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nationalIdImage: input.nationalCardUrl,
      ownershipDocImage: input.propertyDocumentUrl,
      documentsStatus: 'pending',
    }),
  });
  const payload = await res.json();
  if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to submit documents');
  return payload.data as HostApplication;
};

export const reviewHostDocuments = async (id: number, status: Exclude<HostDocumentStatus, 'not_required'>) => {
  const res = await fetch(`/api/hosts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentsStatus: status }),
  });
  const payload = await res.json();
  if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to review documents');
  return payload.data as HostApplication;
};

export const removeHostApplication = async (id: number) => {
  await fetch(`/api/hosts/${id}`, { method: 'DELETE' });
};

export const getCurrentHostPhone = () => {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(CURRENT_HOST_PHONE_KEY) || '';
};

export const setCurrentHostPhone = (phone: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CURRENT_HOST_PHONE_KEY, phone);
};

export const findHostApplicationByPhone = async (phone: string) => {
  const res = await fetch(`/api/hosts?phone=${encodeURIComponent(phone)}`);
  const payload = await res.json();
  if (!res.ok || !payload.success) return null;
  const application = Array.isArray(payload.data) && payload.data.length > 0 ? payload.data[0] : null;
  if (!application) return null;
  return application as HostApplication;
};