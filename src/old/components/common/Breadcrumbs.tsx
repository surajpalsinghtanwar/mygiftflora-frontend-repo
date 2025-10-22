import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import type { Breadcrumb } from '../../types/ProductsTypes';

interface BreadcrumbsProps {
  crumbs: Breadcrumb[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => (
  <nav className="flex items-center text-sm text-gray-500">
    {crumbs.map((crumb, index) => (
      <div key={crumb.path} className="flex items-center">
        <Link to={crumb.path} className="hover:text-orange-600">
          {crumb.label}
        </Link>
        {index < crumbs.length - 1 && (
          <FaChevronRight className="mx-2 h-3 w-3" />
        )}
      </div>
    ))}
  </nav>
);