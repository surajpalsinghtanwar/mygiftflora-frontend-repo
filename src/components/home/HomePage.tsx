import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../Layout';
import BannerSlider from './BannerSlider';
import { FaStar, FaHeart, FaShoppingCart, FaQuoteLeft } from 'react-icons/fa';
import { getApiUrl, getUploadUrl } from '@/utils/api';
import ProductCarousel from '../ProductCarousel';

interface HomeData {
  banners: any[];
  categories: any[];
  newArrivals: any[];
  featuredProducts: any[];
  todaysSpecial?: any[];
}

const HomePage: React.FC = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      // Prefer the local proxy endpoint to avoid direct backend CORS/connectivity issues
      const apiUrl = '/api/home';

      let fetched: any = null;
      try {
        const resp = await fetch(apiUrl);
        if (resp.ok) fetched = await resp.json();
        else console.warn('/api/home responded with', resp.status);
      } catch (err) {
        console.warn('Failed to fetch /api/home, will fallback to bundled JSON', err);
      }

      if (!fetched) {
        try {
          const module = await import('../../data/home.json');
          fetched = module?.default || module || null;
        } catch (err) {
          console.error('Failed to load fallback home.json', err);
          fetched = null;
        }
      }

      if (!fetched) {
        setHomeData(null);
        setLoading(false);
        return;
      }

      // fetched may be { data: { banners, categories, ... }, message }
      const payloadRoot = fetched.data || fetched;

      // normalize banners
      const rawBanners = payloadRoot.banners || [];
      const mappedBanners = (rawBanners || []).map((it: any) => ({
        id: it.id || it._id || String(Math.random()),
        imageUrl: it.image && !/^https?:\/\//i.test(it.image) ? getUploadUrl(String(it.image)) : (it.imageUrl || it.image || ''),
        title: it.title || it.name || '',
        subtitle: it.sub_title || it.subtitle || it.description || '',
        description: it.description || it.sub_title || it.subtitle || '',
        link: it.button_url || it.link || it.buttonLink || '#',
        buttonText: it.button_text || it.buttonText || 'Shop Now',
        backgroundColor: it.background_color || it.backgroundColor || it.bgColor || '',
        textColor: it.text_color || it.textColor || it.color || ''
      }));

      // helper to normalize product lists
      const normalizeProducts = (arr: any[] = []) => (arr || []).map((p: any) => {
        const price = parseFloat(p.discounted_price ?? p.price ?? 0) || 0;
        const originalPrice = parseFloat(p.price ?? p.originalPrice ?? 0) || price;
        return {
          id: p.id || p._id || String(Math.random()),
          name: p.name || p.title || '',
          slug: p.slug || (p.name || '').toLowerCase().replace(/\s+/g, '-'),
          main_image: p.main_image || p.mainImage || p.image || '',
          imageUrl: (p.main_image || p.mainImage || p.image) ? getUploadUrl(String(p.main_image || p.mainImage || p.image)) : '',
          price,
          originalPrice,
          ...p
        };
      });

      const categories = payloadRoot.categories || payloadRoot.categories || [];
      const newArrivals = normalizeProducts(payloadRoot.newArrivals || payloadRoot.new_arrivals || []);
      const featuredProducts = normalizeProducts(payloadRoot.featuredProducts || payloadRoot.featured_products || []);
      const todaysSpecial = normalizeProducts(payloadRoot.todaysSpecial || payloadRoot.todays_special || []);

      const payload: HomeData = {
        banners: mappedBanners,
        categories: categories || [],
        newArrivals,
        featuredProducts,
        todaysSpecial
      };

      setHomeData(payload as any);
      setLoading(false);
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!homeData) {
    return <div className="container mt-5 text-center">Error loading page data</div>;
  }

  return (
    <Layout>
      {/* Banner Slider */}
      <section className="banner-section">
        <BannerSlider sliders={homeData.banners} />
      </section>

      {/* Featured Categories */}
      <section className="py-6 bg-gradient" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="display-4 fw-bold text-dark mb-4">🎁 Shop by Category</h2>
            <p className="lead text-muted">Discover our most popular categories</p>
            <div className="mx-auto" style={{ width: '100px', height: '4px', background: 'linear-gradient(135deg, #343a40, #495057)', borderRadius: '2px' }}></div>
          </div>
          <div className="row g-4">
            {homeData.categories?.slice(0, 6).map((category) => (
              <div key={category.id} className="col-lg-2 col-md-4 col-sm-6">
                <Link href={`/products/${category.slug}`} className="text-decoration-none">
                  <div className="card category-card text-center h-100 border-0 shadow-sm rounded-4 overflow-hidden" 
                       style={{ transition: 'all 0.3s ease' }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'translateY(-10px)';
                         e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'translateY(0)';
                         e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                       }}>
                    <div className="position-relative overflow-hidden">
                      <img
                        src={getUploadUrl(category.banner)}
                        alt={category.name}
                        className="img-fluid w-100"
                        style={{ height: '150px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      <div className="position-absolute top-0 start-0 w-100 h-100 bg-opacity-0" 
                           style={{ transition: 'background 0.3s ease' }}></div>
                    </div>
                    <div className="card-body py-4">
                      <h6 className="fw-bold text-dark mb-0">{category.name}</h6>
                      <small className="text-muted">Explore Collection</small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Banner */}
      <section className="py-6">
        <div className="container">
          <div className="row align-items-center rounded-4 p-6 shadow-lg" 
               style={{ background: 'linear-gradient(135deg, #343a40 0%, #495057 100%)' }}>
            <div className="col-md-8">
              <h3 className="fw-bold text-white mb-4">🎉 Special Weekend Offers!</h3>
              <p className="text-white-50 mb-4 fs-4">Get up to 50% off on selected items. Free delivery on orders above ₹999. Limited time offer!</p>
              <Link href="/offers" className="btn btn-light btn-lg px-5 py-3 fw-bold rounded-pill shadow">
                Shop Now & Save
              </Link>
            </div>
            <div className="col-md-4 text-center">
              <div className="display-1">🛍️</div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals (carousel) */}
      <section className="py-6 bg-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-6">
            <div>
              <h2 className="display-4 fw-bold text-dark mb-3">✨ New Arrivals</h2>
              <p className="text-muted mb-0 fs-5">Fresh products just added to our collection</p>
            </div>
            <Link href="/product" className="btn btn-outline-dark btn-lg rounded-pill px-5">View All →</Link>
          </div>
        </div>
        <ProductCarousel products={homeData.newArrivals || []} />
      </section>

      {/* Featured Products */}
      <section className="py-6" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="display-4 fw-bold text-dark mb-4">🌟 Featured Products</h2>
            <p className="lead text-muted">Handpicked favorites loved by our customers</p>
            <div className="mx-auto" style={{ width: '100px', height: '4px', background: 'linear-gradient(135deg, #343a40, #495057)', borderRadius: '2px' }}></div>
          </div>
          <div className="row g-4">
            <div className="col-12">
              <ProductCarousel products={homeData.featuredProducts || []} />
            </div>
          </div>
        </div>
      </section>

      {/* Today's Specials */}
      {homeData.todaysSpecial && homeData.todaysSpecial.length > 0 && (
        <section className="py-6 bg-white">
          <div className="container">
            <div className="text-center mb-6">
              <h2 className="display-4 fw-bold text-dark mb-4">🔥 Today's Specials</h2>
              <p className="lead text-muted">Handpicked special offers for today</p>
            </div>
          </div>
          <ProductCarousel products={homeData.todaysSpecial || []} />
        </section>
      )}

      {/* Special Offers */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100" 
                   style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="card-body text-white p-5 text-center">
                  <div className="fs-1 mb-3">🚚</div>
                  <h5 className="fw-bold mb-2">Free Delivery</h5>
                  <p className="mb-0 opacity-75">On orders above ₹999</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100" 
                   style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                <div className="card-body text-white p-5 text-center">
                  <div className="fs-1 mb-3">⏰</div>
                  <h5 className="fw-bold mb-2">Same Day Delivery</h5>
                  <p className="mb-0 opacity-75">Order before 2 PM</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100" 
                   style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                <div className="card-body text-white p-5 text-center">
                  <div className="fs-1 mb-3">🎁</div>
                  <h5 className="fw-bold mb-2">Fresh & Premium</h5>
                  <p className="mb-0 opacity-75">Quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-3">What Our Customers Say</h2>
            <p className="lead text-muted">Real reviews from real customers</p>
          </div>
          <div className="row g-4">
            {[
              {
                name: "Priya Sharma",
                location: "Mumbai",
                message: "Amazing quality and timely delivery! The cake was fresh and delicious. Highly recommended!",
                rating: 5
              },
              {
                name: "Rohit Verma", 
                location: "Delhi",
                message: "Beautiful flower arrangement and excellent service. Made my anniversary very special!",
                rating: 5
              },
              {
                name: "Sneha Patel",
                location: "Bangalore", 
                message: "The personalized gift was exactly what I wanted. Great quality and fast delivery!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="col-md-4">
                <div className="bg-white p-4 rounded-3 shadow-sm h-100">
                  <div className="mb-3">
                    <FaQuoteLeft className="text-muted fs-3" />
                  </div>
                  <p className="text-muted mb-3">{testimonial.message}</p>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-0">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.location}</small>
                    </div>
                    <div className="d-flex text-dark">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-3">Why Choose MyGiftFlora?</h2>
            <p className="lead text-muted">We make every celebration special</p>
          </div>
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <div className="mb-4">
                <div className="bg-light rounded-circle p-4 d-inline-flex">
                  <span className="fs-1">🕐</span>
                </div>
              </div>
              <h5 className="fw-bold mb-3">24/7 Service</h5>
              <p className="text-muted">Round the clock customer support for all your needs</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="mb-4">
                <div className="bg-light rounded-circle p-4 d-inline-flex">
                  <span className="fs-1">✨</span>
                </div>
              </div>
              <h5 className="fw-bold mb-3">Premium Quality</h5>
              <p className="text-muted">Only the finest ingredients and materials</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="mb-4">
                <div className="bg-light rounded-circle p-4 d-inline-flex">
                  <span className="fs-1">🚀</span>
                </div>
              </div>
              <h5 className="fw-bold mb-3">Fast Delivery</h5>
              <p className="text-muted">Express delivery options available</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="mb-4">
                <div className="bg-light rounded-circle p-4 d-inline-flex">
                  <span className="fs-1">💝</span>
                </div>
              </div>
              <h5 className="fw-bold mb-3">Personalized</h5>
              <p className="text-muted">Custom gifts tailored just for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h3 className="fw-bold mb-3">Stay Updated with Our Latest Offers</h3>
              <p className="mb-0">Subscribe to our newsletter and never miss a deal!</p>
            </div>
            <div className="col-md-6">
              <div className="row g-2">
                <div className="col-8">
                  <input type="email" className="form-control form-control-lg" placeholder="Enter your email" />
                </div>
                <div className="col-4">
                  <button className="btn btn-primary btn-lg w-100">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;