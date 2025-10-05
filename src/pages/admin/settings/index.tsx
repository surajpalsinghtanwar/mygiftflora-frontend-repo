import React from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../layouts/AdminLayout';

const SettingsIndex: React.FC = () => {
  const router = useRouter();

  const settingsMenuItems = [
    {
      id: 'platform',
      title: 'Platform Settings',
      description: 'Configure site name, logo, contact info, and general platform settings',
      icon: '⚙️',
      path: '/admin/settings/platform',
      color: 'primary'
    },
    {
      id: 'email',
      title: 'Email Settings',
      description: 'Configure SMTP settings, email templates, and notifications',
      icon: '📧',
      path: '/admin/settings/email',
      color: 'info'
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Manage authentication, password policies, and security features',
      icon: '🔒',
      path: '/admin/settings/security',
      color: 'warning'
    },
    {
      id: 'payment',
      title: 'Payment Settings',
      description: 'Configure payment gateways, currencies, and billing settings',
      icon: '💳',
      path: '/admin/settings/payment',
      color: 'success'
    },
    {
      id: 'seo',
      title: 'SEO & Analytics',
      description: 'Configure SEO settings, meta tags, and analytics tracking',
      icon: '�',
      path: '/admin/settings/seo',
      color: 'info'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Manage third-party integrations and API settings',
      icon: '🔗',
      path: '/admin/settings/integrations',
      color: 'secondary'
    }
  ];

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0 text-primary d-flex align-items-center gap-2">
          <span role="img" aria-label="Settings">⚙️</span> Settings
        </h2>
      </div>

      <div className="row g-4">
        {settingsMenuItems.map((item) => (
          <div key={item.id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm hover-card">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className={`badge bg-${item.color} fs-5 p-2 me-3`}>
                    {item.icon}
                  </div>
                  <h5 className="card-title mb-0">{item.title}</h5>
                </div>
                <p className="card-text text-muted flex-grow-1">
                  {item.description}
                </p>
                <button
                  className={`btn btn-${item.color} btn-sm mt-auto`}
                  onClick={() => router.push(item.path)}
                >
                  Configure
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Settings Summary */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 bg-light">
            <div className="card-body">
              <h5 className="card-title d-flex align-items-center gap-2 mb-3">
                <span role="img" aria-label="Info">ℹ️</span> Settings Overview
              </h5>
              <div className="row">
                <div className="col-md-3 text-center mb-3">
                  <div className="h4 text-primary mb-1">🏢</div>
                  <div className="small text-muted">Platform</div>
                  <div className="fw-medium">Configured</div>
                </div>
                <div className="col-md-3 text-center mb-3">
                  <div className="h4 text-info mb-1">📧</div>
                  <div className="small text-muted">Email</div>
                  <div className="fw-medium">Not Set</div>
                </div>
                <div className="col-md-3 text-center mb-3">
                  <div className="h4 text-warning mb-1">🔒</div>
                  <div className="small text-muted">Security</div>
                  <div className="fw-medium">Default</div>
                </div>
                <div className="col-md-3 text-center mb-3">
                  <div className="h4 text-success mb-1">💳</div>
                  <div className="small text-muted">Payment</div>
                  <div className="fw-medium">Not Set</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hover-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </AdminLayout>
  );
};

export default SettingsIndex;