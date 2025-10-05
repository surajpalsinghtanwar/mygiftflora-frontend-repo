import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchProductById, updateProduct } from '../../../store/productSlice';
import { toast } from 'react-toastify';

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.categories);
  const { subcategories } = useSelector((state: RootState) => state.subcategories);
  const { currentProduct, loading } = useSelector((state: RootState) => state.products);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' },
  ]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProduct) {
      setName(currentProduct.name);
      setDescription(currentProduct.description);
      setPrice(currentProduct.price.toString());
      setSalePrice(currentProduct.salePrice?.toString() || '');
      setCategoryId(currentProduct.categoryId);
      setSubcategoryId(currentProduct.subcategoryId || '');
      setSku(currentProduct.sku);
      setStock(currentProduct.stock.toString());
      setExistingImages(currentProduct.images);
      setIsActive(currentProduct.isActive);

      // Convert specifications object to array format
      const specsArray = Object.entries(currentProduct.specifications || {}).map(([key, value]) => ({
        key,
        value,
      }));
      setSpecifications(specsArray.length > 0 ? specsArray : [{ key: '', value: '' }]);
    }
  }, [currentProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setImages((prev) => [...prev, ...newImages]);

      // Create preview URLs
      const newPreviews = newImages.map((file) => URL.createObjectURL(file));
      setImagePreview((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreview((prev) => {
        URL.revokeObjectURL(prev[index]); // Clean up the URL
        return prev.filter((_, i) => i !== index);
      });
    }
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const specsObject = specifications.reduce((acc, curr) => {
      if (curr.key && curr.value) {
        acc[curr.key] = curr.value;
      }
      return acc;
    }, {} as Record<string, string>);

    try {
      await dispatch(updateProduct({
        id,
        name,
        description,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : undefined,
        categoryId,
        subcategoryId: subcategoryId || undefined,
        sku,
        stock: Number(stock),
        images: images.length > 0 ? images : undefined,
        specifications: specsObject,
        isActive,
      })).unwrap();

      toast.success('Product updated successfully');
      navigate('/inventory/products');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  if (loading || !currentProduct) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-8">
          <div className="card shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title mb-0">Edit Product</h2>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/inventory/products')}
                >
                  Back to Products
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Sale Price (Optional)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
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
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Subcategory</label>
                      <select
                        className="form-select"
                        value={subcategoryId}
                        onChange={(e) => setSubcategoryId(e.target.value)}
                      >
                        <option value="">Select Subcategory</option>
                        {subcategories
                          .filter((sub) => sub.categoryId === categoryId)
                          .map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">SKU</label>
                      <input
                        type="text"
                        className="form-control"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Images</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                  />
                  <div className="mt-2">
                    <label className="form-label">Existing Images:</label>
                    <div className="d-flex flex-wrap gap-2">
                      {existingImages.map((img, index) => (
                        <div key={`existing-${index}`} className="position-relative">
                          <img
                            src={img}
                            alt={`Product ${index + 1}`}
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                            onClick={() => handleRemoveImage(index, true)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="form-label">New Images:</label>
                    <div className="d-flex flex-wrap gap-2">
                      {imagePreview.map((preview, index) => (
                        <div key={`new-${index}`} className="position-relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                            onClick={() => handleRemoveImage(index, false)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Specifications</label>
                  {specifications.map((spec, index) => (
                    <div key={index} className="row mb-2">
                      <div className="col-5">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Key"
                          value={spec.key}
                          onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                        />
                      </div>
                      <div className="col-5">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Value"
                          value={spec.value}
                          onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        />
                      </div>
                      <div className="col-2">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeSpecification(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addSpecification}
                  >
                    Add Specification
                  </button>
                </div>

                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      Active Product
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <button type="submit" className="btn btn-primary me-2">
                    Update Product
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/inventory/products')}
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

export default EditProduct;
