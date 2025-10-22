import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from 'src/layouts/AdminLayout';
import BannerForm from '../BannerForm';
import { getApiUrl } from 'src/utils/api';
import toast from 'react-hot-toast';

export default function EditBanner() {
  const router = useRouter();
  const { id } = router.query;
  const [initial, setInitial] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => { if (id) fetchBanner(); fetchCategories(); }, [id]);

  const fetchCategories = async () => {
    try { const token = localStorage.getItem('access_token'); const resp = await fetch(getApiUrl('/admin/categories'), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' }); const data = await resp.json(); setCategories(Array.isArray(data) ? data : data.data || []); } catch (e) { console.error(e); }
  };

  const fetchBanner = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl(`/admin/banner/${id}`), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const data = await resp.json();
      const b = Array.isArray(data) ? data[0] : data;
      setInitial(b);
    } catch (e) { console.error(e); toast.error('Failed to load banner'); }
  };

  const handleSubmit = async (fd: FormData) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl(`/admin/banner/${id}`), { method: 'PUT', body: fd, headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const body = await resp.json().catch(() => ({}));
      if (resp.ok) { toast.success('Banner updated'); router.push('/admin/cms/banners'); }
      else { toast.error(body?.message || 'Failed'); }
    } catch (e) { console.error(e); toast.error('Error updating'); }
    finally { setSubmitting(false); }
  };

  if (!initial) return <AdminLayout><div className="text-center py-5">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <h3>Edit Banner</h3>
      <div className="card"><div className="card-body"><BannerForm initial={initial} categories={categories} onSubmit={handleSubmit} submitting={submitting} /></div></div>
    </AdminLayout>
  );
}
