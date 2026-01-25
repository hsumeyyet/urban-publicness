import type { VercelRequest, VercelResponse } from '@vercel/node';
import { analyzePlaceNarratives } from '../services/geminiService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers for GitHub Pages
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://hsume.github.io',
    /^https:\/\/.*\.github\.io$/
  ];
  
  const isAllowed = allowedOrigins.some(allowed => {
    if (typeof allowed === 'string') return origin === allowed;
    return allowed.test(origin);
  });
  
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-proxy-key, x-proxy-token');
  }
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // No authentication required

  const { placeName } = req.body || {};
  if (!placeName || typeof placeName !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid `placeName` in request body' });
  }

  try {
    const result = await analyzePlaceNarratives(placeName);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('GenAI proxy error:', err);
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
