import React, { useState } from 'react';
import Link from 'next/link';

const menu = [
  { label: 'Dashboard', icon: '🏠', path: '/admin' },
  { label: 'Analytics', icon: '📊', path: '/admin/dashboard/analytics' },
  { label: 'Inventory Management', icon: '📦', children: [
    { label: 'Categories', path: '/admin/inventory/categories' },
    { label: 'Subcategories', path: '/admin/inventory/subcategories' },
    { label: 'Sub-Subcategories', path: '/admin/inventory/subsubcategories' },
    { label: 'Products', path: '/admin/inventory/products' },
  ] },
  { label: 'Banner Management', icon: '🎨', path: '/admin/banner-management' },
  { label: 'Excel Upload', icon: '📊', path: '/admin/excel-upload' },
  { label: 'User Management', icon: '👥', children: [
    { label: 'Users', path: '/admin/users' },
    { label: 'Admin Users', path: '/admin/user-management/admin-users' },
    { label: 'Roles & Permissions', path: '/admin/user-management/roles' },
  ] },
  { label: 'Content Management', icon: '📝', children: [
    { label: 'CMS Pages', path: '/admin/content-management/cms' },
    { label: 'Support Tickets', path: '/admin/content-management/support-tickets' },
  ] },
  { label: 'Subscriptions & Payments', icon: '💳', children: [
    { label: 'Active Subscriptions', path: '/admin/subscriptions/active' },
    { label: 'Payment Transactions', path: '/admin/subscriptions/transactions' },
  ] },
  { label: 'Notifications', icon: '🔔', children: [
    { label: 'Send Notification', path: '/admin/notifications/send' },
    { label: 'Notification Logs', path: '/admin/notifications/logs' },
  ] },
  { label: 'Settings', icon: '⚙️', path: '/admin/settings' },
];

const Sidebar: React.FC = () => {
  const [openDropdowns, setOpenDropdowns] = useState<number[]>([]);

  const toggleDropdown = (index: number) => {
    setOpenDropdowns(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <aside className="bg-dark text-light shadow-lg d-flex flex-column position-fixed top-0 start-0" style={{ width: '260px', height: '100vh', overflowY: 'auto', zIndex: 1040 }}>
      <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom border-secondary">
        <span className="fw-bold fs-4">Admin Panel</span>
      </div>
      <nav className="flex-grow-1 px-3 py-4">
        {menu.map((item, idx) => (
          <div key={idx} className="mb-2">
            {!item.children ? (
              <Link href={item.path || '#'} className="d-flex align-items-center gap-2 px-3 py-2 rounded text-light fw-semibold text-decoration-none sidebar-main-item">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ) : (
              <div>
                <button 
                  className="w-100 d-flex align-items-center justify-content-between px-3 py-2 text-light border-0 rounded fw-semibold text-start sidebar-dropdown-button"
                  onClick={() => toggleDropdown(idx)}
                  style={{ cursor: 'pointer', backgroundColor: 'transparent' }}
                >
                  <span className="d-flex align-items-center gap-2">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  <span className={`transition-transform ${openDropdowns.includes(idx) ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openDropdowns.includes(idx) && (
                  <div className="ps-4 py-2">
                    {item.children.map((child, cidx) => (
                      <Link 
                        key={cidx} 
                        href={child.path} 
                        className="d-block px-2 py-2 rounded text-light text-decoration-none sidebar-dropdown-item small mb-1"
                        style={{ fontSize: '0.9rem' }}
                      >
                        • {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
