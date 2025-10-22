import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { useWishlist } from '../../hooks/useWishlist';

export const WishlistIcon: React.FC = () => {
  const { itemCount } = useWishlist();

  return (
    <Link to="/wishlist" className="relative flex items-center">
      <FaHeart className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-orange-500" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
};