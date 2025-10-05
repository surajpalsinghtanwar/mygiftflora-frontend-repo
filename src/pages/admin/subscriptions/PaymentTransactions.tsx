import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentTransactions } from '../../store/subscriptionSlice';
import type { RootState, AppDispatch } from '../../store/store';

const PaymentTransactions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error } = useSelector((state: RootState) => state.subscriptions);

  useEffect(() => {
    dispatch(fetchPaymentTransactions());
  }, [dispatch]);

  return (
    <div className="container-fluid py-4">
      <div className="card">
        <div className="card-header pb-0 d-flex justify-content-between align-items-center">
          <h6>Payment Transactions</h6>
        </div>
        <div className="card-body px-0 pt-0 pb-2">
          <div className="table-responsive p-0">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4">No transactions found.</td></tr>
                ) : (
                  transactions.map((tx: any) => (
                    <tr key={tx.id}>
                      <td>{tx.id}</td>
                      <td>{tx.userName}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.status}</td>
                      <td>{tx.date}</td>
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

export default PaymentTransactions;
