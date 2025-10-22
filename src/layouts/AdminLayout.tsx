import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="bg-light text-dark">
      <div className="d-flex min-vh-100">
        <Sidebar />
        <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: 260, minWidth: 0 }}>
          <Topbar />
          <main className="flex-grow-1 p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;