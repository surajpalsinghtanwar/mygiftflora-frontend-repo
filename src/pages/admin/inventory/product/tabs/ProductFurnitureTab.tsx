import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductFurniture, addProductFurniture, updateProductFurniture } from '../../../../store/productFurnitureSlice';
import type { RootState, AppDispatch } from '../../../../store/store';

const ProductFurnitureTab: React.FC<{ productId: string }> = ({ productId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { furniture } = useSelector((state: RootState) => state.productFurniture);
  const [form, setForm] = useState({
    material: '', color: '', depth: '', assembly_required: false, warranty: '', style: '', shape: '', seating_capacity: '', storage_included: false, country_of_origin: ''
  });

  useEffect(() => {
    dispatch(fetchProductFurniture(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (furniture) setForm({ ...furniture });
  }, [furniture]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    if (furniture) {
      dispatch(updateProductFurniture({ id: furniture.id, ...form }));
    } else {
      dispatch(addProductFurniture({ productId, ...form }));
    }
  };

  return (
    <form>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Material</label>
          <input type="text" className="form-control" name="material" value={form.material} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Color</label>
          <input type="text" className="form-control" name="color" value={form.color} onChange={handleChange} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Depth</label>
          <input type="text" className="form-control" name="depth" value={form.depth} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Assembly Required</label>
          <input type="checkbox" className="form-check-input" name="assembly_required" checked={form.assembly_required} onChange={handleChange} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Warranty</label>
          <input type="text" className="form-control" name="warranty" value={form.warranty} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Style</label>
          <input type="text" className="form-control" name="style" value={form.style} onChange={handleChange} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Shape</label>
          <input type="text" className="form-control" name="shape" value={form.shape} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Seating Capacity</label>
          <input type="text" className="form-control" name="seating_capacity" value={form.seating_capacity} onChange={handleChange} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Storage Included</label>
          <input type="checkbox" className="form-check-input" name="storage_included" checked={form.storage_included} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Country of Origin</label>
          <input type="text" className="form-control" name="country_of_origin" value={form.country_of_origin} onChange={handleChange} />
        </div>
      </div>
      <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
    </form>
  );
};

export default ProductFurnitureTab;
