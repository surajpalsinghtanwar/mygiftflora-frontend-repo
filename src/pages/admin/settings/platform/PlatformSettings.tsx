import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import type { AppDispatch, RootState } from '../../../../store/store';
import {
  fetchPlatformSettings,
  updatePlatformSettings,
  clearError,
  clearSuccess,
} from '../../../../store/platformSettingsSlice';
import type {
  ContactInfo,
  SocialLinks,
  SeoSettings,
  ThemeSettings,
} from '../../../../types/platformSettings';
import AdminLayout from '../../../../layouts/AdminLayout';

const PlatformSettingsPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading, error, success, message } = useSelector(
    (state: RootState) => state.platformSettings
  );

  // Form state
  const [siteName, setSiteName] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [darkLogo, setDarkLogo] = useState<File | null>(null);
  const [siteUrl, setSiteUrl] = useState('');
  
  // File upload preview URLs
  const [logoPreview, setLogoPreview] = useState('');
  const [darkLogoPreview, setDarkLogoPreview] = useState('');

  // Active tab state
  const [activeTab, setActiveTab] = useState('basic');

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'darkLogo'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'logo') {
          setLogo(file);
          setLogoPreview(reader.result as string);
        } else {
          setDarkLogo(file);
          setDarkLogoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Contact Info
  const [contact, setContact] = useState<ContactInfo>({
    email: '',
    phone: '',
    address: '',
    supportEmail: '',
    supportPhone: '',
  });

  // Social Links
  const [social, setSocial] = useState<SocialLinks>({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
  });

  // SEO Settings
  const [seo, setSeo] = useState<SeoSettings>({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    ogImage: '',
    favicon: '',
  });

  // Theme Settings
  const [theme, setTheme] = useState<ThemeSettings>({
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    fontFamily: 'Arial, sans-serif',
    logoWidth: 150,
    logoHeight: 50,
  });

  // Maintenance Mode
  const [maintenance, setMaintenance] = useState({
    enabled: false,
    message: '',
  });

  useEffect(() => {
    dispatch(fetchPlatformSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setSiteName(settings.siteName);
      setSiteUrl(settings.siteUrl);
      setContact(settings.contact);
      setSocial(settings.social);
      setSeo(settings.seo);
      setTheme(settings.theme);
      if (settings.maintenance) {
        setMaintenance({
          enabled: settings.maintenance.enabled,
          message: settings.maintenance.message || '',
        });
      }
      
      // Set preview URLs for existing logos
      if (settings.logoUrl) {
        setLogoPreview(settings.logoUrl);
      }
      if (settings.darkLogoUrl) {
        setDarkLogoPreview(settings.darkLogoUrl);
      }
    }
  }, [settings]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create FormData instance to handle file uploads
      const formData = new FormData();
      
      // Append basic form fields
      formData.append('siteName', siteName);
      formData.append('siteUrl', siteUrl);
      
      // Append files if they exist
      if (logo) {
        formData.append('logo', logo);
      }
      if (darkLogo) {
        formData.append('darkLogo', darkLogo);
      }
      
      // Append other settings as JSON strings
      formData.append('contact', JSON.stringify(contact));
      formData.append('social', JSON.stringify(social));
      formData.append('seo', JSON.stringify(seo));
      formData.append('theme', JSON.stringify(theme));
      formData.append('maintenance', JSON.stringify(maintenance));
      
      // Log the request details
      console.log('Making PUT request to update platform settings');
      
      // Make the API call through Redux
      await dispatch(
        updatePlatformSettings(formData)
      ).unwrap();
    } catch (error) {
      // Error is handled by the useEffect
    }
  };

  if (loading && !settings) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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
            <span role="img" aria-label="Settings">⚙️</span> Platform Settings
          </h2>
        </div>
        <button
          type="submit"
          className="btn btn-primary px-4"
          disabled={loading}
          form="platformSettingsForm"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          {/* Tab Navigation */}
          <ul className="nav nav-tabs mb-4" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                🏢 Basic Info
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => setActiveTab('contact')}
              >
                📞 Contact
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
                className={`nav-link ${activeTab === 'seo' ? 'active' : ''}`}
                onClick={() => setActiveTab('seo')}
              >
                🔍 SEO
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'theme' ? 'active' : ''}`}
                onClick={() => setActiveTab('theme')}
              >
                🎨 Theme
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'maintenance' ? 'active' : ''}`}
                onClick={() => setActiveTab('maintenance')}
              >
                🔧 Maintenance
              </button>
            </li>
          </ul>

          <form id="platformSettingsForm" onSubmit={handleSubmit}>
            {/* Basic Settings Tab */}
            {activeTab === 'basic' && (
              <div className="tab-content">
                <h4 className="h5 mb-3">Basic Settings</h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Site Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Site URL <span className="text-danger">*</span>
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Logo</label>
                    <div className="d-flex gap-3 align-items-start">
                      <div className="flex-grow-1">
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'logo')}
                        />
                        <small className="text-muted d-block mt-1">
                          Recommended size: {theme.logoWidth}x{theme.logoHeight}px
                        </small>
                      </div>
                      {logoPreview && (
                        <div 
                          className="border rounded p-2" 
                          style={{width: '100px', height: '100px'}}
                        >
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="img-fluid"
                            style={{objectFit: 'contain', width: '100%', height: '100%'}}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Dark Logo</label>
                    <div className="d-flex gap-3 align-items-start">
                      <div className="flex-grow-1">
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'darkLogo')}
                        />
                        <small className="text-muted d-block mt-1">
                          For dark theme compatibility
                        </small>
                      </div>
                      {darkLogoPreview && (
                        <div 
                          className="border rounded p-2" 
                          style={{width: '100px', height: '100px'}}
                        >
                          <img
                            src={darkLogoPreview}
                            alt="Dark logo preview"
                            className="img-fluid"
                            style={{objectFit: 'contain', width: '100%', height: '100%'}}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information Tab */}
            {activeTab === 'contact' && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={contact.email}
                      onChange={(e) =>
                        setContact({ ...contact, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={contact.phone}
                      onChange={(e) =>
                        setContact({ ...contact, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      value={contact.address}
                      onChange={(e) =>
                        setContact({ ...contact, address: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Support Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={contact.supportEmail}
                      onChange={(e) =>
                        setContact({ ...contact, supportEmail: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Support Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={contact.supportPhone}
                      onChange={(e) =>
                        setContact({ ...contact, supportPhone: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h4 className="h5 mb-3">Social Links</h4>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Facebook</label>
                    <input
                      type="url"
                      className="form-control"
                      value={social.facebook}
                      onChange={(e) =>
                        setSocial({ ...social, facebook: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Twitter</label>
                    <input
                      type="url"
                      className="form-control"
                      value={social.twitter}
                      onChange={(e) =>
                        setSocial({ ...social, twitter: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Instagram</label>
                    <input
                      type="url"
                      className="form-control"
                      value={social.instagram}
                      onChange={(e) =>
                        setSocial({ ...social, instagram: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">LinkedIn</label>
                    <input
                      type="url"
                      className="form-control"
                      value={social.linkedin}
                      onChange={(e) =>
                        setSocial({ ...social, linkedin: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">YouTube</label>
                    <input
                      type="url"
                      className="form-control"
                      value={social.youtube}
                      onChange={(e) =>
                        setSocial({ ...social, youtube: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* SEO Settings */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h4 className="h5 mb-3">SEO Settings</h4>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Meta Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={seo.metaTitle}
                      onChange={(e) =>
                        setSeo({ ...seo, metaTitle: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Meta Keywords</label>
                    <input
                      type="text"
                      className="form-control"
                      value={seo.metaKeywords.join(', ')}
                      onChange={(e) =>
                        setSeo({
                          ...seo,
                          metaKeywords: e.target.value.split(',').map((k) => k.trim()),
                        })
                      }
                    />
                    <small className="text-muted">
                      Separate keywords with commas
                    </small>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Meta Description</label>
                    <textarea
                      className="form-control"
                      value={seo.metaDescription}
                      onChange={(e) =>
                        setSeo({ ...seo, metaDescription: e.target.value })
                      }
                      rows={3}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">OG Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={seo.ogImage}
                      onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Favicon URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={seo.favicon}
                      onChange={(e) =>
                        setSeo({ ...seo, favicon: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Theme Settings */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h4 className="h5 mb-3">Theme Settings</h4>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Primary Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color w-100"
                      value={theme.primaryColor}
                      onChange={(e) =>
                        setTheme({ ...theme, primaryColor: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Secondary Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color w-100"
                      value={theme.secondaryColor}
                      onChange={(e) =>
                        setTheme({ ...theme, secondaryColor: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Font Family</label>
                    <input
                      type="text"
                      className="form-control"
                      value={theme.fontFamily}
                      onChange={(e) =>
                        setTheme({ ...theme, fontFamily: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Logo Width (px)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={theme.logoWidth}
                      onChange={(e) =>
                        setTheme({
                          ...theme,
                          logoWidth: parseInt(e.target.value) || 150,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Logo Height (px)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={theme.logoHeight}
                      onChange={(e) =>
                        setTheme({
                          ...theme,
                          logoHeight: parseInt(e.target.value) || 50,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Maintenance Mode */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h4 className="h5 mb-3">Maintenance Mode</h4>
                  </div>
                  <div className="col-12 mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="maintenanceMode"
                        checked={maintenance.enabled}
                        onChange={(e) =>
                          setMaintenance({
                            ...maintenance,
                            enabled: e.target.checked,
                          })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="maintenanceMode"
                      >
                        Enable Maintenance Mode
                      </label>
                    </div>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Maintenance Message</label>
                    <textarea
                      className="form-control"
                      value={maintenance.message}
                      onChange={(e) =>
                        setMaintenance({
                          ...maintenance,
                          message: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="This site is under maintenance. Please check back later."
                    />
                  </div>
                </div>

                {/* Form section end */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettingsPage;
