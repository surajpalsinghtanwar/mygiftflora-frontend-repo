import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../layouts/AdminLayout';
import toast from 'react-hot-toast';

interface PaymentSettings {
  enabled: boolean;
  currency: string;
  taxRate: number;
  processingFee: number;
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  paypalEnabled: boolean;
  paypalClientId: string;
  paypalClientSecret: string;
  paypalSandbox: boolean;
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  minimumOrderAmount: number;
  maximumOrderAmount: number;
  refundPolicy: string;
  shippingEnabled: boolean;
  freeShippingThreshold: number;
}

const PaymentSettingsPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<PaymentSettings>({
    enabled: true,
    currency: 'USD',
    taxRate: 0,
    processingFee: 0,
    stripeEnabled: false,
    stripePublishableKey: '',
    stripeSecretKey: '',
    paypalEnabled: false,
    paypalClientId: '',
    paypalClientSecret: '',
    paypalSandbox: true,
    razorpayEnabled: false,
    razorpayKeyId: '',
    razorpayKeySecret: '',
    minimumOrderAmount: 0,
    maximumOrderAmount: 10000,
    refundPolicy: '',
    shippingEnabled: true,
    freeShippingThreshold: 100,
  });

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  ];

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/admin/settings/payment`, {
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
      console.error('Failed to fetch payment settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/admin/settings/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Payment settings updated successfully!');
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      toast.error('Failed to update payment settings');
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
            <span role="img" aria-label="Payment">💳</span> Payment Settings
          </h2>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          form="paymentSettingsForm"
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
                className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                💰 General
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'gateways' ? 'active' : ''}`}
                onClick={() => setActiveTab('gateways')}
              >
                🏦 Payment Gateways
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'policies' ? 'active' : ''}`}
                onClick={() => setActiveTab('policies')}
              >
                📋 Policies
              </button>
            </li>
          </ul>

          <form id="paymentSettingsForm" onSubmit={handleSubmit}>
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="tab-content">
                <h5 className="text-secondary mb-3">General Payment Settings</h5>
                
                <div className="row mb-4">
                  <div className="col-12 mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="paymentEnabled"
                        checked={settings.enabled}
                        onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="paymentEnabled">
                        <strong>Enable Payment Processing</strong>
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Default Currency</label>
                    <select
                      className="form-select"
                      value={settings.currency}
                      onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name} ({currency.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tax Rate (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.taxRate}
                      onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Processing Fee (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.processingFee}
                      onChange={(e) => setSettings({ ...settings, processingFee: parseFloat(e.target.value) || 0 })}
                      min="0"
                      max="10"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Minimum Order Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.minimumOrderAmount}
                      onChange={(e) => setSettings({ ...settings, minimumOrderAmount: parseFloat(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Maximum Order Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.maximumOrderAmount}
                      onChange={(e) => setSettings({ ...settings, maximumOrderAmount: parseFloat(e.target.value) || 10000 })}
                      min="100"
                    />
                  </div>
                </div>

                {/* Shipping Settings */}
                <h5 className="text-secondary mb-3">Shipping Settings</h5>
                <div className="row">
                  <div className="col-12 mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="shippingEnabled"
                        checked={settings.shippingEnabled}
                        onChange={(e) => setSettings({ ...settings, shippingEnabled: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="shippingEnabled">
                        <strong>Enable Shipping</strong>
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Free Shipping Threshold</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 100 })}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Gateways */}
            {activeTab === 'gateways' && (
              <div className="tab-content">
                {/* Stripe */}
                <div className="mb-4">
                  <h5 className="text-secondary mb-3">Stripe</h5>
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="stripeEnabled"
                      checked={settings.stripeEnabled}
                      onChange={(e) => setSettings({ ...settings, stripeEnabled: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="stripeEnabled">
                      <strong>Enable Stripe</strong>
                    </label>
                  </div>
                  
                  {settings.stripeEnabled && (
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Publishable Key</label>
                        <input
                          type="text"
                          className="form-control"
                          value={settings.stripePublishableKey}
                          onChange={(e) => setSettings({ ...settings, stripePublishableKey: e.target.value })}
                          placeholder="pk_test_..."
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Secret Key</label>
                        <input
                          type="password"
                          className="form-control"
                          value={settings.stripeSecretKey}
                          onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                          placeholder="sk_test_..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* PayPal */}
                <div className="mb-4">
                  <h5 className="text-secondary mb-3">PayPal</h5>
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="paypalEnabled"
                      checked={settings.paypalEnabled}
                      onChange={(e) => setSettings({ ...settings, paypalEnabled: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="paypalEnabled">
                      <strong>Enable PayPal</strong>
                    </label>
                  </div>
                  
                  {settings.paypalEnabled && (
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Client ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={settings.paypalClientId}
                          onChange={(e) => setSettings({ ...settings, paypalClientId: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Client Secret</label>
                        <input
                          type="password"
                          className="form-control"
                          value={settings.paypalClientSecret}
                          onChange={(e) => setSettings({ ...settings, paypalClientSecret: e.target.value })}
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="paypalSandbox"
                            checked={settings.paypalSandbox}
                            onChange={(e) => setSettings({ ...settings, paypalSandbox: e.target.checked })}
                          />
                          <label className="form-check-label" htmlFor="paypalSandbox">
                            Use Sandbox Mode (for testing)
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Razorpay */}
                <div className="mb-4">
                  <h5 className="text-secondary mb-3">Razorpay</h5>
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="razorpayEnabled"
                      checked={settings.razorpayEnabled}
                      onChange={(e) => setSettings({ ...settings, razorpayEnabled: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="razorpayEnabled">
                      <strong>Enable Razorpay</strong>
                    </label>
                  </div>
                  
                  {settings.razorpayEnabled && (
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Key ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={settings.razorpayKeyId}
                          onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Key Secret</label>
                        <input
                          type="password"
                          className="form-control"
                          value={settings.razorpayKeySecret}
                          onChange={(e) => setSettings({ ...settings, razorpayKeySecret: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Policies */}
            {activeTab === 'policies' && (
              <div className="tab-content">
                <h5 className="text-secondary mb-3">Refund & Return Policy</h5>
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label">Refund Policy</label>
                    <textarea
                      className="form-control"
                      value={settings.refundPolicy}
                      onChange={(e) => setSettings({ ...settings, refundPolicy: e.target.value })}
                      rows={6}
                      placeholder="Enter your refund and return policy..."
                    />
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

export default PaymentSettingsPage;