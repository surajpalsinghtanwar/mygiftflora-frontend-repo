import { Link } from 'react-router-dom'

// Placeholder for bottom tab items, will be fetched from API in future
const tabItems = [
  { label: 'Home', icon: '🏠', path: '/' },
  { label: 'Products', icon: '🛒', path: '/products' },
  { label: 'Cart', icon: '🛍️', path: '/cart' },
  { label: 'Orders', icon: '📦', path: '/orders' },
  { label: 'Account', icon: '👤', path: '/account' },
]

const BottomTabs = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow md:hidden flex justify-around py-2">
    {tabItems.map((item) => (
      <Link
        key={item.path}
        to={item.path}
        className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
      >
        <span className="text-xl mb-1">{item.icon}</span>
        {item.label}
      </Link>
    ))}
  </nav>
)

export default BottomTabs
