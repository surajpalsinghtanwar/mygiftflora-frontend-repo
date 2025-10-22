import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaShoppingCart, FaSearch, FaFilter } from 'react-icons/fa';
import { motion } from 'framer-motion';
// products data will be fetched from backend at build time

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
  description: string;
  inStock: boolean;
  stockCount: number;
  badges?: string[];
}

interface ProductsPageProps {
  products: Product[];
  categories: string[];
}

const ProductsPage: React.FC<ProductsPageProps> = ({ products, categories }) => {
  const router = useRouter();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assuming newer products have higher IDs
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        // Featured/default order
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, sortBy, products]);

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

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.slug}`);
  };

  return (
    <Layout>
      <div className="bg-light min-vh-100">
        {/* Hero Section */}
        <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="container">
            <motion.div 
              className="text-center text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="display-4 fw-bold mb-3">Our Products</h1>
              <p className="lead mb-4">Discover our amazing collection of cakes, flowers, and gifts</p>
            </motion.div>
          </div>
        </section>

        <div className="container py-5">
          {/* Filters and Search */}
          <motion.div 
            className="row mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="col-md-8">
              <div className="row g-3">
                {/* Search */}
                <div className="col-md-6">
                  <div className="position-relative">
                    <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                    <input
                      type="text"
                      className="form-control ps-5 rounded-pill"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Category Filter */}
                <div className="col-md-6">
                  <select
                    className="form-select rounded-pill"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Sort */}
            <div className="col-md-4">
              <select
                className="form-select rounded-pill"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="row g-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="col-lg-3 col-md-4 col-sm-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div 
                  className="card product-card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onClick={() => handleProductClick(product)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 3px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="position-relative overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: '250px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    
                    {/* Discount Badge */}
                    {product.originalPrice > product.price && (
                      <div className="position-absolute top-0 start-0 m-3">
                        <span className="badge bg-danger text-white px-3 py-2 rounded-pill">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    )}
                    
                    {/* Badges */}
                    {product.badges && product.badges.length > 0 && (
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-dark text-white px-3 py-2 rounded-pill">
                          {product.badges[0]}
                        </span>
                      </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <button 
                        className="btn btn-light rounded-circle p-3 opacity-0"
                        style={{ transition: 'opacity 0.3s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add to wishlist logic
                        }}
                      >
                        <FaHeart className="text-danger" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-body p-4">
                    <h6 className="card-title fw-bold mb-2 text-truncate">{product.name}</h6>
                    
                    {/* Rating */}
                    <div className="d-flex align-items-center mb-3">
                      <div className="d-flex me-2">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-muted small">({product.reviews})</span>
                    </div>
                    
                    {/* Price */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <span className="h5 fw-bold text-dark mb-0">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-muted text-decoration-line-through ms-2 small">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Add to Cart Button */}
                    <button 
                      className="btn btn-dark w-100 fw-bold rounded-pill"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart logic
                      }}
                    >
                      <FaShoppingCart className="me-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Products Found */}
          {filteredProducts.length === 0 && (
            <motion.div 
              className="text-center py-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="text-muted">No products found</h4>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<ProductsPageProps> = async () => {
  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
  // Try common frontend product endpoints used in this project
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
      // backend might return { data: [...] } or an array
      products = json?.data || json?.products || json || [];
      if (Array.isArray(products) && products.length) break;
    } catch (err) {
      // try next
    }
  }

  // Map backend product fields to the shape used in this page. If backend already matches, pass through.
  const mapped = (products || []).map((p: any) => ({
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

  const categoriesSet = new Set(mapped.map((product: any) => product.category));
  const categories = Array.from(categoriesSet);

  return {
    props: {
      products: mapped,
      categories,
    },
  };
};

export default ProductsPage;