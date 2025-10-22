import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const Topbar: React.FC = () => {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    // Get admin user from localStorage
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      setAdminUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('adminUser');
      toast.success('Logged out successfully');
      router.push('/admin/login');
    }
  };

  return (  
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold fs-4">
          Welcome, {adminUser?.name || 'Admin'}
        </span>
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-light position-relative">
            <i className="bi bi-bell fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>
          </button>
          
          <div className="dropdown">
            <button 
              className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2" 
              type="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              <img 
                src="/login-box.jpg" 
                alt="Profile" 
                className="rounded-circle border border-light" 
                style={{ width: '32px', height: '32px' }} 
              />
              <span>{adminUser?.email || 'admin@mygiftflora.com'}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <h6 className="dropdown-header">
                  <i className="bi bi-person-circle me-2"></i>
                  {adminUser?.name || 'Admin User'}
                </h6>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a className="dropdown-item" href="/admin/settings">
                  <i className="bi bi-gear me-2"></i>Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/admin/profile">
                  <i className="bi bi-person me-2"></i>Profile
                </a>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button 
                  className="dropdown-item text-danger" 
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;