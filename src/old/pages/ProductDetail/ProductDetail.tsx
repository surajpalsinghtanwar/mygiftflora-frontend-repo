import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { 
  fetchProductBySlugAsync, 
  selectSelectedProduct, 
  selectProductStatus,
  selectProductError 
} from '../../features/products/productSlice';

// Common Components
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';

// Feature Components
import { ProductImageGallery } from '../../features/products/ProductImageGallery';
import { ProductInfo } from '../../features/products/ProductInfo';
import { ProductTabs } from '../../features/products/ProductTabs';
import { RelatedProducts } from '../../features/products/RelatedProducts';

const ProductDetailPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Get `slug` from the URL parameters (e.g., /product/:slug)
  const { slug } = useParams<{ slug: string }>(); 
  
  const productData = useAppSelector(selectSelectedProduct);
  const status = useAppSelector(selectProductStatus);
  const error = useAppSelector(selectProductError);

  useEffect(() => {

    if (slug) {
      dispatch(fetchProductBySlugAsync(slug));
    }

  }, [slug, dispatch]);

  if (status === 'loading' && !productData) {
    return <LoadingSpinner />;
  }

  if (status === 'failed') {
    return <ErrorMessage message={error || 'Could not load product details.'} />;
  }

  if (!productData) {
      return <LoadingSpinner />;
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Breadcrumbs crumbs={productData.breadcrumbs} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <ProductImageGallery images={productData.images} productName={productData.name} />
          <ProductInfo product={productData} />
        </div>
        <ProductTabs description={productData.longDescription} specifications={productData.specifications} />
        <RelatedProducts products={productData.relatedProducts} />
      </div>
    </div>
  );
};

export default ProductDetailPage;