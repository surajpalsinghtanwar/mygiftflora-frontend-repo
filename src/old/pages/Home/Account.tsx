import { Link } from 'react-router-dom'

const Account = () => (
  <div className="max-w-2xl mx-auto p-4">
    <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300">Account Overview</h1>
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
            Neeraj Jha
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">neeraj@jhajiconsultancy.in</div>
        </div>
        <Link
          to="/profile"
          className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          View Profile
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 flex flex-col gap-2">
          <span className="font-semibold text-blue-700 dark:text-blue-300">Contact</span>
          <span className="text-gray-700 dark:text-gray-200">Phone: +91-7667264079</span>
          <span className="text-gray-700 dark:text-gray-200">
            Address: 123, Furniture Street, City, Country
          </span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
          <span className="font-semibold text-gray-700 dark:text-gray-200">Account Actions</span>
          <Link to="/orders" className="text-blue-600 hover:underline">
            My Orders
          </Link>
          <Link to="/wishlist" className="text-pink-600 hover:underline">
            Wishlist
          </Link>
          <Link to="/tracking" className="text-yellow-600 hover:underline">
            Track Orders
          </Link>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Link
          to="/login"
          className="px-4 py-2 rounded bg-gray-500 text-white font-medium hover:bg-gray-600 transition"
        >
          Logout
        </Link>
      </div>
    </div>
  </div>
)

export default Account
