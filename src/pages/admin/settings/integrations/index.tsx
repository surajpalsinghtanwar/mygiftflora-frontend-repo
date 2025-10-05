import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../layouts/AdminLayout';
import toast from 'react-hot-toast';

interface IntegrationSettings {
  googleAnalyticsEnabled: boolean;
  googleAnalyticsId: string;
  googleTagManagerEnabled: boolean;
  googleTagManagerId: string;
  facebookPixelEnabled: boolean;
  facebookPixelId: string;
  googleLoginEnabled: boolean;
  googleClientId: string;
  googleClientSecret: string;
  facebookLoginEnabled: boolean;
  facebookAppId: string;
  facebookAppSecret: string;
  chatbotEnabled: boolean;
  chatbotProvider: string;
  chatbotConfig: any;
  slackEnabled: boolean;
  slackWebhookUrl: string;
  discordEnabled: boolean;
  discordWebhookUrl: string;
  zendeskEnabled: boolean;
  zendeskSubdomain: string;
  zendeskApiToken: string;
}

const IntegrationsSettingsPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');
  const [settings, setSettings] = useState<IntegrationSettings>({
    googleAnalyticsEnabled: false,
    googleAnalyticsId: '',
    googleTagManagerEnabled: false,
    googleTagManagerId: '',
    facebookPixelEnabled: false,
    facebookPixelId: '',
    googleLoginEnabled: false,
    googleClientId: '',
    googleClientSecret: '',
    facebookLoginEnabled: false,
    facebookAppId: '',
    facebookAppSecret: '',
    chatbotEnabled: false,
    chatbotProvider: 'none',
    chatbotConfig: {},
    slackEnabled: false,
    slackWebhookUrl: '',
    discordEnabled: false,
    discordWebhookUrl: '',
    zendeskEnabled: false,
    zendeskSubdomain: '',
    zendeskApiToken: '',
  });

  // Helper function to safely update settings
  const updateSettings = (updates: Partial<IntegrationSettings>) => {
    const defaultSettings = {
      googleAnalyticsEnabled: false,
      googleAnalyticsId: '',
      googleTagManagerEnabled: false,
      googleTagManagerId: '',
      facebookPixelEnabled: false,
      facebookPixelId: '',
      googleLoginEnabled: false,
      googleClientId: '',
      googleClientSecret: '',
      facebookLoginEnabled: false,
      facebookAppId: '',
      facebookAppSecret: '',
      chatbotEnabled: false,
      chatbotProvider: 'none',
      chatbotConfig: {},
      slackEnabled: false,
      slackWebhookUrl: '',
      discordEnabled: false,
      discordWebhookUrl: '',
      zendeskEnabled: false,
      zendeskSubdomain: '',
      zendeskApiToken: '',
    };
    setSettings({ ...(settings || defaultSettings), ...updates });
  };

  useEffect(() => {
    fetchIntegrationSettings();
  }, []);

  const fetchIntegrationSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/admin/settings/integrations`, {
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
      console.error('Failed to fetch integration settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/admin/settings/integrations`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Integration settings updated successfully!');
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      toast.error('Failed to update integration settings');
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
            <span role="img" aria-label="Integrations">🔗</span> Integrations
          </h2>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          form="integrationsSettingsForm"
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
                className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                📊 Analytics
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'social' ? 'active' : ''}`}
                onClick={() => setActiveTab('social')}
              >
                👥 Social Login
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'support' ? 'active' : ''}`}
                onClick={() => setActiveTab('support')}
              >
                🎧 Support
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                🔔 Notifications
              </button>
            </li>
          </ul>

          <form id="integrationsSettingsForm" onSubmit={handleSubmit}>
            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="tab-content">
                <h5 className="text-secondary mb-3">Analytics & Tracking</h5>
                
                {/* Google Analytics */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="text-dark mb-3">Google Analytics</h6>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="googleAnalyticsEnabled"
                        checked={settings?.googleAnalyticsEnabled || false}
                        onChange={(e) => updateSettings({ googleAnalyticsEnabled: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="googleAnalyticsEnabled">
                        <strong>Enable Google Analytics</strong>
                      </label>
                    </div>
                    
                    {(settings?.googleAnalyticsEnabled) && (
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Tracking ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={settings?.googleAnalyticsId || ''}
                          onChange={(e) => updateSettings({ googleAnalyticsId: e.target.value })}
                          placeholder="G-XXXXXXXXXX"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Google Tag Manager */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="text-dark mb-3">Google Tag Manager</h6>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="googleTagManagerEnabled"
                        checked={settings?.googleTagManagerEnabled || false}
                        onChange={(e) => updateSettings({ googleTagManagerEnabled: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="googleTagManagerEnabled">
                        <strong>Enable Google Tag Manager</strong>
                      </label>
                    </div>
                    
                    {settings.googleTagManagerEnabled && (
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Container ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={settings.googleTagManagerId}
                          onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
                          placeholder="GTM-XXXXXXX"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Facebook Pixel */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="text-dark mb-3">Facebook Pixel</h6>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="facebookPixelEnabled"
                        checked={settings?.facebookPixelEnabled || false}
                        onChange={(e) => updateSettings({ facebookPixelEnabled: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="facebookPixelEnabled">
                        <strong>Enable Facebook Pixel</strong>
                      </label>
                    </div>
                    
                    {settings.facebookPixelEnabled && (
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Pixel ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={settings.facebookPixelId}
                          onChange={(e) => setSettings({ ...settings, facebookPixelId: e.target.value })}
                          placeholder="123456789012345"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Social Login Tab */}
            {activeTab === 'social' && (
              <div className="tab-content">
                <h5 className="text-secondary mb-3">Social Login Providers</h5>
                
                {/* Google Login */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="text-dark mb-3">Google Login</h6>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="googleLoginEnabled"
                        checked={settings?.googleLoginEnabled || false}
                        onChange={(e) => updateSettings({ googleLoginEnabled: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="googleLoginEnabled">
                        <strong>Enable Google Login</strong>
                      </label>
                    </div>
                    
                    {settings.googleLoginEnabled && (
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Client ID</label>
                          <input
                            type="text"
                            className="form-control"
                            value={settings.googleClientId}
                            onChange={(e) => setSettings({ ...settings, googleClientId: e.target.value })}
                            placeholder="your-client-id.googleusercontent.com"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Client Secret</label>
                          <input
                            type="password"
                            className="form-control"
                            value={settings.googleClientSecret}
                            onChange={(e) => setSettings({ ...settings, googleClientSecret: e.target.value })}
                            placeholder="Your client secret"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Facebook Login */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="text-dark mb-3">Facebook Login</h6>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="facebookLoginEnabled"
                        checked={settings?.facebookLoginEnabled || false}
                        onChange={(e) => updateSettings({ facebookLoginEnabled: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="facebookLoginEnabled">
                        <strong>Enable Facebook Login</strong>
                      </label>
                    </div>
                    
                    {settings.facebookLoginEnabled && (
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">App ID</label>
                          <input
                            type="text"
                            className="form-control"
                            value={settings.facebookAppId}
                            onChange={(e) => setSettings({ ...settings, facebookAppId: e.target.value })}
                            placeholder="123456789012345"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">App Secret</label>
                          <input
                            type="password"
                            className="form-control"
                            value={settings.facebookAppSecret}
                            onChange={(e) => setSettings({ ...settings, facebookAppSecret: e.target.value })}
                            placeholder="Your app secret"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Support Tab */}
            {activeTab === 'support' && (
              <div className="tab-content">
                <h5 className="text-secondary mb-3">Customer Support</h5>
                
                {/* Chatbot */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="text-dark mb-3">Chatbot</h6>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="chatbotEnabled"
                        checked={settings?.chatbotEnabled || false}
                        onChange={(e) => updateSettings({ chatbotEnabled: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="chatbotEnabled">
                        <strong>Enable Chatbot</strong>
                      </label>
                    </div>
                    
                    {settings.chatbotEnabled && (
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Chatbot Provider</label>
                        <select
                          className="form-select"
                          value={settings.chatbotProvider}
                          onChange={(e) => setSettings({ ...settings, chatbotProvider: e.target.value })}
                        >
                          <option value="none">Select Provider</option>
                          <option value="intercom">Intercom</option>
                          <option value="zendesk">Zendesk Chat</option>
                          <option value="tawk">Tawk.to</option>
                          <option value="crisp">Crisp</option>
                          <option value="freshchat">Freshchat</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Zendesk */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="text-dark mb-3">Zendesk</h6>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="zendeskEnabled"
                        checked={settings?.zendeskEnabled || false}
                        onChange={(e) => updateSettings({ zendeskEnabled: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="zendeskEnabled">
                        <strong>Enable Zendesk Integration</strong>
                      </label>
                    </div>
                    
                    {settings.zendeskEnabled && (
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Subdomain</label>
                          <input
                            type="text"
                            className="form-control"
                            value={settings.zendeskSubdomain}
                            onChange={(e) => setSettings({ ...settings, zendeskSubdomain: e.target.value })}
                            placeholder="yourcompany"
                          />
                          <small className="text-muted">yourcompany.zendesk.com</small>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">API Token</label>
                          <input
                            type="password"
                            className="form-control"
                            value={settings.zendeskApiToken}
                            onChange={(e) => setSettings({ ...settings, zendeskApiToken: e.target.value })}
                            placeholder="Your API token"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="tab-content">
                <h5 className="text-secondary mb-3">Notification Services</h5>
                
                {/* Slack */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="text-dark mb-3">Slack</h6>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="slackEnabled"
                        checked={settings?.slackEnabled || false}
                        onChange={(e) => updateSettings({ slackEnabled: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="slackEnabled">
                        <strong>Enable Slack Notifications</strong>
                      </label>
                    </div>
                    
                    {settings.slackEnabled && (
                      <div className="col-md-8 mb-3">
                        <label className="form-label">Webhook URL</label>
                        <input
                          type="url"
                          className="form-control"
                          value={settings.slackWebhookUrl}
                          onChange={(e) => setSettings({ ...settings, slackWebhookUrl: e.target.value })}
                          placeholder="https://hooks.slack.com/services/..."
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Discord */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="text-dark mb-3">Discord</h6>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="discordEnabled"
                        checked={settings?.discordEnabled || false}
                        onChange={(e) => updateSettings({ discordEnabled: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="discordEnabled">
                        <strong>Enable Discord Notifications</strong>
                      </label>
                    </div>
                    
                    {settings.discordEnabled && (
                      <div className="col-md-8 mb-3">
                        <label className="form-label">Webhook URL</label>
                        <input
                          type="url"
                          className="form-control"
                          value={settings.discordWebhookUrl}
                          onChange={(e) => setSettings({ ...settings, discordWebhookUrl: e.target.value })}
                          placeholder="https://discord.com/api/webhooks/..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default IntegrationsSettingsPage;