import React, { useState, useEffect } from 'react';
import AdminLayout from 'src/layouts/AdminLayout';
import BannerForm from './BannerForm';
import { getApiUrl } from 'src/utils/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function CreateBanner() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => { fetchCategories(); }, []);
  const fetchCategories = async () => {
    try { const token = localStorage.getItem('access_token'); const resp = await fetch(getApiUrl('/admin/categories'), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' }); const data = await resp.json(); setCategories(Array.isArray(data) ? data : data.data || []); } catch (e) { console.error(e); }
  };

  const handleSubmit = async (fd: FormData) => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl('/admin/banner'), { method: 'POST', body: fd, headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const body = await resp.json().catch(() => ({}));
      if (resp.ok) { toast.success('Banner created'); router.push('/admin/cms/banners'); }
      else { toast.error(body?.message || 'Failed'); }
    } catch (e) { console.error(e); toast.error('Error creating'); }
    finally { setSubmitting(false); }
  };

  return (
    <AdminLayout>
      <h3>Create Banner</h3>
      <div className="card"><div className="card-body"><BannerForm categories={categories} onSubmit={handleSubmit} submitting={submitting} /></div></div>
    </AdminLayout>
  );
}
