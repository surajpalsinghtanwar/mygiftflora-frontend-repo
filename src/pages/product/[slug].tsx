import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart, FaShare, FaCheck, FaMinus, FaPlus, FaChevronRight, FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';
// products data will be fetched from backend at build time

interface PersonalizationOption {
  type: string; // 'message' | 'image_upload' | 'both'
  messageLabel?: string;
  imageLabel?: string;
  messagePlaceholder?: string;
  maxMessageLength?: number;
  imageTypes?: string[];
  required?: boolean;
}

interface SizeOption {
  id: string;
  weight: string;
  serves: string;
  price: number;
  originalPrice: number;
  isDefault: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  subsubcategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  gallery?: string[];
  description: string;
  inStock: boolean;
  stockCount: number;
  features?: string[];
  weight?: string;
  serves?: string;
  badges?: string[];
  sizeOptions?: SizeOption[];
  personalization?: PersonalizationOption;
}

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, relatedProducts }) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
  const [selectedSizeOption, setSelectedSizeOption] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [messageCharCount, setMessageCharCount] = useState<number>(0);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Check if product supports personalization
  const hasPersonalization = product?.personalization;
  const showMessage = hasPersonalization?.type === 'message' || hasPersonalization?.type === 'both';
  const showImageUpload = hasPersonalization?.type === 'image_upload' || hasPersonalization?.type === 'both';
  const maxMessageLength = hasPersonalization?.maxMessageLength || 50;

  // Initialize selected size option when product loads
  useEffect(() => {
    if (product?.sizeOptions && product.sizeOptions.length > 0) {
      const defaultOption = product.sizeOptions.find(option => option.isDefault) || product.sizeOptions[0];
      setSelectedSizeOption(defaultOption.id);
    }
  }, [product]);

  // Get current selected size option details
  const getCurrentSizeOption = () => {
    if (!product?.sizeOptions || product.sizeOptions.length === 0) {
      return {
        weight: product?.weight || '',
        serves: product?.serves || '',
        price: product?.price || 0,
        originalPrice: product?.originalPrice || 0
      };
    }
    
    const selectedOption = product.sizeOptions.find(option => option.id === selectedSizeOption);
    return selectedOption || product.sizeOptions[0];
  };

  const currentOption = getCurrentSizeOption();

  if (router.isFallback) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="text-center">
            <h1 className="display-4 fw-bold">Product not found</h1>
            <p className="text-muted mt-4">The product you're looking for doesn't exist.</p>
            <button 
              onClick={() => router.push('/products')} 
              className="btn btn-dark btn-lg mt-3 px-4"
            >
              Back to Products
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-dark" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key={fullStars} className="text-dark" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={fullStars + i + 1} className="text-dark" />);
    }
    
    return stars;
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      image: product.imageUrl,
      price: currentOption.price,
      originalPrice: currentOption.originalPrice,
      quantity: quantity,
      size: selectedSizeOption ? currentOption.weight : undefined,
      personalization: {
        message: showMessage && customMessage ? customMessage.trim() : undefined,
        uploadedImage: showImageUpload && uploadedImage ? URL.createObjectURL(uploadedImage) : undefined
      }
    };

    try {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex((item: any) => 
        item.id === product.id && 
        item.size === cartItem.size &&
        item.personalization?.message === cartItem.personalization?.message
      );
      
      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Dispatch custom event to update cart icon
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase' && quantity < product.stockCount) {
      setQuantity(quantity + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const message = e.target.value;
    if (message.length <= maxMessageLength) {
      setCustomMessage(message);
      setMessageCharCount(message.length);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = hasPersonalization?.imageTypes || ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, GIF)');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please upload an image smaller than 5MB');
        return;
      }
      
      setUploadedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setImagePreview('');
  };

  const gallery = product.gallery || [product.imageUrl];

  return (
    <Layout>
      <div className="bg-light min-vh-100">
        <div className="container py-4">
          
          {/* Enhanced Animated Breadcrumbs */}
          <motion.nav 
            aria-label="breadcrumb" 
            className="mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-4 p-4 shadow-sm border">
              <ol className="breadcrumb mb-0 align-items-center">
                <motion.li 
                  className="breadcrumb-item"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a href="/" className="text-decoration-none d-flex align-items-center text-primary fw-medium">
                    <FaHome className="me-2" />
                    Home
                  </a>
                </motion.li>
                <li className="breadcrumb-item">
                  <FaChevronRight className="text-muted small mx-2" />
                </li>
                <motion.li 
                  className="breadcrumb-item"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a href="/products" className="text-decoration-none text-primary fw-medium">
                    Products
                  </a>
                </motion.li>
                <li className="breadcrumb-item">
                  <FaChevronRight className="text-muted small mx-2" />
                </li>
                <motion.li 
                  className="breadcrumb-item"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a href={`/products/${product.category}`} className="text-decoration-none text-primary fw-medium">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </a>
                </motion.li>
                <li className="breadcrumb-item">
                  <FaChevronRight className="text-muted small mx-2" />
                </li>
                <motion.li 
                  className="breadcrumb-item"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a href={`/products/${product.category}/${product.subcategory}`} className="text-decoration-none text-primary fw-medium">
                    {product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)}
                  </a>
                </motion.li>
                <li className="breadcrumb-item">
                  <FaChevronRight className="text-muted small mx-2" />
                </li>
                <li className="breadcrumb-item active fw-bold text-dark" aria-current="page">
                  {product.name}
                </li>
              </ol>
            </div>
          </motion.nav>

          {/* Product Details */}
          <div className="row g-5">
            
            {/* Product Image Gallery */}
            <motion.div 
              className="col-lg-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="position-sticky bg-white rounded-4 p-4 shadow-sm" style={{ top: '100px' }}>
                {/* Product Badges */}
                  {product.badges && product.badges.length > 0 && (
                    <motion.div 
                      className="product-badge"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      {product.badges.map((badge, index) => (
                        <span key={index} className="badge bg-dark text-white me-2 mb-2 px-3 py-2">
                          {badge}
                        </span>
                      ))}
                    </motion.div>
                  )}                <div className="mb-4">
                  <div className="ratio ratio-1x1 bg-light rounded-3 overflow-hidden border-0 shadow-sm">
                    <img
                      src={gallery[selectedImage]}
                      alt={product.name}
                      className="w-100 h-100 object-fit-cover product-image-hover"
                    />
                  </div>
                </div>
                
                {/* Image Thumbnails */}
                {gallery.length > 1 && (
                  <div className="row g-2">
                    {gallery.map((image, index) => (
                      <div key={index} className="col-3">
                        <button
                          onClick={() => setSelectedImage(index)}
                          className={`ratio ratio-1x1 w-100 rounded-2 overflow-hidden border-2 ${
                            selectedImage === index ? 'border-warning' : 'border-transparent'
                          } thumbnail-hover`}
                        >
                          <img 
                            src={image} 
                            alt={`${product.name} thumbnail ${index + 1}`} 
                            className="w-100 h-100 object-fit-cover"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div 
              className="col-lg-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white rounded-4 p-4 shadow-sm h-100">
                <div className="position-relative">
                  {/* Wishlist Button */}
                  <div className="position-absolute top-0 end-0">
                    <button className="btn btn-light btn-lg rounded-circle p-3 wishlist-btn shadow-sm">
                      <FaHeart className="text-muted" />
                    </button>
                  </div>

                  {/* Product Title */}
                  <h1 className="display-6 fw-bold text-dark mb-2">{product.name}</h1>
                  <p className="text-muted small mb-3">SKU: {product.id}</p>
                  
                  {/* Rating */}
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="d-flex">
                      {renderStars(product.rating)}
                    </div>
                    <span className="badge bg-dark text-white px-3 py-2">{product.rating}</span>
                    <span className="text-muted">({product.reviews} reviews)</span>
                  </div>
                  
                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="d-flex align-items-baseline gap-3 mb-2">
                      <span className="display-6 fw-bold text-dark">₹{currentOption.price.toLocaleString()}</span>
                      {currentOption.originalPrice > currentOption.price && (
                        <span className="h4 text-muted text-decoration-line-through">₹{currentOption.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    {currentOption.originalPrice && currentOption.originalPrice > currentOption.price && (
                      <p className="text-success fw-semibold mb-0">
                        You save ₹{(currentOption.originalPrice - currentOption.price).toLocaleString()} ({Math.round(((currentOption.originalPrice - currentOption.price) / currentOption.originalPrice) * 100)}%)
                      </p>
                    )}
                  </div>

                  {/* Enhanced Size Options */}
                  {product.sizeOptions && product.sizeOptions.length > 0 && (
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3 d-flex align-items-center">
                        <span className="me-2">🎂</span>
                        Select Size:
                      </h5>
                      <div className="size-options-container">
                        {product.sizeOptions.map((option) => (
                          <label key={option.id} className="size-option-wrapper">
                            <input
                              type="radio"
                              name="sizeOption"
                              value={option.id}
                              checked={selectedSizeOption === option.id}
                              onChange={(e) => setSelectedSizeOption(e.target.value)}
                              className="d-none"
                            />
                            <div className={`size-option-modern ${
                              selectedSizeOption === option.id ? 'selected' : ''
                            }`}>
                              {/* Discount Badge - positioned absolutely */}
                              {option.originalPrice > option.price && (
                                <div className="discount-badge">
                                  {Math.round(((option.originalPrice - option.price) / option.originalPrice) * 100)}% OFF
                                </div>
                              )}
                              
                              <div className="size-option-content">
                                <div className="weight-display">{option.weight}</div>
                                <div className="serves-display">{option.serves}</div>
                                <div className="price-display">
                                  <span className="current-price">₹{option.price.toLocaleString()}</span>
                                  {option.originalPrice > option.price && (
                                    <span className="original-price">₹{option.originalPrice.toLocaleString()}</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="selection-indicator">
                                <FaCheck />
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-4">
                      <h5 className="fw-bold mb-3">Key Features:</h5>
                      <ul className="list-unstyled">
                        {product.features.map((feature, index) => (
                          <li key={index} className="d-flex align-items-start mb-2">
                            <FaCheck className="text-success me-2 mt-1 small" />
                            <span className="text-muted">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Specifications */}
                  {(currentOption.weight || currentOption.serves) && (
                    <div className="row g-3 mb-4">
                      {currentOption.weight && (
                        <div className="col-6">
                          <div className="bg-light p-3 rounded-3 text-center border">
                            <div className="fw-semibold text-dark">Weight</div>
                            <div className="text-muted">{currentOption.weight}</div>
                          </div>
                        </div>
                      )}
                      {currentOption.serves && (
                        <div className="col-6">
                          <div className="bg-light p-3 rounded-3 text-center border">
                            <div className="fw-semibold text-dark">Serves</div>
                            <div className="text-muted">{currentOption.serves}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="mb-4">
                    <label className="form-label fw-bold h6">Quantity:</label>
                    <div className="d-flex align-items-center gap-3">
                      <div className="d-flex align-items-center bg-white rounded-pill shadow-sm overflow-hidden">
                        <button 
                          onClick={() => handleQuantityChange('decrease')} 
                          className="btn quantity-btn btn-light border-0"
                          disabled={quantity <= 1}
                        >
                          <FaMinus className="small" />
                        </button>
                        <span className="px-4 py-2 fw-bold bg-light text-center" style={{ minWidth: '60px' }}>{quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange('increase')} 
                          className="btn quantity-btn btn-light border-0"
                          disabled={quantity >= product.stockCount}
                        >
                          <FaPlus className="small" />
                        </button>
                      </div>
                      <span className="text-muted small">
                        <strong>{product.stockCount}</strong> items available
                      </span>
                    </div>
                  </div>

                  {/* Personalization Options */}
                  {hasPersonalization && (
                    <motion.div 
                      className="mb-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="personalization-container bg-light rounded-4 p-4 border">
                        <h6 className="fw-bold mb-3 d-flex align-items-center text-primary">
                          <span className="me-2">✨</span>
                          Personalize Your {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </h6>
                        
                        {/* Custom Message Input */}
                        {showMessage && (
                          <div className="mb-4">
                            <label className="form-label fw-bold d-flex align-items-center">
                              <span className="me-2">💬</span>
                              {hasPersonalization?.messageLabel || 'Custom Message'}:
                            </label>
                            <div className="position-relative">
                              <textarea
                                className="form-control rounded-3 shadow-sm"
                                rows={3}
                                placeholder={hasPersonalization?.messagePlaceholder || "Enter your custom message (e.g., Happy Birthday John!)"}
                                value={customMessage}
                                onChange={handleMessageChange}
                                style={{
                                  resize: 'none',
                                  border: '2px solid #e9ecef',
                                  transition: 'all 0.3s ease'
                                }}
                                onFocus={(e) => {
                                  e.target.style.borderColor = '#0d6efd';
                                  e.target.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)';
                                }}
                                onBlur={(e) => {
                                  e.target.style.borderColor = '#e9ecef';
                                  e.target.style.boxShadow = 'none';
                                }}
                              />
                              <div className="position-absolute bottom-0 end-0 p-2">
                                <small className={`text-muted ${messageCharCount > maxMessageLength * 0.8 ? 'text-dark' : ''} ${messageCharCount === maxMessageLength ? 'text-danger' : ''}`}>
                                  {messageCharCount}/{maxMessageLength}
                                </small>
                              </div>
                            </div>
                            <small className="text-muted d-block mt-2">
                              💡 <strong>Free service!</strong> Your message will be beautifully written on your {product.category}
                            </small>
                          </div>
                        )}

                        {/* Image Upload */}
                        {showImageUpload && (
                          <div className="mb-4">
                            <label className="form-label fw-bold d-flex align-items-center">
                              <span className="me-2">📸</span>
                              {hasPersonalization?.imageLabel || 'Upload Your Photo'}:
                            </label>
                            
                            {!imagePreview ? (
                              <div className="upload-area">
                                <input
                                  type="file"
                                  id="imageUpload"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="d-none"
                                />
                                <label 
                                  htmlFor="imageUpload" 
                                  className="upload-zone d-flex flex-column align-items-center justify-content-center rounded-3 border-2 border-dashed p-4 text-center"
                                  style={{ 
                                    minHeight: '150px', 
                                    cursor: 'pointer',
                                    borderColor: '#0d6efd',
                                    backgroundColor: '#f8f9fa',
                                    transition: 'all 0.3s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e7f1ff';
                                    e.currentTarget.style.borderColor = '#0a58ca';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                    e.currentTarget.style.borderColor = '#0d6efd';
                                  }}
                                >
                                  <div className="fs-1 text-primary mb-2">📁</div>
                                  <h6 className="fw-bold text-primary">Click to upload your photo</h6>
                                  <p className="text-muted small mb-0">
                                    Supports JPG, PNG, GIF up to 5MB
                                  </p>
                                </label>
                              </div>
                            ) : (
                              <div className="uploaded-image-preview position-relative">
                                <div className="image-preview-container rounded-3 overflow-hidden border shadow-sm">
                                  <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="img-fluid w-100"
                                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={removeUploadedImage}
                                  className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                                  style={{ width: '30px', height: '30px' }}
                                >
                                  ×
                                </button>
                                <div className="mt-2 text-center">
                                  <small className="text-success fw-medium">
                                    ✅ Image uploaded successfully!
                                  </small>
                                </div>
                              </div>
                            )}
                            
                            <small className="text-muted d-block mt-2">
                              🎨 <strong>High-quality printing!</strong> Your photo will be printed with edible ink on your {product.category}
                            </small>
                          </div>
                        )}

                        {hasPersonalization?.required && (
                          <div className="alert alert-info d-flex align-items-center">
                            <span className="me-2">ℹ️</span>
                            <small>
                              <strong>Note:</strong> Personalization is required for this product.
                            </small>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="row g-3 mb-4">
                    <div className="col-12">
                      <button 
                        onClick={handleAddToCart} 
                        className="btn btn-add-to-cart btn-lg w-100 fw-bold text-white rounded-3 py-3 d-flex align-items-center justify-content-center gap-2"
                      >
                        {addedToCart ? (
                          <>
                            <FaCheck />
                            Added to Cart!
                            {(showMessage && customMessage) || (showImageUpload && uploadedImage) && (
                              <span className="ms-2 small">with personalization</span>
                            )}
                          </>
                        ) : (
                          <>
                            <FaShoppingCart />
                            Add to Cart - ₹{currentOption.price.toLocaleString()}
                            {(showMessage && customMessage) || (showImageUpload && uploadedImage) ? (
                              <span className="ms-2 small">+ Personalized</span>
                            ) : hasPersonalization ? (
                              <span className="ms-2 small text-muted">+ Add Personalization</span>
                            ) : null}
                          </>
                        )}
                      </button>
                      {/* Personalization Status */}
                      {hasPersonalization && (customMessage || uploadedImage) && (
                        <div className="text-center mt-2">
                          <div className="d-flex justify-content-center gap-3 flex-wrap">
                            {showMessage && customMessage && (
                              <small className="text-success fw-medium d-flex align-items-center">
                                <span className="me-1">💬</span>
                                Message: "{customMessage.length > 20 ? customMessage.substring(0, 20) + '...' : customMessage}"
                              </small>
                            )}
                            {showImageUpload && uploadedImage && (
                              <small className="text-success fw-medium d-flex align-items-center">
                                <span className="me-1">📸</span>
                                Photo: {uploadedImage.name}
                              </small>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-8">
                      <button className="btn btn-buy-now btn-lg w-100 fw-bold text-white rounded-3 py-3">
                        Buy Now
                      </button>
                    </div>
                    <div className="col-4">
                      <button className="btn btn-outline-danger btn-lg w-100 rounded-3 py-3 wishlist-btn">
                        <FaHeart />
                      </button>
                    </div>
                  </div>

                  {/* Additional Actions */}
                  <div className="d-flex justify-content-center gap-4 text-muted">
                    <button className="btn btn-link text-muted text-decoration-none p-0">
                      <FaShare className="me-1" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Tabs */}
          <div className="mt-5 bg-white rounded-4 shadow-sm overflow-hidden">
            <ul className="nav nav-pills nav-fill bg-light p-2" id="productTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link rounded-3 fw-bold ${activeTab === 'description' ? 'active bg-primary text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('description')}
                  type="button"
                >
                  Description
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link rounded-3 fw-bold ${activeTab === 'specs' ? 'active bg-primary text-white' : 'text-dark'}`}
                  onClick={() => setActiveTab('specs')}
                  type="button"
                >
                  Specifications
                </button>
              </li>
            </ul>
            <div className="tab-content p-4">
              {activeTab === 'description' && (
                <div className="tab-pane fade show active">
                  <h5 className="fw-bold mb-3 text-dark">Product Description</h5>
                  <p className="text-muted lh-lg fs-6">{product.description}</p>
                  {product.features && product.features.length > 0 && (
                    <div className="mt-4">
                      <h6 className="fw-bold mb-3 text-dark">Key Features:</h6>
                      <div className="row g-2">
                        {product.features.map((feature, index) => (
                          <div key={index} className="col-md-6">
                            <div className="d-flex align-items-start p-3 bg-light rounded-3">
                              <FaCheck className="text-success me-3 mt-1" />
                              <span className="text-dark fw-medium">{feature}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'specs' && (
                <div className="tab-pane fade show active">
                  <h5 className="fw-bold mb-4 text-dark">Product Specifications</h5>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="bg-light rounded-3 p-4">
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                          <strong className="text-dark">Weight:</strong>
                          <span className="text-muted fw-medium">{currentOption.weight || 'Not specified'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                          <strong className="text-dark">Serves:</strong>
                          <span className="text-muted fw-medium">{currentOption.serves || 'Not specified'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <strong className="text-dark">SKU:</strong>
                          <span className="text-muted fw-medium">{product.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bg-light rounded-3 p-4">
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                          <strong className="text-dark">Rating:</strong>
                          <div className="d-flex align-items-center gap-2">
                            <div className="d-flex">
                              {renderStars(product.rating)}
                            </div>
                            <span className="text-muted fw-medium">({product.rating})</span>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                          <strong className="text-dark">Reviews:</strong>
                          <span className="text-muted fw-medium">{product.reviews} reviews</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <strong className="text-dark">Stock:</strong>
                          <span className="text-success fw-medium">{product.stockCount} available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-5">
            <h2 className="text-center fw-bold mb-4">Related Products</h2>
            <div className="row g-4">
              {relatedProducts.map((relatedProduct) => {
                const relatedDiscount = Math.round(((relatedProduct.originalPrice - relatedProduct.price) / Math.max(relatedProduct.originalPrice, 1)) * 100);
                return (
                  <div key={relatedProduct.id} className="col-md-6 col-lg-3">
                    <div 
                      className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden"
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                      onClick={() => router.push(`/product/${relatedProduct.slug}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                      }}
                    >
                      <div className="position-relative">
                        <img 
                          src={relatedProduct.imageUrl} 
                          className="card-img-top" 
                          alt={relatedProduct.name}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        {relatedDiscount > 0 && (
                          <span className="position-absolute top-0 end-0 m-2 badge bg-danger px-2 py-1 rounded-pill">
                            {relatedDiscount}% OFF
                          </span>
                        )}
                        {relatedProduct.badges && relatedProduct.badges.length > 0 && (
                          <span className="position-absolute top-0 start-0 m-2 badge bg-success px-2 py-1 rounded-pill">
                            {relatedProduct.badges[0]}
                          </span>
                        )}
                      </div>
                      
                      <div className="card-body p-3">
                        <h6 className="card-title fw-bold mb-2 text-truncate">{relatedProduct.name}</h6>
                        
                        <div className="d-flex align-items-center mb-2">
                          {renderStars(relatedProduct.rating)}
                          <span className="text-muted ms-1 small">({relatedProduct.reviews})</span>
                        </div>
                        
                        <div className="d-flex align-items-baseline gap-2">
                          <span className="h6 fw-bold text-dark mb-0">₹{relatedProduct.price.toLocaleString()}</span>
                          {relatedProduct.originalPrice > relatedProduct.price && (
                            <span className="text-muted text-decoration-line-through small">
                              ₹{relatedProduct.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<ProductDetailProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
  const candidates = [
    `${backendBase.replace(/\/?$/, '')}/v1/inventory/products`,
    `${backendBase.replace(/\/?$/, '')}/products`,
    `${backendBase.replace(/\/?$/, '')}/admin/products`,
  ];

  let products: any[] = [];
  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = await res.json();
      products = json?.data || json?.products || json || [];
      if (Array.isArray(products) && products.length) break;
    } catch (err) {
      // ignore and try next
    }
  }

  // fallback to local file
  if ((!products || products.length === 0)) {
    try {
      const module = await import('../../data/products.json');
      products = module?.default?.products || module || [];
    } catch (err) {
      products = [];
    }
  }

  const product = (products || []).find((p: any) => p.slug === slug || (p.name && String(p.name).toLowerCase().replace(/\s+/g, '-') === slug)) || null;

  if (!product) {
    return { notFound: true };
  }

  // Map to the Product interface used by the page
  const mapped = {
    id: product.id || product._id || String(product.sku || product.id || ''),
    name: product.name || product.title || 'Unnamed Product',
    slug: product.slug || (product.name && String(product.name).toLowerCase().replace(/\s+/g, '-')) || String(product.id || ''),
    category: product.category?.slug || product.category || product.category_id || product.categoryName || 'general',
    subcategory: product.subcategory?.slug || product.subcategory || product.subcategory_id || product.subcategoryName || '',
    subsubcategory: product.subsubcategory?.slug || product.subsubcategory || product.subsubcategory_id || product.subsubcategoryName || '',
    price: Number(product.price || product.sale_price || product.discounted_price || 0),
    originalPrice: Number(product.originalPrice || product.mrp || product.list_price || product.price || 0),
    rating: Number(product.rating || 0),
    reviews: Number(product.reviews || product.review_count || 0),
    imageUrl: product.imageUrl || product.mainImage || product.thumbnail || (product.images && product.images[0]) || '',
    gallery: product.gallery || product.images || [],
    description: product.description || product.short_description || '',
    inStock: !!(product.inStock ?? product.available ?? true),
    stockCount: Number(product.stockCount || product.qty || product.quantity || 0),
    features: product.features || [],
    weight: product.weight || product.size || '',
    serves: product.serves || product.servings || '',
    badges: product.badges || [],
    sizeOptions: product.sizeOptions || product.variants || [],
    personalization: product.personalization || null,
  };

  // derive related products (same category, different id)
  const allMapped = (products || []).map((p: any) => ({
    id: p.id || p._id || String(p.sku || p.id || ''),
    name: p.name || p.title || 'Unnamed Product',
    slug: p.slug || (p.name && String(p.name).toLowerCase().replace(/\s+/g, '-')) || String(p.id || ''),
    category: p.category?.slug || p.category || p.category_id || p.categoryName || 'general',
    subcategory: p.subcategory?.slug || p.subcategory || p.subcategory_id || p.subcategoryName || '',
    subsubcategory: p.subsubcategory?.slug || p.subsubcategory || p.subsubcategory_id || p.subsubcategoryName || '',
    price: Number(p.price || p.sale_price || p.discounted_price || 0),
    originalPrice: Number(p.originalPrice || p.mrp || p.list_price || p.price || 0),
    rating: Number(p.rating || 0),
    reviews: Number(p.reviews || p.review_count || 0),
    imageUrl: p.imageUrl || p.mainImage || p.thumbnail || (p.images && p.images[0]) || '',
    description: p.description || p.short_description || '',
    inStock: !!(p.inStock ?? p.available ?? true),
    stockCount: Number(p.stockCount || p.qty || p.quantity || 0),
    badges: p.badges || [],
  }));

  const relatedProducts = allMapped.filter((rp: any) => rp.category === mapped.category && rp.id !== mapped.id).slice(0, 4);

  return {
    props: {
      product: mapped,
      relatedProducts,
    },
  };
};

export default ProductDetail;