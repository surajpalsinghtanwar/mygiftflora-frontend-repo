import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductSpecs, addProductSpec, updateProductSpec, deleteProductSpec } from '../../../../store/productSpecSlice';
import type { RootState, AppDispatch } from '../../../../store/store';

const ProductSpecsTab: React.FC<{ productId: string }> = ({ productId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { specs } = useSelector((state: RootState) => state.productSpecs);
  const [newSpec, setNewSpec] = useState({ spec_key: '', spec_value: '' });

  useEffect(() => {
    dispatch(fetchProductSpecs(productId));
  }, [dispatch, productId]);

  const handleAdd = () => {
    if (newSpec.spec_key && newSpec.spec_value) {
      dispatch(addProductSpec({ productId, ...newSpec }));
      setNewSpec({ spec_key: '', spec_value: '' });
    }
  };

  const handleUpdate = (id: string, key: string, value: string) => {
    dispatch(updateProductSpec({ id, spec_key: key, spec_value: value }));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteProductSpec(id));
  };

  return (
    <div>
      <div className="mb-3 d-flex">
        <input type="text" className="form-control me-2" value={newSpec.spec_key} onChange={e => setNewSpec(s => ({ ...s, spec_key: e.target.value }))} placeholder="Key" />
        <input type="text" className="form-control me-2" value={newSpec.spec_value} onChange={e => setNewSpec(s => ({ ...s, spec_value: e.target.value }))} placeholder="Value" />
        <button className="btn btn-primary" type="button" onClick={handleAdd}>Add</button>
      </div>
      <ul className="list-group">
        {specs.map((spec: any) => (
          <li key={spec.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{spec.spec_key}: {spec.spec_value}</span>
            <div>
              <button className="btn btn-sm btn-warning me-2" onClick={() => handleUpdate(spec.id, spec.spec_key, spec.spec_value)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(spec.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductSpecsTab;
