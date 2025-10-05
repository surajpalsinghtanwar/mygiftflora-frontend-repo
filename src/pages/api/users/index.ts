import { NextApiRequest, NextApiResponse } from 'next';

function enableCors(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  enableCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

  try {
    let url = `${backendUrl}/users`;
    let method = req.method;
    let body = null;

    // Handle different HTTP methods
    if (method === 'POST') {
      body = JSON.stringify(req.body);
    }

    const headers: any = {
      'Content-Type': 'application/json',
    };

    // Forward authorization header if present
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}