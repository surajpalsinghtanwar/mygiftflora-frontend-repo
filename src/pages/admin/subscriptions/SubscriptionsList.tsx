import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptions } from '../../store/subscriptionSlice';
import type { RootState, AppDispatch } from '../../store/store';

const SubscriptionsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { subscriptions, loading, error } = useSelector((state: RootState) => state.subscriptions);

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  return (
    <div className="container-fluid py-4">
      <div className="card">
        <div className="card-header pb-0 d-flex justify-content-between align-items-center">
          <h6>Subscriptions</h6>
        </div>
        <div className="card-body px-0 pt-0 pb-2">
          <div className="table-responsive p-0">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4">No subscriptions found.</td></tr>
                ) : (
                  subscriptions.map((sub: any) => (
                    <tr key={sub.id}>
                      <td>{sub.userName}</td>
                      <td>{sub.planName}</td>
                      <td>{sub.status}</td>
                      <td>{sub.startDate}</td>
                      <td>{sub.endDate}</td>
                      <td>
                        {/* Actions: View/Edit/Cancel */}
                        <button className="btn btn-link text-secondary mb-0">View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsList;
