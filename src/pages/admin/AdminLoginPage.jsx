import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, isAuthenticated } from '@/services/authService';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { if (isAuthenticated()) navigate('/admin/dashboard', { replace: true }); }, [navigate]);

  const handleChange = (e) => { setFormData({...formData, [e.target.name]: e.target.value }); if (error) setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() ||!formData.password.trim()) { setError('Please fill in all fields'); return; }
    try {
      setLoading(true);
      await login({ email: formData.email.trim(), password: formData.password });
      navigate('/admin/dashboard', { replace: true });
    } catch (err) { setError(err.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8"><Link to="/" className="inline-flex items-center gap-2"><div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold">S</div><span className="text-xl font-bold">ShopMart <span className="text-gray-400 font-normal">Admin</span></span></Link><h1 className="mt-8 text-3xl font-bold tracking-tight">Welcome back</h1><p className="mt-2 text-sm text-gray-500">Please sign in to your admin account</p></div>
          {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3.5 flex gap-2.5">⚠️ {error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email or Username</label><input name="email" type="text" value={formData.email} onChange={handleChange} placeholder="admin@shopmart.com" required className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label><div className="relative"><input name="password" type={showPassword? 'text':'password'} value={formData.password} onChange={handleChange} placeholder="••••••••" required className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400">👁️</button></div></div>
            <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">{loading? 'Signing in...' : 'Sign in to Dashboard'}</button>
          </form>
          <p className="mt-8 text-center text-xs text-gray-500">Demo: <span className="font-medium text-gray-700">admin@shopmart.com / admin123</span></p>
          <div className="mt-8 pt-6 border-t text-center"><Link to="/" className="text-sm text-gray-500 hover:text-gray-900">← Back to Store</Link></div>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 bg-gray-950 relative items-center justify-center p-12"><div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 max-w-md"><div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6">📦</div><h3 className="text-white text-2xl font-bold">Manage your store with confidence</h3><p className="text-gray-400 text-sm mt-3">Track orders, manage products, and grow your business.</p></div></div>
    </div>
  );
};
export default AdminLoginPage;
