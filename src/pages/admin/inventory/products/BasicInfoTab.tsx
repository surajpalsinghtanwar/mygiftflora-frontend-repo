
import React from 'react';

type Props = {
  form: any;
  setForm: (f: any) => void;
  categories: any[];
  subcategories: any[];
  subsubcategories: any[];
};

const BasicInfoTab: React.FC<Props> = ({ form, setForm, categories, subcategories, subsubcategories }) => {
  return (
    <div className="row">
      <div className="col-md-6">
         <div className="mb-3">
          <label className="form-label">Product Name <span className="text-danger">*</span></label>
          <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g., Red Roses Bouquet, Chocolate Cake, etc." />
        </div>
        <div className="mb-3">
          <label className="form-label">Category <span className="text-danger">*</span></label>
          <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id || category._id} value={category.id || category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Subcategory</label>
          <select className="form-select" value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })} disabled={!form.category}>
            <option value="">Select a subcategory</option>
            {subcategories.map(subcategory => (
              <option key={subcategory.id || subcategory._id} value={subcategory.id || subcategory._id}>{subcategory.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Sub-subcategory</label>
          <select className="form-select" value={form.subsubcategory} onChange={e => setForm({ ...form, subsubcategory: e.target.value })} disabled={!form.subcategory}>
            <option value="">Select a sub-subcategory</option>
            {subsubcategories.map(subsubcategory => (
              <option key={subsubcategory.id || subsubcategory._id} value={subsubcategory.id || subsubcategory._id}>{subsubcategory.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">SKU</label>
          <input
            type="text"
            className="form-control"
            value={form.sku}
            onChange={e => setForm({ ...form, sku: e.target.value })}
            placeholder="Product SKU"
            style={{ background: form.sku.startsWith('auto-') ? '#f8f9fa' : undefined }}
            readOnly={form.sku.startsWith('auto-')}
            onDoubleClick={(f: any) => setForm({ ...form, sku: '' })}
          />
          <small className="form-text text-muted">SKU is auto-generated. Double-click to edit manually.</small>
        </div>
        <div className="mb-3">
          <label className="form-label">Brand</label>
          <input type="text" className="form-control" value={form.brand || ''} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Brand name" />
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Stock Quantity</label>
          <input type="number" className="form-control" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="Available quantity" />
        </div>
        <div className="mb-3">
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="status" checked={form.status} onChange={e => setForm({ ...form, status: e.target.checked })} />
            <label className="form-check-label" htmlFor="status">Active</label>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Image Personalization (show image upload option to user on web)</label>
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="imagePersonalization" checked={form.imagePersonalization || false} onChange={e => setForm({ ...form, imagePersonalization: e.target.checked })} />
            <label className="form-check-label" htmlFor="imagePersonalization">Enable Image Personalization</label>
          </div>
          <label className="form-label">Text Personalization(show text input option to user on web)</label>
          <div className="form-check">
            <input type="checkbox" className="form-check-input" id="textPersonalization" checked={form.textPersonalization || false} onChange={e => setForm({ ...form, textPersonalization: e.target.checked })} />
            <label className="form-check-label" htmlFor="textPersonalization">Enable Text Personalization</label>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default BasicInfoTab;
