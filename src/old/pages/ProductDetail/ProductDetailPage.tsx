// // import { useEffect } from 'react';
// // import { useParams } from 'react-router-dom';
// // import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
// // import { 
// //   fetchProductBySlugAsync, 
// //   selectSelectedProduct, 
// //   selectProductStatus,
// //   selectProductError 
// // } from '../../features/products/productSlice';

// // // Common Components
// // import { Breadcrumbs } from '../../components/common/Breadcrumbs';
// // import { LoadingSpinner } from '../../components/common/LoadingSpinner';
// // import { ErrorMessage } from '../../components/common/ErrorMessage';

// // // Feature Components
// // import { ProductImageGallery } from '../../features/products/ProductImageGallery';
// // import { ProductInfo } from '../../features/products/ProductInfo';
// // import { ProductTabs } from '../../features/products/ProductTabs';
// // import { RelatedProducts } from '../../features/products/RelatedProducts';

// // const ProductDetailPage: React.FC = () => {
// //   const dispatch = useAppDispatch();
  
// //   // Get `slug` from the URL parameters (e.g., /product/:slug)
// //   const { slug } = useParams<{ slug: string }>(); 
  
// //   const productData = useAppSelector(selectSelectedProduct);
// //   const status = useAppSelector(selectProductStatus);
// //   const error = useAppSelector(selectProductError);

// //   useEffect(() => {

// //     if (slug) {
// //       dispatch(fetchProductBySlugAsync(slug));
// //     }

// //   }, [slug, dispatch]);

// //   if (status === 'loading' && !productData) {
// //     return <LoadingSpinner />;
// //   }

// //   if (status === 'failed') {
// //     return <ErrorMessage message={error || 'Could not load product details.'} />;
// //   }

// //   if (!productData) {
// //       return <LoadingSpinner />;
// //   }

// //   return (
// //     <div className="bg-white dark:bg-gray-900">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         <div className="mb-6">
// //           <Breadcrumbs crumbs={productData.breadcrumbs} />
// //         </div>
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
// //           <ProductImageGallery images={productData.images} productName={productData.name} />
// //           <ProductInfo product={productData} />
// //         </div>
// //         <ProductTabs description={productData.longDescription} specifications={productData.specifications} />
// //         <RelatedProducts products={productData.relatedProducts} />
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductDetailPage;
// // my-ecommerce-app/src/pages/ProductDetail/ProductDetailPage.tsx
// // my-ecommerce-app/src/pages/ProductDetail/ProductDetailPage.tsx
// // C:\themurphy-ui\src\pages\ProductDetail\ProductDetailPage.tsx
// // Page component for displaying single product details

// // C:\themurphy-ui\src\pages\ProductDetail\ProductDetailPage.tsx
// // Page component for displaying single product details

// import { useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks.ts';
// import {
//   fetchProductBySlugAsync, // Thunk to fetch data
//   selectSelectedProduct, // Selector for product data
//   selectProductStatus, // Selector for fetch status
//   selectProductError, // Selector for fetch error
//   //  clearSelectedProduct // Action to clear state on unmount/slug change
// } from '../../features/products/productSlice.ts'; // Assuming this slice is used

// // Import types from shared types
// // import type { ProductDetailData, Specification } from '../../types/SharedTypes';

// // Import common components (assuming they exist and match type expectations)
// import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx'; // Assuming this exists
// import { ErrorMessage } from '../../components/common/ErrorMessage.tsx'; // Assuming this exists
// // You will need to create or import these components:
// import { Breadcrumbs } from '../../components/common/Breadcrumbs.tsx'; // Assuming this exists
// import { ProductImageGallery } from '../../features/products/ProductImageGallery.tsx'; // Assuming this exists
// import { ProductInfo } from '../../features/products/ProductInfo.tsx'; // Assuming this exists
// import { ProductTabs } from '../../features/products/ProductTabs.tsx'; // Assuming this exists
// import { RelatedProducts } from '../../features/products/RelatedProducts.tsx'; // Assuming this exists


// const ProductDetailPage: React.FC = () => {
//   const dispatch = useAppDispatch();

//   // Get the 'slug' parameter from the URL
//   const { slug } = useParams<{ slug: string }>();

//   // Select data, status, and error from the product slice
//   // This will get data from the preloaded state if the backend injected it during SSR
//   const productData = useAppSelector(selectSelectedProduct);
//   const status = useAppSelector(selectProductStatus); // Status for selectedProduct
//   const error = useAppSelector(selectProductError); // Error for selectedProduct


//   useEffect(() => {
//     // This effect runs after the component mounts (on both server and client initially,
//     // but effects only run on client) or when slug changes (client-side navigation).
//     // We only need to fetch data client-side if:
//     // 1. A slug exists in the URL parameters.
//     // 2. AND the data for THIS slug is NOT already in the store from SSR preloading or a previous fetch.
//     // 3. AND the store status is NOT 'loading' for a product fetch.

//     // Ensure a slug is present in the URL
//     if (!slug) {
//         console.warn("ProductDetailPage useEffect: No slug found in URL params.");
//         return; // Do nothing if no slug
//     }

//     // Check if data is already loaded for the current slug
//     const isDataLoadedForThisSlug = productData && productData.slug === slug && status === 'succeeded';
//     // Check if a fetch is currently in progress
//     const isCurrentlyLoading = status === 'loading';


//     console.log(`ProductDetailPage useEffect: slug=${slug}, isDataLoadedForThisSlug=${isDataLoadedForThisSlug}, status=${status}`);

//     // If data is NOT loaded for this slug AND we are NOT currently loading, then dispatch the fetch.
//     // This handles client-side navigation to a *different* product and initial load IF SSR didn't preload it.
//     if (!isDataLoadedForThisSlug && !isCurrentlyLoading) {
//         console.log(`ProductDetailPage useEffect: Triggering client-side fetch for slug: ${slug}`);
//         dispatch(fetchProductBySlugAsync(slug));
//     }

//      // Cleanup function: Clear the selected product state when component unmounts or slug changes
//      // This prevents briefly showing stale data when navigating to a different product detail page.
//     //  return () => {
//     //      console.log("ProductDetailPage: Cleaning up selected product state.");
//     //      dispatch(clearSelectedProduct());
//     //  }

//   }, [slug, dispatch, productData, status]); // Depend on slug, dispatch, productData, and status


//   // --- Conditional Rendering based on Redux State ---

//   // Show loading spinner if status is 'loading' AND there's no data currently displayed
//   // This happens on initial load if SSR didn't preload (CSR fallback) or during client-side fetches.
//   if (status === 'loading' && !productData) {
//     console.log("ProductDetailPage: Rendering LoadingSpinner");
//     return <LoadingSpinner />;
//   }

//   // Show error message if status is 'failed' AND there's no data currently displayed
//   // This happens if fetching failed (both SSR fetch leading to 'failed' status, or client-side fetch failed).
//    if (status === 'failed' && !productData) {
//      console.log("ProductDetailPage: Rendering ErrorMessage");
//      return <ErrorMessage message={error || 'Could not load product details.'} />;
//   }

//   // If we are not loading and not failed, but still no productData:
//   // This might happen if the backend's SSR fetch resulted in data: null but status 'succeeded' (backend issue)
//   // or if initial state was somehow bad. Treat as data not available.
//   if (!productData) {
//       console.log("ProductDetailPage: Rendering 'Product data not available'");
//       // Show the specific error message if available, otherwise a generic not found
//       return <ErrorMessage message={error || "Product not found or data not available."} />;
//   }

//   // --- Render Product Details (Data is available in the store) ---
//   // This will be rendered during SSR (using preloaded data) and on client after hydration or fetch completion.
//   console.log("ProductDetailPage: Rendering product details for", productData.name);

//    // Assuming ProductDetailData matches the type expected by these display components
//    return (
//     <div className="bg-white dark:bg-gray-900 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

//         {/* Breadcrumbs - Ensure productData.breadcrumbs exists and has items */}
//         <div className="mb-6">
//           {productData.breadcrumbs && productData.breadcrumbs.length > 0 && (
//              // Ensure Breadcrumbs component accepts 'crumbs' prop
//             <Breadcrumbs crumbs={productData.breadcrumbs} />
//           )}
//         </div>

//         {/* Product Image Gallery and Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
//           {/* Product Image Gallery - Ensure images array exists */}
//           {productData.images && productData.images.length > 0 && (
//              // Ensure ProductImageGallery component accepts 'images' and 'productName' props
//             <ProductImageGallery images={productData.images} productName={productData.name} />
//           )}
//            {/* Product Info - Ensure ProductInfo component accepts 'product' prop */}
//           <ProductInfo product={productData} />
//         </div>

//         {/* Product Tabs (Description and Specifications) */}
//         {/* Ensure longDescription or specifications exist before rendering tabs */}
//         {(productData.longDescription || (productData.specifications && productData.specifications.length > 0)) && (
//              // Ensure ProductTabs component accepts 'description' and 'specifications' props
//             <ProductTabs description={productData.longDescription} specifications={productData.specifications} />
//         )}


//         {/* Related Products */}
//         {/* Ensure relatedProducts array exists and has items */}
//         {productData.relatedProducts && productData.relatedProducts.length > 0 && (
//             // Ensure RelatedProducts component accepts 'products' prop
//             <RelatedProducts products={productData.relatedProducts} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;

import { useEffect } from 'react'; // Keep if needed for client-side only effects
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  // Remove fetchProductBySlugAsync dispatch from useEffect
  selectSelectedProduct,
  selectProductStatus, // Keep status
  selectProductError
} from '../../features/products/productSlice';

// Common Components
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { LoadingSpinner } from '../../components/common/LoadingSpinner'; // May need adjustments
import { ErrorMessage } from '../../components/common/ErrorMessage';

// Feature Components
import { ProductImageGallery } from '../../features/products/ProductImageGallery';
import { ProductInfo } from '../../features/products/ProductInfo';
import { ProductTabs } from '../../features/products/ProductTabs';
import { RelatedProducts } from '../../features/products/RelatedProducts';

const ProductDetailPage: React.FC = () => {
  const dispatch = useAppDispatch(); // Keep for client-side actions

  // Get `slug` from the URL parameters
  const { slug } = useParams<{ slug: string }>();

  // Data should already be in the store if SSR worked
  const productData = useAppSelector(selectSelectedProduct);
  const status = useAppSelector(selectProductStatus); // Status reflects the *server* fetch result initially
  const error = useAppSelector(selectProductError); // Error reflects the *server* fetch result initially


  // REMOVE or modify this useEffect. Data for the initial load
  // comes from the server now.
  // useEffect(() => {
  //   if (slug) {
  //     dispatch(fetchProductBySlugAsync(slug));
  //   }
  // }, [slug, dispatch]);

  // Adjust loading state check - check if productData is null *and* status is loading
  if (status === 'loading' && !productData) {
    return <LoadingSpinner />;
  }

  if (status === 'failed') {
    return <ErrorMessage message={error || 'Could not load product details.'} />;
  }

  // If productData is null *after* loading/error checks, it means the server
  // didn't find the product or there was a data issue not caught by status='failed'.
  if (!productData) {
      // You might return a 404 page here in a real app
      return <div className="flex justify-center items-center h-screen">Product not found.</div>;
  }

  // Render with data already populated from the server
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ensure productData has breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs crumbs={productData.breadcrumbs || []} /> {/* Provide default empty array */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Ensure productData has images */}
          <ProductImageGallery images={productData.images || []} productName={productData.name} /> {/* Provide default empty array */}
          {/* Ensure ProductInfo uses productData structure */}
          <ProductInfo product={productData as any} /> {/* Type assertion if needed */}
        </div>
        {/* Ensure productData has description and specifications */}
        <ProductTabs description={productData.longDescription || ''} specifications={productData.specifications || []} /> {/* Provide defaults */}
         {/* Ensure productData has relatedProducts */}
        <RelatedProducts products={productData.relatedProducts || []} /> {/* Provide default empty array */}
      </div>
    </div>
  );
};

export default ProductDetailPage;
