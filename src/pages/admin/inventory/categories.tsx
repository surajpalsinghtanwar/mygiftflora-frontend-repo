import AdminLayout from '../../../layouts/AdminLayout';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  banner?: string;
  meta_keyword?: string;
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
        const categoriesData = Array.isArray(data) ? data : data.data || [];
        setCategories(categoriesData);
        
        if (categoriesData.length > 0) {
          toast.success(`Loaded ${categoriesData.length} categories successfully`);
        }
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
  
  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/category/status/${id}`, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        toast.success('Category status updated');
        fetchCategories();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating status');
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
                        <th>Name</th>
                        <th>Banner</th>
                        <th>Meta Keyword</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td className="fw-semibold">{category.name}</td>
                          <td>
                            {category.banner ? (
                              <img 
                                src={`http://localhost:8000/${category.banner}`} 
                                alt={category.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                className="rounded border"
                              />
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>{category.meta_keyword || '-'}</td>
                          <td>
                              <span className={`badge ${category.status ? 'bg-success' : 'bg-danger'}`}> 
                                {category.status ? 'Active' : 'Inactive'}
                              </span>
                          </td>
                          <td>{new Date(category.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                title="Edit"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => window.location.href = `/admin/inventory/categories/edit/${category.id}`}
                              >
                                <FaEdit />
                              </button>
                              <button
                                type="button"
                                title="Toggle Status"
                                className="btn btn-outline-warning btn-sm"
                                onClick={() => handleToggleStatus(category.id, !category.status)}
                              >
                                {category.status ? (
                                  <FaToggleOn style={{ color: 'green' }} />
                                ) : (
                                  <FaToggleOff style={{ color: 'red' }} />
                                )}
                              </button>
                              <button
                                type="button"
                                title="Delete"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <FaTrash />
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