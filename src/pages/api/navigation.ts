import { NextApiRequest, NextApiResponse } from 'next';
import { API_CONFIG } from '../../utils/api';

function enableCors(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Transform backend category shape into NavItem[] used by the frontend
function transformCategoriesToNav(items: any[]): any[] {
  if (!Array.isArray(items)) return [];
  return items.map((cat) => {
    const navItem: any = {
      label: cat.name || cat.title || cat.label || 'Unnamed',
      path: `/products/${cat.slug || cat.name?.toLowerCase()?.replace(/\s+/g, '-') || ''}`,
    };

    if (Array.isArray(cat.subcategories) && cat.subcategories.length) {
      navItem.subcategories = cat.subcategories.map((sub: any) => ({
        title: sub.name || sub.title || sub.label || 'Unnamed',
        path: `/products/${cat.slug || cat.name?.toLowerCase()?.replace(/\s+/g, '-') || ''}/${sub.slug || sub.name?.toLowerCase()?.replace(/\s+/g, '-') || ''}`,
        subSubcategories: Array.isArray(sub.subsubcategories)
          ? sub.subsubcategories.map((s3: any) => ({
              label: s3.name || s3.title || s3.label || 'Unnamed',
              path: `/products/${cat.slug || cat.name?.toLowerCase()?.replace(/\s+/g, '-') || ''}/${sub.slug || sub.name?.toLowerCase()?.replace(/\s+/g, '-') || ''}/${s3.slug || s3.name?.toLowerCase()?.replace(/\s+/g, '-') || ''}`,
            }))
          : [],
      }));
    }

    return navItem;
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  enableCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return;
  }

  try {
    // Prefer backend API base from env; fall back to defaults in utils/api
    const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || API_CONFIG.BASE_URL || '/api';
    // Expecting an endpoint that returns categories with nested subcategories/subsubcategories
    const backendUrl = `${backendBase.replace(/\/?$/, '')}/admin/categories`;

    const response = await fetch(backendUrl, { method: 'GET' });
    if (!response.ok) {
      // Fallback to static JSON bundled in the frontend if backend unavailable
      console.error('Backend navigation fetch failed, status:', response.status);
      // try to return bundled static JSON as last resort
      const navigationModule = await import('../../data/navigation.json');
      res.status(200).json(navigationModule.default || []);
      return;
    }

    const data = await response.json();

    // Many backends wrap payload in { data: [...] } or { success, data }
    const categories = data?.data || data?.categories || data || [];

    const nav = transformCategoriesToNav(categories);
    res.status(200).json(nav);
  } catch (error) {
    console.error('Error building navigation from backend:', error);
    try {
      const navigationModule = await import('../../data/navigation.json');
      res.status(200).json(navigationModule.default || []);
    } catch (fallbackError) {
      console.error('Error loading fallback navigation data:', fallbackError);
      res.status(500).json({ error: 'Failed to load navigation data' });
    }
  }
}
