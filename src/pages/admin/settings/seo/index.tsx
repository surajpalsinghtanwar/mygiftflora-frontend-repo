import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../layouts/AdminLayout';
import toast from 'react-hot-toast';

interface SeoSettings {
  enabled: boolean;
  siteName: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterSite: string;
  twitterCreator: string;
  canonicalUrl: string;
  robotsTxt: string;
  sitemapEnabled: boolean;
  sitemapUrl: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  googleSearchConsoleId: string;
  facebookPixelId: string;
  bingWebmasterToolsId: string;
  schemaOrgType: string;
  schemaOrgData: string;
}

const SeoSettingsPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [settings, setSettings] = useState<SeoSettings>({
    enabled: true,
    siteName: 'EcommercePro',
    metaTitle: 'EcommercePro - Your Premier Shopping Destination',
    metaDescription: 'Discover amazing products at EcommercePro. Quality items, great prices, fast shipping.',
    metaKeywords: ['ecommerce', 'shopping', 'online store'],
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: '',
    twitterCreator: '',
    canonicalUrl: '',
    robotsTxt: 'User-agent: *\nAllow: /',
    sitemapEnabled: true,
    sitemapUrl: '/sitemap.xml',
    googleAnalyticsId: '',
    googleTagManagerId: '',
    googleSearchConsoleId: '',
    facebookPixelId: '',
    bingWebmasterToolsId: '',
    schemaOrgType: 'Organization',
    schemaOrgData: '',
  });

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  const fetchSeoSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/admin/settings/seo`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        // If data.data is null, keep the default settings
        if (data.data) {
          setSettings(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/admin/settings/seo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('SEO settings updated successfully!');
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      toast.error('Failed to update SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = () => {
    const newKeyword = prompt('Enter new keyword:');
    if (newKeyword && !settings.metaKeywords.includes(newKeyword.trim())) {
      setSettings({
        ...settings,
        metaKeywords: [...settings.metaKeywords, newKeyword.trim()]
      });
    }
  };

  const removeKeyword = (keyword: string) => {
    setSettings({
      ...settings,
      metaKeywords: settings.metaKeywords.filter(k => k !== keyword)
    });
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={() => router.push('/admin/settings')}
          >
            ← Back to Settings
          </button>
          <h2 className="h3 mb-0 text-primary d-flex align-items-center gap-2">
            <span role="img" aria-label="SEO">🔍</span> SEO & Analytics Settings
          </h2>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          form="seoSettingsForm"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          {/* Tab Navigation */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                📄 Basic SEO
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'social' ? 'active' : ''}`}
                onClick={() => setActiveTab('social')}
              >
                📱 Social Media
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'technical' ? 'active' : ''}`}
                onClick={() => setActiveTab('technical')}
              >
                ⚙️ Technical SEO
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                📊 Analytics
              </button>
            </li>
          </ul>

          <form id="seoSettingsForm" onSubmit={handleSubmit}>
            {/* Basic SEO Tab */}
            {activeTab === 'basic' && (
              <div className="tab-content">
                <h5 className="text-secondary mb-3">Basic SEO Settings</h5>
                
                <div className="row mb-4">
                  <div className="col-12 mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="seoEnabled"
                        checked={settings.enabled}
                        onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="seoEnabled">
                        <strong>Enable SEO Optimization</strong>
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Site Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Meta Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.metaTitle}
                      onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                      maxLength={60}
                      required
                    />
                    <small className="text-muted">
                      {settings.metaTitle.length}/60 characters
                    </small>
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">
                      Meta Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      value={settings.metaDescription}
                      onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                      rows={3}
                      maxLength={160}
                      required
                    />
                    <small className="text-muted">
                      {settings.metaDescription.length}/160 characters
                    </small>
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">Meta Keywords</label>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {settings.metaKeywords.map((keyword, index) => (
                        <span key={index} className="badge bg-secondary d-flex align-items-center gap-1">
                          {keyword}
                          <button
                            type="button"
                            className="btn-close btn-close-white"
                            style={{ fontSize: '0.6em' }}
                            onClick={() => removeKeyword(keyword)}
                          ></button>
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={addKeyword}
                    >
                      + Add Keyword
                    </button>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Canonical URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={settings.canonicalUrl}
                      onChange={(e) => setSettings({ ...settings, canonicalUrl: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="tab-content">
                <h5 className="text-secondary mb-3">Open Graph & Social Media</h5>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">OG Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.ogTitle}
                      onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
                      placeholder="Leave empty to use Meta Title"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">OG Type</label>
                    <select
                      className="form-select"
                      value={settings.ogType}
                      onChange={(e) => setSettings({ ...settings, ogType: e.target.value })}
                    >
                      <option value="website">Website</option>
                      <option value="article">Article</option>
                      <option value="product">Product</option>
                      <option value="business.business">Business</option>
                    </select>
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">OG Description</label>
                    <textarea
                      className="form-control"
                      value={settings.ogDescription}
                      onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
                      rows={3}
                      placeholder="Leave empty to use Meta Description"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">OG Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={settings.ogImage}
                      onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                      placeholder="https://example.com/og-image.jpg"
                    />
                    <small className="text-muted">
                      Recommended: 1200x630px
                    </small>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Twitter Card Type</label>
                    <select
                      className="form-select"
                      value={settings.twitterCard}
                      onChange={(e) => setSettings({ ...settings, twitterCard: e.target.value })}
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                      <option value="app">App</option>
                      <option value="player">Player</option>
                    </select>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Twitter Site Handle</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.twitterSite}
                      onChange={(e) => setSettings({ ...settings, twitterSite: e.target.value })}
                      placeholder="@yoursite"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Twitter Creator Handle</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.twitterCreator}
                      onChange={(e) => setSettings({ ...settings, twitterCreator: e.target.value })}
                      placeholder="@creator"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Technical SEO Tab */}
            {activeTab === 'technical' && (
              <div className="tab-content">
                <h5 className="text-secondary mb-3">Technical SEO</h5>
                
                <div className="row">
                  <div className="col-12 mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="sitemapEnabled"
                        checked={settings.sitemapEnabled}
                        onChange={(e) => setSettings({ ...settings, sitemapEnabled: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="sitemapEnabled">
                        <strong>Enable XML Sitemap</strong>
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Sitemap URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.sitemapUrl}
                      onChange={(e) => setSettings({ ...settings, sitemapUrl: e.target.value })}
                      placeholder="/sitemap.xml"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Schema.org Type</label>
                    <select
                      className="form-select"
                      value={settings.schemaOrgType}
                      onChange={(e) => setSettings({ ...settings, schemaOrgType: e.target.value })}
                    >
                      <option value="Organization">Organization</option>
                      <option value="LocalBusiness">Local Business</option>
                      <option value="Store">Store</option>
                      <option value="WebSite">Website</option>
                      <option value="OnlineStore">Online Store</option>
                    </select>
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">Robots.txt Content</label>
                    <textarea
                      className="form-control"
                      value={settings.robotsTxt}
                      onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
                      rows={6}
                      placeholder="User-agent: *&#10;Allow: /"
                    />
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">Custom Schema.org JSON-LD</label>
                    <textarea
                      className="form-control"
                      value={settings.schemaOrgData}
                      onChange={(e) => setSettings({ ...settings, schemaOrgData: e.target.value })}
                      rows={8}
                      placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
                    />
                    <small className="text-muted">
                      Enter valid JSON-LD structured data
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="tab-content">
                <h5 className="text-secondary mb-3">Analytics & Tracking</h5>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Google Analytics ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.googleAnalyticsId}
                      onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                      placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Google Tag Manager ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.googleTagManagerId}
                      onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
                      placeholder="GTM-XXXXXXX"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Google Search Console ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.googleSearchConsoleId}
                      onChange={(e) => setSettings({ ...settings, googleSearchConsoleId: e.target.value })}
                      placeholder="google-site-verification=..."
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Facebook Pixel ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.facebookPixelId}
                      onChange={(e) => setSettings({ ...settings, facebookPixelId: e.target.value })}
                      placeholder="123456789012345"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Bing Webmaster Tools ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.bingWebmasterToolsId}
                      onChange={(e) => setSettings({ ...settings, bingWebmasterToolsId: e.target.value })}
                      placeholder="msvalidate.01-..."
                    />
                  </div>
                </div>
                
                <div className="alert alert-info mt-3">
                  <h6 className="alert-heading">📊 Analytics Setup Guide</h6>
                  <ul className="mb-0">
                    <li><strong>Google Analytics:</strong> Create property at analytics.google.com</li>
                    <li><strong>Google Tag Manager:</strong> Set up container at tagmanager.google.com</li>
                    <li><strong>Search Console:</strong> Verify site at search.google.com/search-console</li>
                    <li><strong>Facebook Pixel:</strong> Create pixel at facebook.com/business/help</li>
                  </ul>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SeoSettingsPage;