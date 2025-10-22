import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: {
    to: string;
    label: string;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, action }) => {
  return (
    <div className="text-center py-16 px-6 bg-gray-50 rounded-lg">
      <div className="mx-auto h-16 w-16 text-gray-400">{icon}</div>
      <h3 className="mt-4 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-base text-gray-500">{message}</p>
      {action && (
        <div className="mt-6">
          <Link
            to={action.to}
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
          >
            {action.label}
          </Link>
        </div>
      )}
    </div>
  );
};