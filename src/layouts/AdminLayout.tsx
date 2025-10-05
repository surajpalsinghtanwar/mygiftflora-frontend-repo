import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store.minimal';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
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