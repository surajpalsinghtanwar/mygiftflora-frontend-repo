import React, { useState, useEffect } from 'react';
import { getUploadUrl } from '../../../../utils/api';

type Props = {
  initial?: any;
  categories?: any[];
  onSubmit: (formData: FormData) => Promise<void>;
  submitting?: boolean;
};

const availablePages = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'category', label: 'Category Pages' },
];

export default function BannerForm({ initial = {}, categories = [], onSubmit, submitting = false }: Props) {
  const [form, setForm] = useState<any>({
    title: '', subtitle: '', description: '', type: 'static', category: '', slug: '', buttonText: '', buttonUrl: '', position: 'middle', order: 0, isActive: true, pages: [] as string[], imageFile: null as File | null,
    backgroundColor: '',
    textColor: '',
    ...initial,
  });
  const [slugTouched, setSlugTouched] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // If initial contains image path/url, show via getUploadUrl
    if (!form.imageFile && (initial?.image || initial?.image_url || initial?.imageUrl)) {
      const img = initial.image || initial.image_url || initial.imageUrl;
      setImagePreview(getUploadUrl(String(img)));
    } else if (form.imageFile) {
      setImagePreview(URL.createObjectURL(form.imageFile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.imageFile, initial]);

  // If banner is dynamic and a category is selected, auto-fill slug from category (unless user edited it)
  useEffect(() => {
    if (form.type === 'dynamic' && form.category && categories && categories.length) {
      const cat = categories.find((c: any) => String(c.id || c._id) === String(form.category));
      const candidate = cat?.slug || cat?.slug_name || cat?.category_slug || cat?.name || '';
      if (candidate && !slugTouched) {
        setForm((f: any) => ({ ...f, slug: candidate }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.type, form.category, categories, slugTouched]);

  const togglePage = (key: string) => {
    const pages = new Set(form.pages || []);
    if (pages.has(key)) pages.delete(key); else pages.add(key);
    setForm({ ...form, pages: Array.from(pages) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
  const allowed = ['title','subtitle','description','type','category','slug','buttonText','buttonUrl','position','order','isActive'];
    // include backgroundColor and textColor as well
    const allowedWithStyles = [...allowed, 'backgroundColor', 'textColor'];
    allowedWithStyles.forEach(k => { if (form[k] !== undefined && form[k] !== null) fd.append(k, String(form[k])); });
    fd.append('pages', JSON.stringify(form.pages || []));
    if (form.imageFile instanceof File) fd.append('image', form.imageFile);
    await onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-8">
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input className="form-control" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Subtitle</label>
            <input className="form-control" value={form.subtitle || ''} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={4} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="static">Static</option>
              <option value="dynamic">Dynamic (category-driven)</option>
            </select>
          </div>
          {form.type === 'dynamic' && (
            <div className="mb-3">
              <label className="form-label">Category (for dynamic banners)</label>
              <select className="form-select" value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">-- Select category --</option>
                {categories.map(c => <option key={c.id || c._id} value={c.id || c._id}>{c.name}</option>)}
              </select>
            </div>
          )}
          {/* Slug (visible) - auto-filled for dynamic banners but editable */}
          <div className="mb-3">
            <label className="form-label">Slug (used for dynamic banners)</label>
            <input className="form-control" value={form.slug || ''} onChange={e => { setSlugTouched(true); setForm({ ...form, slug: e.target.value }); }} placeholder="category-slug or custom slug" />
          </div>
          <div className="mb-3 row">
            <div className="col-md-6">
              <label className="form-label">Button Text</label>
              <input className="form-control" value={form.buttonText || ''} onChange={e => setForm({ ...form, buttonText: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Button URL</label>
              <input className="form-control" value={form.buttonUrl || ''} onChange={e => setForm({ ...form, buttonUrl: e.target.value })} />
            </div>
          </div>
          <div className="mb-3 row">
            <div className="col-md-4">
              <label className="form-label">Position</label>
              <select className="form-select" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}>
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="last">Last</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Order</label>
              <input type="number" className="form-control" value={form.order ?? 0} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Active</label>
              <select className="form-select" value={form.isActive ? '1' : '0'} onChange={e => setForm({ ...form, isActive: e.target.value === '1' })}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Pages</label>
            <div className="d-flex gap-2 flex-wrap">
              {availablePages.map(p => (
                <div key={p.key} className="form-check">
                  <input id={`page-${p.key}`} className="form-check-input" type="checkbox" checked={(form.pages || []).includes(p.key)} onChange={() => togglePage(p.key)} />
                  <label htmlFor={`page-${p.key}`} className="form-check-label ms-1">{p.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="mb-3">
            <label className="form-label">Banner Image <small className="text-muted ms-2" title="Recommended image size: 1920×600">(Recommended: 1920×600)</small></label>
            <input className="form-control" type="file" accept="image/*" onChange={e => setForm({ ...form, imageFile: e.target.files?.[0] || null })} />
          </div>
          {imagePreview && (
            <div className="mb-3">
              <label className="form-label">Preview</label>
              <div><img src={imagePreview} style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} alt="preview" /></div>
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Background (CSS)</label>
            <input className="form-control" value={form.backgroundColor || ''} placeholder="e.g. linear-gradient(135deg,#667eea,#764ba2) or #fff" onChange={e => setForm({ ...form, backgroundColor: e.target.value })} />
            <small className="text-muted">You can use a color, gradient, or CSS background value.</small>
          </div>
          <div className="mb-3">
            <label className="form-label">Text Color</label>
            <input type="text" className="form-control" value={form.textColor || ''} placeholder="e.g. white or #000" onChange={e => setForm({ ...form, textColor: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mt-3">
        <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Save Banner'}</button>
      </div>
    </form>
  );
}
