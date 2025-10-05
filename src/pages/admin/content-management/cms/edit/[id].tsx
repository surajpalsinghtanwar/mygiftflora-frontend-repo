import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import type { AppDispatch, RootState } from '../../../../../store/store';
import { fetchCmsPageById, updateCmsPage, clearError, clearSuccess, clearCurrentPage } from '../../../../../store/cmsSlice';
import { PageType } from '../../../../../types/cms';
import AdminLayout from '../../../../../layouts/AdminLayout';
import RichTextEditor from '../../../../../components/RichTextEditor';

const EditCmsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  
  // Safe destructuring with fallbacks
  const cmsState = useSelector((state: RootState) => state?.cms);
  const currentPage = cmsState?.currentPage || null;
  const loading = cmsState?.loading || false;
  const error = cmsState?.error || null;
  const success = cmsState?.success || false;
  const message = cmsState?.message || null;

  const [formData, setFormData] = useState({
    pageName: '',
    slug: '',
    title: '',
    metaDescription: '',
    metaKeywords: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    pageType: 'static' as PageType,
    category: '',
    tags: '',
    author: '',
    isPublished: false,
  });

  const [formLoaded, setFormLoaded] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      dispatch(fetchCmsPageById(id));
    }
    
    return () => {
      dispatch(clearCurrentPage());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentPage && !formLoaded) {
      setFormData({
        pageName: currentPage.pageName || '',
        slug: currentPage.slug || '',
        title: currentPage.title || '',
        metaDescription: currentPage.metaDescription || '',
        metaKeywords: currentPage.metaKeywords ? currentPage.metaKeywords.join(', ') : '',
        content: currentPage.content || '',
        excerpt: currentPage.excerpt || '',
        featuredImage: currentPage.featuredImage || '',
        pageType: (currentPage.pageType as PageType) || 'static',
        category: currentPage.category || '',
        tags: currentPage.tags ? currentPage.tags.join(', ') : '',
        author: currentPage.author || '',
        isPublished: currentPage.isPublished || false,
      });
      setFormLoaded(true);
    }
  }, [currentPage, formLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto-generate slug from page name
      if (name === 'pageName') {
        const slug = value.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        setFormData(prev => ({ ...prev, slug }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || typeof id !== 'string') return;
    
    try {
      const pageData = {
        ...formData,
        metaKeywords: formData.metaKeywords ? formData.metaKeywords.split(',').map(k => k.trim()) : [],
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      };
      
      await dispatch(updateCmsPage({ id, page: pageData })).unwrap();
      alert('CMS page updated successfully!');
      router.push('/admin/content-management/cms');
    } catch (error) {
      // Error handled by useEffect
    }
  };

  React.useEffect(() => {
    if (error) {
      alert(`Error: ${error}`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  React.useEffect(() => {
    if (success && message) {
      alert(`Success: ${message}`);
      dispatch(clearSuccess());
    }
  }, [success, message, dispatch]);

  if (loading && !currentPage) {
    return (
      <AdminLayout>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading page...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!currentPage && !loading) {
    return (
      <AdminLayout>
        <div className="alert alert-danger">
          Page not found.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>✏️ Edit CMS Page: {currentPage?.pageName}</h3>
        <button 
          className="btn btn-secondary"
          onClick={() => router.push('/admin/content-management/cms')}
        >
          ← Back to CMS Pages
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Page Information</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Page Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="pageName"
                        className="form-control"
                        value={formData.pageName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter page name"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">URL Slug</label>
                      <input
                        type="text"
                        name="slug"
                        className="form-control"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="auto-generated-from-name"
                      />
                      <div className="form-text">URL-friendly version of the page name</div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label className="form-label">Page Title <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter page title for SEO"
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Page Type</label>
                      <select
                        name="pageType"
                        className="form-select"
                        value={formData.pageType}
                        onChange={handleInputChange}
                      >
                        {Object.values(PageType).map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        name="category"
                        className="form-control"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g., Company Info, Support, Legal"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Author</label>
                      <input
                        type="text"
                        name="author"
                        className="form-control"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="Content author name"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Excerpt/Summary</label>
                  <textarea
                    name="excerpt"
                    className="form-control"
                    rows={3}
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief summary of the page content"
                    maxLength={300}
                  />
                  <div className="form-text">
                    {formData.excerpt.length}/300 characters - Used in previews and search results
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Featured Image URL</label>
                  <input
                    type="url"
                    name="featuredImage"
                    className="form-control"
                    value={formData.featuredImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Meta Description</label>
                  <textarea
                    name="metaDescription"
                    className="form-control"
                    rows={3}
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    placeholder="Brief description for search engines (150-160 characters)"
                    maxLength={160}
                  />
                  <div className="form-text">
                    {formData.metaDescription.length}/160 characters
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Meta Keywords</label>
                  <input
                    type="text"
                    name="metaKeywords"
                    className="form-control"
                    value={formData.metaKeywords}
                    onChange={handleInputChange}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <div className="form-text">Separate keywords with commas</div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    className="form-control"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="tag1, tag2, tag3"
                  />
                  <div className="form-text">Separate tags with commas</div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Page Content <span className="text-danger">*</span></label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                    placeholder="Enter the page content..."
                    height="400px"
                  />
                  <div className="form-text mt-2">Use the rich text editor to format your content</div>
                </div>

                <div className="mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="isPublished"
                      className="form-check-input"
                      id="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="isPublished">
                      Publish this page
                    </label>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? '⏳ Updating...' : '✅ Update Page'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => router.push('/admin/content-management/cms')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h6 className="card-title mb-0">📊 Page Info</h6>
            </div>
            <div className="card-body">
              <div className="small">
                <div className="mb-2">
                  <strong>Created:</strong> 
                  <div className="text-muted">
                    {currentPage?.createdAt ? new Date(currentPage.createdAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
                <div className="mb-2">
                  <strong>Last Updated:</strong> 
                  <div className="text-muted">
                    {currentPage?.updatedAt ? new Date(currentPage.updatedAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
                <div className="mb-2">
                  <strong>Current Status:</strong> 
                  <span className={`badge ms-1 ${currentPage?.isPublished ? 'bg-success' : 'bg-warning'}`}>
                    {currentPage?.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h6 className="card-title mb-0">💡 Tips</h6>
            </div>
            <div className="card-body">
              <div className="small">
                <div className="mb-3">
                  <strong>Page Name:</strong> Internal reference name for the page
                </div>
                <div className="mb-3">
                  <strong>URL Slug:</strong> Will be used in the page URL. Keep it SEO-friendly
                </div>
                <div className="mb-3">
                  <strong>Page Types:</strong>
                  <ul className="mt-1">
                    <li><strong>Static:</strong> Regular pages (About, Contact)</li>
                    <li><strong>Landing:</strong> Campaign or promotional pages</li>
                    <li><strong>Blog:</strong> Blog posts and articles</li>
                    <li><strong>Policy:</strong> Terms, Privacy, etc.</li>
                    <li><strong>Help:</strong> FAQ and support pages</li>
                  </ul>
                </div>
                <div className="mb-3">
                  <strong>SEO Tips:</strong>
                  <ul className="mt-1">
                    <li>Keep title under 60 characters</li>
                    <li>Meta description should be 150-160 characters</li>
                    <li>Use relevant keywords naturally</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h6 className="card-title mb-0">📝 Preview</h6>
            </div>
            <div className="card-body">
              <div className="small">
                <div className="mb-2">
                  <strong>URL:</strong> 
                  <code className="ms-1">
                    /page/{formData.slug || 'page-slug'}
                  </code>
                </div>
                <div className="mb-2">
                  <strong>Title:</strong> {formData.title || 'Page Title'}
                </div>
                <div className="mb-2">
                  <strong>Type:</strong> 
                  <span className="badge bg-info ms-1">
                    {formData.pageType.charAt(0).toUpperCase() + formData.pageType.slice(1)}
                  </span>
                </div>
                <div>
                  <strong>Status:</strong> 
                  <span className={`badge ms-1 ${formData.isPublished ? 'bg-success' : 'bg-warning'}`}>
                    {formData.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditCmsPage;