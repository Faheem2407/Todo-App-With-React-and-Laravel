import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    if (token) setUser({ token, name: name ?? 'User' });
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userData.name);
    setUser({ token, ...userData });
    setMsg('Welcome back!');
    setTimeout(() => setMsg(''), 3000);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUser(null);
    setMsg('');
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {msg && (
        <div className="fixed top-4 right-4 z-50 rounded bg-green-600 px-4 py-2 text-white shadow-lg">
          {msg}
        </div>
      )}

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login login={login} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register login={login} />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} logout={logout} /> : <Navigate to="/login" replace />}
          />
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}