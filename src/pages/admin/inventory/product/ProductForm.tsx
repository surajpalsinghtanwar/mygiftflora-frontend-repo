import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, fetchProductById } from '../../../store/productSlice';
import type { RootState, AppDispatch } from '../../../store/store';
import ProductTabs from './ProductTabs';

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { currentProduct, loading, error } = useSelector((state: RootState) => state.products);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    market_price: '',
    selling_price: '',
    brand: '',
    status: 'active',
    thumbnail: '',
    likes: 0,
    views: 0,
    sales: 0,
    average_rating: 0,
    score: 0,
    breadcrumbs: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchProductById(id));
    }
  }, [isEdit, id, dispatch]);

  useEffect(() => {
    if (isEdit && currentProduct) {
      setForm({ ...currentProduct });
    }
  }, [isEdit, currentProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && id) {
        await dispatch(updateProduct({ id, data: form })).unwrap();
        navigate('/inventory/product');
      } else {
        await dispatch(createProduct(form)).unwrap();
        navigate('/inventory/product');
      }
    } catch (err) {
      // handle error
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Slug</label>
                  <input type="text" className="form-control" name="slug" value={form.slug} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" value={form.description} onChange={handleChange} required />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Market Price</label>
                    <input type="number" className="form-control" name="market_price" value={form.market_price} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Selling Price</label>
                    <input type="number" className="form-control" name="selling_price" value={form.selling_price} onChange={handleChange} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Brand</label>
                  <input type="text" className="form-control" name="brand" value={form.brand} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="status" value={form.status} onChange={handleChange} required>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Thumbnail URL</label>
                  <input type="text" className="form-control" name="thumbnail" value={form.thumbnail} onChange={handleChange} />
                </div>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Likes</label>
                    <input type="number" className="form-control" name="likes" value={form.likes} onChange={handleChange} />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Views</label>
                    <input type="number" className="form-control" name="views" value={form.views} onChange={handleChange} />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Sales</label>
                    <input type="number" className="form-control" name="sales" value={form.sales} onChange={handleChange} />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Avg. Rating</label>
                    <input type="number" className="form-control" name="average_rating" value={form.average_rating} onChange={handleChange} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Score</label>
                    <input type="number" className="form-control" name="score" value={form.score} onChange={handleChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Breadcrumbs</label>
                    <input type="text" className="form-control" name="breadcrumbs" value={form.breadcrumbs} onChange={handleChange} />
                  </div>
                </div>
                <div className="mt-4">
                  <button type="submit" className="btn btn-primary me-2">{isEdit ? 'Update' : 'Create'} Product</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/inventory/product')}>Cancel</button>
                </div>
              </form>
              <ProductTabs productId={id} isEdit={isEdit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
