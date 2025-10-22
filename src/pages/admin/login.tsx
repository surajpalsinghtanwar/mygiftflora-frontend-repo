import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Store auth token and user data from backend response
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('adminUser', JSON.stringify(data.user || data.admin));
        
        toast.success('Login successful! Welcome to admin panel.');
        
        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        toast.error(data.message || 'Invalid email or password');
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login failed. Please check your connection and try again.');
      setError('Login failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - MyGiftFlora</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <div className="mb-3">
                      <h1 className="h3 text-primary fw-bold">MyGiftFlora</h1>
                      <p className="text-muted small">Admin Portal</p>
                    </div>
                    <h2 className="card-title fw-bold text-dark">Admin Login</h2>
                    <p className="text-muted">Sign in to your admin account</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                        required
                        placeholder="Enter your admin email"
                        autoComplete="email"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="password" className="form-label fw-semibold">Password</label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        id="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        required
                        placeholder="Enter your admin password"
                        autoComplete="current-password"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-dark btn-lg w-100 py-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </form>

                  <div className="text-center mt-4">
                    <small className="text-muted">
                      Enter your admin credentials to access the dashboard
                    </small>
                  </div>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      © 2024 MyGiftFlora. All rights reserved.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;