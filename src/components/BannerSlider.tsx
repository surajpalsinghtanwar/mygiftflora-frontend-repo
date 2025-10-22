import { getURL } from 'next/dist/shared/lib/utils';
import React, { useEffect, useState } from 'react';
import { getApiUrl, getUploadUrl } from 'src/utils/api';

type Banner = {
  id?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  pages?: string[];
  position?: string;
  order?: number;
  slug?: string;
  buttonText?: string;
  buttonUrl?: string;
};

export default function BannerSlider({ page = 'home', position = 'middle', categorySlug }: { page?: string; position?: string; categorySlug?: string }) {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => { fetchBanners(); }, [page, position, categorySlug]);

  const fetchBanners = async () => {
    try {
      const url = getApiUrl('api/home');
      console.log('url-----',url);
      const resp = await fetch('/api/home');
      if (!resp.ok) return;
      const data = await resp.json();
      if (process.env.NODE_ENV !== 'production') console.debug('BannerSlider fetched', data);
      let items = Array.isArray(data) ? data : data.data || [];
      // filter by page & position
      items = items.filter((b: any) => (b.position || 'middle') === position && (b.pages && b.pages.length ? b.pages.includes(page) : true));
      // if categorySlug provided, include dynamic banners matching slug
      if (categorySlug) items = items.filter((b: any) => (b.slug ? String(b.slug) === String(categorySlug) : true));
      items = items.sort((a: any, b: any) => (Number(a.order || 0) - Number(b.order || 0)));
      // normalize image URLs
      const norm = items.map((it: any) => ({ ...it, image: it.image && !/^https?:\/\//i.test(it.image) ? getUploadUrl(String(it.image)) : it.image }));
      setBanners(norm);
    } catch (e) { console.error('fetch banners', e); }
  };

  if (!banners.length) return null;

  return (
    <div className="banner-slider">
      {banners.map(b => (
        <div key={b.id} className="banner-slide" style={{ position: 'relative', overflow: 'hidden', marginBottom: 12 }}>
          {b.image && <img src={b.image} alt={b.title} style={{ width: '100%', height: 300, objectFit: 'cover' }} />}
          <div style={{ position: 'absolute', left: 20, bottom: 20, color: '#fff' }}>
            <h3>{b.title}</h3>
            {b.subtitle && <p>{b.subtitle}</p>}
            {b.buttonText && <a className="btn btn-primary" href={b.buttonUrl || '#'}>{b.buttonText}</a>}
          </div>
        </div>
      ))}
    </div>
  );
}
