

import { useEffect } from 'react';
// Keep useParams for breadcrumbs/titles
// Import useLoaderData for the successful data returned by the loader
// Import useRouteError for errors thrown by the loader
import { useParams, useLoaderData, useRouteError } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { isRouteErrorResponse } from 'react-router-dom'; // Helper to check if error is a Response


import {
    // Keep these if you need client-side fetching for scenarios *not* handled by data router navigation
    // (Less common in a full data router setup where client nav re-runs loaders)
    fetchProductsAsync,
    fetchProductsByCategoryAsync,
    fetchProductsBySubCategoryAsync,
    fetchProductsBySubSubCategoryAsync,
    clearProductList, // Keep cleanup if needed
} from '../../features/products/productSlice';


import { ProductCard } from '../../components/common/ProductCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner'; // Keep if you track client-side loading
import { ErrorMessage } from '../../components/common/ErrorMessage'; // Keep for errors
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import type { ProductSummary } from '../../types/ProductsTypes'; // Import necessary type


// Define the types for the URL parameters
interface ProductListRouteParams {
    category?: string;
    subcategory?: string; // Correct parameter name
    subsubcategory?: string; // Correct parameter name
    [key: string]: string | undefined; // Index signature for safety with useParams
}

const ProductListingPage: React.FC = () => {
  const dispatch = useAppDispatch(); // Keep dispatch if using clearList cleanup


  // Extract parameters using corrected names (used for breadcrumbs, titles)
  const { category, subcategory, subsubcategory } = useParams<ProductListRouteParams>();

  const products = useLoaderData() as ProductSummary[] | null | undefined; // Explicitly include undefined possibility
  console.log('Client: ProductListingPage - Data from useLoaderData:', products);

  const error = useRouteError();
  console.error("Client: ProductListingPage - Error from useRouteError:", error);

  useEffect(() => {
      // Example cleanup: Clear list in Redux when parameters change or component unmounts
      // This helps ensure stale data isn't shown if Redux state is used elsewhere,
      // or if you navigate away from a loaded list page.
      return () => {
          console.log("Client: ProductListingPage useEffect cleanup - clearProductList");
          dispatch(clearProductList()); // Assuming this action exists and is needed
      };
       // Add dependencies if cleanup depends on params: [dispatch, category, subcategory, subsubcategory]
   }, [dispatch]); // Simple cleanup on mount/unmount depends only on dispatch


  // --- End Optional Client-side logic ---


  // Build breadcrumbs based on available parameters
  const crumbs = [{ label: 'Products', path: '/products' }];
  let currentPath = '/products';
  if (category) {
      const categoryLabel = category.replace(/-/g, ' ');
      currentPath += `/${category}`;
      crumbs.push({ label: categoryLabel, path: currentPath });
      if (subcategory) {
          const subcategoryLabel = subcategory.replace(/-/g, ' ');
          currentPath += `/${subcategory}`;
           crumbs.push({ label: subcategoryLabel, path: currentPath });
          if (subsubcategory) {
               const subSubcategoryLabel = subsubcategory.replace(/-/g, ' ');
               currentPath += `/${subsubcategory}`;
               crumbs.push({ label: subSubcategoryLabel, path: currentPath });
          }
      }
  }

  // Determine the page title
  const pageTitle = subsubcategory?.replace(/-/g, ' ') || subcategory?.replace(/-/g, ' ') || category?.replace(/-/g, ' ') || 'Products';


  // --- CORRECTED Rendering Logic: Handle Error, Loading, No Data, and Success ---

  // 1. Handle Loader Errors: If useRouteError caught something
  if (error) {
      console.log("ProductListingPage: Rendering error state.");
       // Check if the error is a Response object (like the 404 or 500 you throw from loader)
      if (isRouteErrorResponse(error)) {
          // Render a specific message for Response errors
          return (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-red-600">
                  <h1 className="text-2xl font-bold mb-4">Error: {error.status} - {error.statusText}</h1>
                  {/* Error.data might contain a message if you threw Response("message", { status: ... }) */}
                  <p className="text-gray-600 dark:text-gray-400">{error.data?.toString() || "An error occurred while loading products."}</p>
              </div>
          );
      }

      console.error("ProductListingPage: Rendering generic error state for non-Response error.");
      return (
           <div className="flex flex-col items-center justify-center min-h-[300px] text-red-600">
               <h1 className="text-2xl font-bold mb-4">An Unexpected Error Occurred</h1>
               {/* error.message might exist if it's an Error object */}
               <p className="text-gray-600 dark:text-gray-400">{ (error as any).message || "Something went wrong."}</p> {/* Cast to any to safely access message */}
           </div>
      );
  }

 

  // 3. Handle No Data Found: If the loader succeeded but returned null or an empty array.
  // Check if products is null, undefined, or an empty array.
  const hasProducts = Array.isArray(products) && products.length > 0; // Check if it's an array AND has items

   if (!hasProducts) {
       console.log("Client: ProductListingPage - Loader returned no products or null/undefined.");
        // Display message if loader finished successfully and found no products
        return (
             <div className="flex flex-col items-center justify-center min-h-[300px]">
                <p className="text-xl text-gray-600 dark:text-gray-400">No products found in this category.</p>
             </div>
        );
   }

   // 4. Handle Success: If products data is available (from useLoaderData) AND has items
    console.log("Client: ProductListingPage - Rendering product list from useLoaderData.", products);
    // products is guaranteed to be ProductSummary[] here due to the hasProducts check above.
    const productList = products as ProductSummary[]; // Type assertion is safe here


  return (
    <div className="bg-gray-50 dark:bg-gray-900 w-full min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
            <Breadcrumbs crumbs={crumbs} />
        </div>
        <h1 className="text-3xl font-bold mb-8 capitalize text-gray-800 dark:text-white">
          {pageTitle}
        </h1>
         {/* Render grid if there are products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {productList.map(product => ( // Use the casted productList
              // Ensure ProductCard uses product.image and product.path
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
      </div>
    </div>
  );
};

export default ProductListingPage;