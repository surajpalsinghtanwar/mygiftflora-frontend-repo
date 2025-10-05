import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import AdminLayout from '../../../layouts/AdminLayout';

const EditUser = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    phone_number: '',
    email: '',
    avatar_url: '',
    role: 'user',
    date_of_birth: '',
    gender: undefined as string | undefined,
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setUser(data);
          setForm({
            name: data.name || '',
            phone_number: data.phone_number || '',
            email: data.email || '',
            avatar_url: data.avatar_url || '',
            role: data.role || 'user',
            date_of_birth: data.date_of_birth || '',
            gender: data.gender || undefined,
          });
        } else {
          toast.error('Failed to fetch user data');
        }
      } catch (error) {
        toast.error('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return toast.error('User ID missing');
    
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('User updated successfully');
        setTimeout(() => router.push('/admin/users'), 1200);
      } else {
        toast.error(data.message || 'Failed to update user');
      }
    } catch (error) {
      toast.error('Error updating user');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <AdminLayout><div className="alert alert-warning">User not found.</div></AdminLayout>;

  return (
    <AdminLayout>
      <h2 className="fw-bold mb-4">Edit User</h2>
      <div className="card shadow-lg border-0" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="card-body">
          <h2 className="fw-bold mb-4 text-center">Edit User</h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input name="name" type="text" className="form-control" value={form.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input name="phone_number" type="text" className="form-control" value={form.phone_number} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select name="role" className="form-select" value={form.role} onChange={handleChange} required>
                    <option value="user">User</option>
                    <option value="consultant">Consultant</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Avatar URL</label>
                  <input name="avatar_url" type="text" className="form-control" value={form.avatar_url} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input name="date_of_birth" type="date" className="form-control" value={form.date_of_birth} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select name="gender" className="form-select" value={form.gender || ''} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">Update User</button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditUser;
