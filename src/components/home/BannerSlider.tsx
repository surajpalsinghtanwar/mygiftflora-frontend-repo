import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface SliderItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  description?: string;
  link: string;
  buttonText: string;
  backgroundColor?: string;
  textColor?: string;
}

interface BannerSliderProps {
  sliders?: SliderItem[];
  autoPlay?: boolean;
  interval?: number;
}

const BannerSlider: React.FC<BannerSliderProps> = ({ 
  sliders, 
  autoPlay = true, 
  interval = 5000 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<SliderItem[]>(sliders || []);
  const safeSliders = slides || [];

  const UPLOADS_BASE = (process.env.NEXT_PUBLIC_UPLOADS_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

  const normalizeImageUrl = (src?: string) => {
    if (!src) return '';
    try {
      // If absolute URL, extract pathname and re-base it to UPLOADS_BASE
      if (/^https?:\/\//i.test(src)) {
        // If the URL is external (not localhost/uploads), return it as-is so unsplash etc. load correctly.
        const u = new URL(src);
        const uploadsHost = (new URL(UPLOADS_BASE)).host;
        if (!u.host.includes(uploadsHost) && !u.pathname.startsWith('/uploads')) {
          return src; // external CDN - keep original
        }
        // otherwise rebase to UPLOADS_BASE while preserving path
        return `${UPLOADS_BASE}${u.pathname}`;
      }
      // otherwise ensure it starts with '/'
      const path = src.startsWith('/') ? src : `/${src}`;
      return `${UPLOADS_BASE}${path}`;
    } catch (e) {
      return src;
    }
  };

  const computeContrastColor = (bg?: string, imageUrl?: string) => {
    // If explicit text color provided, use it
    if (!bg) return 'white';
    // try to extract a hex color from bg (works for gradients containing hex codes)
    const hexMatch = bg.match(/#([0-9a-fA-F]{3,6})/);
    if (hexMatch) {
      let hex = hexMatch[0];
      // normalize 3-digit hex to 6-digit
      if (/^#([0-9a-fA-F]{3})$/.test(hex)) {
        hex = hex.replace(/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/, '#$1$1$2$2$3$3');
      }
      const r = parseInt(hex.substr(1,2),16);
      const g = parseInt(hex.substr(3,2),16);
      const b = parseInt(hex.substr(5,2),16);
      // relative luminance formula
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      return luminance > 0.6 ? '#000000' : '#ffffff';
    }
    // fallback: if background contains 'linear-gradient' but no hex, prefer white
    if (/linear-gradient/i.test(bg)) return '#ffffff';
    return '#ffffff';
  };

  // Auto-play functionality
  useEffect(() => {
    console.log('test---81',safeSliders);
        console.log('test---82',sliders);
    if (!autoPlay || safeSliders.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % safeSliders.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, safeSliders.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % safeSliders.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + safeSliders.length) % safeSliders.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // If the component was not provided explicit `sliders` prop, load the static home.json as fallback
  useEffect(() => {
    
    if (Array.isArray(sliders) && sliders.length) return; // prop provided

    let mounted = true;
    (async () => {
      try {
        const module = await import('../../data/home.json');
        const data = module?.default?.data || module?.data || null;
        if (!mounted || !data) return;
        
        const s = (data.sliders || []).map((it: any) => ({
          id: String(it.id),
          imageUrl: it.imageUrl || it.image || '',
          title: it.title || it.name || '',
          subtitle: it.subtitle || it.description || '',
          description: it.description || '',
          link: it.link || it.buttonUrl || it.button_url || '#',
          buttonText: it.buttonText || it.button_text || 'Shop Now',
          backgroundColor: it.backgroundColor || it.bgColor || '',
          textColor: it.textColor || it.color || ''
        }));
        setSlides(s);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [sliders]);

  if (safeSliders.length === 0) {
    return null;
  }

  const trackWidthPercent = safeSliders.length * 100;
  const slidePercent = safeSliders.length ? (100 / safeSliders.length) : 100;

  return (
    <div className="position-relative overflow-hidden" style={{ height: '85vh', minHeight: '650px' }}>
      {/* Slider Container */}
      <div
        // explicit track styles to avoid relying on external CSS
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          width: `${trackWidthPercent}%`,
          height: '100%',
          transform: `translateX(-${currentSlide * slidePercent}%)`,
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {safeSliders.map((slider, index) => (
          <div
            key={slider.id}
            style={{
              flex: '0 0 auto',
              width: `${slidePercent}%`,
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              // if there's no image, fall back to backgroundColor on the container itself
              background: slider.imageUrl ? undefined : (slider.backgroundColor || '#222')
            }}
          >
            {/* Image element placed behind content to avoid background-image quirks */}
            {slider.imageUrl && (
              <img
                src={normalizeImageUrl(slider.imageUrl)}
                alt={slider.title || 'banner'}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 0
                }}
              />
            )}
            {/* Optional overlay for gradient/backgroundColor to sit on top of the image without hiding it */}
            {slider.backgroundColor && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                  pointerEvents: 'none',
                  // allow gradient strings like 'linear-gradient(...)' or plain colors
                  background: slider.backgroundColor,
                  mixBlendMode: 'overlay',
                  opacity: 0.85
                }}
              />
            )}
            {/* Content */}
            <div className="position-relative h-100 d-flex align-items-center" style={{ zIndex: 2 }}>
              <div className="container">
                <div className="row">
                  <div className="col-lg-8 col-xl-7">
                    {
                      (() => {
                        const textColor = slider.textColor || computeContrastColor(slider.backgroundColor, slider.imageUrl);
                        return (
                          <div style={{ color: textColor }}>
                            <h1
                              className="display-3 fw-bold mb-4"
                              style={{
                                color: textColor,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.25)',
                                lineHeight: '1.2'
                              }}
                            >
                              {slider.title}
                            </h1>
                            <h3
                              className="h4 mb-4 fw-normal"
                              style={{
                                color: textColor,
                                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                                opacity: 0.95
                              }}
                            >
                              {slider.subtitle}
                            </h3>
                            {slider.description && (
                              <p
                                className="lead mb-5"
                                style={{
                                  color: textColor,
                                  textShadow: '1px 1px 2px rgba(0,0,0,0.15)',
                                  maxWidth: '500px'
                                }}
                              >
                                {slider.description}
                              </p>
                            )}
                            <Link href={slider.link || '#'}>
                              <button
                                className="btn btn-dark btn-lg px-4 py-3 fw-bold text-uppercase shadow-lg text-nowrap"
                                style={{
                                  borderRadius: '50px',
                                  letterSpacing: '1px',
                                  transition: 'all 0.3s ease',
                                  minWidth: 'fit-content',
                                  whiteSpace: 'nowrap',
                                  color: textColor
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                }}
                              >
                                {slider.buttonText}
                              </button>
                            </Link>
                          </div>
                        );
                      })()
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
  {safeSliders.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="btn btn-dark btn-lg position-absolute top-50 start-0 translate-middle-y ms-4 rounded-circle d-none d-md-flex align-items-center justify-content-center"
            style={{ 
              width: '60px', 
              height: '60px', 
              zIndex: 10,
              backgroundColor: 'rgba(0,0,0,0.7)',
              border: 'none'
            }}
            aria-label="Previous slide"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            className="btn btn-dark btn-lg position-absolute top-50 end-0 translate-middle-y me-4 rounded-circle d-none d-md-flex align-items-center justify-content-center"
            style={{ 
              width: '60px', 
              height: '60px', 
              zIndex: 10,
              backgroundColor: 'rgba(0,0,0,0.7)',
              border: 'none'
            }}
            aria-label="Next slide"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      {/* Slide Indicators */}
  {safeSliders.length > 1 && (
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4" style={{ zIndex: 10 }}>
          <div className="d-flex gap-2">
            {safeSliders.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-circle border-0 ${
                  currentSlide === index ? 'bg-white' : 'bg-secondary'
                }`}
                style={{
                  width: '12px',
                  height: '12px',
                  opacity: currentSlide === index ? 1 : 0.6,
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerSlider;