import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductLogistics, addProductLogistics, updateProductLogistics } from '../../../../store/productLogisticsSlice';
import type { RootState, AppDispatch } from '../../../../store/store';

const ProductLogisticsTab: React.FC<{ productId: string }> = ({ productId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { logistics } = useSelector((state: RootState) => state.productLogistics);
  const [form, setForm] = useState({
    length: '', width: '', height: '', weight: '', warehouse_id: '', default_country: '', default_state: '', default_city: ''
  });

  useEffect(() => {
    dispatch(fetchProductLogistics(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (logistics) setForm({ ...logistics });
  }, [logistics]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (logistics) {
      dispatch(updateProductLogistics({ id: logistics.id, ...form }));
    } else {
      dispatch(addProductLogistics({ productId, ...form }));
    }
  };

  return (
    <form>
      <div className="row">
        <div className="col-md-3 mb-3">
          <label className="form-label">Length</label>
          <input type="text" className="form-control" name="length" value={form.length} onChange={handleChange} />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Width</label>
          <input type="text" className="form-control" name="width" value={form.width} onChange={handleChange} />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Height</label>
          <input type="text" className="form-control" name="height" value={form.height} onChange={handleChange} />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Weight</label>
          <input type="text" className="form-control" name="weight" value={form.weight} onChange={handleChange} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">Warehouse ID</label>
          <input type="text" className="form-control" name="warehouse_id" value={form.warehouse_id} onChange={handleChange} />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Default Country</label>
          <input type="text" className="form-control" name="default_country" value={form.default_country} onChange={handleChange} />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Default State</label>
          <input type="text" className="form-control" name="default_state" value={form.default_state} onChange={handleChange} />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Default City</label>
        <input type="text" className="form-control" name="default_city" value={form.default_city} onChange={handleChange} />
      </div>
      <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
    </form>
  );
};

export default ProductLogisticsTab;
