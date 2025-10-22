import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { ProductCard } from "../components/products/ProductCard";
import BannerSlider from "../components/home/BannerSlider";

// Sample product data for cakes and gifts
const sampleProducts = [
  {
    id: 1,
    name: "Chocolate Birthday Cake",
    price: 899,
    originalPrice: 1299,
    image: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
    path: "/products/chocolate-birthday-cake"
  },
  {
    id: 2,
    name: "Red Roses Bouquet",
    price: 649,
    originalPrice: 899,
    image: "https://images.pexels.com/photos/736230/pexels-photo-736230.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
    path: "/products/red-roses-bouquet"
  },
  {
    id: 3,
    name: "Personalized Photo Frame",
    price: 399,
    originalPrice: 599,
    image: "https://images.pexels.com/photos/1172849/pexels-photo-1172849.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
    path: "/products/personalized-photo-frame"
  },
  {
    id: 4,
    name: "Indoor Plant Combo",
    price: 799,
    originalPrice: 1199,
    image: "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
    path: "/products/indoor-plant-combo"
  }
];

export default function Home() {
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch('/api/home');
        if (response.ok) {
          const data = await response.json();
          setHomeData(data.data || data);
        } else {
          // Fallback: load from static JSON file
          const homeModule = await import('../data/home.json');
          setHomeData(homeModule.default.data);
        }
      } catch (error) {
        console.error('Error loading home data:', error);
        // Fallback: load from static JSON file
        try {
          const homeModule = await import('../data/home.json');
          setHomeData(homeModule.default.data);
        } catch (fallbackError) {
          console.error('Error loading fallback home data:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-light">
        {/* Banner Slider */}
        {homeData?.sliders && (
          <BannerSlider sliders={homeData.sliders} autoPlay={true} interval={5000} />
        )}

        {/* Features Section */}
        <section className="py-5 bg-white">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <span className="fs-1">🚚</span>
                  </div>
                  <h5 className="fw-bold mb-2">Free Delivery</h5>
                  <p className="text-muted mb-0">Free delivery on all orders above ₹999</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <span className="fs-1">⏰</span>
                  </div>
                  <h5 className="fw-bold mb-2">Same Day Delivery</h5>
                  <p className="text-muted mb-0">Order before 2 PM for same day delivery</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <span className="fs-1">🍰</span>
                  </div>
                  <h5 className="fw-bold mb-2">Fresh & Delicious</h5>
                  <p className="text-muted mb-0">Fresh cakes and flowers delivered on time</p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <span className="fs-1">💝</span>
                  </div>
                  <h5 className="fw-bold mb-2">Perfect Packaging</h5>
                  <p className="text-muted mb-0">Beautiful packaging for every order</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold text-dark mb-3">Featured Products</h2>
              <p className="lead text-muted">Discover our most popular items</p>
            </div>
            <div className="row g-4">
              {sampleProducts.map((product) => (
                <div key={product.id} className="col-lg-3 col-md-6">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-5 bg-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold text-dark mb-3">Shop by Category</h2>
              <p className="lead text-muted">Explore our wide range of products</p>
            </div>
            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm h-100 category-card">
                  <button type="button" className="p-0 border-0 bg-transparent" onClick={() => setPreviewSrc('https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1')}>
                    <img 
                      src="https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" 
                      alt="Cakes" 
                      className="card-img-top"
                      style={{height: '200px', objectFit: 'cover', cursor: 'pointer'}}
                    />
                  </button>
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">Cakes</h5>
                    <p className="card-text text-muted">Delicious cakes for every occasion</p>
                    <a href="/products/cakes" className="btn btn-outline-primary">Shop Now</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm h-100 category-card">
                  <button type="button" className="p-0 border-0 bg-transparent" onClick={() => setPreviewSrc('https://images.pexels.com/photos/1128797/pexels-photo-1128797.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1')}>
                    <img 
                      src="https://images.pexels.com/photos/1128797/pexels-photo-1128797.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" 
                      alt="Flowers" 
                      className="card-img-top"
                      style={{height: '200px', objectFit: 'cover', cursor: 'pointer'}}
                    />
                  </button>
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">Flowers</h5>
                    <p className="card-text text-muted">Fresh flowers to brighten any day</p>
                    <a href="/products/flowers" className="btn btn-outline-primary">Shop Now</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm h-100 category-card">
                  <button type="button" className="p-0 border-0 bg-transparent" onClick={() => setPreviewSrc('https://images.pexels.com/photos/264869/pexels-photo-264869.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1')}>
                    <img 
                      src="https://images.pexels.com/photos/264869/pexels-photo-264869.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" 
                      alt="Gifts" 
                      className="card-img-top"
                      style={{height: '200px', objectFit: 'cover', cursor: 'pointer'}}
                    />
                  </button>
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">Gifts</h5>
                    <p className="card-text text-muted">Thoughtful gifts for your loved ones</p>
                    <a href="/products/gifts" className="btn btn-outline-primary">Shop Now</a>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card border-0 shadow-sm h-100 category-card">
                  <button type="button" className="p-0 border-0 bg-transparent" onClick={() => setPreviewSrc('https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1')}>
                    <img 
                      src="https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1" 
                      alt="Plants" 
                      className="card-img-top"
                      style={{height: '200px', objectFit: 'cover', cursor: 'pointer'}}
                    />
                  </button>
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">Plants</h5>
                    <p className="card-text text-muted">Green plants for a healthier home</p>
                    <a href="/products/plants" className="btn btn-outline-primary">Shop Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Image preview modal */}
        {previewSrc && (
          <div className="image-preview-overlay" onClick={() => setPreviewSrc(null)} style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050}}>
            <div style={{position: 'relative', maxWidth: '90%', maxHeight: '90%'}}>
              <button type="button" onClick={() => setPreviewSrc(null)} style={{position: 'absolute', right: 0, top: 0, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem'}} aria-label="Close">×</button>
              <img src={previewSrc} alt="Preview" style={{maxWidth: '100%', maxHeight: '80vh', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.5)'}} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}