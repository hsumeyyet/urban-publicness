import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const verify = (token: string, key: string) => {
  try {
    const [b64, sig] = token.split('.');
    const payload = Buffer.from(b64, 'base64url').toString('utf8');
    const expected = crypto.createHmac('sha256', key).update(payload).digest('base64url');
    if (expected !== sig) return false;
    const { exp } = JSON.parse(payload);
    if (Date.now() / 1000 > exp) return false;
    return true;
  } catch (e) {
    return false;
  }
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  const PROXY_KEY = process.env.PROXY_KEY;
  if (!PROXY_KEY) return res.status(500).json({ error: 'Server misconfigured' });

  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|; )session=([^;]+)/);
  const token = match ? match[1] : null;
  if (!token) return res.status(200).json({ authenticated: false });

  const ok = verify(token, PROXY_KEY);
  return res.status(200).json({ authenticated: !!ok });
}
