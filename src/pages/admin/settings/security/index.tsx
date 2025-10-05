import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../layouts/AdminLayout';
import toast from 'react-hot-toast';

interface SecuritySettings {
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecialChars: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  twoFactorEnabled: boolean;
  ipWhitelist: string[];
  enableAuditLog: boolean;
  forcePasswordChange: number;
}

const SecuritySettingsPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SecuritySettings>({
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorEnabled: false,
    ipWhitelist: [],
    enableAuditLog: true,
    forcePasswordChange: 90,
  });

  const [newIp, setNewIp] = useState('');

  // Helper function to safely update settings
  const updateSettings = (updates: Partial<SecuritySettings>) => {
    const defaultSettings = {
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireLowercase: true,
      passwordRequireNumbers: true,
      passwordRequireSpecialChars: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      twoFactorEnabled: false,
      ipWhitelist: [],
      enableAuditLog: true,
      forcePasswordChange: 90,
    };
    setSettings({ ...(settings || defaultSettings), ...updates });
  };

  useEffect(() => {
    fetchSecuritySettings();
  }, []);

  const fetchSecuritySettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/admin/settings/security`, {
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
      console.error('Failed to fetch security settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/admin/settings/security`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Security settings updated successfully!');
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      toast.error('Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };

  const addIpToWhitelist = () => {
    if (newIp && !(settings?.ipWhitelist || []).includes(newIp)) {
      updateSettings({
        ipWhitelist: [...(settings?.ipWhitelist || []), newIp]
      });
      setNewIp('');
    }
  };

  const removeIpFromWhitelist = (ip: string) => {
    updateSettings({
      ipWhitelist: (settings?.ipWhitelist || []).filter(item => item !== ip)
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
            <span role="img" aria-label="Security">🔒</span> Security Settings
          </h2>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          form="securitySettingsForm"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <form id="securitySettingsForm" onSubmit={handleSubmit}>
            {/* Password Policy */}
            <div className="row mb-4">
              <div className="col-12">
                <h5 className="text-secondary mb-3">Password Policy</h5>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Minimum Password Length</label>
                <input
                  type="number"
                  className="form-control"
                  value={settings?.passwordMinLength || 8}
                  onChange={(e) => updateSettings({ passwordMinLength: parseInt(e.target.value) || 8 })}
                  min="6"
                  max="50"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Force Password Change (days)</label>
                <input
                  type="number"
                  className="form-control"
                  value={settings?.forcePasswordChange || 90}
                  onChange={(e) => updateSettings({ forcePasswordChange: parseInt(e.target.value) || 90 })}
                  min="30"
                  max="365"
                />
              </div>
              <div className="col-12">
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="requireUppercase"
                        checked={settings?.passwordRequireUppercase || false}
                        onChange={(e) => updateSettings({ passwordRequireUppercase: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="requireUppercase">
                        Require uppercase letters
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="requireLowercase"
                        checked={settings?.passwordRequireLowercase || false}
                        onChange={(e) => updateSettings({ passwordRequireLowercase: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="requireLowercase">
                        Require lowercase letters
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="requireNumbers"
                        checked={settings?.passwordRequireNumbers || false}
                        onChange={(e) => updateSettings({ passwordRequireNumbers: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="requireNumbers">
                        Require numbers
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="requireSpecialChars"
                        checked={settings?.passwordRequireSpecialChars || false}
                        onChange={(e) => updateSettings({ passwordRequireSpecialChars: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="requireSpecialChars">
                        Require special characters
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session & Login Security */}
            <div className="row mb-4">
              <div className="col-12">
                <h5 className="text-secondary mb-3">Session & Login Security</h5>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Session Timeout (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  value={settings?.sessionTimeout || 30}
                  onChange={(e) => updateSettings({ sessionTimeout: parseInt(e.target.value) || 30 })}
                  min="5"
                  max="480"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Max Login Attempts</label>
                <input
                  type="number"
                  className="form-control"
                  value={settings?.maxLoginAttempts || 5}
                  onChange={(e) => updateSettings({ maxLoginAttempts: parseInt(e.target.value) || 5 })}
                  min="3"
                  max="10"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Lockout Duration (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  value={settings?.lockoutDuration || 15}
                  onChange={(e) => updateSettings({ lockoutDuration: parseInt(e.target.value) || 15 })}
                  min="5"
                  max="1440"
                />
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="row mb-4">
              <div className="col-12">
                <h5 className="text-secondary mb-3">Two-Factor Authentication</h5>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="twoFactorEnabled"
                    checked={settings?.twoFactorEnabled || false}
                    onChange={(e) => updateSettings({ twoFactorEnabled: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="twoFactorEnabled">
                    <strong>Enable Two-Factor Authentication</strong>
                  </label>
                </div>
                <small className="text-muted">
                  Require users to use 2FA for enhanced security
                </small>
              </div>
            </div>

            {/* IP Whitelist */}
            <div className="row mb-4">
              <div className="col-12">
                <h5 className="text-secondary mb-3">IP Whitelist</h5>
                <div className="mb-3">
                  <label className="form-label">Add IP Address</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={newIp}
                      onChange={(e) => setNewIp(e.target.value)}
                      placeholder="192.168.1.1 or 192.168.1.0/24"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={addIpToWhitelist}
                    >
                      Add
                    </button>
                  </div>
                  <small className="text-muted">
                    Leave empty to allow all IPs. Use CIDR notation for ranges.
                  </small>
                </div>
                
                {(settings?.ipWhitelist || []).length > 0 && (
                  <div>
                    <label className="form-label">Whitelisted IPs</label>
                    <div className="list-group">
                      {(settings?.ipWhitelist || []).map((ip, index) => (
                        <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          <span className="font-monospace">{ip}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeIpFromWhitelist(ip)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audit & Logging */}
            <div className="row mb-4">
              <div className="col-12">
                <h5 className="text-secondary mb-3">Audit & Logging</h5>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="enableAuditLog"
                    checked={settings?.enableAuditLog || false}
                    onChange={(e) => updateSettings({ enableAuditLog: e.target.checked })}
                  />
                  <label className="form-check-label" htmlFor="enableAuditLog">
                    <strong>Enable Audit Logging</strong>
                  </label>
                </div>
                <small className="text-muted">
                  Log user actions and system events for security monitoring
                </small>
              </div>
            </div>

            {/* Security Warning */}
            <div className="alert alert-warning">
              <h6 className="alert-heading">⚠️ Security Notice</h6>
              <p className="mb-0">
                Changes to security settings will affect all users. Test thoroughly before applying in production.
                Some settings may require users to re-authenticate.
              </p>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SecuritySettingsPage;