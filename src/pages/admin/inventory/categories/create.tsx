import AdminLayout from '../../../../layouts/AdminLayout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CreateCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    banner: null as File | null,
  meta_keyword: '',
    meta_description: '',
    status: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
  formData.append('meta_keyword', form.meta_keyword);
      formData.append('meta_description', form.meta_description);
      formData.append('status', form.status.toString());
      
      if (form.banner) {
        formData.append('banner', form.banner);
      }

      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/admin/category', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Category created successfully');
        router.push('/admin/inventory/categories');
      } else {
        toast.error(data.message || 'Failed to create category');
      }
    } catch (error) {
      toast.error('Error creating category');
    } finally {
      setLoading(false);
    }
  };

  // Cake and gift flora related icons
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
    { value: '�', label: 'Bouquet' },
    { value: '🌿', label: 'Herb' },
    { value: '🍫', label: 'Chocolate' },
    { value: '�', label: 'Lollipop' },
    { value: '🍪', label: 'Cookie' },
    { value: '🥧', label: 'Pie' },
    { value: '�', label: 'Confetti Ball' },
    { value: '�', label: 'Party Popper' },
    { value: '💝', label: 'Gift with Ribbon' },
    { value: '�', label: 'Daisy' }
  ];

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Create New Category</h2>
          <Link href="/admin/inventory/categories" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Categories
          </Link>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <form onSubmit={handleSubmit}>              
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Banner Image <small className="text-muted ms-2" title="Recommended image size: 400×400">(Recommended: 400×400)</small></label>
                      <input
                        type="file"
                        name="banner"
                        className="form-control"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <div className="form-text">Optional: Upload banner image for this category</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Meta Keyword</label>
                      <input
                        type="text"
                        name="meta_keyword"
                        className="form-control"
                        value={form.meta_keyword}
                        onChange={handleChange}
                        placeholder="SEO keyword for this category"
                      />
                      <div className="form-text">Optional: For SEO purposes</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Category Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter category name"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Meta Description</label>
                      <textarea
                        name="meta_description"
                        className="form-control"
                        rows={2}
                        value={form.meta_description}
                        onChange={handleChange}
                        placeholder="SEO description for this category"
                      />
                      <div className="form-text">Optional: For SEO purposes</div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="status"
                          className="form-check-input"
                          checked={form.status}
                          onChange={handleChange}
                          id="status"
                        />
                        <label className="form-check-label fw-semibold" htmlFor="status">
                          Active Status
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Create Category
                        </>
                      )}
                    </button>
                    <Link href="/admin/inventory/categories" className="btn btn-outline-secondary">
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}