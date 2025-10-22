import { Link } from 'react-router-dom'

const Orders = () => (
  <div className="max-w-2xl mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">My Orders</h1>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <p className="text-gray-600 dark:text-gray-300">
        No orders found. Your recent orders will appear here.
      </p>
      <Link to="/account" className="text-blue-600 hover:underline text-sm mt-2 block">
        Go to Account
      </Link>
    </div>
  </div>
)

export default Orders
