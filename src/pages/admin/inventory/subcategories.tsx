import AdminLayout from '../../../layouts/AdminLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
  categoryName?: string;
  icon?: string;
  banner?: string;
  status: boolean;
  created_at: string;
  category?: {
    id: string;
    name: string;
    icon?: string;
  };
}

export default function Subcategories() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/admin/subcategories', {
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/subcategory/${id}`, {
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
        toast.success('Subcategory deleted successfully');
        fetchSubcategories(); // Refresh the list
      } else {
        toast.error('Failed to delete subcategory');
      }
    } catch (error) {
      toast.error('Error deleting subcategory');
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Subcategories Management</h2>
          <Link href="/admin/inventory/subcategories/create" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Add New Subcategory
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
              {subcategories.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No subcategories found. Create your first subcategory!</p>
                  <Link href="/admin/inventory/subcategories/create" className="btn btn-primary">
                    Create Subcategory
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Icon</th>
                        <th>Banner</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subcategories.map((subcategory) => (
                        <tr key={subcategory.id}>
                          <td className="fw-semibold">{subcategory.name}</td>
                          <td>{subcategory.category?.name || subcategory.categoryName || '-'}</td>
                          <td>
                            {subcategory.icon ? (
                              <span style={{ fontSize: '1.5rem' }}>{subcategory.icon}</span>
                            ) : (
                              <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                📂
                              </div>
                            )}
                          </td>
                          <td>
                            {subcategory.banner ? (
                              <img 
                                src={`http://localhost:8000/uploads/subcategories/${subcategory.banner}`} 
                                alt={subcategory.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                className="rounded"
                              />
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>
                            <span className={`badge ${subcategory.status ? 'bg-success' : 'bg-secondary'}`}>
                              {subcategory.status ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(subcategory.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Link href={`/admin/inventory/subcategories/edit/${subcategory.id}`} className="btn btn-outline-primary">
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button 
                                onClick={() => handleDeleteSubcategory(subcategory.id)}
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