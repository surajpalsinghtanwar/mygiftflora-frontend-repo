import React from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../layouts/AdminLayout';

const ContentManagementIndex: React.FC = () => {
  const router = useRouter();

  const contentModules = [
    {
      id: 'cms',
      title: 'Website Pages',
      description: 'Manage static pages like About Us, Privacy Policy, FAQ, Contact, etc.',
      icon: '📄',
      route: '/admin/content-management/cms',
      color: 'primary',
      stats: 'About, FAQ, Privacy, Contact'
    },
    {
      id: 'faq',
      title: 'FAQ Management',
      description: 'Create and manage frequently asked questions',
      icon: '❓',
      route: '/admin/content-management/faq',
      color: 'info',
      stats: 'Help & Support'
    },
    {
      id: 'policy',
      title: 'Policy Pages',
      description: 'Manage terms, privacy policy, and legal pages',
      icon: '📋',
      route: '/admin/content-management/policy',
      color: 'warning',
      stats: 'Legal & Terms'
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-4">
        <h2 className="h3 mb-2">📝 Website Content Management</h2>
        <p className="text-muted">Manage all your website content including pages like About Us, FAQ, Privacy Policy, Contact, and more</p>
      </div>

      <div className="row g-4">
        {contentModules.map((module) => (
          <div key={module.id} className="col-lg-4 col-md-6">
            <div 
              className="card h-100 border-0 shadow-sm hover-shadow cursor-pointer" 
              onClick={() => router.push(module.route)}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
              }}
            >
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <span 
                    className="display-4" 
                    role="img" 
                    aria-label={module.title}
                  >
                    {module.icon}
                  </span>
                </div>
                <h5 className="card-title mb-3">{module.title}</h5>
                <p className="card-text text-muted mb-3">
                  {module.description}
                </p>
                <span className={`badge bg-${module.color} fs-6`}>
                  {module.stats}
                </span>
              </div>
              <div className="card-footer bg-transparent border-0 text-center pb-4">
                <button 
                  className={`btn btn-outline-${module.color}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(module.route);
                  }}
                >
                  Manage {module.title}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-light border-0">
            <div className="card-body text-center py-5">
              <h4 className="text-muted mb-3">🚀 Quick Actions</h4>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/admin/content-management/cms/create')}
                >
                  🏢 Create About Us
                </button>
                <button 
                  className="btn btn-info"
                  onClick={() => router.push('/admin/content-management/cms/create')}
                >
                  ❓ Create FAQ
                </button>
                <button 
                  className="btn btn-warning"
                  onClick={() => router.push('/admin/content-management/cms/create')}
                >
                  🔒 Create Privacy Policy
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => router.push('/admin/content-management/cms/create')}
                >
                  � Create Contact Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 bg-primary text-white">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h5 className="text-white mb-2">💡 Website Content Tips</h5>
                  <ul className="mb-0 ps-3">
                    <li>Use templates for common pages like About Us, Privacy Policy, FAQ</li>
                    <li>Keep content updated and relevant to your business</li>
                    <li>Use SEO-friendly titles and descriptions for better search rankings</li>
                    <li>Preview pages before publishing to ensure proper formatting</li>
                  </ul>
                </div>
                <div className="col-md-4 text-end">
                  <span className="display-1 opacity-25">📝</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentManagementIndex;