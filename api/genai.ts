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

  const proxyKey = req.headers['x-proxy-key'] || req.headers['x-proxy-token'];

  // Accept either header token or session cookie
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|; )session=([^;]+)/);
  const sessionToken = match ? match[1] : null;

  const PROXY_KEY = process.env.PROXY_KEY;
  if (!PROXY_KEY) return res.status(500).json({ error: 'Server misconfigured' });

  const verifySession = (token: string | null) => {
    if (!token) return false;
    try {
      const [b64, sig] = token.split('.');
      const payload = Buffer.from(b64, 'base64url').toString('utf8');
      const expected = require('crypto').createHmac('sha256', PROXY_KEY).update(payload).digest('base64url');
      const { exp } = JSON.parse(payload);
      if (expected !== sig) return false;
      if (Date.now() / 1000 > exp) return false;
      return true;
    } catch (e) {
      return false;
    }
  };

  if (!(proxyKey === PROXY_KEY || verifySession(sessionToken))) {
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
