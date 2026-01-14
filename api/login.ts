import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const sign = (payload: string, key: string) => {
  return crypto.createHmac('sha256', key).update(payload).digest('base64url');
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  const PROXY_KEY = process.env.PROXY_KEY;
  if (!PROXY_KEY) return res.status(500).json({ error: 'Server misconfigured' });

  if (!password || password !== PROXY_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24; // 24h
  const payload = JSON.stringify({ iat, exp });
  const sig = sign(payload, PROXY_KEY);
  const token = Buffer.from(payload).toString('base64url') + '.' + sig;

  // Set HttpOnly cookie
  res.setHeader('Set-Cookie', `session=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Strict; Secure`);
  return res.status(200).json({ ok: true });
}
