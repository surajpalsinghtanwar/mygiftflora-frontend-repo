import AdminLayout from '../../../../layouts/AdminLayout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';

const cakeAndFloralIcons = [
  { value: 'bi-cake2', label: 'Birthday Cake' },
  { value: 'bi-gift', label: 'Gift Box' },
  { value: 'bi-flower1', label: 'Flower' },
  { value: 'bi-balloon', label: 'Balloon' },
  { value: 'bi-heart', label: 'Heart' },
  { value: 'bi-star', label: 'Star' },
  { value: 'bi-trophy', label: 'Trophy' },
  { value: 'bi-gem', label: 'Gem' },
  { value: 'bi-balloon-heart', label: 'Heart Balloon' },
  { value: 'bi-gift-fill', label: 'Gift Filled' },
  { value: 'bi-heart-fill', label: 'Heart Filled' },
  { value: 'bi-star-fill', label: 'Star Filled' },
  { value: 'bi-suit-diamond', label: 'Diamond' },
  { value: 'bi-suit-heart', label: 'Heart Suit' },
  { value: 'bi-flower2', label: 'Flower 2' },
  { value: 'bi-flower3', label: 'Flower 3' },
  { value: 'bi-palette', label: 'Palette' },
  { value: 'bi-award', label: 'Award' },
  { value: 'bi-bookmark-heart', label: 'Bookmark Heart' },
  { value: 'bi-emoji-smile', label: 'Smile' }
];

export default function CreateCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    banner: null as File | null,
    icon: 'bi-cake2',
    meta_title: '',
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

      const response = await fetch('/api/categories', {
        method: 'POST',
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
                      <label className="form-label fw-semibold">Category Name *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Birthday Cakes, Wedding Flowers"
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Icon *</label>
                      <select
                        name="icon"
                        className="form-select"
                        value={form.icon}
                        onChange={handleChange}
                        required
                      >
                        {cakeAndFloralIcons.map(icon => (
                          <option key={icon.value} value={icon.value}>
                            {icon.label}
                          </option>
                        ))}
                      </select>
                      <div className="form-text">
                        Selected: <i className={form.icon}></i> {cakeAndFloralIcons.find(i => i.value === form.icon)?.label}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Banner Image</label>
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
                      <label className="form-label fw-semibold">Meta Title</label>
                      <input
                        type="text"
                        name="meta_title"
                        className="form-control"
                        value={form.meta_title}
                        onChange={handleChange}
                        placeholder="SEO title for this category"
                      />
                      <div className="form-text">Optional: For SEO purposes</div>
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