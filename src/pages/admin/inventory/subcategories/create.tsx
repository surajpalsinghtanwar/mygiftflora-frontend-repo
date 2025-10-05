import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../../layouts/AdminLayout';

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
  { value: '⛺', label: 'Tent' },
  { value: '🎨', label: 'Arts' },
  { value: '🖼️', label: 'Art' },
  { value: '🎵', label: 'Music' },
  { value: '⚙️', label: 'Settings' },
  { value: '🛠️', label: 'Tools' },
  { value: '🔧', label: 'Wrench' },
  { value: '🔩', label: 'Nut and Bolt' },
  { value: '📌', label: 'Pin' }
];

interface Category {
  id: string;
  name: string;
  icon?: string;
  status: boolean;
}

export default function CreateSubcategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    banner: null as File | null,
    icon: '📂',
    meta_title: '',
    meta_description: '',
    status: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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
      const response = await fetch('http://localhost:8000/api/admin/subcategory', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Subcategory created successfully!');
        router.push('/admin/inventory/subcategories');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create subcategory');
      }
    } catch (error) {
      toast.error('Error creating subcategory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Create New Subcategory</h3>
        <button 
          className="btn btn-secondary"
          onClick={() => router.push('/admin/inventory/subcategories')}
        >
          Back to Subcategories
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Subcategory Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category <span className="text-danger">*</span></label>
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
                  <label className="form-label">Icon</label>
                  <div className="mb-2">
                    <div className="d-flex flex-wrap gap-2" style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                      {subcategoryIcons.map((iconOption) => (
                        <button
                          key={iconOption.value}
                          type="button"
                          className={`btn ${form.icon === iconOption.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                          style={{ fontSize: '1.2rem', padding: '8px 12px' }}
                          title={iconOption.label}
                          onClick={() => setForm(prev => ({ ...prev, icon: iconOption.value }))}
                        >
                          {iconOption.value}
                        </button>
                      ))}
                    </div>
                  </div>
                  <small className="text-muted">
                    Selected: <span style={{ fontSize: '1.5rem' }}>{form.icon}</span> {subcategoryIcons.find(i => i.value === form.icon)?.label || form.icon}
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Banner Image</label>
                  <input
                    type="file"
                    name="banner"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {form.banner && (
                    <div className="mt-2">
                      <img 
                        src={URL.createObjectURL(form.banner)} 
                        alt="Preview" 
                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Meta Title</label>
                  <input
                    type="text"
                    name="meta_title"
                    className="form-control"
                    value={form.meta_title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Meta Description</label>
                  <textarea
                    name="meta_description"
                    className="form-control"
                    rows={4}
                    value={form.meta_description}
                    onChange={handleInputChange}
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
                      Active
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Subcategory'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => router.push('/admin/inventory/subcategories')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}