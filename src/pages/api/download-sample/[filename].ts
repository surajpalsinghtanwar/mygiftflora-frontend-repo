import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filename } = req.query;

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Filename is required' });
  }

  // Validate filename to prevent directory traversal
  const allowedFiles = [
    'categories.xlsx',
    'subcategories.xlsx', 
    'subsubcategories.xlsx',
    'products.xlsx'
  ];

  if (!allowedFiles.includes(filename)) {
    return res.status(404).json({ error: 'File not found' });
  }

  try {
    const filePath = path.join(process.cwd(), 'src', 'data', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    return res.send(fileBuffer);
  } catch (error) {
    console.error('Error downloading file:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}