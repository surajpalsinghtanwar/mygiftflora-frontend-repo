import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import type { AppDispatch, RootState } from '../../../../store/store';
import { fetchCmsPages, deleteCmsPage, clearError, clearSuccess } from '../../../../store/cmsSlice';
import { PageType } from '../../../../types/cms';
import AdminLayout from '../../../../layouts/AdminLayout';

const CmsPagesList: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  // Safe destructuring with fallbacks
  const cmsState = useSelector((state: RootState) => state?.cms);
  const pages = cmsState?.pages || [];
  const loading = cmsState?.loading || false;
  const error = cmsState?.error || null;
  const success = cmsState?.success || false;
  const message = cmsState?.message || null;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchCmsPages());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert(`Error: ${error}`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success && message) {
      alert(`Success: ${message}`);
      dispatch(clearSuccess());
    }
  }, [success, message, dispatch]);

  const handleDelete = async (id: string, pageName: string) => {
    if (window.confirm(`Are you sure you want to delete "${pageName}"?`)) {
      try {
        await dispatch(deleteCmsPage(id)).unwrap();
      } catch (error) {
        // Error is already handled in useEffect
      }
    }
  };

  const filteredPages = pages.filter(page => {
    if (!page) return false;
    const pageType = page.page_type || page.pageType || 'static';
    const pageName = page.page_name || page.pageName || '';
    const isPublished = page.is_published ?? page.isPublished ?? false;
    
    const matchesSearch = pageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (page.category && page.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || pageType === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && isPublished) ||
                         (filterStatus === 'draft' && !isPublished);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0 text-primary d-flex align-items-center gap-2">
          <span role="img" aria-label="CMS">📄</span> CMS Pages
        </h2>
        <button 
          className="btn btn-primary"
          onClick={() => router.push('/admin/content-management/cms/create')}
        >
          <span role="img" aria-label="Add">➕</span> Add New Page
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {Object.values(PageType).map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-6 text-muted mb-3">📄</div>
          <h5 className="text-muted">No CMS pages found</h5>
          <p className="text-muted">Create your first page to get started</p>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/admin/content-management/cms/create')}
          >
            Create Page
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Page Name</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map(page => (
                  <tr key={page.id}>
                    <td>
                      <div className="fw-medium">{page.page_name || page.pageName}</div>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '200px' }}>
                        {page.title}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-info">
                        {((page.page_type || page.pageType) || 'static').charAt(0).toUpperCase() + ((page.page_type || page.pageType) || 'static').slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {page.category || 'None'}
                      </span>
                    </td>
                    <td className="text-muted">
                      {page.author || 'N/A'}
                    </td>
                    <td>
                      <span className={`badge ${(page.is_published ?? page.isPublished) ? 'bg-success' : 'bg-dark text-white'}`}>
                        {(page.is_published ?? page.isPublished) ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="text-muted">
                      {formatDate(page.created_at || page.createdAt)}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          title="Edit"
                          onClick={() => router.push(`/admin/content-management/cms/edit/${page.id}`)}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          title="Delete"
                          onClick={() => handleDelete(page.id, page.page_name || page.pageName || 'Unknown')}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-3 text-muted text-center">
        Showing {filteredPages.length} of {pages.length} pages
      </div>
    </AdminLayout>
  );
};

export default CmsPagesList;