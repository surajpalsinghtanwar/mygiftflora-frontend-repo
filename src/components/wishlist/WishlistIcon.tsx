import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

export const WishlistIcon: React.FC = () => {
  // For now, using dummy data - replace with actual wishlist state from Redux
  const itemCount = 0;

  return (
    <Link href="/wishlist" className="btn btn-link text-white text-decoration-none d-flex align-items-center gap-2 p-2 position-relative">
      <FaHeart />
      <span className="d-none d-xl-block">Wishlist</span>
      {itemCount > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.75rem' }}>
          {itemCount}
        </span>
      )}
    </Link>
  );
};