import { NextApiRequest, NextApiResponse } from 'next';
import { API_CONFIG } from '../../utils/api';

function enableCors(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  enableCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    return;
  }

  try {
    const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL || API_CONFIG.BASE_URL || 'http://localhost:8000/api';
    const backendUrl = `${backendBase.replace(/\/?$/, '')}/home`;

    const response = await fetch(backendUrl, { method: 'GET' });
    if (!response.ok) {
      const homeModule = await import('../../data/home.json');
      res.status(200).json(homeModule.default || {});
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching home data from backend:', error);
    try {
      const homeModule = await import('../../data/home.json');
      res.status(200).json(homeModule.default || {});
    } catch (fallbackError) {
      console.error('Error loading fallback home data:', fallbackError);
      res.status(500).json({ success: false, message: 'Failed to load home data' });
    }
  }
}