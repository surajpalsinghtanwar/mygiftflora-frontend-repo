// import React from 'react'
// import FurnitureDashboard from '../../components/common/FurnitureDashboard.tsx'
// // Placeholder imports for future API-driven data and translation
// // import { useTranslation } from 'react-i18next';
// // import { useProducts, useCategories } from '../../hooks';

// // 1. Slider Banner Component (to be implemented or imported)
// const SliderBanner = () => (
//   <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-6">
//     <span className="text-white text-2xl font-bold">[Slider Banner Placeholder]</span>
//   </div>
// )

// // 2. New Arrivals Section
// const NewArrivals = () => (
//   <section className="mb-6">
//     <h2 className="text-xl font-semibold mb-2">New Arrivals</h2>
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//       {/* Map new arrival products here */}
//       {[1, 2, 3, 4].map((id) => (
//         <div
//           key={id}
//           className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center"
//         >
//           <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
//           <span className="font-medium">Product {id}</span>
//           <span className="text-sm text-gray-500">$99.99</span>
//         </div>
//       ))}
//     </div>
//   </section>
// )

// // 3. Categories & Filters
// const CategoriesFilters = () => (
//   <section className="mb-6">
//     <div className="flex flex-wrap gap-2 items-center mb-2">
//       {/* Map categories here */}
//       {['Electronics', 'Clothing', 'Books', 'Home', 'Toys', 'Sports'].map((cat) => (
//         <button
//           key={cat}
//           className="px-4 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 border border-gray-200 dark:border-gray-600 text-sm font-medium transition"
//         >
//           {cat}
//         </button>
//       ))}
//       <button className="ml-auto flex items-center gap-1 px-4 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition">
//         <svg
//           width="18"
//           height="18"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707l-6.414 6.414A1 1 0 0 0 14 13.414V19a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-5.586a1 1 0 0 0-.293-.707L3.293 6.707A1 1 0 0 1 3 6V4z"
//           />
//         </svg>
//         Filters
//       </button>
//     </div>
//   </section>
// )

// // 4. Product Grid
// const ProductGrid = () => (
//   <section>
//     <h2 className="text-xl font-semibold mb-2">Products</h2>
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//       {/* Map products here */}
//       {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
//         <div
//           key={id}
//           className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center"
//         >
//           <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
//           <span className="font-medium">Product {id}</span>
//           <span className="text-sm text-gray-500">$99.99</span>
//         </div>
//       ))}
//     </div>
//   </section>
// )

// const HomeSection = () => (
//   <div className="w-full max-w-7xl mx-auto">
//     <SliderBanner />
//     <FurnitureDashboard />
//     <NewArrivals />
//     <CategoriesFilters />
//     <ProductGrid />
//   </div>
// )

// export default HomeSection

// src/pages/Home/HomeSection.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks.ts';
import {
  fetchHomePageDataAsync,
  selectHomePageData,
  selectHomePageStatus,
  selectHomePageError
} from '../../features/home/homeSlice';

// Import common components
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProductCard } from '../../components/common/ProductCard'; // Assuming ProductCard exists
import FurnitureDashboard from '../../components/common/FurnitureDashboard.tsx'; // Keep your existing dashboard

// Import new home-specific components
import { HomeSlider } from '../../features/home/HomeSlider.tsx'; // Will create this
import { FeaturedCategories } from '../../features/home/FeaturedCategories.tsx'; // Will create this

const HomeSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const homeData = useAppSelector(selectHomePageData);
  const status = useAppSelector(selectHomePageStatus);
  const error = useAppSelector(selectHomePageError);

  useEffect(() => {
    // Fetch data only if status is idle
    if (status === 'idle') {
      dispatch(fetchHomePageDataAsync());
    }
  }, [status, dispatch]); // Depend on status and dispatch

  if (status === 'loading' && !homeData) { // Show spinner if loading and no data yet
    return <LoadingSpinner />;
  }

  if (status === 'failed') { // Show error if fetching failed
    return <ErrorMessage message={error || 'Could not load home page data.'} />;
  }

  // Don't render content if data is still null after loading/error check
  if (!homeData) {
      return <div className="flex justify-center items-center h-screen">No home data available.</div>;
  }


  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Hero Slider Section */}
      <HomeSlider sliders={homeData.sliders} />

      {/* Keep your Furniture Dashboard */}
      <FurnitureDashboard />

      {/* Featured Categories Section */}
      <FeaturedCategories categories={homeData.featuredCategories} />

      {/* New Arrivals Section */}
      <section className="my-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">New Arrivals</h2>
        {homeData.newArrivals && homeData.newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {homeData.newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
           <p className="text-center text-gray-600 dark:text-gray-400">No new arrivals found.</p>
        )}
      </section>

      {/* Featured Products Section */}
       <section className="my-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Featured Products</h2>
        {homeData.featuredProducts && homeData.featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {homeData.featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
           <p className="text-center text-gray-600 dark:text-gray-400">No featured products found.</p>
        )}
      </section>

      {/* Add other sections as needed */}
    </div>
  );
};

export default HomeSection;