import React from 'react';

const Overview: React.FC = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold">₹1,20,000</span>
          <span className="mt-2 text-lg font-medium">Total Sales</span>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-400 text-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold">320</span>
          <span className="mt-2 text-lg font-medium">Active Users</span>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-400 text-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold">12</span>
          <span className="mt-2 text-lg font-medium">Consultations</span>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-300 text-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold">8</span>
          <span className="mt-2 text-lg font-medium">AI Quiz Results</span>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 mt-8">
        <h3 className="text-2xl font-bold mb-4">Analytics</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-600">
          {/* Chart placeholder */}
          <span>Charts and analytics will appear here.</span>
        </div>
      </div>
    </div>
  );
};

export default Overview;
