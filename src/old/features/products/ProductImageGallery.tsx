import { useState, useEffect } from 'react';
import type { ProductImageGalleryProps } from '../../types/ProductsTypes';

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 rounded-lg flex items-center justify-center">No Image</div>;
  }

  return (
    <div>
      <div className="aspect-w-1 aspect-h-1 w-full bg-gray-100 rounded-lg overflow-hidden border">
        <img
          src={selectedImage}
          alt={productName}
          className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
        />
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden border-2 transition ${
              selectedImage === image ? 'border-orange-500' : 'border-transparent'
            }`}
          >
            <img src={image} alt={`${productName} thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
          </button>
        ))}
      </div>
    </div>
  );
};