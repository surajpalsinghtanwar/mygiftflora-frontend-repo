import { NextApiRequest, NextApiResponse } from 'next';

// Disable Next.js body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

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
    let url = `${backendUrl}/admin/category`;
    let method = req.method;
    let body = null;
    let headers: any = {};

    // Forward authorization header if present
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }

    // Handle different HTTP methods
    if (method === 'POST') {
      // For multipart/form-data, we need to forward the raw request body
      const chunks: Buffer[] = [];
      
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      
      const buffer = Buffer.concat(chunks);
      
      // Forward the raw body with proper content-type
      const response = await fetch(url, {
        method,
        headers: {
          ...headers,
          'Content-Type': req.headers['content-type'] || 'multipart/form-data',
          'Content-Length': req.headers['content-length'],
        },
        body: buffer,
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      // For GET requests
      const response = await fetch(url, {
        method,
        headers,
      });

      const data = await response.json();
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('Categories API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}