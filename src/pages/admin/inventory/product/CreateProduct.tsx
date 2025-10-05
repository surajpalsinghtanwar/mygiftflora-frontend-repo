
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { createProduct } from '../../../store/productSlice';
import { fetchCategories } from '../../../store/categorySlice';
import { fetchSubcategories } from '../../../store/subcategorySlice';
import { toast } from 'react-toastify';

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { subcategories } = useSelector((state: RootState) => state.subcategories);
  const { loading, error } = useSelector((state: RootState) => state.products);

  // Tabs
  const [activeTab, setActiveTab] = useState('basic');

  // Basic Info
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');

  // Load categories and subcategories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubcategories());
  }, [dispatch]);


  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Images
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);

  // Specifications
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([]);

  // Dimensions
  const [dimensions, setDimensions] = useState({ length: '', width: '', height: '', unit: 'cm' });

  // Logistics
  const [logistics, setLogistics] = useState({ length: '', width: '', height: '', weight: '', warehouse: '', country: '', state: '', city: '' });

  // Furniture
  const [furniture, setFurniture] = useState({ material: '', color: '', style: '', shape: '', seating: '', storage: false, assembly: false, warranty: '', origin: '' });

  // SEO
  const [seo, setSeo] = useState({ title: '', description: '', keywords: '', canonical: '' });

  // Handlers for images
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

  // Handlers for dynamic fields
  const handleSpecChange = (idx: number, field: 'key' | 'value', value: string) => {
    setSpecifications(specs => specs.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };
  const addSpec = () => setSpecifications(specs => [...specs, { key: '', value: '' }]);
  const removeSpec = (idx: number) => setSpecifications(specs => specs.filter((_, i) => i !== idx));

  // Handlers for logistics, furniture, SEO, dimensions
  const handleLogisticsChange = (field: string, value: string) => setLogistics(l => ({ ...l, [field]: value }));
  const handleFurnitureChange = (field: string, value: string | boolean) => setFurniture(f => ({ ...f, [field]: value }));
  const handleSeoChange = (field: string, value: string) => setSeo(s => ({ ...s, [field]: value }));
  const handleDimensionChange = (field: string, value: string) => setDimensions(d => ({ ...d, [field]: value }));

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Product name is required.';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    }
    if (!mainImage) {
      newErrors.mainImage = 'Main image is required.';
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Valid price is required.';
    }
    if (!sku.trim()) {
      newErrors.sku = 'SKU is required.';
    }
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required.';
    }
    if (!categoryId) {
      newErrors.categoryId = 'Category is required.';
    }

    setErrors(newErrors);

    // Switch to first tab with error
    if (newErrors.name || newErrors.price || newErrors.sku || newErrors.stock || newErrors.categoryId) {
      setActiveTab('basic');
    } else if (newErrors.description) {
      setActiveTab('desc');
    } else if (newErrors.mainImage) {
      setActiveTab('img');
    }

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix all validation errors before submitting.');
      return;
    }

    try {
      // Prepare specifications as object
      const specsObject: Record<string, string> = {};
      specifications.forEach(spec => {
        if (spec.key.trim() && spec.value.trim()) {
          specsObject[spec.key.trim()] = spec.value.trim();
        }
      });

      // Prepare the complete payload with all data
      const productData = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : undefined,
        categoryId,
        subcategoryId: subcategoryId || undefined,
        sku: sku.trim(),
        stock: Number(stock),
        isActive,
        mainImage: mainImage || undefined,
        galleryImages: gallery.length > 0 ? gallery : undefined,
        specifications: Object.keys(specsObject).length > 0 ? specsObject : undefined,
        // Additional data for extended fields
        dimensions: dimensions.length || dimensions.width || dimensions.height ? dimensions : undefined,
        logistics: logistics.length || logistics.width || logistics.height || logistics.weight || logistics.warehouse || logistics.country || logistics.state || logistics.city ? logistics : undefined,
        furniture: furniture.material || furniture.color || furniture.style || furniture.shape || furniture.seating || furniture.storage || furniture.assembly || furniture.warranty || furniture.origin ? furniture : undefined,
        seo: seo.title || seo.description || seo.keywords || seo.canonical ? seo : undefined,
      };

      // Dispatch the createProduct action and wait for result
      await dispatch(createProduct(productData)).unwrap();
      
      toast.success('Product created successfully!');
      navigate('/inventory/products');
    } catch (error: any) {
      // Stay on current page and show error
      const errorMessage = error.message || error || 'Failed to create product';
      toast.error(errorMessage);
      console.error('Product creation error:', error);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title mb-0">Create New Product</h2>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/inventory/products')}
                  disabled={loading}
                >
                  Back to Products
                </button>
              </div>

              {/* Show error message if any */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <ul className="nav nav-tabs mb-4">
                <li className="nav-item"><button type="button" className={`nav-link${activeTab === 'basic' ? ' active' : ''}`} onClick={() => setActiveTab('basic')}>Basic Info</button></li>
                <li className="nav-item"><button type="button" className={`nav-link${activeTab === 'desc' ? ' active' : ''}`} onClick={() => setActiveTab('desc')}>Description</button></li>
                <li className="nav-item"><button type="button" className={`nav-link${activeTab === 'specs' ? ' active' : ''}`} onClick={() => setActiveTab('specs')}>Specifications</button></li>
                <li className="nav-item"><button type="button" className={`nav-link${activeTab === 'dim' ? ' active' : ''}`} onClick={() => setActiveTab('dim')}>Dimensions</button></li>
                <li className="nav-item"><button type="button" className={`nav-link${activeTab === 'img' ? ' active' : ''}`} onClick={() => setActiveTab('img')}>Images</button></li>
                <li className="nav-item"><button type="button" className={`nav-link${activeTab === 'log' ? ' active' : ''}`} onClick={() => setActiveTab('log')}>Logistics</button></li>
                <li className="nav-item"><button type="button" className={`nav-link${activeTab === 'furn' ? ' active' : ''}`} onClick={() => setActiveTab('furn')}>Furniture</button></li>
                <li className="nav-item"><button type="button" className={`nav-link${activeTab === 'seo' ? ' active' : ''}`} onClick={() => setActiveTab('seo')}>SEO</button></li>
              </ul>

              <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                {activeTab === 'basic' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Product Name *</label>
                      <input 
                        className={`form-control${errors.name ? ' is-invalid' : ''}`} 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        disabled={loading}
                      />
                      {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">SKU *</label>
                      <input 
                        className={`form-control${errors.sku ? ' is-invalid' : ''}`} 
                        value={sku} 
                        onChange={e => setSku(e.target.value)}
                        disabled={loading}
                      />
                      {errors.sku && <div className="invalid-feedback d-block">{errors.sku}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Price *</label>
                      <input 
                        type="number" 
                        step="0.01"
                        className={`form-control${errors.price ? ' is-invalid' : ''}`} 
                        value={price} 
                        onChange={e => setPrice(e.target.value)}
                        disabled={loading}
                      />
                      {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Sale Price</label>
                      <input 
                        type="number" 
                        step="0.01"
                        className="form-control" 
                        value={salePrice} 
                        onChange={e => setSalePrice(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Stock *</label>
                      <input 
                        type="number" 
                        className={`form-control${errors.stock ? ' is-invalid' : ''}`} 
                        value={stock} 
                        onChange={e => setStock(e.target.value)}
                        disabled={loading}
                      />
                      {errors.stock && <div className="invalid-feedback d-block">{errors.stock}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category *</label>
                      <select 
                        className={`form-select${errors.categoryId ? ' is-invalid' : ''}`} 
                        value={categoryId} 
                        onChange={e => {
                          setCategoryId(e.target.value);
                          // Reset subcategory when category changes
                          setSubcategoryId('');
                        }}
                        disabled={loading}
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                      {errors.categoryId && <div className="invalid-feedback d-block">{errors.categoryId}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Subcategory</label>
                      <select 
                        className="form-select" 
                        value={subcategoryId} 
                        onChange={e => setSubcategoryId(e.target.value)}
                        disabled={loading || !categoryId}
                      >
                        <option value="">Select Subcategory</option>
                        {subcategories
                          .filter((sub) => sub.categoryId === categoryId)
                          .map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                          ))}
                      </select>
                      {!categoryId && <small className="text-muted">Please select a category first</small>}
                    </div>
                    <div className="col-md-4">
                      <div className="form-check mt-4">
                        <input 
                          type="checkbox" 
                          className="form-check-input" 
                          id="isActive"
                          checked={isActive} 
                          onChange={e => setIsActive(e.target.checked)}
                          disabled={loading}
                        />
                        <label className="form-check-label" htmlFor="isActive">
                          Product is Active
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                {/* Description */}
                {activeTab === 'desc' && (
                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea 
                      className={`form-control${errors.description ? ' is-invalid' : ''}`} 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      rows={6}
                      disabled={loading}
                    />
                    {errors.description && <div className="invalid-feedback d-block">{errors.description}</div>}
                  </div>
                )}
                {/* Specifications */}
                {activeTab === 'specs' && (
                  <div>
                    <label className="form-label">Specifications</label>
                    {specifications.map((spec, idx) => (
                      <div className="row mb-2" key={idx}>
                        <div className="col">
                          <input 
                            className="form-control" 
                            placeholder="Key" 
                            value={spec.key} 
                            onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                            disabled={loading}
                          />
                        </div>
                        <div className="col">
                          <input 
                            className="form-control" 
                            placeholder="Value" 
                            value={spec.value} 
                            onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                            disabled={loading}
                          />
                        </div>
                        <div className="col-auto">
                          <button 
                            type="button" 
                            className="btn btn-danger" 
                            onClick={() => removeSpec(idx)}
                            disabled={loading}
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={addSpec}
                      disabled={loading}
                    >
                      Add Specification
                    </button>
                  </div>
                )}
                {/* Dimensions */}
                {activeTab === 'dim' && (
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label">Length</label>
                      <input type="number" className="form-control" value={dimensions.length} onChange={e => handleDimensionChange('length', e.target.value)} disabled={loading} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Width</label>
                      <input type="number" className="form-control" value={dimensions.width} onChange={e => handleDimensionChange('width', e.target.value)} disabled={loading} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Height</label>
                      <input type="number" className="form-control" value={dimensions.height} onChange={e => handleDimensionChange('height', e.target.value)} disabled={loading} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Unit</label>
                      <select className="form-select" value={dimensions.unit} onChange={e => handleDimensionChange('unit', e.target.value)} disabled={loading}>
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                      </select>
                    </div>
                  </div>
                )}
                {/* Images */}
                {activeTab === 'img' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Main Image *</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className={`form-control${errors.mainImage ? ' is-invalid' : ''}`} 
                        onChange={handleMainImage}
                        disabled={loading}
                      />
                      {mainImagePreview && <img src={mainImagePreview} alt="Main" className="img-thumbnail mt-2" style={{ maxWidth: 120 }} />}
                      {errors.mainImage && <div className="invalid-feedback d-block">{errors.mainImage}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Gallery Images</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="form-control" 
                        multiple 
                        onChange={handleGallery}
                        disabled={loading}
                      />
                      <div className="d-flex flex-wrap mt-2">
                        {galleryPreview.map((img, idx) => (
                          <img key={idx} src={img} alt={`Gallery ${idx}`} className="img-thumbnail me-2 mb-2" style={{ maxWidth: 80 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {/* Logistics */}
                {activeTab === 'log' && (
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label">Length</label>
                      <input type="number" className="form-control" value={logistics.length} onChange={e => handleLogisticsChange('length', e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Width</label>
                      <input type="number" className="form-control" value={logistics.width} onChange={e => handleLogisticsChange('width', e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Height</label>
                      <input type="number" className="form-control" value={logistics.height} onChange={e => handleLogisticsChange('height', e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Weight</label>
                      <input type="number" className="form-control" value={logistics.weight} onChange={e => handleLogisticsChange('weight', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Warehouse</label>
                      <input className="form-control" value={logistics.warehouse} onChange={e => handleLogisticsChange('warehouse', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Country</label>
                      <input className="form-control" value={logistics.country} onChange={e => handleLogisticsChange('country', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">State</label>
                      <input className="form-control" value={logistics.state} onChange={e => handleLogisticsChange('state', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">City</label>
                      <input className="form-control" value={logistics.city} onChange={e => handleLogisticsChange('city', e.target.value)} />
                    </div>
                  </div>
                )}
                {/* Furniture */}
                {activeTab === 'furn' && (
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Material</label>
                      <input className="form-control" value={furniture.material} onChange={e => handleFurnitureChange('material', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Color</label>
                      <input className="form-control" value={furniture.color} onChange={e => handleFurnitureChange('color', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Style</label>
                      <input className="form-control" value={furniture.style} onChange={e => handleFurnitureChange('style', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Shape</label>
                      <input className="form-control" value={furniture.shape} onChange={e => handleFurnitureChange('shape', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Seating Capacity</label>
                      <input className="form-control" value={furniture.seating} onChange={e => handleFurnitureChange('seating', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Storage Included</label>
                      <input type="checkbox" className="form-check-input ms-2" checked={furniture.storage} onChange={e => handleFurnitureChange('storage', e.target.checked)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Assembly Required</label>
                      <input type="checkbox" className="form-check-input ms-2" checked={furniture.assembly} onChange={e => handleFurnitureChange('assembly', e.target.checked)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Warranty</label>
                      <input className="form-control" value={furniture.warranty} onChange={e => handleFurnitureChange('warranty', e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Country of Origin</label>
                      <input className="form-control" value={furniture.origin} onChange={e => handleFurnitureChange('origin', e.target.value)} />
                    </div>
                  </div>
                )}
                {/* SEO */}
                {activeTab === 'seo' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">SEO Title</label>
                      <input className="form-control" value={seo.title} onChange={e => handleSeoChange('title', e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">SEO Keywords</label>
                      <input className="form-control" value={seo.keywords} onChange={e => handleSeoChange('keywords', e.target.value)} />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">SEO Description</label>
                      <textarea className="form-control" value={seo.description} onChange={e => handleSeoChange('description', e.target.value)} rows={3} />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Canonical URL</label>
                      <input className="form-control" value={seo.canonical} onChange={e => handleSeoChange('canonical', e.target.value)} />
                    </div>
                  </div>
                )}
                <div className="mt-4 text-end">
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4 py-2 fs-5"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Product...
                      </>
                    ) : (
                      'Save Product'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
