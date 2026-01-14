import React, { useEffect, useState } from 'react';
import { login, checkAuth } from '../src/services/auth';

const LoginGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const ok = await checkAuth();
      setAuthenticated(ok);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const ok = await login(password);
      if (ok) setAuthenticated(true);
      else setError('Invalid password');
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (authenticated === null) return null;
  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Private site — sign in</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full border rounded px-4 py-3 mb-4"
            disabled={loading}
          />
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginGate;
