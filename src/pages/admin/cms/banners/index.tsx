import React, { useEffect, useState } from 'react';
import AdminLayout from 'src/layouts/AdminLayout';
import { getApiUrl, getUploadUrl } from 'src/utils/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function BannerList() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => { fetchBanners(); }, []);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl('/admin/categories'), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const data = await resp.json();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (e) { console.error('fetchCategories', e); }
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl('/admin/banners'), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const data = await resp.json();
      setBanners(Array.isArray(data) ? data : data.data || []);
    } catch (e) { console.error(e); toast.error('Failed to fetch banners'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl(`/admin/banner/${id}`), { method: 'DELETE', headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      if (resp.ok) { toast.success('Deleted'); fetchBanners(); } else { toast.error('Failed'); }
    } catch (e) { console.error(e); toast.error('Error deleting'); }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Banners</h3>
        <Link href="/admin/cms/banners/create" className="btn btn-primary">+ Add Banner</Link>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="card"><div className="card-body">
          <table className="table">
            <thead><tr><th>Preview</th><th>Title</th><th>Type</th><th>Slug</th><th>Pages</th><th>Position</th><th>Order</th><th>Active</th><th>Actions</th></tr></thead>
            <tbody>
              {banners.map(b => (
                <tr key={b.id || b._id}>
                  <td style={{ width: 120 }}>
                    {b.image ? (
                      <img src={getUploadUrl(String(b.image))} style={{ width: 120, height: 60, objectFit: 'cover', cursor: 'pointer' }} onClick={() => setPreviewSrc(getUploadUrl(String(b.image)))} />
                    ) : '-'}
                  </td>
                  <td>{b.title}</td>
                  <td>{b.type || 'static'}</td>
                  <td>{b.type === 'dynamic' ? (b.slug ? `/${b.slug}` : (categories.find(c => String(c.id||c._id) === String(b.category))?.slug || '-')) : '-'}</td>
                  <td>{(b.pages || []).join(', ')}</td>
                  <td>{b.position}</td>
                  <td>{b.order}</td>
                  <td>{b.isActive ? 'Yes' : 'No'}</td>
                  <td>
                    <Link href={`/admin/cms/banners/edit/${b.id || b._id}`} className="btn btn-sm btn-outline-primary me-2">Edit</Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b.id || b._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div></div>
      )}
      {/* preview modal */}
      {previewSrc && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} onClick={() => setPreviewSrc(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-body p-0">
                <img src={previewSrc} alt="Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setPreviewSrc(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
