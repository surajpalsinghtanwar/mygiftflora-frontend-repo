import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductSeo, updateProductSeo } from '../../../../store/productSeoSlice';
import type { RootState, AppDispatch } from '../../../../store/store';

const ProductSeoTab: React.FC<{ productId: string }> = ({ productId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { seo } = useSelector((state: RootState) => state.productSeo);
  const [form, setForm] = useState({
    seo_title: '', seo_description: '', seo_keywords: '', canonical_url: ''
  });

  useEffect(() => {
    dispatch(fetchProductSeo(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (seo) setForm({ ...seo });
  }, [seo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    dispatch(updateProductSeo({ productId, ...form }));
  };

  return (
    <form>
      <div className="mb-3">
        <label className="form-label">SEO Title</label>
        <input type="text" className="form-control" name="seo_title" value={form.seo_title} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">SEO Description</label>
        <textarea className="form-control" name="seo_description" value={form.seo_description} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">SEO Keywords</label>
        <input type="text" className="form-control" name="seo_keywords" value={form.seo_keywords} onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label">Canonical URL</label>
        <input type="text" className="form-control" name="canonical_url" value={form.canonical_url} onChange={handleChange} />
      </div>
      <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
    </form>
  );
};

export default ProductSeoTab;
