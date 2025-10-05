import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../layouts/AdminLayout';
import toast from 'react-hot-toast';

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
  enabled: boolean;
}

const EmailSettingsPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<EmailSettings>({
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: '',
    replyToEmail: '',
    enabled: false,
  });

  // Helper function to safely update settings
  const updateSettings = (updates: Partial<EmailSettings>) => {
    const defaultSettings = {
      smtpHost: '',
      smtpPort: 587,
      smtpSecure: false,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: '',
      replyToEmail: '',
      enabled: false,
    };
    setSettings({ ...(settings || defaultSettings), ...updates });
  };

  useEffect(() => {
    fetchEmailSettings();
  }, []);

  const fetchEmailSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/admin/settings/email`, {
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
      console.error('Failed to fetch email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/admin/settings/email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Email settings updated successfully!');
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      toast.error('Failed to update email settings');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/admin/settings/email/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Email connection test successful!');
      } else {
        toast.error(`Connection test failed: ${data.message}`);
      }
    } catch (error) {
      alert('Connection test failed');
    } finally {
      setLoading(false);
    }
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
            <span role="img" aria-label="Email">📧</span> Email Settings
          </h2>
        </div>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-info"
            onClick={testConnection}
            disabled={loading}
          >
            Test Connection
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            form="emailSettingsForm"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <form id="emailSettingsForm" onSubmit={handleSubmit}>
            {/* Email Enable/Disable */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="emailEnabled"
                    checked={settings?.enabled || false}
                    onChange={(e) => updateSettings({ enabled: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="emailEnabled">
                    <strong>Enable Email Service</strong>
                  </label>
                </div>
                <small className="text-muted">
                  Turn on to enable email notifications and communications
                </small>
              </div>
            </div>

            {/* SMTP Configuration */}
            <div className="row mb-4">
              <div className="col-12">
                <h5 className="text-secondary mb-3">SMTP Configuration</h5>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  SMTP Host <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={settings?.smtpHost || ''}
                  onChange={(e) => updateSettings({ smtpHost: e.target.value })}
                  placeholder="smtp.gmail.com"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  SMTP Port <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={settings?.smtpPort || 587}
                  onChange={(e) => updateSettings({ smtpPort: parseInt(e.target.value) })}
                  placeholder="587"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  SMTP Username <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={settings?.smtpUser || ''}
                  onChange={(e) => updateSettings({ smtpUser: e.target.value })}
                  placeholder="your-email@gmail.com"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  SMTP Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={settings?.smtpPassword || ''}
                  onChange={(e) => updateSettings({ smtpPassword: e.target.value })}
                  placeholder="Your app password"
                  required
                />
              </div>
              <div className="col-12 mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="smtpSecure"
                    checked={settings?.smtpSecure || false}
                    onChange={(e) => updateSettings({ smtpSecure: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="smtpSecure">
                    Use SSL/TLS
                  </label>
                </div>
                <small className="text-muted">
                  Enable for secure email transmission (recommended)
                </small>
              </div>
            </div>

            {/* Email From Configuration */}
            <div className="row mb-4">
              <div className="col-12">
                <h5 className="text-secondary mb-3">Email From Configuration</h5>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  From Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={settings?.fromEmail || ''}
                  onChange={(e) => updateSettings({ fromEmail: e.target.value })}
                  placeholder="noreply@yoursite.com"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  From Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={settings?.fromName || ''}
                  onChange={(e) => updateSettings({ fromName: e.target.value })}
                  placeholder="Your Site Name"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Reply To Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={settings?.replyToEmail || ''}
                  onChange={(e) => updateSettings({ replyToEmail: e.target.value })}
                  placeholder="support@yoursite.com"
                />
              </div>
            </div>

            {/* Email Templates Preview */}
            <div className="row">
              <div className="col-12">
                <h5 className="text-secondary mb-3">Email Templates</h5>
                <div className="alert alert-info">
                  <strong>ℹ️ Info:</strong> Email templates will be managed separately. 
                  Configure SMTP settings here to enable email functionality.
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EmailSettingsPage;