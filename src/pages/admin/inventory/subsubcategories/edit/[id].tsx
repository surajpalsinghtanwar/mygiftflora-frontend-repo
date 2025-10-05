import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../../../layouts/AdminLayout';

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
  status: boolean;
}

interface SubSubcategory {
  id: string;
  name: string;
  category_id: string;
  subcategory_id: string;
  banner?: string;
  status: boolean;
}

export default function EditSubSubcategory() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [subsubcategory, setSubSubcategory] = useState<SubSubcategory | null>(null);
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    subcategory_id: '',
    banner: null as File | null,
    status: true,
  });

  useEffect(() => {
    if (id) {
      fetchSubSubcategory();
      fetchCategories();
    }
  }, [id]);

  useEffect(() => {
    if (form.category_id) {
      fetchSubcategories(form.category_id);
    } else {
      setSubcategories([]);
      setForm(prev => ({ ...prev, subcategory_id: '' }));
    }
  }, [form.category_id]);

  const fetchSubSubcategory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/subsubcategory/${id}`, {
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
        const subsubcategoryData = Array.isArray(data) ? data[0] : data;
        setSubSubcategory(subsubcategoryData);
        setForm({
          name: subsubcategoryData.name || '',
          category_id: subsubcategoryData.category_id || '',
          subcategory_id: subsubcategoryData.subcategory_id || '',
          banner: null,
          status: subsubcategoryData.status || true,
        });
      } else {
        toast.error('Failed to fetch subsubcategory');
      }
    } catch (error) {
      toast.error('Error fetching subsubcategory');
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

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/subcategories?category_id=${categoryId}`, {
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
        setSubcategories(Array.isArray(data) ? data : data.data || []);
      } else {
        toast.error('Failed to fetch subcategories');
      }
    } catch (error) {
      toast.error('Error fetching subcategories');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      toast.error('SubSubcategory name is required');
      return;
    }
    
    if (!form.category_id) {
      toast.error('Please select a category');
      return;
    }

    if (!form.subcategory_id) {
      toast.error('Please select a subcategory');
      return;
    }
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category_id', form.category_id);
      formData.append('subcategory_id', form.subcategory_id);
      formData.append('status', form.status.toString());
      
      if (form.banner) {
        formData.append('banner', form.banner);
      }

      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/subsubcategory/${id}`, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      });

      if (response.ok) {
        toast.success('SubSubcategory updated successfully!');
        router.push('/admin/inventory/subsubcategories');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update subsubcategory');
      }
    } catch (error) {
      toast.error('Error updating subsubcategory');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !subsubcategory) {
    return (
      <AdminLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Edit SubSubcategory</h3>
        <button 
          className="btn btn-secondary"
          onClick={() => router.push('/admin/inventory/subsubcategories')}
        >
          Back to SubSubcategories
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">SubSubcategory Name <span className="text-danger">*</span></label>
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
                  <label className="form-label">Subcategory <span className="text-danger">*</span></label>
                  <select
                    name="subcategory_id"
                    className="form-select"
                    value={form.subcategory_id}
                    onChange={handleInputChange}
                    required
                    disabled={!form.category_id}
                  >
                    <option value="">Select a subcategory</option>
                    {subcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                  {!form.category_id && (
                    <div className="form-text text-muted">Please select a category first</div>
                  )}
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
                  {subsubcategory?.banner && !form.banner && (
                    <div className="mt-2">
                      <p className="text-muted mb-2">Current banner:</p>
                      <img 
                        src={`http://localhost:8000/uploads/subsubcategories/${subsubcategory.banner}`} 
                        alt="Current banner" 
                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                  {form.banner && (
                    <div className="mt-2">
                      <p className="text-muted mb-2">New banner preview:</p>
                      <img 
                        src={URL.createObjectURL(form.banner)} 
                        alt="Preview" 
                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
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
                {loading ? 'Updating...' : 'Update SubSubcategory'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => router.push('/admin/inventory/subsubcategories')}
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