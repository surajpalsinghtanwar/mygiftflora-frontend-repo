import React from 'react';
import Layout from '../../components/Layout';

export default function WishlistPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>
          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-4">Start adding items you love to your wishlist!</p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}