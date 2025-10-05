import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../../../layouts/AdminLayout';

const bootstrapIcons = [
  'bi-cake2', 'bi-gift', 'bi-flower1', 'bi-heart', 'bi-balloon', 'bi-star', 
  'bi-cup-hot', 'bi-emoji-smile', 'bi-box-seam', 'bi-basket', 'bi-candy',
  'bi-shop', 'bi-bag', 'bi-cart', 'bi-trophy', 'bi-gem'
];

interface Category {
  id: string;
  name: string;
  icon: string;
  banner?: string;
  meta_title: string;
  meta_description: string;
  status: boolean;
}

export default function EditCategory() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({
    name: '',
    icon: 'bi-cake2',
    banner: null as File | null,
    meta_title: '',
    meta_description: '',
    status: true,
  });

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
          icon: categoryData.icon || 'bi-cake2',
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Category Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="Enter category name"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Icon <span className="text-danger">*</span>
                      </label>
                      <div className="d-flex flex-wrap gap-2 mb-2 p-3 border rounded">
                        {bootstrapIcons.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            className={`btn ${form.icon === icon ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={{ fontSize: '20px', width: '50px', height: '50px' }}
                            onClick={() => setForm(prev => ({ ...prev, icon }))}
                          >
                            <i className={icon}></i>
                          </button>
                        ))}
                      </div>
                      <small className="text-muted">Selected: <i className={form.icon}></i> {form.icon}</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Banner Image</label>
                      {category.banner && (
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
                  </div>

                  <div className="col-md-6">
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
                      <div className="form-text">Optional: For SEO purposes</div>
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
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4"
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
}