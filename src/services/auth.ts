import { API_ENDPOINTS } from '../config';

export async function login(password: string) {
  const res = await fetch(API_ENDPOINTS.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
    credentials: 'include', // Important for cookies in cross-origin requests
  });
  return res.ok;
}

export async function checkAuth() {
  const res = await fetch(API_ENDPOINTS.authStatus, {
    credentials: 'include', // Important for cookies in cross-origin requests
  });
  if (!res.ok) return false;
  const j = await res.json();
  return !!j.authenticated;
}
