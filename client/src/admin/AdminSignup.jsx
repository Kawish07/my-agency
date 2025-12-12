import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export default function AdminSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await auth.signup({ email, password, name });
    if (res.ok) {
      navigate('/admin');
    } else {
      setError(res.error || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Admin Sign Up</h2>
        {error && <div className="text-sm text-red-500 mb-3">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" required className="w-full px-3 py-2 border rounded" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required className="w-full px-3 py-2 border rounded" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required className="w-full px-3 py-2 border rounded" />
          <button className="w-full bg-black text-white py-2 rounded">Create account</button>
        </form>
        <p className="mt-4 text-sm">Already have an account? <Link to="/admin/login" className="underline">Log in</Link></p>
      </div>
    </div>
  );
}
