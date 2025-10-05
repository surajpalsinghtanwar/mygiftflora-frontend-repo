import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSubscription } from '../../store/subscriptionSlice';
import { toast } from 'react-toastify';
import type { AppDispatch } from '../../store/store';

const CreateSubscription: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [userId, setUserId] = useState('');
  const [planId, setPlanId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createSubscription({ userId, planId, startDate, endDate })).unwrap();
      toast.success('Subscription created');
    } catch {
      toast.error('Failed to create subscription');
    }
  };

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-body">
          <h4 className="mb-4">Create Subscription</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>User ID</label>
              <input className="form-control" value={userId} onChange={e => setUserId(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Plan ID</label>
              <input className="form-control" value={planId} onChange={e => setPlanId(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Start Date</label>
              <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>End Date</label>
              <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSubscription;
