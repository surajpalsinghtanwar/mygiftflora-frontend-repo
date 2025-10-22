import React from 'react';
type Props = {
  form: any;
  setForm: (f: any) => void;
};
const SEOTab: React.FC<Props> = ({ form, setForm }) => (
  <div className="p-3 bg-light border rounded">
    <h5 className="mb-3">SEO Settings</h5>
    <div className="mb-3">
      <label className="form-label">SEO Title</label>
      <input className="form-control" type="text" value={form.seoTitle || ''} onChange={e => setForm({ ...form, seoTitle: e.target.value })} placeholder="SEO title for product page" />
    </div>
    <div className="mb-3">
      <label className="form-label">SEO Description</label>
      <textarea className="form-control" rows={2} value={form.seoDescription || ''} onChange={e => setForm({ ...form, seoDescription: e.target.value })} placeholder="SEO description for product page" />
    </div>
    <div className="mb-3">
      <label className="form-label">SEO Keywords</label>
      <input className="form-control" type="text" value={form.seoKeywords || ''} onChange={e => setForm({ ...form, seoKeywords: e.target.value })} placeholder="e.g., cake, birthday, chocolate" />
    </div>
    <div className="mb-3">
      <label className="form-label">Slug</label>
      <input className="form-control" type="text" value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="e.g., royal-designer-wedding-cake" />
    </div>
  </div>
);
export default SEOTab;
