import AdminLayout from '../../../layouts/AdminLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  category?: {
    id: string;
    name: string;
  };
  subcategory?: {
    id: string;
    name: string;
  };
  status: boolean;
  created_at: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/admin/products', {
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
        setProducts(Array.isArray(data) ? data : data.data || []);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/admin/product/${id}`, {
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
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh the list
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Products Management</h2>
          <Link href="/admin/inventory/products/create" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Add New Product
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
              {products.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No products found. Create your first product!</p>
                  <Link href="/admin/inventory/products/create" className="btn btn-primary">
                    Create Product
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Name</th>
                        <th>SKU</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="fw-semibold">{product.name}</td>
                          <td>{product.sku || '-'}</td>
                          <td>${product.price}</td>
                          <td>{product.stock}</td>
                          <td>{product.category?.name || '-'}</td>
                          <td>{product.subcategory?.name || '-'}</td>
                          <td>
                            <span className={`badge ${product.status ? 'bg-success' : 'bg-secondary'}`}>
                              {product.status ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(product.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <Link href={`/admin/inventory/products/edit/${product.id}`} className="btn btn-outline-primary">
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
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