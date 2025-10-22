import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { FaStar, FaHeart, FaShoppingCart, FaFilter, FaTh, FaList } from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  category: string;
  subcategory: string;
  subsubcategory: string;
  description: string;
  tags?: string[];
  badges?: string[];
  inStock: boolean;
  fastDelivery?: boolean;
  gallery?: string[];
}

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl
    };

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Show success message
    alert(`${product.name} added to cart!`);
  };

  useEffect(() => {
    if (category) {
      const loadProducts = async () => {
        try {
          // try backend API first (supports response shapes: { data: [] } | { products: [] } | [] )
          const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
          const url = `${base.replace(/\/?$/, '')}/products?category=${encodeURIComponent(String(category))}`;
          let resp: Response | null = null;
          try {
            resp = await fetch(url);
          } catch (e) { resp = null; }

          let items: any[] = [];
          if (resp && resp.ok) {
            const json = await resp.json();
            items = json?.data || json?.products || json || [];
          }

          // fallback to local JSON when API not available or empty
          if (!items || items.length === 0) {
            const productsModule = await import('../../data/products.json');
            items = productsModule.default.products || [];
          }

          // Normalize backend product shape to the frontend `Product` interface
          const { getUploadUrl } = await import('../../utils/api');
          const normalized: Product[] = (items || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price || p.discounted_price || 0),
            originalPrice: p.discounted_price ? Number(p.discounted_price) : (p.originalPrice ? Number(p.originalPrice) : undefined),
            rating: Number(p.rating || 0),
            reviews: Number(p.reviews || 0),
            imageUrl: getUploadUrl(String(p.main_image || p.imageUrl || '')),
            category: p.category?.slug || p.category || '',
            subcategory: p.subcategory?.slug || p.subcategory || '',
            subsubcategory: p.subsubcategory?.slug || p.subsubcategory || '',
            description: p.description || p.short_description || '',
            tags: p.tags || [],
            badges: p.badges ? (Array.isArray(p.badges) ? p.badges : [p.badges]) : [],
            inStock: Boolean(p.stock === undefined ? true : p.stock > 0),
            fastDelivery: p.delivery_type === 'same_day',
            gallery: (p.gallery_images || p.gallery || []).map((g: string) => getUploadUrl(String(g)))
          }));

          // Match by category slug or name (case-insensitive)
          const catLower = String(category).toLowerCase();
          const categoryProducts = normalized.filter((product) => 
            (product.category || '').toString().toLowerCase() === catLower
          );

          setProducts(categoryProducts);
          setFilteredProducts(categoryProducts);
        } catch (error) {
          console.error('Error loading products:', error);
        } finally {
          setLoading(false);
        }
      };
      loadProducts();
    }
  }, [category]);

  const handleSort = (sortOption: string) => {
    setSortBy(sortOption);
    const sorted = [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    setFilteredProducts(sorted);
  };

  const getCategoryTitle = (cat: string) => {
    const titles: { [key: string]: string } = {
      'cakes': 'Cakes',
      'flowers': 'Flowers', 
      'gifts': 'Gifts',
      'plants': 'Plants',
      'chocolates': 'Chocolates',
      'combos': 'Combos'
    };
    return titles[cat] || cat;
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'bestseller': return 'bg-danger';
      case 'new': return 'bg-success';
      case 'premium': return 'bg-dark text-white';
      case 'limited': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{getCategoryTitle(category as string)} - MyGiftFlora</title>
        <meta name="description" content={`Browse our collection of ${category}`} />
      </Head>

      <section className="bg-light py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold text-dark mb-3">{getCategoryTitle(category as string)}</h1>
              <p className="lead text-muted">Discover our amazing collection of {category}</p>
            </div>
            <div className="col-md-6 text-end">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-md-end">
                  <li className="breadcrumb-item">
                    <Link href="/" className="text-decoration-none">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/products" className="text-decoration-none">Products</Link>
                  </li>
                  <li className="breadcrumb-item active">{getCategoryTitle(category as string)}</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-3">
                <FaFilter className="text-muted" />
                <span className="text-muted">Showing {filteredProducts.length} products</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-md-end gap-3">
                <select 
                  className="form-select form-select-sm" 
                  style={{width: 'auto'}}
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${viewMode === 'grid' ? 'btn-dark' : 'btn-outline-secondary'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <FaTh />
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-dark' : 'btn-outline-secondary'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <h3>No products found</h3>
              <p className="text-muted">We're working on adding products to this category.</p>
              <Link href="/products" className="btn btn-dark">Browse All Products</Link>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="product-card h-100" style={{ cursor: 'pointer' }}>
                    <div className="position-relative overflow-hidden" onClick={() => router.push(`/product/${product.slug}`)}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="img-fluid w-100"
                        style={{ height: '250px', objectFit: 'cover' }}
                      />
                      {product.originalPrice && (
                        <div className="product-badge">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                      {product.badges && product.badges.length > 0 && (
                        <div className="position-absolute top-0 start-0 p-2">
                          {product.badges.map((badge, index) => (
                            <span
                              key={index}
                              className={`badge me-1 ${getBadgeColor(badge)}`}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {badge.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="position-absolute top-0 end-0 p-2">
                        <button className="btn btn-light btn-sm rounded-circle" onClick={(e) => e.stopPropagation()}>
                          <FaHeart />
                        </button>
                      </div>
                    </div>
                    <div className="card-body p-3" onClick={() => router.push(`/product/${product.slug}`)}>
                      <h6 className="fw-bold text-dark mb-2">
                        {product.name}
                      </h6>
                      <div className="d-flex align-items-center mb-2">
                        <div className="d-flex text-dark me-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < Math.floor(product.rating) ? '' : 'text-muted'} />
                          ))}
                        </div>
                        <small className="text-muted">({product.reviews})</small>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <span className="h6 text-dark fw-bold">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-muted text-decoration-line-through ms-2 small">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        className="btn btn-dark w-100 fw-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        <FaShoppingCart className="me-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;
