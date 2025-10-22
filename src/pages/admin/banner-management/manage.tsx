import React, { useEffect, useState } from 'react';
import AdminLayout from 'src/layouts/AdminLayout';
import { Row, Col, Card, Table, Button, Form, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { getApiUrl, getUploadUrl } from 'src/utils/api';
import toast from 'react-hot-toast';

type Banner = any;

export default function BannerManagePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState<any>({
    title: '', subtitle: '', description: '', backgroundColor: '', textColor: '', type: 'static', categoryId: '', imageFile: null as File | null, image: '', buttonText: '', buttonLink: '', position: 1, status: 'active'
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => { fetchBanners(); fetchCategories(); }, []);

  async function fetchBanners() {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl('/admin/banners'), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const data = await resp.json();
      const items = Array.isArray(data) ? data : data.data || [];
      setBanners(items);
    } catch (e) { console.error(e); toast.error('Failed to load banners'); }
    finally { setLoading(false); }
  }

  async function fetchCategories() {
    try {
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl('/admin/categories'), { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      const data = await resp.json();
      setCategories(Array.isArray(data) ? data : data.data || []);
    } catch (e) { console.error(e); }
  }

  function startCreate() {
    setEditing(null);
    setForm({ title: '', subtitle: '', description: '', backgroundColor: '', textColor: '', type: 'static', categoryId: '', imageFile: null, image: '', buttonText: '', buttonLink: '', position: (banners.length || 0) + 1, status: 'active' });
    setPreview(null);
  }

  function startEdit(b: Banner) {
    setEditing(b);
    setForm({
      title: b.title || '', subtitle: b.subtitle || '', description: b.description || '', backgroundColor: b.backgroundColor || '', textColor: b.textColor || '', type: b.type || 'static', categoryId: b.categoryId || '', imageFile: null, image: b.image || '', buttonText: b.buttonText || '', buttonLink: b.buttonLink || '', position: b.position || 1, status: b.status || 'active'
    });
  setPreview(b.image && !/^https?:\/\//i.test(b.image) ? getUploadUrl(String(b.image)) : b.image || null);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setForm((prev: any) => ({ ...prev, imageFile: f, image: f.name }));
    setPreview(URL.createObjectURL(f));
  }

  async function save() {
    // validate
    if (!form.title || !form.buttonText) { toast.error('Please fill required fields'); return; }
    try {
      const token = localStorage.getItem('access_token');
    const fd = new FormData();
  const keys = ['title','subtitle','description','backgroundColor','textColor','type','categoryId','buttonText','buttonLink','position','status'];
    keys.forEach(k => { if (form[k] !== undefined) fd.append(k, String(form[k])); });
      if (form.imageFile) fd.append('image', form.imageFile);

      let resp: Response;
      if (editing) {
        resp = await fetch(getApiUrl(`/admin/banner/${editing.id}`), { method: 'PUT', body: fd, headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      } else {
        resp = await fetch(getApiUrl('/admin/banner'), { method: 'POST', body: fd, headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      }
      const body = await resp.json().catch(() => ({}));
      if (resp.ok) { toast.success(editing ? 'Updated' : 'Created'); fetchBanners(); startCreate(); }
      else { toast.error(body?.message || 'Failed'); }
    } catch (e) { console.error(e); toast.error('Error saving'); }
  }

  async function remove(id: any) {
    if (!confirm('Delete this banner?')) return;
    try {
      const token = localStorage.getItem('access_token');
      const resp = await fetch(getApiUrl(`/admin/banner/${id}`), { method: 'DELETE', headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
      if (resp.ok) { toast.success('Deleted'); fetchBanners(); } else toast.error('Failed');
    } catch (e) { console.error(e); toast.error('Error deleting'); }
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <h3 className="mb-3">Banner Management (Full Page)</h3>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Banners</h5>
                  <Button variant="dark" size="sm" onClick={startCreate}><FaPlus /> New</Button>
                </div>
                <Table responsive hover>
                  <thead className="table-dark"><tr><th>Pos</th><th>Title</th><th>Type</th><th>Slug</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {banners.sort((a,b)=> (a.position||0)-(b.position||0)).map(b => (
                      <tr key={b.id || b._id}>
                        <td><Badge bg="secondary">{b.position}</Badge></td>
                        <td>{b.title}</td>
                        <td>{b.type || 'static'}</td>
                        <td>{b.type === 'dynamic' ? (b.slug ? `/${b.slug}` : (b.categorySlug ? `/${b.categorySlug}` : '-')) : '-'}</td>
                        <td>{b.status}</td>
                        <td>
                          <Button variant="outline-primary" size="sm" onClick={() => startEdit(b)}><FaEdit /></Button>{' '}
                          <Button variant="outline-danger" size="sm" onClick={() => remove(b.id || b._id)}><FaTrash /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <h5>{editing ? 'Edit Banner' : 'Create Banner'}</h5>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Type</Form.Label>
                        <Form.Select value={form.type} onChange={e=>{
                          const t = e.target.value;
                          setForm((prev: any)=> ({ ...prev, type: t, categoryId: '', buttonLink: '' }));
                        }}>
                          <option value="static">Static</option>
                          <option value="dynamic">Dynamic (category)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{form.type === 'dynamic' ? 'Category' : 'Page'}</Form.Label>
                        <Form.Select value={form.categoryId} onChange={e=>{
                          const val = e.target.value;
                          if (form.type === 'dynamic') {
                            const cat = categories.find((c:any)=>String(c.id||c._id)===String(val));
                            const slug = cat?.slug || cat?.name || val;
                            setForm((p:any)=> ({ ...p, categoryId: val, buttonLink: `/products/${slug}` }));
                          } else {
                            setForm((p:any)=> ({ ...p, categoryId: val, buttonLink: `/${val}` }));
                          }
                        }}>
                          <option value="">-- Select --</option>
                          {form.type === 'dynamic' ? (
                            categories.map((c:any) => <option key={c.id||c._id} value={c.id||c._id}>{c.name}</option>)
                          ) : (
                            [
                              { key: 'about-us', label: 'About Us' },
                              { key: 'privacy-policy', label: 'Privacy Policy' },
                              { key: 'contact-us', label: 'Contact Us' },
                              { key: 'faq', label: 'FAQ' },
                              { key: 'blogs', label: 'Blogs' }
                            ].map(p => <option key={p.key} value={p.key}>{p.label}</option>)
                          )}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control value={form.title} onChange={e=>setForm({...form, title: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Subtitle</Form.Label>
                    <Form.Control value={form.subtitle} onChange={e=>setForm({...form, subtitle: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Banner Image Upload</Form.Label>
                    <Form.Control type="file" onChange={handleFileInput} />
                  </Form.Group>
                  {preview && <div className="mb-3"><img src={preview} alt="preview" style={{ width: '100%', height: 200, objectFit: 'cover' }} /></div>}
                  <Form.Group className="mb-3">
                    <Form.Label>Background (CSS)</Form.Label>
                    <Form.Control value={form.backgroundColor} placeholder="e.g. linear-gradient(135deg,#667eea,#764ba2) or #fff" onChange={e=>setForm({...form, backgroundColor: e.target.value})} />
                    <Form.Text className="text-muted">Enter a CSS background value or color.</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Text Color</Form.Label>
                    <Form.Control value={form.textColor} placeholder="e.g. white or #000" onChange={e=>setForm({...form, textColor: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Button Text</Form.Label>
                    <Form.Control value={form.buttonText} onChange={e=>setForm({...form, buttonText: e.target.value})} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Button Link</Form.Label>
                    <Form.Control value={form.buttonLink} onChange={e=>setForm({...form, buttonLink: e.target.value})} />
                  </Form.Group>
                  <div className="d-flex gap-2">
                    <Button variant="secondary" onClick={startCreate}>Reset</Button>
                    <Button variant="dark" onClick={save}>{editing ? 'Update' : 'Create'}</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
}
