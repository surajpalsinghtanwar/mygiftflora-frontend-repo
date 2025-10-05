import AdminLayout from '../../../layouts/AdminLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface SubSubcategory {
  id: string;
  name: string;
  category_id: string;
  subcategory_id: string;
  banner?: string;
  status: boolean;
  created_at: string;
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
}

export default function SubSubcategories() {
  const [subsubcategories, setSubSubcategories] = useState<SubSubcategory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubSubcategories();
  }, []);

  const fetchSubSubcategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/admin/subsubcategories', {
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
        setSubSubcategories(Array.isArray(data) ? data : data.data || []);
      } else {
        toast.error('Failed to fetch subsubcategories');
      }
    } catch (error) {
      toast.error('Error fetching subsubcategories');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubSubcategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subsubcategory?')) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/subsubcategory/${id}`, {
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
        toast.success('SubSubcategory deleted successfully');
        fetchSubSubcategories(); // Refresh the list
      } else {
        toast.error('Failed to delete subsubcategory');
      }
    } catch (error) {
      toast.error('Error deleting subsubcategory');
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">SubSubcategories Management</h2>
          <Link href="/admin/inventory/subsubcategories/create" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Add New SubSubcategory
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
              {subsubcategories.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No subsubcategories found. Create your first subsubcategory!</p>
                  <Link href="/admin/inventory/subsubcategories/create" className="btn btn-primary">
                    Create SubSubcategory
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Banner</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subsubcategories.map((subsubcategory) => (
                        <tr key={subsubcategory.id}>
                          <td className="fw-semibold">{subsubcategory.name}</td>
                          <td>{subsubcategory.category?.name || '-'}</td>
                          <td>{subsubcategory.subcategory?.name || '-'}</td>
                          <td>
                            {subsubcategory.banner ? (
                              <img 
                                src={`http://localhost:8000/uploads/subsubcategories/${subsubcategory.banner}`} 
                                alt={subsubcategory.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                className="rounded"
                              />
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>
                            <span className={`badge ${subsubcategory.status ? 'bg-success' : 'bg-secondary'}`}>
                              {subsubcategory.status ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(subsubcategory.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Link href={`/admin/inventory/subsubcategories/edit/${subsubcategory.id}`} className="btn btn-outline-primary">
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button 
                                onClick={() => handleDeleteSubSubcategory(subsubcategory.id)}
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