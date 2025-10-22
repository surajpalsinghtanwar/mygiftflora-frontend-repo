// src/features/home/FeaturedCategories.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { CategoryItem } from '../../types/HomeTypes';

interface FeaturedCategoriesProps {
  categories: CategoryItem[];
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ categories }) => {
    if (!categories || categories.length === 0) {
        return null; // Don't render if no categories
    }

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/products/${category.slug}`}
            className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden group"
          >
            <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-orange-500 transition-colors">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};