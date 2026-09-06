import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const handleSubscribe = (e) => { e.preventDefault(); if (!email) return; alert(`Subscribed: ${email}`); setEmail(''); };

  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4"><img src="/logo.png" alt="Logo" className="w-8 h-8" onError={(e)=>e.target.style.display='none'} /><span className="text-xl font-extrabold text-white">Shop<span className="text-indigo-500">Mart</span></span></Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">Your one-stop destination for quality products. Fast shipping & excellent support.</p>
          </div>
          <div><h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Quick Links</h4><ul className="space-y-3 text-sm"><li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li><li><Link to="/products" className="text-gray-400 hover:text-white transition">All Products</Link></li><li><Link to="/cart" className="text-gray-400 hover:text-white transition">Cart</Link></li><li><Link to="/checkout" className="text-gray-400 hover:text-white transition">Checkout</Link></li></ul></div>
          <div><h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Categories</h4><ul className="space-y-3 text-sm"><li><Link to="/products?category=electronics" className="text-gray-400 hover:text-white transition">Electronics</Link></li><li><Link to="/products?category=fashion" className="text-gray-400 hover:text-white transition">Fashion</Link></li><li><Link to="/products?category=home" className="text-gray-400 hover:text-white transition">Home & Living</Link></li><li><Link to="/products?category=beauty" className="text-gray-400 hover:text-white transition">Beauty</Link></li></ul></div>
          <div><h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Stay Updated</h4><p className="text-sm text-gray-400 mb-4">Subscribe for offers and new products.</p><form onSubmit={handleSubscribe} className="space-y-3"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="w-full px-4 py-3 text-sm bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-white placeholder-gray-500" /><button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-3 rounded-lg transition">Subscribe Now</button></form></div>
        </div>
        <div className="border-t border-gray-900 py-6 flex flex-col md:flex-row items-center justify-between gap-4"><p className="text-xs text-gray-500">© {new Date().getFullYear()} ShopMart. All rights reserved.</p><div className="flex gap-6 text-xs text-gray-500"><a href="#" className="hover:text-white">Privacy</a><a href="#" className="hover:text-white">Terms</a><a href="#" className="hover:text-white">Shipping</a></div></div>
      </div>
    </footer>
  );
};
export default Footer;
