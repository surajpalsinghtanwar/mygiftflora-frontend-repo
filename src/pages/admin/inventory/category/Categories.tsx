import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { getUploadUrl } from '../../../../utils/api';

// Mock data for categories
const mockCategories = [
  { id: '1', name: 'Electronics', icon: '📱', banner: 'electronics.jpg', status: 'active' },
  { id: '2', name: 'Fashion', icon: '👔', banner: 'fashion.jpg', status: 'active' },
  { id: '3', name: 'Home & Garden', icon: '🏠', banner: 'home.jpg', status: 'active' },
  { id: '4', name: 'Sports', icon: '⚽', banner: 'sports.jpg', status: 'inactive' },
];

const Categories: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState(mockCategories);
  const [loading, setLoading] = useState(false);

  const handleEdit = (id: string) => {
    router.push(`/admin/inventory/categories/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully');
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Categories</h2>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/admin/inventory/categories/create')}
        >
          Create Category
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {loading && <div>Loading categories...</div>}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories && categories.length > 0 ? (
                  categories.map((cat: any) => (
                    <tr key={cat.id}>
                      <td>
                        {cat.banner ? (
                          <img src={getUploadUrl('categories', cat.banner)} alt={cat.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                        ) : (
                          <span className="text-muted">No image</span>
                        )}
                      </td>
                      <td>{cat.icon}</td>
                      <td>{cat.name}</td>
                      <td>{cat.status}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(cat.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(cat.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
