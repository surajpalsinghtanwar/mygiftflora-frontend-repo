import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Temporary mock data - you can replace this with actual API calls later
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
];

const UsersList = () => {
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-lg border-0 mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-0">User Management</h2>
            <p className="text-muted mb-0">Manage all users and consultants in the system</p>
          </div>
          <Link href="/admin/users/create" className="btn btn-primary btn-lg">+ Add User</Link>
        </div>
      </div>
      {loading && <div className="text-center py-4">Loading...</div>}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="fw-semibold">{user.name}</td>
                    <td>-</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge rounded-pill ${user.role === 'Admin' ? 'bg-info' : 'bg-secondary'}`}>{user.role}</span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>{user.status}</span>
                    </td>
                    <td>
                      <Link href={`/admin/users/edit/${user.id}`} className="btn btn-sm btn-outline-primary me-2">Edit</Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
