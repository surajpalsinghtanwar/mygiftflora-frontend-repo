import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../../layouts/AdminLayout';

interface Category {
  id: string;
  name: string;
  icon: string;
  banner?: string;
  meta_title: string;
  meta_description: string;
  status: boolean;
}

const EditCategory: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({
    name: '',
    icon: '🎂',
    banner: null as File | null,
    meta_title: '',
    meta_description: '',
    status: true,
  });
  
  // Emoji icons for cake and floral business - same as create.tsx
  const iconOptions = [
    { value: '🎂', label: 'Birthday Cake' },
    { value: '🧁', label: 'Cupcake' },
    { value: '🍰', label: 'Cake Slice' },
    { value: '🎈', label: 'Balloon' },
    { value: '🎁', label: 'Gift Box' },
    { value: '🌹', label: 'Rose' },
    { value: '🌸', label: 'Cherry Blossom' },
    { value: '🌺', label: 'Hibiscus' },
    { value: '🌻', label: 'Sunflower' },
    { value: '🌷', label: 'Tulip' },
    { value: '💐', label: 'Bouquet' },
    { value: '🌿', label: 'Herb' },
    { value: '🍫', label: 'Chocolate' },
    { value: '🍭', label: 'Lollipop' },
    { value: '🍪', label: 'Cookie' },
    { value: '🥧', label: 'Pie' },
    { value: '🎊', label: 'Confetti Ball' },
    { value: '🎉', label: 'Party Popper' },
    { value: '💝', label: 'Gift with Ribbon' },
    { value: '🌼', label: 'Daisy' }
  ];

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/category/${id}`, {
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        const categoryData = Array.isArray(data) ? data[0] : data;
        setCategory(categoryData);
        setForm({
          name: categoryData.name || '',
          icon: categoryData.icon || '🎂',
          banner: null,
          meta_title: categoryData.meta_title || '',
          meta_description: categoryData.meta_description || '',
          status: categoryData.status || true,
        });
      } else {
        toast.error('Failed to fetch category');
        router.push('/admin/inventory/categories');
      }
    } catch (error) {
      toast.error('Error fetching category');
      router.push('/admin/inventory/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, banner: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('icon', form.icon);
      formData.append('meta_title', form.meta_title);
      formData.append('meta_description', form.meta_description);
      formData.append('status', form.status.toString());
      
      if (form.banner) {
        formData.append('banner', form.banner);
      }

      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/category/${id}`, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Category updated successfully');
        router.push('/admin/inventory/categories');
      } else {
        toast.error(data.message || 'Failed to update category');
      }
    } catch (error) {
      toast.error('Error updating category');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !category) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Edit Category</h2>
          <button 
            onClick={() => router.push('/admin/inventory/categories')}
            className="btn btn-outline-secondary"
          >
            Back to Categories
          </button>
        </div>

        {category && (
          <div className="card shadow">
            <div className="card-body">

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter category name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Icon *</label>
                  <select
                    name="icon"
                    className="form-select"
                    value={form.icon}
                    onChange={handleInputChange}
                    required
                  >
                    {iconOptions.map(icon => (
                      <option key={icon.value} value={icon.value}>
                        {icon.value} {icon.label}
                      </option>
                    ))}
                  </select>
                  <div className="form-text">
                    Selected: <span style={{ fontSize: '1.5rem' }}>{form.icon}</span> {iconOptions.find(i => i.value === form.icon)?.label}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Banner Image</label>
                  {category && category.banner && (
                    <div className="mb-2">
                      <img 
                        src={`http://localhost:8000/uploads/categories/${category.banner}`}
                        alt="Current banner"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        className="rounded border"
                      />
                      <small className="d-block text-muted">Current banner</small>
                    </div>
                  )}
                  <input
                    type="file"
                    name="banner"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted">Upload new banner image (optional)</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Meta Title</label>
                  <input
                    type="text"
                    name="meta_title"
                    className="form-control"
                    value={form.meta_title}
                    onChange={handleInputChange}
                    placeholder="SEO title for this category"
                  />
                  <div className="form-text">Optional: For SEO purposes</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Meta Description</label>
                  <textarea
                    name="meta_description"
                    className="form-control"
                    rows={3}
                    value={form.meta_description}
                    onChange={handleInputChange}
                    placeholder="SEO meta description (optional)"
                  />
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="status"
                      className="form-check-input"
                      id="status"
                      checked={form.status}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="status">
                      Active Status
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4 me-2"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Category'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={() => router.push('/admin/inventory/categories')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditCategory;
