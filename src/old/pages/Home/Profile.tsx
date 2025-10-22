import { Link } from 'react-router-dom'

const Profile = () => (
  <div className="max-w-2xl mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Profile</h1>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-4">
      <div>
        <span className="font-semibold">Name:</span> John Doe
      </div>
      <div>
        <span className="font-semibold">Email:</span> johndoe@example.com
      </div>
      <div>
        <span className="font-semibold">Phone:</span> +91-9876543210
      </div>
      <div>
        <span className="font-semibold">Address:</span> 123, Furniture Street, City, Country
      </div>
      <Link to="/account" className="text-blue-600 hover:underline text-sm mt-2">
        Back to Account
      </Link>
    </div>
  </div>
)

export default Profile
