import type { NextApiRequest, NextApiResponse } from 'next';
import { getApiUrl } from 'src/utils/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Try public endpoint first, then try admin endpoint as fallback
    const candidates = ['/banners', '/admin/banners'];
    for (const path of candidates) {
      try {
        const apiUrl = getApiUrl(path);
        const r = await fetch(apiUrl);
        if (!r.ok) {
          // try next
          continue;
        }
        const data = await r.json();
        return res.status(200).json(data);
      } catch (inner) {
        // continue to next candidate
        continue;
      }
    }
    return res.status(502).json({ error: 'No banner endpoint responded' });
  } catch (e) {
    console.error('proxy /api/banners error', e);
    return res.status(500).json([]);
  }
}
