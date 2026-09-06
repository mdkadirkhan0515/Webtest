import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '@/services/productService';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductGridSkeleton } from '@/components/product/ProductSkeleton';

const categories = [
  { label: 'All', value: '', icon: '🛍️' },
  { label: 'Electronics', value: 'electronics', icon: '💻' },
  { label: 'Fashion', value: 'fashion', icon: '👗' },
  { label: 'Home', value: 'home', icon: '🏠' },
  { label: 'Beauty', value: 'beauty', icon: '💄' },
  { label: 'Sports', value: 'sports', icon: '⚽' },
  { label: 'Books', value: 'books', icon: '📚' },
];

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const data = await getFeaturedProducts();
        const products = data?.data || data?.products || data || [];
        setFeatured(Array.isArray(products)? products : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleCategoryClick = (value) => {
    if (!value) navigate('/products');
    else navigate(`/products?category=${value}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800">
        <div className="absolute inset-0">
          <img src="/banner.jpg" alt="Banner" className="w-full h-full object-cover mix-blend-overlay opacity-30" onError={(e) => (e.target.style.display = 'none')} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full mb-4">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" /> New Collection 2025
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
                Shop Smart, <br /><span className="text-yellow-300">Live Better</span>
              </h1>
              <p className="text-indigo-100 text-base md:text-lg max-w-xl mb-8">Discover premium products at unbeatable prices. Free shipping, easy returns and 24/7 support.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition shadow-lg">Shop Now <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></Link>
                <Link to="/products?category=electronics" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-white/20 transition">Explore Deals</Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative bg-white/10 backdrop-blur-md rounded-[2rem] p-6 border border-white/20 shadow-2xl">
                <img src="/banner.jpg" alt="Featured" className="w-full h-[380px] object-cover rounded-2xl" onError={(e) => (e.target.src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800')} />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">✅</div>
                  <div><p className="text-sm font-bold">Free Shipping</p><p className="text-xs text-gray-500">On orders over $50</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Shop by Category</h2>
          <Link to="/products" className="text-sm font-medium text-indigo-600">View All →</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button key={cat.value} onClick={() => handleCategoryClick(cat.value)} className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-white transition-all shadow-sm">
              <span>{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between mb-8">
          <div><h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2><p className="text-sm text-gray-500 mt-2">Handpicked for you</p></div>
          <Link to="/products" className="hidden md:inline-flex items-center gap-2 text-sm font-semibold border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-900 hover:text-white transition">View All Products →</Link>
        </div>
        {loading? <ProductGridSkeleton count={8} /> : error? <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center"><p className="text-sm text-red-600">{error}</p></div> : <ProductGrid products={featured} />}
      </section>
    </div>
  );
};
export default HomePage;
