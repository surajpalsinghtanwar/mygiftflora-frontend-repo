import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ProductSpec {
  key: string;
  value: string;
}
interface ProductDimension {
  length: number;
  width: number;
  height: number;
  unit: string;
}
interface Brand {
  id: string;
  name: string;
}

const brandOptions: Brand[] = [
  { id: '1', name: 'Brand A' },
  { id: '2', name: 'Brand B' },
];

const units = ['cm', 'inch'];

const ProductFormExtended: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<ProductSpec[]>([]);
  const [dimensions, setDimensions] = useState<ProductDimension>({ length: 0, width: 0, height: 0, unit: 'cm' });

  // Handlers
  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setMainImage(file || null);
    setMainImagePreview(file ? URL.createObjectURL(file) : null);
  };
  const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setGallery(files);
    setGalleryPreview(files.map(f => URL.createObjectURL(f)));
  };
  const handleSpecChange = (idx: number, field: 'key' | 'value', value: string) => {
    setSpecifications(specs => specs.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };
  const addSpec = () => setSpecifications(specs => [...specs, { key: '', value: '' }]);
  const removeSpec = (idx: number) => setSpecifications(specs => specs.filter((_, i) => i !== idx));
  const handleDimensionChange = (field: keyof ProductDimension, value: string) => {
    setDimensions(dim => ({ ...dim, [field]: field === 'unit' ? value : Number(value) }));
  };

  // Submit handler (stub)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Validate and submit
    alert('Submitted!');
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button type="button" className={`nav-link${activeTab === 'basic' ? ' active' : ''}`} onClick={() => setActiveTab('basic')}>Basic Info</button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link${activeTab === 'desc' ? ' active' : ''}`} onClick={() => setActiveTab('desc')}>Description</button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link${activeTab === 'specs' ? ' active' : ''}`} onClick={() => setActiveTab('specs')}>Specifications</button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link${activeTab === 'dim' ? ' active' : ''}`} onClick={() => setActiveTab('dim')}>Dimensions</button>
        </li>
        <li className="nav-item">
          <button type="button" className={`nav-link${activeTab === 'img' ? ' active' : ''}`} onClick={() => setActiveTab('img')}>Images</button>
        </li>
      </ul>
      {/* Tabs */}
      {activeTab === 'basic' && (
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Product Name</label>
            <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Brand</label>
            <select className="form-select" value={brandId} onChange={e => setBrandId(e.target.value)} required>
              <option value="">Select Brand</option>
              {brandOptions.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">SKU</label>
            <input className="form-control" value={sku} onChange={e => setSku(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Price</label>
            <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Stock</label>
            <input type="number" className="form-control" value={stock} onChange={e => setStock(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Active</label>
            <input type="checkbox" className="form-check-input ms-2" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
          </div>
        </div>
      )}
      {activeTab === 'desc' && (
        <div className="mb-3">
          <label className="form-label">Description</label>
          <ReactQuill value={description} onChange={setDescription} theme="snow" />
        </div>
      )}
      {activeTab === 'specs' && (
        <div>
          <label className="form-label">Specifications</label>
          {specifications.map((spec, idx) => (
            <div className="row mb-2" key={idx}>
              <div className="col">
                <input className="form-control" placeholder="Key" value={spec.key} onChange={e => handleSpecChange(idx, 'key', e.target.value)} />
              </div>
              <div className="col">
                <input className="form-control" placeholder="Value" value={spec.value} onChange={e => handleSpecChange(idx, 'value', e.target.value)} />
              </div>
              <div className="col-auto">
                <button type="button" className="btn btn-danger" onClick={() => removeSpec(idx)}>&times;</button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addSpec}>Add Specification</button>
        </div>
      )}
      {activeTab === 'dim' && (
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Length</label>
            <input type="number" className="form-control" value={dimensions.length} onChange={e => handleDimensionChange('length', e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Width</label>
            <input type="number" className="form-control" value={dimensions.width} onChange={e => handleDimensionChange('width', e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Height</label>
            <input type="number" className="form-control" value={dimensions.height} onChange={e => handleDimensionChange('height', e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Unit</label>
            <select className="form-select" value={dimensions.unit} onChange={e => handleDimensionChange('unit', e.target.value)}>
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      )}
      {activeTab === 'img' && (
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Main Image <small className="text-muted ms-2" title="Recommended image size: 800×800">(Recommended: 800×800)</small></label>
            <input type="file" accept="image/*" className="form-control" onChange={handleMainImage} />
            {mainImagePreview && <img src={mainImagePreview} alt="Main" className="img-thumbnail mt-2" style={{ maxWidth: 120 }} />}
          </div>
          <div className="col-md-6">
            <label className="form-label">Gallery Images <small className="text-muted ms-2" title="Recommended image size: 400×400">(Recommended: 400×400)</small></label>
            <input type="file" accept="image/*" className="form-control" multiple onChange={handleGallery} />
            <div className="d-flex flex-wrap mt-2">
              {galleryPreview.map((img, idx) => (
                <img key={idx} src={img} alt={`Gallery ${idx}`} className="img-thumbnail me-2 mb-2" style={{ maxWidth: 80 }} />
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 text-end">
        <button type="submit" className="btn btn-primary">Save Product</button>
      </div>
    </form>
  );
};

export default ProductFormExtended;
