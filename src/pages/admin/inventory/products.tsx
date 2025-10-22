import AdminLayout from '../../../layouts/AdminLayout';
import { useState, useEffect } from 'react';
import { getApiUrl, getUploadUrl } from '../../../utils/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

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
  mainImage?: string;
  status: boolean;
  created_at: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  // keep a full collection when backend returns all items (no pagination)
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(25);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (p?: number, limit?: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const currentPage = p ?? page;
      const currentPerPage = limit ?? perPage;
      // keep state in sync if caller passed explicit values
      setPage(currentPage);
      setPerPage(currentPerPage);

      const url = getApiUrl(`/admin/products?page=${currentPage}&limit=${currentPerPage}`);
      const response = await fetch(url, {
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
        const items = Array.isArray(data) ? data : data.data || [];

        // Determine whether server provided paged metadata
        let serverPaged = false;
        let serverTotal: number | null = null;

        if (!Array.isArray(data)) {
          if (data.meta && typeof data.meta.total === 'number') {
            serverPaged = true;
            serverTotal = data.meta.total;
          } else if (typeof data.total === 'number') {
            serverPaged = true;
            serverTotal = data.total;
          }
        }

        if (serverPaged) {
          // server handled pagination: set page items directly
          setProducts(items);
          setAllProducts(null);
          setTotal(serverTotal);
        } else {
          // fallback: server sent full list (or plain array) -> keep full list and paginate client-side
          setAllProducts(items);
          // compute total from full items
          setTotal(items.length);
          // slice current page items
          const start = (currentPage - 1) * currentPerPage;
          const pageItems = items.slice(start, start + currentPerPage);
          setProducts(pageItems);
        }
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
      const url = getApiUrl(`/admin/product/${id}`);
      const response = await fetch(url, {
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
        // Refresh the list for current page.
        if (allProducts) {
          // remove locally and re-slice
          const updated = allProducts.filter(p => p.id !== id);
          setAllProducts(updated);
          setTotal(updated.length);
          const start = (page - 1) * perPage;
          setProducts(updated.slice(start, start + perPage));
          // if current page is now out of range, go to previous
          const newTotalPages = Math.max(1, Math.ceil(updated.length / perPage));
          if (page > newTotalPages) goToPage(newTotalPages);
        } else {
          await fetchProducts(page, perPage); // server-side pagination
        }
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    try {
      const token = localStorage.getItem('access_token');
      const url = getApiUrl(`/admin/product/status/${id}`);
      const response = await fetch(url, {
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
        toast.success('Product status updated');
        // refresh list
        if (allProducts) {
          fetchProducts(page, perPage);
        } else {
          fetchProducts(page, perPage);
        }
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  // Pagination helpers
  const totalPages = total ? Math.max(1, Math.ceil(total / perPage)) : null;

  const goToPage = (p: number) => {
    if (p < 1) p = 1;
    if (totalPages && p > (totalPages || 1)) p = totalPages;
    setPage(p);
    // If we have allProducts cached, do client-side slice
    if (allProducts) {
      const start = (p - 1) * perPage;
      setProducts(allProducts.slice(start, start + perPage));
    } else {
      fetchProducts(p, perPage);
    }
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
    fetchProducts(1, newPerPage);
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
                        <th>Main Image</th>
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
                          <td>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(product.price || 0))}</td>
                          <td>{product.stock}</td>
                          <td>
                            <div className="fw-semibold">{product.category?.name || '-'}</div>
                          </td>
                          <td>
                            { (product.mainImage || (product as any).main_image) ? (
                              <img
                                src={getUploadUrl(String(product.mainImage || (product as any).main_image))}
                                alt={product.name}
                                style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, cursor: 'pointer' }}
                                onClick={() => setPreviewSrc(getUploadUrl(String(product.mainImage || (product as any).main_image)))}
                              />
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${product.status ? 'bg-success' : 'bg-secondary'}`}>
                              {product.status ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(product.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Link href={`/admin/inventory/products/edit/${product.id}`} className="btn btn-outline-primary btn-sm">
                                <FaEdit />
                              </Link>
                              <button 
                                onClick={() => handleToggleStatus(product.id, !product.status)}
                                type="button"
                                title="Toggle Status"
                                className="btn btn-outline-warning btn-sm"
                              >
                                {product.status ? (
                                  <FaToggleOn style={{ color: 'green' }} />
                                ) : (
                                  <FaToggleOff style={{ color: 'red' }} />
                                )}
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="btn btn-outline-danger btn-sm"
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
            {/* Pagination controls */}
            <div className="card-footer d-flex justify-content-between align-items-center">
              <div>

            {/* Image preview modal */}
            {previewSrc && (
              <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} onClick={() => setPreviewSrc(null)}>
                <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-content">
                    <div className="modal-body p-0">
                      <img src={previewSrc} alt="Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setPreviewSrc(null)}>Close</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
                <select value={perPage} onChange={(e) => handlePerPageChange(Number(e.target.value))} className="form-select d-inline-block w-auto">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div>
                <nav aria-label="Products pagination">
                  <ul className="pagination mb-0">
                    <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => goToPage(page - 1)}>Previous</button>
                    </li>
                    {totalPages && Array.from({ length: totalPages }).map((_, i) => {
                      const p = i + 1;
                      // limit rendering of many pages
                      if (totalPages > 10 && Math.abs(p - page) > 3 && p !== 1 && p !== totalPages) return null;
                      return (
                        <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => goToPage(p)}>{p}</button>
                        </li>
                      );
                    })}
                    <li className={`page-item ${totalPages && page >= (totalPages || 1) ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => goToPage(page + 1)}>Next</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}