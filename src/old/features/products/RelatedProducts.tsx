import { ProductCard } from '../../components/common/ProductCard';
import type { ProductSummary } from '../../types/ProductsTypes';


interface RelatedProductsProps {
  products: ProductSummary[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => (
  <div className="mt-16">
    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">Related Products</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  </div>
);