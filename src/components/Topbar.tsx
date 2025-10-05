import React from 'react';

const Topbar: React.FC = () => {
  return (  
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold fs-4">Welcome, Admin</span>
        <div className="d-flex align-items-center gap-4">
          <button className="btn btn-outline-light position-relative">
            <i className="bi bi-bell fs-5"></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>
          </button>
          <img src="/login-box.jpg" alt="Profile" className="rounded-circle border border-primary" style={{ width: '40px', height: '40px' }} />
        </div>
      </div>
    </nav>
  );
};

export default Topbar;