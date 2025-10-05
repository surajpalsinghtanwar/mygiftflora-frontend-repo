import AdminLayout from '../../../../../layouts/AdminLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const subcategoryIcons = [
  { value: '📂', label: 'Folder' },
  { value: '🗂️', label: 'Card Index' },
  { value: '📋', label: 'Clipboard' },
  { value: '🏷️', label: 'Label' },
  { value: '🔖', label: 'Bookmark' },
  { value: '⭐', label: 'Star' },
  { value: '💼', label: 'Briefcase' },
  { value: '🎯', label: 'Target' },
  { value: '📦', label: 'Package' },
  { value: '🏪', label: 'Store' },
  { value: '🛍️', label: 'Shopping Bags' },
  { value: '🎪', label: 'Tent' },
  { value: '🎭', label: 'Arts' },
  { value: '🎨', label: 'Art' },
  { value: '🎵', label: 'Music' },
  { value: '⚙️', label: 'Settings' },
  { value: '🛠️', label: 'Tools' },
  { value: '🔧', label: 'Wrench' },
  { value: '🔩', label: 'Nut and Bolt' },
  { value: '📍', label: 'Pin' }
];

interface Category {
  id: string;
  name: string;
  icon?: string;
  status: boolean;
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
  icon?: string;
  banner?: string;
  status: boolean;
}

export default function EditSubcategory() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    icon: '📂',
    banner: null as File | null,
    meta_title: '',
    meta_description: '',
    status: true,
  });

  useEffect(() => {
    if (id) {
      fetchSubcategory();
      fetchCategories();
    }
  }, [id]);

  const fetchSubcategory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/subcategory/${id}`, {
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
        const subcategoryData = Array.isArray(data) ? data[0] : data;
        setSubcategory(subcategoryData);
        setForm({
          name: subcategoryData.name || '',
          category_id: subcategoryData.category_id || subcategoryData.categoryId || '',
          icon: subcategoryData.icon || '📂',
          banner: null,
          meta_title: subcategoryData.meta_title || subcategoryData.meta_keyword || '',
          meta_description: subcategoryData.meta_description || '',
          status: subcategoryData.status || true,
        });
      } else {
        toast.error('Failed to fetch subcategory');
        router.push('/admin/inventory/subcategories');
      }
    } catch (error) {
      toast.error('Error fetching subcategory');
      router.push('/admin/inventory/subcategories');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/admin/categories', {
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
        setCategories(Array.isArray(data) ? data : data.data || []);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      toast.error('Error fetching categories');
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
      toast.error('Subcategory name is required');
      return;
    }
    
    if (!form.category_id) {
      toast.error('Please select a category');
      return;
    }
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category_id', form.category_id);
      formData.append('icon', form.icon);
      formData.append('meta_title', form.meta_title);
      formData.append('meta_description', form.meta_description);
      formData.append('status', form.status.toString());
      
      if (form.banner) {
        formData.append('banner', form.banner);
      }

      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/subcategory/${id}`, {
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
        toast.success('Subcategory updated successfully');
        router.push('/admin/inventory/subcategories');
      } else {
        toast.error(data.message || 'Failed to update subcategory');
      }
    } catch (error) {
      toast.error('Error updating subcategory');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !subcategory) {
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
          <h2 className="fw-bold">Edit Subcategory</h2>
          <button 
            onClick={() => router.push('/admin/inventory/subcategories')}
            className="btn btn-outline-secondary"
          >
            Back to Subcategories
          </button>
        </div>

        {subcategory && (
          <div className="card shadow">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Parent Category <span className="text-danger">*</span>
                      </label>
                      <select
                        name="category_id"
                        className="form-select"
                        value={form.category_id}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                                     {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Subcategory Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={form.name}
                        onChange={handleInputChange}
                        placeholder="Enter subcategory name"
                        required
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
                        {subcategoryIcons.map(icon => (
                          <option key={icon.value} value={icon.value}>
                            {icon.value} {icon.label}
                          </option>
                        ))}
                      </select>
                      <div className="form-text">
                        Selected: <span style={{ fontSize: '1.5rem' }}>{form.icon}</span> {subcategoryIcons.find(i => i.value === form.icon)?.label}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Banner Image</label>
                      {subcategory.banner && (
                        <div className="mb-2">
                          <img 
                            src={`http://localhost:8000/uploads/subcategories/${subcategory.banner}`}
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
                        placeholder="SEO title for this subcategory"
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
                    {loading ? 'Updating...' : 'Update Subcategory'}
                  </button>
                  <button 
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={() => router.push('/admin/inventory/subcategories')}
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