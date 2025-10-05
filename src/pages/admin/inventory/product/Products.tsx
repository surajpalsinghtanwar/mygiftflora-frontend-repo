import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchProducts, deleteProduct } from '../../../store/productSlice';
import { toast } from 'react-toastify';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Debug logging to check the products data structure
  useEffect(() => {
    console.log('Products from state:', products);
    console.log('Is products array?', Array.isArray(products));
    if (Array.isArray(products) && products.length > 0) {
      console.log('First product:', products[0]);
    }
  }, [products]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error:</strong> {error}
        <button 
          className="btn btn-sm btn-outline-danger ms-2" 
          onClick={() => dispatch(fetchProducts())}
        >
          Retry
        </button>
      </div>
    );
  }

  if (error) {
    // Show warning above the table if there is an error
    return (
      <div>
        <div className="alert alert-warning text-center" role="alert">
          {typeof error === 'string' && error.includes('Network')
            ? 'Could not connect to backend. Showing cached or empty list.'
            : error}
        </div>
        <div className="container-fluid py-4">
          <div className="card">
            <div className="card-header pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h6>Products</h6>
                <button
                  className="btn btn-primary btn-sm mb-0"
                  onClick={() => navigate('/inventory/product/create')}
                >
                  Add New Product
                </button>
              </div>
            </div>
            <div className="card-body px-0 pt-0 pb-2">
              <div className="table-responsive p-0">
                <table className="table align-items-center mb-0">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>Selling Price</th>
                      <th>Stock</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!Array.isArray(products) || products.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          {!Array.isArray(products) ? 'Loading products...' : 'No products found.'}
                        </td>
                      </tr>
                    ) : (
                      products.map((product, index) => (
                          <tr key={product.id || index}>
                            <td>
                              <img
                                src={
                                  product.thumbnail 
                                    ? `/uploads/${product.thumbnail}` 
                                    : (product.images && product.images[0]) 
                                      ? `/uploads/${product.images[0]}` 
                                      : '/placeholder.jpg'
                                }
                                alt={product.name || 'Product image'}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.jpg';
                                }}
                              />
                            </td>
                            <td>{product.name || 'Unnamed Product'}</td>
                            <td>{product.sku || 'N/A'}</td>
                            <td>
                              <div>
                                <strong>${product.selling_price || product.price || '0.00'}</strong>
                                {product.market_price && product.market_price !== product.selling_price && (
                                  <div>
                                    <small className="text-muted text-decoration-line-through">
                                      Market: ${product.market_price}
                                    </small>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>{product.stock || 'N/A'}</td>
                            <td>{product.categoryId || 'N/A'}</td>
                            <td>
                              <span className={`badge ${
                                (product.status === 'active') ? 'bg-success' : 'bg-danger'
                              }`}>
                                {(product.status === 'active') ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          <td>
                            <button
                              className="btn btn-link text-secondary mb-0"
                              onClick={() => navigate(`/inventory/product/edit/${product.id}`)}
                            >
                              <i className="fa fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-link text-danger mb-0"
                              onClick={() => handleDelete(product.id)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="card">
        <div className="card-header pb-0">
          <div className="d-flex justify-content-between align-items-center">
            <h6>Products</h6>
            <button
              className="btn btn-primary btn-sm mb-0"
              onClick={() => navigate('/inventory/product/create')}
            >
              Add New Product
            </button>
          </div>
        </div>
        <div className="card-body px-0 pt-0 pb-2">
          <div className="table-responsive p-0">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!Array.isArray(products) || products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      {!Array.isArray(products) ? 'Loading products...' : 'No products found.'}
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={
                            product.thumbnail 
                              ? `/uploads/${product.thumbnail}` 
                              : (product.images && product.images[0]) 
                                ? `/uploads/${product.images[0]}` 
                                : '/placeholder.jpg'
                          }
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>${product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.categoryId}</td>
                      <td>
                        <span className={`badge ${product.isActive ? 'bg-success' : 'bg-danger'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-link text-secondary mb-0"
                          onClick={() => navigate(`/inventory/product/edit/${product.id}`)}
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-link text-danger mb-0"
                          onClick={() => handleDelete(product.id)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
