import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchSubSubcategoryById, updateSubSubcategory } from '../../../store/subsubcategorySlice';
import { toast } from 'react-toastify';

const EditSubSubcategory: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { subcategories } = useSelector((state: RootState) => state.subcategories);
  const { currentSubSubcategory, loading, error } = useSelector(
    (state: RootState) => state.subSubcategories
  );

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [icon, setIcon] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);

  const filteredSubcategories = subcategories.filter(
    (sub) => sub.categoryId === categoryId
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSubSubcategoryById(id))
        .unwrap()
        .catch((error) => {
          toast.error('Failed to fetch sub-subcategory');
          navigate('/inventory/subsubcategories');
        });
    }
  }, [id, dispatch, navigate]);

  useEffect(() => {
    if (currentSubSubcategory) {
      setName(currentSubSubcategory.name);
      setCategoryId(currentSubSubcategory.categoryId);
      setSubcategoryId(currentSubSubcategory.subcategoryId);
      setIcon(currentSubSubcategory.icon || '');
      setCurrentImage(currentSubSubcategory.image || '');
    }
  }, [currentSubSubcategory]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await dispatch(updateSubSubcategory({
        id,
        data: {
          name,
          categoryId,
          subcategoryId,
          icon: icon || undefined,
          image: image || undefined,
        }
      })).unwrap();

      toast.success('Sub-subcategory updated successfully');
      navigate('/inventory/subsubcategories');
    } catch (error) {
      toast.error('Failed to update sub-subcategory');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-8">
          <div className="card shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title mb-0">Edit Sub-subcategory</h2>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/inventory/subsubcategories')}
                >
                  Back to Sub-subcategories
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Subcategory</label>
                  <select
                    className="form-select"
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    required
                    disabled={!categoryId}
                  >
                    <option value="">Select Subcategory</option>
                    {filteredSubcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Sub-subcategory Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Icon</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      placeholder="Select or enter FontAwesome class"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowIconPicker(!showIconPicker)}
                    >
                      Browse Icons
                    </button>
                  </div>
                  {icon && (
                    <div className="mt-2">
                      <label className="form-label">Icon Preview:</label>
                      <div className="border rounded p-3 d-inline-block">
                        <i className={icon} style={{ fontSize: '24px' }}></i>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Sub-subcategory Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  {(imagePreview || currentImage) && (
                    <div className="mt-2">
                      <label className="form-label">Image Preview:</label>
                      <div className="border rounded p-2" style={{ maxWidth: '200px' }}>
                        <img
                          src={imagePreview || currentImage}
                          alt="Sub-subcategory preview"
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <button type="submit" className="btn btn-primary me-2">
                    Update Sub-subcategory
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/inventory/subsubcategories')}
                  >
                    Cancel
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

export default EditSubSubcategory;
