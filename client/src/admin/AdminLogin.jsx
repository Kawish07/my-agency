import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await auth.login({ email, password });
    if (res.ok) {
      navigate('/admin');
    } else {
      setError(res.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        {error && <div className="text-sm text-red-500 mb-3">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required className="w-full px-3 py-2 border rounded" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required className="w-full px-3 py-2 border rounded" />
          <button className="w-full bg-black text-white py-2 rounded">Login</button>
        </form>
        <p className="mt-4 text-sm">No account? <Link to="/admin/signup" className="underline">Sign up</Link></p>
      </div>
    </div>
  );
}
