// src/features/home/HomeSlider.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { SliderItem } from '../../types/HomeTypes';

interface HomeSliderProps {
  sliders: SliderItem[];
}

// Using a simple static display for now. For a real slider,
// you would integrate a library like Swiper or slick-carousel.
export const HomeSlider: React.FC<HomeSliderProps> = ({ sliders }) => {
  if (!sliders || sliders.length === 0) {
    return null; // Don't render if no slider items
  }

  // Displaying the first slider item as a placeholder
  const firstSlider = sliders[0];

  return (
    <section className="w-full my-6 rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
        <img
          src={firstSlider.imageUrl}
          alt={firstSlider.title}
          className="w-full h-60 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-white text-center p-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow">{firstSlider.title}</h1>
          {firstSlider.subtitle && (
            <p className="text-lg md:text-xl mb-4 drop-shadow">{firstSlider.subtitle}</p>
          )}
          {firstSlider.link && firstSlider.buttonText && (
            <Link
              to={firstSlider.link}
              className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-md text-lg hover:bg-orange-600 transition-colors"
            >
              {firstSlider.buttonText}
            </Link>
          )}
        </div>
      </div>
      {/* You would add dots or navigation for multiple slides here */}
    </section>
  );
};