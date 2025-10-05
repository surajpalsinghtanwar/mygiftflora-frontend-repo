import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUser } from '../../store/usersSlice';
import type { AppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateUser = () => {
  const [form, setForm] = useState<{
    name: string;
    phone_number: string;
    email: string;
    avatar_url: string;
    role: 'user' | 'consultant';
    date_of_birth: string;
    gender: 'M' | 'F' | 'O' | undefined;
  }>({
    name: '',
    phone_number: '',
    email: '',
    avatar_url: '',
    role: 'user',
    date_of_birth: '',
    gender: undefined
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createUser(form)).then((action: any) => {
      if (action.type.endsWith('fulfilled')) {
        toast.success('User created successfully');
        setTimeout(() => navigate('/users'), 1200);
      } else {
        toast.error(action.payload || 'Failed to create user');
      }
    });
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Add User</h2>
      <div className="card shadow-lg border-0" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="card-body">
          <h2 className="fw-bold mb-4 text-center">Add New User</h2>
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
            <button type="submit" className="btn btn-primary w-100 mt-3">Create User</button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateUser;
