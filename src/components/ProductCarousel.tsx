import React, { useEffect, useRef, useState } from 'react';
import { FaStar, FaShoppingCart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';
import { getUploadUrl } from 'src/utils/api';

interface Product {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string;
  main_image?: string;
  price: number;
  originalPrice?: number;
}

interface Props {
  products: Product[];
  autoPlay?: boolean;
  interval?: number;
}

const ProductCarousel: React.FC<Props> = ({ products, autoPlay = true, interval = 4000 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(4);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      // cap to 4 items maximum
      if (w >= 1200) setVisibleCount(4);
      else if (w >= 992) setVisibleCount(4);
      else if (w >= 768) setVisibleCount(3);
      else if (w >= 576) setVisibleCount(2);
      else setVisibleCount(1);
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  useEffect(() => {
    // reset page if visibleCount changed and page is out of range
    const totalPages = Math.max(1, Math.ceil(products.length / Math.max(1, visibleCount)));
    if (page >= totalPages) setPage(0);
  }, [visibleCount, products.length]);

  useEffect(() => {
    if (!autoPlay) return;
    if (products.length <= visibleCount) return; // nothing to slide
    const totalPages = Math.max(1, Math.ceil(products.length / visibleCount));
    const t = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, interval);
    return () => clearInterval(t);
  }, [autoPlay, interval, products.length, visibleCount]);

  if (!products || products.length === 0) return null;

  const totalPages = Math.max(1, Math.ceil(products.length / Math.max(1, visibleCount)));

  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const goNext = () => setPage((p) => (p + 1) % totalPages);

  // build pages: array of slices
  const pages: Product[][] = [];
  for (let i = 0; i < totalPages; i++) {
    const start = i * visibleCount;
    pages.push(products.slice(start, start + visibleCount));
  }

  return (
    <div className="product-carousel position-relative py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div></div>
          <div>
            <button className="btn btn-sm btn-outline-secondary me-2" onClick={goPrev} aria-label="Previous">
              <FaChevronLeft />
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={goNext} aria-label="Next">
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div ref={containerRef} className="overflow-hidden">
          <div
            className="d-flex transition-transform"
            style={{ width: `${totalPages * 100}%`, transform: `translateX(-${(page * 100) / totalPages}%)`, transition: 'transform 500ms ease' }}
          >
            {pages.map((pageItems, pi) => (
              <div key={pi} style={{ width: `${100 / totalPages}%` }}>
                <div className="d-flex gap-3">
                  {pageItems.map((p) => (
                    <div key={p.id} className="card border-0 shadow-sm" style={{ flex: `0 0 ${100 / visibleCount}%`, minWidth: 0 }}>
                      <div className="position-relative overflow-hidden">
                        <img src={p.imageUrl || getUploadUrl(String(p.main_image || ''))} alt={p.name} className="img-fluid w-100" style={{ height: 220, objectFit: 'cover' }} />
                      </div>
                      <div className="card-body p-3">
                        <h6 className="fw-bold mb-2" style={{ fontSize: 14 }}>{p.name}</h6>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div>
                            <span className="h6 text-success fw-bold">₹{Number(p.price || 0).toLocaleString()}</span>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <div className="text-muted small text-decoration-line-through">₹{Number(p.originalPrice).toLocaleString()}</div>
                            )}
                          </div>
                          <div className="text-muted small d-flex align-items-center">
                            <FaStar className="me-1" /> <strong>4.7</strong>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <Link href={`/product/${p.slug || ''}`} className="btn btn-outline-dark btn-sm flex-grow-1">View</Link>
                          <button className="btn btn-dark btn-sm"><FaShoppingCart /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* page indicators */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-3">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`rounded-circle ${i === page ? 'bg-dark' : 'bg-secondary'}`}
                style={{ width: 10, height: 10, border: 'none' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
