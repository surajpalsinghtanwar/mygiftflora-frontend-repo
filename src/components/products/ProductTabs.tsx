import { useState } from 'react';

interface ProductTabsProps {
  productId: string;
}

export default function ProductTabs({ productId }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'bi-info-circle' },
    { id: 'pricing', label: 'Pricing', icon: 'bi-currency-dollar' },
    { id: 'inventory', label: 'Inventory', icon: 'bi-boxes' },
    { id: 'seo', label: 'SEO', icon: 'bi-search' },
    { id: 'images', label: 'Images', icon: 'bi-images' },
  ];

  return (
    <div className="mt-4">
      {/* Tab Navigation */}
      <ul className="nav nav-tabs" role="tablist">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id} role="presentation">
            <button
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              role="tab"
            >
              <i className={`${tab.icon} me-2`}></i>
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className="tab-content mt-3">
        <div className="tab-pane fade show active">
          {activeTab === 'basic' && (
            <div className="card">
              <div className="card-body">
                <h5>Basic Information</h5>
                <p>Product basic information will be managed here.</p>
                <div className="alert alert-info">
                  <strong>Note:</strong> This tab is for basic product details like name, description, category, etc.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="card">
              <div className="card-body">
                <h5>Pricing & Discounts</h5>
                <p>Manage product pricing, discounts, and special offers.</p>
                <div className="alert alert-info">
                  <strong>Note:</strong> This tab will handle price management, bulk pricing, discounts, etc.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="card">
              <div className="card-body">
                <h5>Inventory Management</h5>
                <p>Track stock levels, manage inventory, and set alerts.</p>
                <div className="alert alert-info">
                  <strong>Note:</strong> This tab manages stock quantities, reorder points, and inventory tracking.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="card">
              <div className="card-body">
                <h5>SEO Settings</h5>
                <p>Optimize product for search engines.</p>
                <div className="alert alert-info">
                  <strong>Note:</strong> This tab handles meta titles, descriptions, keywords, and URL slugs.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="card">
              <div className="card-body">
                <h5>Product Images</h5>
                <p>Upload and manage product images and gallery.</p>
                <div className="alert alert-info">
                  <strong>Note:</strong> This tab manages product images, image gallery, and image optimization.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}