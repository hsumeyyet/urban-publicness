// API configuration for hybrid deployment
// Frontend on GitHub Pages, Backend on Vercel

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? '' : 'https://urban-publicness-4ciwyngu9-sumeyyes-projects-c3dc542b.vercel.app');

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/login`,
  authStatus: `${API_BASE_URL}/api/auth-status`,
  genai: `${API_BASE_URL}/api/genai`,
};
