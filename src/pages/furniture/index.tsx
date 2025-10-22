import React from 'react';
import Layout from '../../components/Layout';

export default function FurniturePage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Furniture Collection</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Sofa Sets</h3>
              <p className="text-gray-600">Comfortable and stylish sofa sets for your living room.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Dining Tables</h3>
              <p className="text-gray-600">Elegant dining tables for memorable family meals.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Bedroom Sets</h3>
              <p className="text-gray-600">Complete bedroom furniture for a perfect night's rest.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}