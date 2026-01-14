import type { VercelRequest, VercelResponse } from '@vercel/node';
import { analyzePlaceNarratives } from '../services/geminiService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const proxyKey = req.headers['x-proxy-key'] || req.headers['x-proxy-token'];
  if (!proxyKey || proxyKey !== process.env.PROXY_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

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
