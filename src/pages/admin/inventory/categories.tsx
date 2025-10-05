import AdminLayout from '../../../layouts/AdminLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  banner?: string;
  icon?: string;
  meta_title?: string;
  meta_description?: string;
  status: boolean;
  created_at: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
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
        // Your backend returns array directly, not wrapped in data property
        setCategories(Array.isArray(data) ? data : data.data || []);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      toast.error('Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/category/${id}`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        toast.success('Category deleted successfully');
        fetchCategories(); // Refresh the list
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      toast.error('Error deleting category');
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Categories Management</h2>
          <Link href="/admin/inventory/categories/create" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Add New Category
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body">
              {categories.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No categories found. Create your first category!</p>
                  <Link href="/admin/inventory/categories/create" className="btn btn-primary">
                    Create Category
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Icon</th>
                        <th>Name</th>
                        <th>Banner</th>
                        <th>Meta Title</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td>
                            {category.icon ? (
                              <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                            ) : (
                              <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                🎂
                              </div>
                            )}
                          </td>
                          <td className="fw-semibold">{category.name}</td>
                          <td>
                            {category.banner ? (
                              <img 
                                src={`http://localhost:8000/uploads/categories/${category.banner}`} 
                                alt={category.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                className="rounded"
                              />
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>{category.meta_title || '-'}</td>
                          <td>
                            <span className={`badge ${category.status ? 'bg-success' : 'bg-secondary'}`}>
                              {category.status ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(category.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Link href={`/admin/inventory/categories/edit/${category.id}`} className="btn btn-outline-primary">
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button 
                                onClick={() => handleDeleteCategory(category.id)}
                                className="btn btn-outline-danger"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}