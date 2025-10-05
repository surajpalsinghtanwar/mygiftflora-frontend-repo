import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductTags, addProductTag, deleteProductTag } from '../../../../store/productTagSlice';
import type { RootState, AppDispatch } from '../../../../store/store';

const ProductTagsTab: React.FC<{ productId: string }> = ({ productId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tags } = useSelector((state: RootState) => state.productTags);
  const [tag, setTag] = useState('');

  useEffect(() => {
    dispatch(fetchProductTags(productId));
  }, [dispatch, productId]);

  const handleAdd = () => {
    if (tag.trim()) {
      dispatch(addProductTag({ productId, tag }));
      setTag('');
    }
  };

  const handleDelete = (tag: string) => {
    dispatch(deleteProductTag({ productId, tag }));
  };

  return (
    <div>
      <div className="mb-3 d-flex">
        <input type="text" className="form-control me-2" value={tag} onChange={e => setTag(e.target.value)} placeholder="Add tag" />
        <button className="btn btn-primary" type="button" onClick={handleAdd}>Add</button>
      </div>
      <ul className="list-group">
        {tags.map((t: any) => (
          <li key={t.tag} className="list-group-item d-flex justify-content-between align-items-center">
            {t.tag}
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.tag)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductTagsTab;
